"""Turns a project's scenes (narration + image) into an MP4 with FFmpeg.

Each scene gets an Edge TTS voiceover, a slow zoom over its image for as long
as the narration lasts, and word-chunk captions. The scenes are joined, the
captions burned in and optional background music mixed under the voice.
"""
import asyncio
import hashlib
import math
import subprocess
from pathlib import Path

FORMATS = {
    'landscape': (1920, 1080),
    'landscape-1440': (2560, 1440),
    'shorts': (1080, 1920),
}
FPS = 30
SCENE_GAP = 0.35        # pause after each scene's narration, in seconds
MUSIC_VOLUME = 0.12
CAPTION_WORDS = 6       # max words on screen at once

# A short list of natural English Edge voices; any Edge voice name also works.
VOICES = [
    ('en-US-AndrewNeural', 'Andrew (US, male, warm)'),
    ('en-US-BrianNeural', 'Brian (US, male, casual)'),
    ('en-US-ChristopherNeural', 'Christopher (US, male, deep)'),
    ('en-US-GuyNeural', 'Guy (US, male)'),
    ('en-US-AvaNeural', 'Ava (US, female, warm)'),
    ('en-US-EmmaNeural', 'Emma (US, female, clear)'),
    ('en-US-JennyNeural', 'Jenny (US, female)'),
    ('en-GB-RyanNeural', 'Ryan (UK, male)'),
    ('en-GB-SoniaNeural', 'Sonia (UK, female)'),
    ('en-IN-PrabhatNeural', 'Prabhat (India, male)'),
    ('en-IN-NeerjaNeural', 'Neerja (India, female)'),
    ('en-AU-WilliamNeural', 'William (Australia, male)'),
    ('silent', 'Silent (test timing, no voice)'),
]


class RenderError(Exception):
    pass


def run(cmd, cwd=None):
    proc = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    if proc.returncode != 0:
        raise RenderError(f'{Path(cmd[0]).name} failed: {proc.stderr.strip()[-800:]}')
    return proc.stdout


def media_duration(path):
    out = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)])
    return float(out.strip())


# ---------- voiceover ----------

def synthesize(text, voice, rate, out_base):
    """Writes the narration for one scene and returns the audio file path."""
    if voice == 'silent':
        out = out_base.with_suffix('.wav')
        seconds = max(1.5, len(text.split()) / 2.6)
        run(['ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono',
             '-t', f'{seconds:.2f}', str(out)])
        return out

    import edge_tts  # imported here so the silent voice works without it

    out = out_base.with_suffix('.mp3')
    last_error = None
    for _ in range(3):
        try:
            asyncio.run(edge_tts.Communicate(text, voice, rate=rate).save(str(out)))
            if out.exists() and out.stat().st_size > 0:
                return out
        except Exception as e:  # network hiccups are common; retry
            last_error = e
    raise RenderError(f'Voiceover failed for "{text[:40]}…": {last_error}')


def voiceover(text, voice, rate, cache_dir):
    """Reuses audio from earlier renders when the text, voice and rate match."""
    key = hashlib.sha1(f'{voice}|{rate}|{text}'.encode()).hexdigest()[:16]
    for ext in ('.mp3', '.wav'):
        cached = cache_dir / f'{key}{ext}'
        if cached.exists() and cached.stat().st_size > 0:
            return cached
    return synthesize(text, voice, rate, cache_dir / key)


# ---------- captions ----------

