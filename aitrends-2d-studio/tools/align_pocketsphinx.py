"""tools/align_pocketsphinx.py — word timings by forcing a known script onto the voiceover (offline).

  python tools/align_pocketsphinx.py --project projects/my-video [--script input/script.txt]

Use this instead of transcribe.py when Whisper can't download its model (e.g. Hugging Face is blocked).
pocketsphinx ships its English model inside the pip wheel, so nothing is downloaded at run time.
Writes the same files as transcribe.py: timeline/words.json, sentences.json, transcript.txt.
"""
import argparse, os, re, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from common import load_audio, load_json, sentences_from_words, write_timeline

# pronunciations for script words missing from CMUdict (add more here when the tool reports them)
EXTRA = {
    "clicky": "K L IH K IY", "dustpan": "D AH S T P AE N", "houseflies": "HH AW S F L AY Z",
    "slideshow": "S L AY D SH OW", "strobes": "S T R OW B Z",
    "cpr": "S IY P IY AA R", "eagleman": "IY G AH L M AH N", "maths": "M AE TH S",
    "gilovich": "G IH L AH V IH CH", "kiddo": "K IH D OW", "medvec": "M EH D V EH K", "omar's": "OW M AA R Z", "roommate's": "R UW M M EY T S", "squints": "S K W IH N T S",
    "sol's": "S AA L Z", "mia's": "M IY AH Z",
}
# numbers written as digits in the script -> the words the voice actually says
SPOKEN = {"2007": "two thousand seven", "1995": "nineteen ninety five"}


def tokens(script):
    """Script tokens as written (kept for display) + the normalised words to align for each."""
    out = []
    for tok in re.findall(r"\S+", script):
        low = tok.lower().replace("’", "'").replace("‘", "'").replace("-", " ")
        for num, words in SPOKEN.items():
            low = low.replace(num, " " + words + " ")
        parts = [p.strip("'") for p in re.findall(r"[a-z']+", low)]
        out.append((tok, [p for p in parts if p]))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--script")
    a = ap.parse_args()
    from pocketsphinx import Decoder, get_model_path
    cfg = load_json(os.path.join(a.project, "config.json"))
    script = a.script or os.path.join(a.project, cfg["script"])
    toks = tokens(open(script, encoding="utf-8").read())
    mp = get_model_path()
    dic = {l.split()[0] for l in open(os.path.join(mp, "en-us", "cmudict-en-us.dict")) if l.strip()}
    missing = sorted({w for _, ws in toks for w in ws if w not in dic and w not in EXTRA})
    if missing:
        sys.exit(f"add pronunciations to EXTRA for: {missing}")
    dec = Decoder(samprate=16000, lm=None, beam=1e-100, wbeam=1e-80, pbeam=1e-100)
    for w, ph in EXTRA.items():
        dec.add_word(w, ph, True)
    flat = [w for _, ws in toks for w in ws]
    dec.set_align_text(" ".join(flat))
    audio = load_audio(os.path.join(a.project, cfg["voiceover"]), 16000)
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16).tobytes()
    dec.start_utt(); dec.process_raw(pcm, full_utt=True); dec.end_utt()
    segs = [s for s in dec.seg() if s.word not in ("<s>", "</s>", "<sil>") and not s.word.startswith("[")]
    aligned = [(re.sub(r"\(\d+\)$", "", s.word), s.start_frame / 100.0, (s.end_frame + 1) / 100.0) for s in segs]
    if len(aligned) != len(flat):
        print(f"warning: aligned {len(aligned)} of {len(flat)} words", file=sys.stderr)
    words, k = [], 0
    for tok, ws in toks:
        if not ws:
            continue
        part = aligned[k:k + len(ws)]; k += len(ws)
        if not part:
            break
        words.append({"word": tok, "start": round(part[0][1], 3), "end": round(part[-1][2], 3)})
    print(f"aligned {len(words)} script words; last word ends at {words[-1]['end']:.2f}s")
    write_timeline(os.path.join(a.project, "timeline"), words, sentences_from_words(words), "pocketsphinx-align+script")


if __name__ == "__main__":
    main()
