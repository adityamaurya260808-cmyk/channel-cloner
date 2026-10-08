"""Channel Studio: a local app that turns your script into a faceless video.

Run `python3 server.py`, then open http://localhost:8770. It only listens on
this computer. Images come from Google Flow through the FlowPilot extension;
voiceover, animation and rendering happen here with Edge TTS and FFmpeg.
"""
import argparse
import base64
import json
import re
import secrets
import shutil
import threading
import time
import traceback
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import render

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / 'static'
CLIENT_JS = ROOT.parent / 'web' / 'flowpilot-client.js'
PROJECTS = ROOT / 'projects'
ID_RE = re.compile(r'^[a-z0-9-]{1,64}$')
MAX_BODY = 60 * 1024 * 1024
TYPES = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
    '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.ogg': 'audio/ogg',
}
IMAGE_EXT = {'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp'}
MUSIC_EXT = {'audio/mpeg': '.mp3', 'audio/mp3': '.mp3', 'audio/wav': '.wav', 'audio/x-wav': '.wav',
             'audio/mp4': '.m4a', 'audio/x-m4a': '.m4a', 'audio/ogg': '.ogg'}
# Fields the browser may save; everything else in project.json is server-owned.
EDITABLE = {'title', 'script', 'style', 'character', 'splitMode', 'voice', 'rate', 'format',
            'captions', 'useMusic', 'speed', 'scenes'}

jobs = {}           # project id -> render status
jobs_lock = threading.Lock()


class ApiError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status


# ---------- projects on disk ----------

def project_dir(pid):
    if not ID_RE.match(pid or ''):
        raise ApiError(HTTPStatus.NOT_FOUND, 'No such project')
    d = PROJECTS / pid
    if not (d / 'project.json').exists():
        raise ApiError(HTTPStatus.NOT_FOUND, 'No such project')
    return d


def load(pid):
    return json.loads((project_dir(pid) / 'project.json').read_text(encoding='utf-8'))


def store(pid, project):
    project['updated'] = time.time()
    path = PROJECTS / pid / 'project.json'
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(project, indent=1), encoding='utf-8')
    tmp.replace(path)


def create(title):
    pid = time.strftime('%Y%m%d-%H%M%S-') + secrets.token_hex(2)
    (PROJECTS / pid / 'images').mkdir(parents=True)
    project = {
        'id': pid, 'title': title or 'Untitled video', 'created': time.time(),
        'script': '', 'style': 'cinematic digital illustration, rich colors, dramatic lighting, no text, no watermark',
        'character': '', 'splitMode': 'auto', 'voice': render.VOICES[0][0], 'rate': '+0%',
        'format': 'landscape', 'captions': True, 'useMusic': True, 'music': None, 'speed': 'balanced', 'scenes': [],
    }
    store(pid, project)
    return project


def summary(project):
    d = PROJECTS / project['id']
    return {'id': project['id'], 'title': project['title'], 'updated': project.get('updated'),
            'scenes': len(project.get('scenes', [])), 'hasVideo': (d / 'video.mp4').exists()}


def decode_data_url(text, allowed):
    m = re.match(r'^data:([\w/+.-]+);base64,(.*)$', text.strip(), re.S)
    if not m or m.group(1) not in allowed:
        raise ApiError(HTTPStatus.BAD_REQUEST, 'Expected a base64 data URL of a supported type')
    return allowed[m.group(1)], base64.b64decode(m.group(2))


# ---------- rendering in the background ----------

def start_render(pid):
    project = load(pid)
    with jobs_lock:
        if jobs.get(pid, {}).get('state') == 'running':
            raise ApiError(HTTPStatus.CONFLICT, 'This project is already rendering')
        jobs[pid] = {'state': 'running', 'stage': 'Starting', 'done': 0, 'total': 1, 'started': time.time()}

    def progress(stage, done, total):
        jobs[pid].update(stage=stage, done=done, total=total)

    def work():
        try:
            render.render_project(PROJECTS / pid, project, progress)
            jobs[pid].update(state='done', finished=time.time())
        except render.RenderError as e:
            jobs[pid].update(state='error', error=str(e))
        except Exception as e:
            traceback.print_exc()
            jobs[pid].update(state='error', error=f'{type(e).__name__}: {e}')

    threading.Thread(target=work, daemon=True).start()