def ass_time(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f'{int(h)}:{int(m):02d}:{s:05.2f}'


def ass_text(s):
    return s.replace('\\', '/').replace('{', '(').replace('}', ')').replace('\n', ' ')


def caption_chunks(text, start, length):
    """Splits narration into short chunks timed by their share of the characters."""
    words = text.split()
    chunks, current = [], []
    for word in words:
        current.append(word)
        if len(current) >= CAPTION_WORDS or word[-1:] in '.!?;:':
            chunks.append(' '.join(current))
            current = []
    if current:
        chunks.append(' '.join(current))
    total = sum(len(c) for c in chunks) or 1
    t = start
    for chunk in chunks:
        d = length * len(chunk) / total
        yield t, t + d, chunk
        t += d


def write_captions(path, timeline, width, height):
    shorts = height > width
    size = round(width * 0.075) if shorts else round(height * 0.058)
    margin = round(height * (0.22 if shorts else 0.07))
    lines = [
        '[Script Info]', 'ScriptType: v4.00+', f'PlayResX: {width}', f'PlayResY: {height}', 'WrapStyle: 0', '',
        '[V4+ Styles]',
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, '
        'Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, '
        'MarginL, MarginR, MarginV, Encoding',
        f'Style: Default,Arial,{size},&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,'
        f'{max(2, size // 14)},1,2,{round(width * 0.08)},{round(width * 0.08)},{margin},1',
        '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    ]
    for start, length, text in timeline:
        for a, b, chunk in caption_chunks(text, start, length):
            lines.append(f'Dialogue: 0,{ass_time(a)},{ass_time(b)},Default,,0,0,0,,{ass_text(chunk)}')
    path.write_text('\n'.join(lines) + '\n', encoding='utf-8')


# ---------- video ----------

def render_scene(image, audio, seconds, out, width, height, index):
    """One scene: the image with a slow zoom (alternating in and out), plus its narration."""
    frames = max(1, math.ceil(seconds * FPS))
    zoom = f'1+0.12*on/{frames}' if index % 2 == 0 else f'1.12-0.12*on/{frames}'
    vf = (
        # Upscale first so the zoom moves smoothly instead of in whole pixels.
        f'scale={width * 2}:{height * 2}:force_original_aspect_ratio=increase,crop={width * 2}:{height * 2},'
        f"zoompan=z='{zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={width}x{height}:fps={FPS},"
        'format=yuv420p'
    )
    run([
        'ffmpeg', '-y', '-v', 'error', '-i', str(image), '-i', str(audio),
        '-vf', vf, '-af', 'apad', '-t', f'{frames / FPS:.3f}',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-r', str(FPS),
        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', str(out),
    ])
    return frames / FPS


def render_project(project_dir, project, progress=lambda stage, done, total: None):
    """Renders project_dir/video.mp4 from the project's scenes and returns its path."""
    project_dir = Path(project_dir)
    width, height = FORMATS.get(project.get('format'), FORMATS['landscape'])
    voice = project.get('voice') or VOICES[0][0]
    rate = project.get('rate') or '+0%'
    scenes = [s for s in project.get('scenes', []) if (s.get('text') or '').strip()]
    if not scenes:
        raise RenderError('No scenes to render. Write a script and make scenes first.')
    missing = [i + 1 for i, s in enumerate(scenes) if not s.get('image') or not (project_dir / 'images' / s['image']).exists()]
    if missing:
        raise RenderError(f'Scenes without an image: {", ".join(map(str, missing[:20]))}')

    work = project_dir / 'work'
    voice_cache = project_dir / 'voice'
    for d in (work, voice_cache):
        d.mkdir(exist_ok=True)
    for old in work.glob('*'):
        old.unlink()

    total = len(scenes)
    audio = []
    for i, scene in enumerate(scenes):
        progress('Voiceover', i, total)
        audio.append(voiceover(scene['text'].strip(), voice, rate, voice_cache))

    timeline, segments, t = [], [], 0.0
    for i, scene in enumerate(scenes):
        progress('Animating scenes', i, total)
        speech = media_duration(audio[i])
        segment = work / f'scene-{i:04d}.mp4'
        length = render_scene(project_dir / 'images' / scene['image'], audio[i], speech + SCENE_GAP, segment, width, height, i)
        timeline.append((t, speech, scene['text'].strip()))
        segments.append(segment)
        t += length

    progress('Joining', 0, 1)
    (work / 'list.txt').write_text(''.join(f"file '{s.name}'\n" for s in segments))
    run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', 'joined.mp4'], cwd=work)

    progress('Captions and music', 0, 1)
    cmd = ['ffmpeg', '-y', '-v', 'error', '-i', 'joined.mp4']
    music = project.get('music') if project.get('useMusic', True) else None
    if music and (project_dir / music).exists():
        cmd += ['-stream_loop', '-1', '-i', str((project_dir / music).resolve())]
        cmd += ['-filter_complex', f'[1:a]volume={MUSIC_VOLUME}[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]',
                '-map', '0:v', '-map', '[a]']
    else:
        cmd += ['-map', '0:v', '-map', '0:a']
    if project.get('captions', True):
        write_captions(work / 'captions.ass', timeline, width, height)
        cmd += ['-vf', 'subtitles=captions.ass', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20']
    else:
        cmd += ['-c:v', 'copy']
    # Write to a temp file so a failed or interrupted render never leaves a broken video.mp4.
    final = project_dir / 'video.mp4'
    partial = work / 'video.partial.mp4'
    cmd += ['-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', partial.name]
    run(cmd, cwd=work)
    partial.replace(final)

    for old in work.glob('*'):
        old.unlink()
    progress('Done', 1, 1)
    return final
