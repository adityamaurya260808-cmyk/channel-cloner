"""Synthesize the script phrase by phrase with Kokoro and write voiceover.wav + words.json.

usage: python3 voice.py <script.txt> <kokoro_dir> <out_dir> [voice] [speed]
"""
import json, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

script, kdir, out = sys.argv[1], sys.argv[2], sys.argv[3]
voice = sys.argv[4] if len(sys.argv) > 4 else "am_michael"
speed = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0

text = open(script, encoding="utf-8").read().strip()
text = text.replace("’", "'").replace("‘", "'").replace("Mr. ", "Mr.\u00a0")

# phrase chunks: end on ... . ? ! : (keep punctuation with the chunk)
chunks = [c.strip() for c in re.findall(r".+?(?:\.\.\.|[.?!:](?=[ \n]|$)|$)", text) if c.strip()]

SPOKEN = {"S&P": "S and P", "500,": "five hundred,", "2008,": "two thousand eight,",
          "1976,": "nineteen seventy six,", "2024,": "twenty twenty four,", "1920,": "nineteen twenty,", "Mr.": "Mister", "US": "U.S.", "Mr.": "Mister"}


def spoken_tok(t):
    core = t.strip("'")
    return SPOKEN.get(core, SPOKEN.get(t, t))


def say(chunk):
    toks = chunk.split()
    s = " ".join(spoken_tok(t) for t in toks)
    s = s.replace("'", "'")
    # drop quote marks wrapping words ('Withdraw.' -> Withdraw.)
    s = re.sub(r"(^|\s)'", r"\1", s)
    s = re.sub(r"'(\s|$|[.,?!])", r"\1", s)
    return s, toks


def pause_after(chunk):
    if chunk.endswith("..."):
        return 0.55
    if chunk.endswith("?"):
        return 0.45
    if chunk.endswith(":"):
        return 0.25
    return 0.32


k = Kokoro(f"{kdir}/kokoro-v1.0.onnx", f"{kdir}/voices-v1.0.bin")
SR = 24000
audio = [np.zeros(int(0.4 * SR), dtype=np.float32)]
t = 0.4
words, phrases = [], []
for i, ch in enumerate(chunks):
    spoken, toks = say(ch)
    s, sr = k.create(spoken, voice=voice, speed=speed, lang="en-us")
    assert sr == SR
    s = np.asarray(s, dtype=np.float32)
    # trim leading/trailing silence
    env = np.abs(s)
    thr = max(0.01, env.max() * 0.03)
    idx = np.where(env > thr)[0]
    if len(idx):
        a = max(0, idx[0] - int(0.02 * SR))
        b = min(len(s), idx[-1] + int(0.06 * SR))
        s = s[a:b]
    dur = len(s) / SR
    # spread words across the phrase by spoken length
    weights = [len(spoken_tok(tk)) + 2 for tk in toks]
    acc = t
    for tk, w in zip(toks, weights):
        d = dur * w / sum(weights)
        words.append({"word": tk, "start": round(acc, 3), "end": round(acc + d * 0.92, 3)})
        acc += d
    phrases.append({"i": i, "start": round(t, 3), "end": round(t + dur, 3), "text": ch})
    audio.append(s)
    gap = pause_after(ch)
    audio.append(np.zeros(int(gap * SR), dtype=np.float32))
    t += dur + gap
    if i % 40 == 0:
        print(f"{i}/{len(chunks)}  {t:.1f}s", flush=True)

audio.append(np.zeros(int(0.8 * SR), dtype=np.float32))
y = np.concatenate(audio)
y = y / max(1e-6, np.abs(y).max()) * 0.89
sf.write(f"{out}/voiceover.wav", y, SR, subtype="PCM_16")
json.dump({"words": words}, open(f"{out}/words.json", "w"), indent=0)
json.dump(phrases, open(f"{out}/phrases.json", "w"), indent=1)
print("chunks", len(chunks), "words", len(words), "duration", round(len(y) / SR, 2))