def render_status(pid):
    d = project_dir(pid)
    status = dict(jobs.get(pid) or {'state': 'idle'})
    video = d / 'video.mp4'
    if video.exists() and status['state'] != 'running':
        status['video'] = f'/projects/{pid}/video.mp4?v={int(video.stat().st_mtime)}'
    return status


# ---------- HTTP ----------

class Handler(BaseHTTPRequestHandler):
    server_version = 'ChannelStudio'

    def log_message(self, fmt, *args):
        if not self.path.startswith('/api/projects/') or not self.path.endswith('/status'):
            super().log_message(fmt, *args)

    def send_json(self, data, status=HTTPStatus.OK):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body(self):
        length = int(self.headers.get('Content-Length') or 0)
        if length > MAX_BODY:
            raise ApiError(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, 'Upload too large')
        return self.rfile.read(length)

    def read_json(self):
        try:
            return json.loads(self.read_body() or b'{}')
        except json.JSONDecodeError:
            raise ApiError(HTTPStatus.BAD_REQUEST, 'Invalid JSON')

    def send_file(self, path):
        if not path.is_file():
            raise ApiError(HTTPStatus.NOT_FOUND, 'Not found')
        size = path.stat().st_size
        start, end = 0, size - 1
        # Range support lets the browser seek in the rendered video.
        m = re.match(r'bytes=(\d*)-(\d*)$', self.headers.get('Range') or '')
        if m and size:
            if m.group(1):
                start = int(m.group(1))
                end = min(int(m.group(2)), size - 1) if m.group(2) else size - 1
            elif m.group(2):
                start = max(0, size - int(m.group(2)))
            if start > end:
                self.send_response(HTTPStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                self.send_header('Content-Range', f'bytes */{size}')
                self.end_headers()
                return
            self.send_response(HTTPStatus.PARTIAL_CONTENT)
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        else:
            self.send_response(HTTPStatus.OK)
        self.send_header('Content-Type', TYPES.get(path.suffix.lower(), 'application/octet-stream'))
        self.send_header('Content-Length', str(end - start + 1 if size else 0))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        with path.open('rb') as f:
            f.seek(start)
            remaining = end - start + 1
            while remaining > 0:
                chunk = f.read(min(1 << 20, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)

    def handle_any(self, method):
        try:
            # Refuse other host names so a web page cannot reach this server by DNS rebinding.
            host = (self.headers.get('Host') or '').rsplit(':', 1)[0]
            if host not in ('localhost', '127.0.0.1'):
                raise ApiError(HTTPStatus.FORBIDDEN, 'Open the studio at http://localhost')
            self.route(method, self.path.split('?', 1)[0])
        except ApiError as e:
            self.send_json({'error': str(e)}, e.status)
        except (BrokenPipeError, ConnectionResetError):
            pass
        except Exception as e:
            traceback.print_exc()
            self.send_json({'error': f'{type(e).__name__}: {e}'}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def do_GET(self):
        self.handle_any('GET')

    def do_POST(self):
        self.handle_any('POST')

    def do_PUT(self):
        self.handle_any('PUT')

    def do_DELETE(self):
        self.handle_any('DELETE')

    def route(self, method, path):
        parts = [p for p in path.split('/') if p]

        if method == 'GET' and path == '/':
            return self.send_file(STATIC / 'index.html')
        if method == 'GET' and path == '/flowpilot-client.js':
            return self.send_file(CLIENT_JS)
        if method == 'GET' and len(parts) == 2 and parts[0] == 'static' and '..' not in parts[1]:
            return self.send_file(STATIC / parts[1])
        if method == 'GET' and len(parts) in (3, 4) and parts[0] == 'projects':
            # /projects/<id>/video.mp4 or /projects/<id>/images/<file>
            d = project_dir(parts[1])
            rel = parts[2:]
            if rel == ['video.mp4'] or (len(rel) == 2 and rel[0] == 'images' and re.match(r'^[\w.-]+$', rel[1])):
                return self.send_file(d.joinpath(*rel))
            raise ApiError(HTTPStatus.NOT_FOUND, 'Not found')

        if parts[:1] != ['api']:
            raise ApiError(HTTPStatus.NOT_FOUND, 'Not found')
        api = parts[1:]

        if api == ['voices'] and method == 'GET':
            return self.send_json([{'id': v, 'label': label} for v, label in render.VOICES])

        if api == ['preview-voice'] and method == 'POST':
            data = self.read_json()
            text = (data.get('text') or 'Here is how this voice sounds in your video.')[:300]
            tmp = PROJECTS / '.preview'
            tmp.mkdir(parents=True, exist_ok=True)
            try:
                audio = render.synthesize(text, data.get('voice') or render.VOICES[0][0], data.get('rate') or '+0%',
                                          tmp / secrets.token_hex(4))
            except render.RenderError as e:
                raise ApiError(HTTPStatus.BAD_GATEWAY, str(e))
            try:
                return self.send_file(audio)
            finally:
                audio.unlink(missing_ok=True)

        if api == ['projects']:
            if method == 'GET':
                items = []
                for f in PROJECTS.glob('*/project.json'):
                    try:
                        items.append(summary(json.loads(f.read_text(encoding='utf-8'))))
                    except (OSError, json.JSONDecodeError, KeyError):
                        continue
                return self.send_json(sorted(items, key=lambda p: p.get('updated') or 0, reverse=True))
            if method == 'POST':
                return self.send_json(create((self.read_json().get('title') or '').strip()[:200]))

        if len(api) >= 2 and api[0] == 'projects':
            pid, rest = api[1], api[2:]
            d = project_dir(pid)

            if rest == [] and method == 'GET':
                return self.send_json(load(pid))
            if rest == [] and method == 'PUT':
                project = load(pid)
                data = self.read_json()
                project.update({k: v for k, v in data.items() if k in EDITABLE})
                store(pid, project)
                return self.send_json({'ok': True})
            if rest == [] and method == 'DELETE':
                if jobs.get(pid, {}).get('state') == 'running':
                    raise ApiError(HTTPStatus.CONFLICT, 'Wait for the render to finish')
                shutil.rmtree(d)
                jobs.pop(pid, None)
                return self.send_json({'ok': True})

            if rest == ['images'] and method == 'POST':
                ext, blob = decode_data_url(self.read_body().decode('ascii', 'replace'), IMAGE_EXT)
                name = f'{int(time.time() * 1000)}-{secrets.token_hex(3)}{ext}'
                (d / 'images' / name).write_bytes(blob)
                return self.send_json({'image': name, 'url': f'/projects/{pid}/images/{name}'})

            if rest == ['music'] and method == 'POST':
                ext, blob = decode_data_url(self.read_body().decode('ascii', 'replace'), MUSIC_EXT)
                for old in d.glob('music.*'):
                    old.unlink()
                (d / f'music{ext}').write_bytes(blob)
                project = load(pid)
                project['music'] = f'music{ext}'
                store(pid, project)
                return self.send_json({'music': project['music']})
            if rest == ['music'] and method == 'DELETE':
                for old in d.glob('music.*'):
                    old.unlink()
                project = load(pid)
                project['music'] = None
                store(pid, project)
                return self.send_json({'ok': True})

            if rest == ['render'] and method == 'POST':
                start_render(pid)
                return self.send_json({'ok': True})
            if rest == ['status'] and method == 'GET':
                return self.send_json(render_status(pid))

        raise ApiError(HTTPStatus.NOT_FOUND, 'Not found')


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--port', type=int, default=8770)
    args = parser.parse_args()
    for tool in ('ffmpeg', 'ffprobe'):
        if not shutil.which(tool):
            raise SystemExit(f'{tool} not found. Install FFmpeg first (see studio/README.md).')
    PROJECTS.mkdir(exist_ok=True)
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    except OSError:
        raise SystemExit(f'Port {args.port} is already in use. Is the studio already running? '
                         f'Otherwise start it on another port: --port {args.port + 10}')
    print(f'Channel Studio running at http://localhost:{args.port}  (Ctrl+C to stop)')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
