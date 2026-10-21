"""story/plan.py — the shot list in compact form. Run it to (re)write story/shots.json.

Each shot starts on a cue phrase (the first words it illustrates); the start time is snapped to the real word
timings in timeline/words.json, 0.15 s before the cue word. Shots are contiguous; the last one ends at
voiceover length + 1.5 s.   python projects/iq-1000/story/plan.py
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
words = json.load(open(os.path.join(ROOT, "timeline", "words.json")))["words"]
cfg = json.load(open(os.path.join(ROOT, "config.json")))
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower().replace("’", "'").replace("‘", "'")).strip("'")
W = [norm(w["word"]) for w in words]

# (cue, set, scene, bars, transition, sfx, amb)
# sfx: list of (at, name, gain[, extra dict]);  amb: (name, gain) or None
C, F, D, Wh, Z, Fa, DW = "cut", "flash", "dip", "whip", "zoom", "fade", "dipWhite"
G = ("roomtone", -30)
H = ("roomtone", -27)
V0 = ("hum", -32)
VS = ("hum", -26)
SHOTS = [
    # --- COLD OPEN: three minds in one frozen second ---
    ("three minds", "void", "three figures far apart in the dark void: Leo, faint Nova, Sol silhouette", "scope", Fa, [(0.2, "shimmer", -16)], VS),
    ("one frozen second", "void", "frozen clock 0.0 s", "scope", C, [(0.2, "tick", -10)], VS),
    ("and no way out", "void", "the void closes in, vignette tightens", "scope", C, [(0.2, "stinger", -14)], VS),
    ("you've been trapped inside", "void", "Leo tiny on the frozen clock face", "scope", C, [(0.2, "freeze", -16)], VS),
    ("for nine hundred years", "blueprint", "counter races to 900 YEARS", "none", Z, [(0.0, "counter", -12)], None),
    ("nova's voice is getting", "void", "Nova fading away", "scope", C, [], VS),
    ("the other voice is", "void", "Sol silhouette grows, violet", "scope", C, [(0.2, "riser", -14)], VS),
    ("stay", "void", "whisper STAY in violet", "scope", C, [(0.0, "hum", -14)], VS),
    ("both of you", "void", "Sol with glinting glasses", "scope", C, [], VS),
    ("there's nothing out there", "void", "Sol wide in fog", "scope", C, [], VS),
    ("you try to breathe", "void", "bigFace Leo straining, cheeks held", "scope", C, [(0.3, "riser", -16)], VS),
    ("you can't", "void", "lock snaps over the breath", "scope", C, [(0.1, "hit", -10)], VS),
    ("something is holding the", "void", "violet ring clamps around the clock", "scope", C, [(0.2, "glitch", -14)], VS),
    ("something", "void", "darkness, Sol face in shadow", "scope", C, [], VS),
    ("very old", "void", "Sol close-up, glints", "scope", C, [(0.0, "stinger", -10)], VS),
    # --- RECAP ---
    ("ten days earlier", "bedroom", "bedroom, label TEN DAYS EARLIER", None, D, [(0.3, "whoosh", -16)], G),
    ("you're leo", "bedroom", "Leo medium, label LEO", None, C, [(0.2, "pop", -12)], G),
    ("hold your breath and", "blueprint", "lungs fill: 1 SECOND = 1 YEAR", "none", Z, [(0.3, "counter", -14)], None),
    ("your mind runs free", "void", "thought bubbles circle Leo", "scope", C, [(0.2, "shimmer", -18)], V0),
    ("your body can't move", "void", "frozen arm with a lock", "scope", C, [(0.3, "tick", -12)], V0),
    ("you saved your grandpa", "kitchen", "PART ONE flashback: frozen kitchen, sepia", "scope", D, [(0.2, "freeze", -14)], None),
    ("then you saved nova", "street", "PART TWO flashback: bus passes, Leo pulls Nova back, sepia", "scope", C, [(0.2, "carpass", -14)], None),
    ("and then a cold", "void", "violet ripple in the void", "scope", C, [(0.2, "glitch", -16)], VS),
    ("his name is sol", "void", "Sol reveal, label SOL", "scope", C, [(0.3, "impact", -12)], VS),
    ("so what happens when", "title", "TITLE CARD FINAL PART", None, F, [(0.0, "impact", -8)], ("wind", -30)),
    # --- SOL ---
    ("sol is polite", "void", "Sol medium, a small bow", "scope", D, [], VS),
    ("calm", "void", "Sol face, calm", "scope", C, [], VS),
    ("ancient", "void", "Sol among drifting dust, ANCIENT", "scope", C, [(0.2, "wind", -20)], VS),
    ("how long have you", "void", "Leo asks Sol across a violet link", "scope", C, [], VS),
    ("about three thousand years", "void", "Sol face talking", "scope", C, [], VS),
    ("three thousand", "void", "bigFace Leo shocked", "scope", C, [], VS),
    ("nova lived two hundred", "blueprint", "bars NOVA 200 vs SOL 3,000", "none", C, [(0.4, "pop", -14)], None),
    ("for sol one second", "blueprint", "1 SECOND = 1,000 YEARS", "none", C, [(0.8, "hit", -12)], None),
    ("out there he's just", "corridor", "real world: a very still old man on the hospital bench", None, D, [], H),
    ("a whole human life", "blueprint", "heart + counter 2,500,000,000 BEATS", "none", C, [(0.3, "counter", -14)], None),
    ("sol has lived three", "blueprint", "3,000 YEARS ... heartbeats heard", "none", C, [], None),
    ("and heard just three", "blueprint", "three slow heartbeats: 3", "none", C, [(0.2, "heartbeat", -10, {"bpm": 50})], None),
    # --- PLUS ---
    ("plus he knows everything", "void", "PLUS chapter, Sol with glowing symbols", "scope", C, [(0.2, "ding", -14)], VS),
    ("every language he ever", "void", "letters of many scripts orbit Sol", "scope", C, [(0.3, "shimmer", -18)], VS),
    ("every maths problem", "blueprint", "equations fill the board", "none", C, [(0.2, "blip", -14)], None),
    ("every story", "void", "books float around Sol", "scope", C, [], VS),
    ("he beats nova at", "void", "chessboard between Sol and Nova", "scope", C, [(0.4, "tick", -16)], VS),
    ("in four moves", "void", "CHECKMATE IN 4", "scope", C, [(0.2, "hit", -12)], VS),
    ("she doesn't talk for", "void", "Nova face sulking, 1 WEEK", "scope", C, [], VS),
    # --- MINUS ---
    ("minus he knows something", "void", "MINUS chapter, Sol and Leo", "scope", C, [(0.2, "stinger", -16)], VS),
    ("your power wasn't growing", "void", "Sol face talking", "scope", C, [], VS),
    ("i was pulling you", "void", "violet threads pull Leo toward Sol", "scope", C, [(0.2, "riser", -14)], VS),
    ("the slammed doors", "bedroom", "flashback: door slam, violet tint", "scope", C, [(0.1, "hit", -10)], None),
    ("the car horns", "street", "flashback: car horn, violet tint", "scope", C, [(0.0, "horn", -14)], None),
    ("the years that came", "void", "calendar pages fly past", "scope", C, [(0.0, "counter", -16)], VS),
    ("that was me", "void", "Sol close, glints", "scope", C, [(0.1, "stinger", -12)], VS),
    ("why", "void", "bigFace Leo", "scope", C, [], VS),
    ("because three thousand years", "void", "Sol tiny alone in a huge void", "scope", C, [], VS),
    ("is a very long", "void", "slow pull back, Sol alone", "scope", C, [], VS),
    # --- THE CATCH ---
    ("the catch", "void", "THE CATCH chapter", "scope", C, [(0.0, "pop", -14)], VS),
    ("sol only sees one", "void", "a frozen picture frame floats by Sol, blurred", "scope", C, [], VS),
    ("always the same", "void", "the same frame repeated", "scope", C, [], VS),
    ("he won't say what", "void", "Sol turns away", "scope", C, [], VS),
    ("nova has her own", "void", "Nova with her own frame: evening sky", "scope", C, [(0.2, "shimmer", -16)], V0),
    ("the evening sky", "sky", "evening sky full of stars", None, C, [], ("wind", -32)),
    ("on a clear night", "blueprint", "eye + stars: A FEW THOUSAND VISIBLE", "none", C, [(0.3, "blip", -14)], None),
    ("she's counted four thousand", "sky", "counter 4,112 STARS", None, C, [(0.0, "counter", -14)], ("wind", -32)),
    ("almost all of them", "sky", "sky wide, sparkles", None, C, [], ("wind", -32)),
    # --- FRIGHTENING ---
    ("but where it gets", "void", "dark void, Leo alone", "scope", D, [(0.2, "riser", -16)], VS),
    ("is how often it", "blueprint", "a day bar with freeze marks", "none", C, [], None),
    ("ten times a day", "blueprint", "clock with 10 marks", "none", C, [(0.2, "tick", -12), (0.5, "tick", -12), (0.8, "tick", -12)], None),
    ("ten years a day", "blueprint", "counter 10 YEARS / DAY", "none", C, [(0.0, "counter", -14)], None),
    ("jake waves a hand", "classroom", "Jake waves a hand in front of frozen Leo", None, C, [(0.3, "swish", -14)], G),
    ("mate", "classroom", "Jake face", None, C, [], G),
    ("where do you keep", "classroom", "Jake talking", None, C, [], G),
    ("somewhere very quiet", "classroom", "Leo face, distant", None, C, [], G),
    # --- THE PRICE ---
    ("and there's a cost", "void", "void dims", "scope", C, [], VS),
    ("the price", "void", "THE PRICE chapter", "scope", C, [(0.0, "stinger", -12)], VS),
    ("you're fifteen", "bedroom", "Leo AGE 15", None, C, [(0.2, "pop", -12)], G),
    ("but inside you've now", "blueprint", "BODY 15 vs MIND 100+", "none", C, [(0.3, "counter", -12)], None),
    ("you start forgetting small", "classroom", "Leo at his locker, confused", None, C, [], G),
    ("your locker code", "classroom", "locker dial: ? ? ?", None, C, [(0.2, "tick", -14), (0.5, "tick", -14)], G),
    ("your mom's birthday", "blueprint", "calendar with a blank date", "none", C, [(0.4, "glitch", -16)], None),
    ("memories that aren't used", "blueprint", "memory shelves fading, a century of boxes crowding", "none", C, [], None),
    ("your mom notices", "kitchen", "Mom watches Leo in the kitchen", None, D, [], G),
    ("leo", "kitchen", "Mom face", None, C, [], G),
    ("is everything okay", "kitchen", "Mom face talking", None, C, [], G),
    ("you smile", "kitchen", "Leo face smiling", None, C, [], G),
    ("you say yes", "kitchen", "Leo face talking", None, C, [], G),
    ("but you're scared", "kitchen", "Leo face scared", None, C, [(0.2, "hum", -18)], G),
    ("because you know exactly", "void", "Leo's shadow stretches into Sol's shape", "scope", C, [(0.2, "riser", -16)], VS),
    ("someone like sol", "void", "Sol silhouette over Leo", "scope", C, [(0.0, "stinger", -12)], VS),
    ("what if you can't", "void", "Leo fades out", "scope", C, [], VS),
    # --- THE HOSPITAL ---
    ("so you go where", "corridor", "hospital corridor wide", None, D, [], H),
    ("grandpa's checkup", "corridor", "Grandpa, Leo, Nova walk in", None, C, [(0.2, "footstep", -18), (0.6, "footstep", -18)], H),
    ("the hospital", "corridor", "corridor wide, lights", None, C, [], H),
    ("same long corridor", "corridor", "slow push down the corridor", None, C, [], H),
    ("same green door", "corridor", "insert: green door", None, C, [], H),
    ("same vending machine with", "corridor", "insert: vending machine, blue can stuck", None, C, [(1.2, "pop", -16)], H),
    ("it was stuck the", "corridor", "Grandpa face talking", None, C, [], H),
    ("maybe it's waiting for", "corridor", "Grandpa face", None, C, [], H),
    ("he gives it a", "corridor", "Grandpa taps the machine", None, C, [(0.4, "hit", -14)], H),
    ("it doesn't move", "corridor", "insert: can wobbles, stays", None, C, [], H),
    ("stubborn thing", "corridor", "Grandpa face smiling", None, C, [], H),
    ("like you", "corridor", "Grandpa nudges Leo", None, C, [], H),
    ("on the bench by", "corridor", "old man on the bench by the green door", None, C, [], H),
    ("eyes closed", "corridor", "old Sol face, eyes closed", None, C, [], H),
    ("hands folded", "corridor", "insert: folded hands", None, C, [], H),
    ("grandpa squeezes your shoulder", "corridor", "Grandpa's hand on Leo's shoulder", None, C, [], H),
    ("you look tired leo", "corridor", "Grandpa face", None, C, [], H),
    ("whatever it is", "corridor", "Grandpa face", None, C, [], H),
    ("a second is plenty", "corridor", "gold words", None, C, [(0.2, "shimmer", -18)], H),
    ("if you use it", "corridor", "gold words continue", None, C, [], H),
    ("nova came with you", "corridor", "Nova by the window", None, C, [], H),
    ("and as a doctor", "corridor", "doctor walks toward the green door", None, C, [(0.3, "footstep", -16), (0.9, "footstep", -16), (1.5, "footstep", -16)], H),
    ("it happens", "corridor", "bigFace Leo", "scope", C, [(0.2, "riser", -12)], H),
    ("your breath catches", "corridor", "Leo gasps", "scope", C, [], H),
    ("so does nova's", "corridor", "Nova gasps", "scope", C, [], H),
    ("the year begins", "corridor", "FREEZE: corridor, blue tint", "scope", F, [(0.0, "freeze", -5)], None),
    ("then it keeps going", "void", "years counter keeps going", "scope", C, [(0.0, "counter", -14)], VS),
    ("a hundred years", "void", "100", "scope", C, [(0.0, "tick", -10)], VS),
    ("five hundred", "void", "500", "scope", C, [(0.0, "tick", -10)], VS),
    ("nine hundred", "void", "900", "scope", C, [(0.0, "hit", -12)], VS),
    ("sol's grip holds the", "void", "violet ring clamps the clock", "scope", C, [(0.2, "glitch", -12)], VS),
    ("stay", "void", "whisper STAY", "scope", C, [(0.0, "hum", -14)], VS),
    ("the doctor is five", "corridor", "frozen: five footprints from doctor to bench", "scope", C, [(0.3, "pop", -16)], None),
    ("at a normal walk", "blueprint", "5 STEPS ≈ 3 SECONDS", "none", C, [(0.4, "blip", -14)], None),
    ("in sol's time", "blueprint", "3 SECONDS × 1,000 YEARS", "none", C, [], None),
    ("three thousand years", "blueprint", "= 3,000 YEARS", "none", C, [(0.0, "counter", -12)], None),
    ("nova's voice is barely", "void", "Nova barely visible", "scope", C, [], VS),
    ("leo", "void", "faint whisper: Leo...", "scope", C, [], VS),
    ("i can't feel the", "void", "Nova face dissolving", "scope", C, [(0.2, "shimmer", -18)], VS),
    ("then sol speaks again", "void", "Sol steps forward", "scope", C, [], VS),
    ("you can still leave", "void", "Sol face talking", "scope", C, [], VS),
    ("you're strong enough", "void", "Sol face", "scope", C, [], VS),
    ("breathe out", "void", "whisper BREATHE OUT", "scope", C, [], VS),
    ("go home", "void", "a doorway of light opens", "scope", C, [(0.2, "shimmer", -16)], VS),
    ("but she stays with", "void", "violet threads hold Nova", "scope", C, [(0.2, "stinger", -14)], VS),
    ("you feel it", "void", "bigFace Leo", "scope", C, [], VS),
    ("one breath and you're", "void", "Leo near the light doorway", "scope", C, [], VS),
    ("your mom", "kitchen", "memory: Mom smiling, warm", None, DW, [], G),
    ("grandpa", "kitchen", "memory: Grandpa dancing", None, C, [], G),
    ("real seconds", "void", "a clock ticking for real", "scope", C, [(0.1, "tick", -10), (0.6, "tick", -10)], V0),
    ("but nova would be", "void", "Nova fading", "scope", C, [], VS),
    ("forever", "void", "empty space where Nova was", "scope", C, [(0.0, "stinger", -14)], VS),
    ("can you carry two", "blueprint", "line figure carrying two", "none", C, [], None),
    ("three", "blueprint", "THREE?", "none", C, [(0.0, "pop", -14)], None),
    ("save yourself", "blueprint", "balance: YOURSELF", "none", C, [(0.2, "swish", -16)], None),
    ("or save all three", "blueprint", "balance tips: ALL THREE", "none", C, [(0.2, "swish", -16)], None),
    ("you think about the", "corridor", "frozen corridor, old man on the bench", "scope", C, [], None),
    ("still", "corridor", "old Sol face, still", "scope", C, [], None),
    ("eyes closed", "corridor", "eyes closed", "scope", C, [], None),
    ("every time someone walks", "corridor", "frozen doctor mid-step toward him", "scope", C, [], None),
    ("he disappears", "void", "the bench fades into the void", "scope", C, [(0.2, "whoosh", -14)], VS),
    ("sol", "void", "bigFace Leo, realising", "scope", C, [], VS),
    ("what do you see", "void", "Leo asks", "scope", C, [], VS),
    ("silence", "void", "darkness", "scope", C, [], None),
    ("a green door", "void", "the green door appears in the void", "scope", C, [(0.0, "pop", -16)], VS),
    ("a vending machine", "void", "the vending machine appears", "scope", C, [(0.0, "pop", -16)], VS),
    ("one blue can", "void", "the stuck blue can glows", "scope", C, [(0.2, "shimmer", -16)], VS),
    ("stuck", "void", "STUCK", "scope", C, [], VS),
    ("it's you", "void", "bigFace Leo, it clicks", "scope", C, [(0.0, "hit", -12)], VS),
    ("you're the man on", "corridor", "the old man on the bench IS Sol", "scope", C, [(0.2, "stinger", -12)], None),
    ("what's behind that door", "void", "the green door glows", "scope", C, [], VS),
    ("a long pause", "void", "darkness, held", "scope", C, [], None),
    ("my wife", "void", "Sol face, grief", "scope", C, [], VS),
    ("the doctor is coming", "corridor", "frozen doctor, the door", "scope", C, [], None),
    ("i couldn't bear to", "void", "Sol face, tears", "scope", C, [], VS),
    ("so you've been hiding", "void", "Sol curled small in the void", "scope", C, [], VS),
    ("for three thousand years", "blueprint", "3,000 YEARS OF HIDING", "none", C, [(0.0, "counter", -16)], None),
    ("you don't fight him", "void", "three figures, no struggle", "scope", C, [], VS),
    ("you don't push", "void", "Leo lowers his hands", "scope", C, [], VS),
    ("you just tell him", "void", "bigFace Leo, gentle", "scope", C, [], VS),
    ("we'll hear it with", "void", "Leo and Nova stand beside Sol, gold link", "scope", C, [(0.2, "shimmer", -14)], VS),
    ("then you hum grandpa's", "kitchen", "memory: Grandpa dancing, warm", None, DW, [], None),
    ("boom", "void", "heart pulse 1", "scope", C, [(0.0, "kick", -6)], None),
    ("boom", "void", "heart pulse 2", "scope", C, [(0.0, "kick", -6)], None),
    ("boom", "void", "heart pulse 3", "scope", C, [(0.0, "kick", -6)], None),
    ("a second is plenty", "void", "gold words: A SECOND IS PLENTY, SOL", "scope", C, [(0.2, "shimmer", -16)], VS),
    ("if you use it", "void", "...IF YOU USE IT", "scope", C, [], VS),
    ("and nova barely there", "void", "Nova faint, whispering", "scope", C, [], VS),
    ("three", "void", "3", "scope", C, [(0.0, "heartbeat", -10)], None),
    ("two", "void", "2", "scope", C, [(0.0, "heartbeat", -10)], None),
    ("one", "void", "1", "scope", C, [(0.0, "heartbeat", -10)], None),
    # --- RESOLUTION ---
    ("all three of you", "corridor", "unfreeze: colour returns, the corridor breathes", None, DW, [(0.0, "whoosh", -8)], H),
    ("the corridor moves", "corridor", "corridor wide, people moving", None, C, [(0.2, "footstep", -18)], H),
    ("the doctor smiles", "corridor", "doctor face smiling", None, C, [], H),
    ("she's awake", "corridor", "doctor talking, SHE'S AWAKE", None, C, [(0.2, "ding", -14)], H),
    ("she's asking for you", "corridor", "doctor talking", None, C, [], H),
    ("the old man opens", "corridor", "old Sol opens his eyes", None, C, [], H),
    ("and cries", "corridor", "tears, a smile", None, C, [], H),
    ("grandpa gives the vending", "corridor", "Grandpa taps the machine again", None, C, [(0.8, "hit", -12)], H),
    ("the blue can drops", "corridor", "the can falls", None, C, [(0.2, "whoosh", -14)], H),
    ("clunk", "corridor", "can in the tray, CLUNK", None, C, [(0.0, "hit", -6)], H),
    ("after that the years", "blueprint", "freeze bars getting shorter", "none", D, [], None),
    ("a month", "blueprint", "A MONTH", "none", C, [(0.0, "pop", -14)], None),
    ("a day", "blueprint", "A DAY", "none", C, [(0.0, "pop", -14)], None),
    ("an hour", "blueprint", "AN HOUR", "none", C, [(0.0, "pop", -14)], None),
    ("then one sunday grandpa's", "kitchen", "Sunday dance: Grandpa, Sol with his wife, Nova with Jake", None, DW, [(0.2, "tick", -14)], G),
    ("and you notice something", "kitchen", "Leo face, noticing", None, C, [], G),
    ("a second", "kitchen", "the kitchen clock", None, C, [(0.3, "tick", -12)], G),
    ("feels like a second", "kitchen", "second hand ticks once", None, C, [(0.3, "tick", -12)], G),
    ("just one", "kitchen", "1 SECOND", None, C, [(0.2, "tick", -12)], G),
    ("ordinary", "kitchen", "kitchen wide warm", None, C, [], G),
    ("perfect", "kitchen", "everyone dancing", None, C, [], G),
    ("you don't need a", "kitchen", "Leo face, content", None, C, [], G),
    ("grandpa winks", "kitchen", "Grandpa face winking", None, C, [(0.3, "pop", -16)], G),
    ("told you", "kitchen", "Grandpa talking", None, C, [], G),
    ("a second is plenty", "kitchen", "gold words", None, C, [(0.2, "shimmer", -18)], G),
    ("it always was", "kitchen", "kitchen wide, pull back", None, C, [], G),
    # --- IS ANY OF THIS REAL ---
    ("is any of this", "blueprint", "IS ANY OF THIS REAL?", "none", D, [(0.2, "whoosh", -16)], None),
    ("no one can live", "blueprint", "NOT POSSIBLE stamp", "none", C, [(0.4, "hit", -12)], None),
    ("but your brain really", "blueprint", "brain bends a timeline", "none", C, [(0.2, "shimmer", -18)], None),
    ("waiting makes minutes drag", "blueprint", "WAITING: clock crawls", "none", C, [(0.4, "tick", -14), (1.4, "tick", -14)], None),
    ("fun makes hours vanish", "blueprint", "FUN: clock spins", "none", C, [(0.2, "whoosh", -16)], None),
    ("and new experiences often", "blueprint", "memory density: new days hold more detail", "none", C, [(0.4, "pop", -16)], None),
    ("so the best way", "blueprint", "a life filled with new things feels longer", "none", C, [], None),
    ("might be filling your", "blueprint", "seconds fill with new icons", "none", C, [(0.2, "pop", -16), (0.8, "pop", -16)], None),
    ("so which second would", "void", "Leo and Nova look up at the clock", "scope", D, [], V0),
    ("what do you think", "end", "END SCREEN: question, cast, MORE WHAT IFS", "none", Fa, [(0.2, "pop", -12)], None),
]

MUSIC = [  # (cue, mood, intensity)
    ("three minds", "dark", 0.5), ("ten days earlier", "hopeful", 0.4), ("so what happens when", "epic", 0.65),
    ("sol is polite", "mystery", 0.45), ("plus he knows everything", "wonder", 0.45), ("minus he knows something", "dark", 0.5),
    ("the catch", "mystery", 0.4), ("but where it gets", "tension", 0.5), ("the price", "sad", 0.35),
    ("so you go where", "hopeful", 0.4), ("and as a doctor", "tension", 0.5), ("the year begins", "dark", 0.55),
    ("then sol speaks again", "tension", 0.55), ("you think about the", "mystery", 0.45), ("my wife", "sad", 0.4),
    ("then you hum grandpa's", "epic", 0.5), ("all three of you", "triumph", 0.55), ("after that the years", "hopeful", 0.45),
    ("then one sunday grandpa's", "playful", 0.5), ("is any of this", "wonder", 0.4), ("so which second would", "mystery", 0.4),
]

def find(cue, frm):
    c = [norm(x) for x in cue.split()]
    for i in range(frm, len(W) - len(c) + 1):
        if W[i:i + len(c)] == c:
            return i
    raise SystemExit(f"cue not found after word {frm}: {cue!r}")


def main():
    dur = round(cfg["duration"] + 1.5, 2)
    starts, k = [], 0
    for s in SHOTS:
        k = find(s[0], k)
        starts.append(k)
        k += len(s[0].split())
    shots = []
    for n, (s, wi) in enumerate(zip(SHOTS, starts)):
        cue, st, scene, bars, tr, sfx, amb = s
        t0 = 0.0 if n == 0 else round(max(words[wi]["start"] - 0.15, shots[-1]["start"] + 0.4), 2)
        if shots:
            shots[-1]["end"] = t0
        endw = starts[n + 1] if n + 1 < len(SHOTS) else len(words)
        line = " ".join(w["word"] for w in words[wi:endw])
        sh = {"id": f"s{n + 1:03d}", "start": t0, "end": None, "line": line, "scene": scene, "set": st, "bars": bars,
              "in": {"type": tr, **({"dur": 0.5} if tr in (D, Fa, DW) else {"dur": 0.35} if tr in (F, Wh, Z) else {})},
              "sfx": [dict(at=x[0], name=x[1], gain=x[2], **(x[3] if len(x) > 3 else {})) for x in sfx], "notes": ""}
        if amb:
            sh["amb"] = {"name": amb[0], "gain": amb[1]}
        if st in ("title", "end"):
            sh["captions"] = False
        shots.append(sh)
    shots[-1]["end"] = dur
    music, k = [], 0
    for cue, mood, inten in MUSIC:
        k = find(cue, k)
        t = 0.0 if not music else round(words[k]["start"] - 0.4, 2)
        if music:
            music[-1]["end"] = t
        music.append({"start": t, "end": None, "mood": mood, "intensity": inten})
        k += 1
    music[-1]["end"] = dur
    out = {"title": cfg["title"], "duration": dur, "shots": shots, "music": music, "sfx": []}
    json.dump(out, open(os.path.join(HERE, "shots.json"), "w"), indent=1, ensure_ascii=False)
    lens = sorted(s["end"] - s["start"] for s in shots)
    print(f"{len(shots)} shots, {dur}s, median {lens[len(lens) // 2]:.2f}s, min {lens[0]:.2f}s, max {lens[-1]:.2f}s")
    for s in shots:
        if s["end"] - s["start"] > 6.5:
            print("  long:", s["id"], round(s["end"] - s["start"], 2), s["line"][:60])


if __name__ == "__main__":
    main()
