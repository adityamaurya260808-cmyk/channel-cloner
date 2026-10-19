"""Print mid-shot times for a range of shot ids, for --stills.  python tools/shot_times.py <project> s001 s018 [frac]"""
import json, sys
d = json.load(open(f"{sys.argv[1]}/story/shots.json"))
a, b = sys.argv[2], sys.argv[3]; frac = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
print(",".join(f"{s['start'] + (s['end'] - s['start']) * frac:.2f}" for s in d["shots"] if a <= s["id"] <= b))
