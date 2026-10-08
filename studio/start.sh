#!/usr/bin/env bash
# Starts Channel Studio on macOS or Linux: run `bash start.sh` from this folder.
# The first run sets up a private Python environment (.venv) for the studio's
# packages, so it never touches your system Python.
set -e
cd "$(dirname "$0")"
PORT="${1:-8770}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is not installed. Get it from https://www.python.org/downloads/ and run this again."
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Note: FFmpeg is not installed yet, so the studio opens but cannot render videos."
  echo "On a Mac, install Homebrew from https://brew.sh, then run:  brew install ffmpeg"
fi

if [ ! -x .venv/bin/python ]; then
  echo "First run: setting up (about a minute)..."
  python3 -m venv .venv
fi
.venv/bin/python -m pip install --quiet --disable-pip-version-check -r requirements.txt

# Open the browser once the server has had a moment to start.
( sleep 2; open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" 2>/dev/null || true ) &
exec .venv/bin/python server.py --port "$PORT"
