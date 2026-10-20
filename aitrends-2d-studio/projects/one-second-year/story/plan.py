"""story/plan.py — the shot list in compact form. Run it to (re)write story/shots.json.

Each shot starts on a cue phrase (the first words it illustrates); the start time is snapped to the real word
timings in timeline/words.json, 0.15 s before the cue word. Shots are contiguous; the last one ends at
voiceover length + 1.5 s.   python projects/reflexes-100x/story/plan.py
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
SHOTS = [
    # --- COLD OPEN: the kitchen freezes ---
    ("sunday afternoon", "kitchen", "kitchen wide, warm afternoon: Grandpa dancing by the record player, Leo at the table, slow push", None, Fa, [], ("roomtone", -28)),
    ("your grandpa is dancing", "kitchen", "medium: Grandpa dances, tapping the counter, music notes", None, C, [(0.3, "pop", -18)], ("roomtone", -28)),
    ("then his hand slips", "kitchen", "insert: Grandpa's hand slides off the counter edge", None, C, [(0.4, "swish", -12)], None),
    ("his knees fold", "kitchen", "medium: Grandpa's knees buckle, Leo turns", None, C, [(0.2, "hit", -16)], None),
    ("and the whole world", "kitchen", "bigFace Leo shocked", "scope", C, [(0.2, "riser", -12)], None),
    ("stops", "kitchen", "TIME FREEZE: the kitchen stops, blue tint, everything hangs", "scope", F, [(0.0, "freeze", -5)], None),
    ("his glasses hang", "kitchen", "insert: Grandpa's glasses floating in the air", "scope", C, [(0.2, "shimmer", -16)], None),
    ("a spoon floats", "kitchen", "insert: a spoon hanging above the floor tiles", "scope", C, [], None),
    ("the music holds one", "kitchen", "record player: one long flat sound wave", "scope", C, [(0.0, "hum", -14)], None),
    ("nothing moves", "kitchen", "wide frozen kitchen, slow pull back", "scope", C, [], None),
    ("not even you", "kitchen", "bigFace Leo frozen, eyes fixed", "scope", C, [], None),
    ("you're standing inside", "void", "Leo stands tiny on a giant frozen clock face", "scope", C, [(0.2, "tick", -10)], None),
    ("and you're about to", "void", "calendar pages flip DAY 1 to 365; 1 SECOND = 1 YEAR", "scope", C, [(0.2, "counter", -14)], None),
    # --- THE POWER ---
    ("three weeks earlier", "bedroom", "dip: bedroom morning, label THREE WEEKS EARLIER", None, D, [(0.3, "whoosh", -16)], ("roomtone", -30)),
    ("your name is leo", "bedroom", "Leo medium, labels LEO and AGE 15", None, C, [(0.2, "pop", -12), (1.5, "pop", -12)], ("roomtone", -30)),
    ("a year holds about", "blueprint", "counter races to 31,500,000 SECONDS", "none", Z, [(0.3, "counter", -14)], None),
    ("most people feel each", "blueprint", "line figures, each second ticks past as just 1 s", "none", C, [(0.3, "tick", -14), (1.3, "tick", -14), (2.3, "tick", -14)], None),
    ("you", "bedroom", "bigFace Leo smirk", None, C, [], None),
    ("hold your breath and", "bedroom", "Leo inhales, blue freeze spreads; 1 SECOND = 1 YEAR", "scope", F, [(0.3, "freeze", -8)], None),
    ("a year to think", "blueprint", "THINK, REMEMBER, PLAN icons pop on the words", "none", C, [(0.1, "pop", -12), (1.9, "pop", -12), (2.9, "pop", -12)], None),
    ("but there's a rule", "void", "bigLine THE RULE", "scope", C, [(0.0, "stinger", -12)], None),
    ("your mind runs free", "blueprint", "line figure: brain glowing gold, thoughts sparking", "none", C, [(0.2, "shimmer", -14)], None),
    ("your body doesn't move", "blueprint", "body locked grey with a padlock", "none", C, [(0.4, "hit", -14)], None),
    ("not a finger", "bedroom", "insert: frozen finger, lock icon", "scope", C, [], None),
    ("not even your eyes", "bedroom", "bigFace Leo, eyes locked in place", "scope", C, [], None),
    ("you can think anything", "blueprint", "split: THINK yes, DO no", "none", C, [(0.4, "ding", -14), (1.6, "hit", -14)], None),
    ("not until you breathe", "bedroom", "Leo breathes out, colour returns", None, C, [(0.3, "whoosh", -14)], ("roomtone", -30)),
    ("so what if one second", "title", "TITLE CARD: WHAT IF ONE SECOND FELT LIKE A YEAR?", "scope", Fa, [(0.05, "stinger", -6)], None),
    # --- PLUS: maths, chess, football ---
    ("the first time is", "classroom", "classroom wide: maths test, students writing, clock", None, D, [], ("roomtone", -26)),
    ("question seven", "classroom", "insert: test paper, QUESTION 7, scary equation", None, C, [(0.2, "pop", -14)], None),
    ("you hold your breath and", "classroom", "bigFace Leo holds breath, freeze flash", "scope", F, [(0.0, "freeze", -8)], None),
    ("you solve it", "classroom", "frozen classroom; thought bubble: equation solved", "scope", C, [(0.4, "ding", -12)], None),
    ("then you solve it three", "classroom", "bubble: three more methods, ticks", "scope", C, [(0.3, "pop", -14), (0.7, "pop", -14), (1.1, "pop", -14)], None),
    ("then you get bored", "classroom", "bubble: a board game builds itself in Leo's head", "scope", C, [(0.5, "blip", -14)], None),
    ("you breathe out", "classroom", "unfreeze, colour returns", None, C, [(0.1, "whoosh", -14)], ("roomtone", -26)),
    ("the clock hasn't moved", "classroom", "insert: wall clock, second hand barely moved", None, C, [(0.2, "tick", -10)], None),
    ("leo you finished", "classroom", "bigFace teacher amazed, talking", None, C, [], ("roomtone", -28)),
    ("i had", "classroom", "Leo smirks, talking: plenty of time", None, C, [], ("roomtone", -28)),
    ("plus chess club", "chess", "PLUS badge; chess club, Leo vs the champion", None, Wh, [(0.0, "whoosh", -12)], ("roomtone", -28)),
    ("every move gets", "chess", "top-down chess board, a piece glows; 1 YEAR PER MOVE", None, C, [(0.4, "blip", -14)], None),
    ("you beat the school", "chess", "checkmate; champion facepalms; 11 MOVES", None, C, [(0.3, "hit", -12), (1.6, "pop", -12)], ("murmur", -28)),
    ("your best friend jake", "chess", "Jake stares at Leo, shocked", None, C, [], ("murmur", -30)),
    ("how long were you", "chess", "bigFace Jake talking", None, C, [], ("murmur", -30)),
    ("about a second", "chess", "Leo shrugs, talking", None, C, [], ("murmur", -30)),
    ("mate", "chess", "Jake leans back nervously, talking", None, C, [], ("murmur", -30)),
    ("then football", "pitch", "football pitch at golden hour: Leo in goal, striker at the spot", None, Wh, [(0.0, "whoosh", -12)], ("wind", -24)),
    ("a hard penalty reaches", "blueprint", "diagram: spot to goal 11 m, ball arrives in 0.5 s", "none", C, [(0.4, "counter", -16)], None),
    ("you hold your breath as", "pitch", "striker kicks; the ball leaves the boot; freeze", "scope", F, [(0.0, "kick", -8), (0.1, "freeze", -8)], None),
    ("you see the spin", "pitch", "frozen ball macro, spin arrows; SPIN", "scope", C, [(0.1, "blip", -14)], None),
    ("the angle", "pitch", "goal diagram: ANGLE, then a gold line to the TOP CORNER", "scope", C, [(0.1, "blip", -14), (1.0, "ding", -12)], None),
    ("but the rule still holds", "pitch", "bigFace Leo frozen in his gloves", "scope", C, [], None),
    ("you can't dive any", "blueprint", "two keepers' dive bars: SAME SPEED", "none", C, [(0.4, "pop", -14)], None),
    ("you just dive the right", "pitch", "Leo dives toward the right corner", None, C, [(0.2, "swish", -8)], ("wind", -26)),
    ("fingertips", "pitch", "insert: glove fingertips tip the ball", "scope", C, [(0.2, "hit", -10)], None),
    ("saved", "pitch", "ball deflects wide; Jake celebrates", None, C, [(0.0, "cheer", -12)], ("wind", -24)),
    # --- MINUS ---
    ("minus your eyes can't", "void", "MINUS badge; an eye-shaped frame around one frozen picture", None, D, [(0.3, "pop", -10)], None),
    ("so for a whole year", "void", "the frozen picture, DAY counter crawling", "scope", C, [(0.4, "counter", -18)], None),
    ("sometimes it's a sunset", "void", "frozen picture: a sunset over the city", "scope", C, [], None),
    ("sometimes it's jake", "chess", "frozen picture: Jake mid-sneeze, droplets hanging", "scope", C, [], None),
    ("for three hundred", "chess", "same sneeze; DAY 365 counter", "scope", C, [(0.2, "counter", -16)], None),
    ("your heart beats roughly", "blueprint", "heartbeat line, one beat per second", "none", C, [(0.3, "heartbeat", -12)], None),
    ("so inside the year", "blueprint", "one beat stretched across a whole year timeline", "none", C, [(1.5, "heartbeat", -10)], None),
    ("just one", "void", "a single glowing heart pulse", "scope", C, [(0.1, "heartbeat", -8)], None),
    ("like a door closing", "hallway", "a door closing very slowly in the dark", "scope", C, [(0.4, "hum", -20)], None),
    ("but where it gets", "storm", "night storm over the city, rain", None, D, [(0.4, "thunder", -12)], ("rain", -20)),
    ("a lightning flash is", "storm", "lightning flashes; label UNDER 1 SECOND", None, C, [(0.3, "thunder", -8)], ("rain", -22)),
    ("you get to watch it", "storm", "TIME FREEZE: lightning grows branch by branch, Leo at the window; FOR MONTHS", "scope", F, [(0.0, "freeze", -8)], None),
    # --- THE COST ---
    ("and there's a cost", "void", "bigFace Leo sad in the dark", "scope", D, [], None),
    ("every time you use it", "void", "years stack up: +1 YEAR, +1 YEAR", None, C, [(0.4, "pop", -14), (1.2, "pop", -14)], None),
    ("alone", "void", "Leo tiny and alone in an endless dark space", "scope", C, [], ("wind", -30)),
    ("no voices", "void", "speech bubbles fade away", "scope", C, [], None),
    ("no touch", "void", "a hand reaches into nothing", "scope", C, [], None),
    ("just your thoughts and", "void", "Leo with one frozen picture floating in front of him", "scope", C, [], None),
    ("you're fifteen", "bedroom", "Leo medium; AGE 15", None, C, [(0.1, "pop", -14)], ("roomtone", -30)),
    ("but you've used it", "blueprint", "40 tally marks", "none", C, [(0.3, "counter", -16)], None),
    ("which means", "bedroom", "Leo's shadow on the wall is an old man; 40 YEARS NOBODY SAW", "scope", C, [(0.6, "stinger", -12)], None),
    ("the price", "void", "bigLine THE PRICE? in coral", "scope", C, [(0.0, "stinger", -12)], None),
    ("scientists know long", "blueprint", "brain inside an isolation box", "none", C, [], None),
    ("people kept alone", "blueprint", "ANXIETY, CONFUSION, SEEING THINGS appear on the words", "none", C, [(1.5, "pop", -14), (3.4, "pop", -14), (4.6, "pop", -14)], None),
    ("you start to feel", "bedroom", "Leo in his room at night; shapes creep in the shadows", "scope", C, [(0.2, "riser", -18)], ("hum", -28)),
    ("jake notices", "hallway", "hallway: Jake looks at tired Leo", None, C, [], ("murmur", -28)),
    ("dude", "hallway", "bigFace Jake talking", None, C, [], ("murmur", -30)),
    ("and one question keeps", "void", "a question mark grows huge", "scope", C, [(0.2, "riser", -14)], None),
    ("what if one day", "void", "frozen forever: breath held, clock never restarts", "scope", C, [(0.5, "heartbeat", -12)], None),
    # --- GRANDPA'S SONG ---
    ("only one person knows", "kitchen", "kitchen evening: Leo and Grandpa at the table", None, D, [], ("roomtone", -28)),
    ("grandpa", "kitchen", "bigFace Grandpa, kind eyes behind glasses", None, C, [], None),
    ("he doesn't laugh", "kitchen", "two-shot: Grandpa nods slowly", None, C, [], ("roomtone", -28)),
    ("a whole year alone", "kitchen", "bigFace Grandpa talking", None, C, [], ("roomtone", -30)),
    ("take a song", "kitchen", "Grandpa holds up a vinyl record, talking", None, C, [], ("roomtone", -30)),
    ("the same old disco", "kitchen", "Grandpa dancing, tapping the counter, record spinning", None, C, [(0.2, "pop", -16)], ("roomtone", -28)),
    ("he even taught you", "kitchen", "Grandpa and Leo dancing side by side", None, C, [], ("roomtone", -28)),
    ("boom boom boom", "kitchen", "three gold beat rings on each Boom", None, C, [(0.0, "kick", -8), (0.33, "kick", -8), (0.62, "kick", -8)], None),
    ("about a hundred beats", "blueprint", "metronome swinging: 100 BEATS / MIN", "none", C, [(0.2, "tick", -12), (0.8, "tick", -12)], None),
    ("you hum it inside", "void", "frozen void; Leo humming, gold notes drifting", "scope", C, [(0.4, "shimmer", -16)], None),
    ("and whenever you worry", "kitchen", "Grandpa's hand on Leo's shoulder, talking", None, C, [], ("roomtone", -30)),
    ("a second is plenty leo", "kitchen", "bigLine A SECOND IS PLENTY... IF YOU USE IT.", "scope", C, [(0.1, "shimmer", -14)], None),
    # --- SUNDAY: THE FALL ---
    ("sunday the kitchen", "kitchen", "quick: SUNDAY. kitchen wide; record player; Grandpa dancing", None, D, [(0.0, "whoosh", -14)], ("roomtone", -28)),
    ("grandpa falls", "kitchen", "Grandpa collapses", None, C, [(0.4, "hit", -10)], None),
    ("and you hold your breath", "kitchen", "bigFace Leo holds breath, flash", "scope", F, [(0.2, "freeze", -5)], None),
    ("now you're in the year", "kitchen", "frozen kitchen; DAY 1 badge", "scope", C, [], None),
    ("a body takes about", "blueprint", "falling line figure; 0.5 s to the floor", "none", C, [(0.4, "counter", -16)], None),
    ("you watch every centimeter", "kitchen", "frozen Grandpa mid-fall, centimetre ticks", "scope", C, [], None),
    ("what can a frozen boy", "kitchen", "bigFace Leo frozen", "scope", C, [], None),
    ("nothing not yet", "void", "NOTHING... NOT YET.", "scope", C, [], None),
    ("you remember a first-aid", "classroom", "flashback: first-aid class, instructor with a dummy", None, Fa, [], ("roomtone", -30)),
    ("when a heart suddenly", "blueprint", "heart stops; brain needs oxygen; MINUTES", "none", C, [(0.4, "heartbeat", -12)], None),
    ("every real second counts", "void", "a real clock ticking loudly", "scope", C, [(0.0, "tick", -8), (0.5, "tick", -8), (1.0, "tick", -8)], None),
    ("and you have a whole year", "kitchen", "frozen kitchen; DAY counter running", "scope", C, [], None),
    ("can you even remember", "blueprint", "CPR steps diagram assembling", "none", C, [(0.3, "blip", -14)], None),
    ("you go over that class", "classroom", "the class repeats; counter x1000", None, C, [(0.3, "counter", -16)], ("roomtone", -30)),
    ("but in here nothing", "kitchen", "frozen kitchen, calm and quiet", "scope", C, [], None),
    ("grandpa's still standing", "kitchen", "Grandpa frozen at a tilt", "scope", C, [], None),
    ("nothing ends", "void", "endless frozen space", "scope", C, [], None),
    ("you could stay", "void", "A YEAR / TEN YEARS / FOREVER", "scope", C, [(0.6, "pop", -14), (1.3, "pop", -14), (2.0, "pop", -14)], None),
    ("in here he's still", "kitchen", "warm frozen Grandpa, glasses hanging", "scope", C, [], None),
    ("out there", "void", "a clock starts ticking, red", "scope", C, [(0.4, "tick", -8), (0.9, "tick", -8)], None),
    ("stay in the frozen", "void", "split: frozen blue left, real red right", "scope", C, [(0.0, "heartbeat", -10)], None),
    ("then you hear it", "kitchen", "bigFace Leo, a sound ring arrives", "scope", C, [(0.3, "shimmer", -14)], None),
    ("one long note", "kitchen", "record player, the long note glowing", "scope", C, [(0.0, "hum", -14)], None),
    ("his song", "kitchen", "memory: Grandpa dancing, gold", "scope", C, [], None),
    ("a second is plenty if", "kitchen", "memory: bigFace Grandpa talking", "scope", C, [], None),
    ("you've had your year", "kitchen", "bigFace Leo determined", "scope", C, [(0.4, "riser", -10)], None),
    ("now use the second", "void", "bigLine NOW USE THE SECOND.", "scope", C, [(0.0, "stinger", -8)], None),
    # --- CPR ---
    ("you breathe out", "kitchen", "unfreeze: everything crashes back", None, F, [(0.0, "whoosh", -8)], ("roomtone", -26)),
    ("the spoon hits", "kitchen", "insert: spoon clatters on the tiles", None, C, [(0.2, "hit", -6)], None),
    ("mom", "kitchen", "Leo shouting toward the door", None, C, [], None),
    ("you kneel", "kitchen", "Leo kneels by Grandpa on the floor", None, C, [(0.2, "hit", -16)], None),
    ("hands in the center", "kitchen", "insert: hands stacked on the centre of the chest", None, C, [], None),
    ("push hard", "kitchen", "Leo starts compressions", None, C, [(0.2, "hit", -12)], None),
    ("about five centimeters", "blueprint", "diagram: 5 cm deep", "none", C, [(0.4, "pop", -14)], None),
    ("about a hundred to", "blueprint", "100-120 PER MINUTE", "none", C, [(0.4, "counter", -14)], None),
    ("how fast is that", "kitchen", "bigFace Leo", None, C, [], None),
    ("you already know", "kitchen", "record player still spinning", None, C, [], None),
    ("boom boom boom", "kitchen", "compressions land on each Boom, gold rings", None, C, [(0.0, "kick", -8), (0.75, "kick", -8), (1.5, "kick", -8)], None),
    ("his song is still", "kitchen", "record player; notes in the air", None, C, [], ("roomtone", -28)),
    ("you push on every beat", "kitchen", "compressions with beat rings", None, C, [(0.1, "kick", -12), (0.7, "kick", -12)], None),
    ("your arms burn", "kitchen", "bigFace Leo straining, sweat", None, C, [], None),
    ("you don't stop", "kitchen", "compressions continue; clock on the wall", None, C, [], None),
    ("nine minutes later", "kitchen", "blue and red lights sweep through the window", None, D, [(0.3, "riser", -14)], ("city", -26)),
    ("the paramedics take over", "kitchen", "paramedics with a defibrillator", None, C, [], ("city", -28)),
    ("then a beep", "kitchen", "monitor insert: flat line, then a beep", None, C, [(0.8, "blip", -6)], None),
    ("a heartbeat", "kitchen", "ECG beat glows", None, C, [(0.1, "heartbeat", -8)], None),
    ("who kept that rhythm", "kitchen", "bigFace paramedic talking", None, C, [], None),
    ("me", "kitchen", "Leo talking, exhausted", None, C, [], None),
    # --- HOSPITAL ---
    ("the next day grandpa", "hospital", "hospital room, morning light: Grandpa smiling in bed, Leo beside him", None, DW, [(0.2, "ding", -14)], ("roomtone", -28)),
    ("so", "hospital", "bigFace Grandpa talking", None, C, [], None),
    ("a year", "hospital", "Leo talking", None, C, [], None),
    ("and the nine minutes", "hospital", "Grandpa talking", None, C, [], None),
    ("you squeeze his hand", "hospital", "insert: Leo squeezes Grandpa's hand", None, C, [], None),
    ("like nine minutes", "hospital", "Leo smiling, talking", None, C, [], None),
    ("grandpa winks", "hospital", "bigFace Grandpa winks, talking: Told you.", None, C, [(0.3, "pop", -16)], None),
    ("a second is plenty and", "hospital", "two-shot in warm light", "scope", C, [(0.2, "shimmer", -14)], None),
    # --- EPILOGUE ---
    ("that night you hold", "bedroom", "night: Leo holds his breath to rest; freeze", "scope", D, [(0.6, "freeze", -10)], ("hum", -30)),
    ("and in the frozen picture", "void", "the frozen picture; something moves", "scope", C, [(0.8, "riser", -12)], None),
    ("someone else is in", "void", "a silhouette in a hat turns toward Leo", "scope", C, [(0.4, "stinger", -8)], None),
    # --- IS IT REAL ---
    ("is any of this real", "blueprint", "bigLine IS ANY OF THIS REAL?", "none", D, [(0.0, "whoosh", -14)], None),
    ("people often say", "blueprint", "line figure scared, clock slowing?", "none", C, [], None),
    ("in 2007", "blueprint", "2007: DAVID EAGLEMAN", "none", C, [(0.3, "pop", -14)], None),
    ("volunteers fell about", "blueprint", "30 m drop into a net, wrist display flashing numbers", "none", C, [(0.5, "whoosh", -12)], None),
    ("if time really slowed", "blueprint", "the display: numbers too fast to read", "none", C, [(0.3, "blip", -14)], None),
    ("they couldn't", "blueprint", "a red X", "none", C, [(0.1, "hit", -12)], None),
    ("their brains just recorded", "blueprint", "memory frames pile up densely", "none", C, [(0.3, "counter", -16)], None),
    ("and the cpr part", "blueprint", "REAL tag", "none", C, [(0.4, "ding", -12)], None),
    ("if someone collapses", "blueprint", "CPR steps: CALL 112/911 and PUSH HARD AND FAST", "none", C, [(1.0, "pop", -14), (3.5, "pop", -14)], None),
    ("so could a brain", "bedroom", "Leo at the moonlit window", "scope", D, [], ("hum", -30)),
    ("what do you think", "end", "END SCREEN: question, comment bubble, subscribe, cast", "none", Fa, [(0.2, "pop", -12)], None),
]

MUSIC = [  # (cue, mood, intensity)
    ("sunday afternoon", "playful", 0.45), ("and the whole world", "tension", 0.6), ("three weeks earlier", "mystery", 0.45),
    ("so what if one second", "epic", 0.65), ("the first time is", "playful", 0.5), ("minus your eyes", "mystery", 0.4),
    ("but where it gets", "tension", 0.55), ("and there's a cost", "sad", 0.35), ("only one person knows", "hopeful", 0.4),
    ("sunday the kitchen", "tension", 0.7), ("you remember a first-aid", "dark", 0.5), ("then you hear it", "epic", 0.6),
    ("you breathe out", "action", 0.75), ("nine minutes later", "tension", 0.55), ("a heartbeat", "triumph", 0.55),
    ("the next day grandpa", "hopeful", 0.45), ("that night you hold", "mystery", 0.5), ("is any of this real", "wonder", 0.4),
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
        k += 1
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
