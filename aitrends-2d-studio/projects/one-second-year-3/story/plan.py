"""story/plan.py — the shot list in compact form. Run it to (re)write story/shots.json.

Each shot starts on a cue phrase (the first words it illustrates); the start time is snapped to the real word
timings in timeline/words.json, 0.15 s before the cue word. Shots are contiguous; the last one ends at
voiceover length + 1.5 s.   python projects/one-second-year-3/story/plan.py
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
R = ("rain", -24)
V0 = ("hum", -32)
SHOTS = [
    # --- COLD OPEN: the bus freeze ---
    ("a busy street at dusk", "street", "wide rainy dusk street, traffic, slow push", None, Fa, [], R),
    ("headlights", "street", "insert: headlights flare through rain", None, C, [(0.1, "swish", -14)], R),
    ("a bus", "street", "the bus swings round the corner", None, C, [(0.2, "carpass", -12)], R),
    ("a girl on a bicycle", "street", "Nova on her bike, front wheel over the curb, bus closing in", None, C, [(1.5, "horn", -14)], R),
    ("and then", "street", "bigFace Leo, breath catches", "scope", C, [(0.2, "riser", -12)], R),
    ("everything stops", "street", "FREEZE: street stops, blue tint, rain hangs", "scope", F, [(0.0, "freeze", -5)], None),
    ("raindrops hang in the", "street", "insert: raindrops hanging like glass beads", "scope", C, [(0.3, "shimmer", -16)], None),
    ("the bus driver's mouth", "street", "insert: bus front, driver frozen mid-shout", "scope", C, [], None),
    ("you can't move", "street", "bigFace Leo frozen", "scope", C, [], None),
    ("you're inside the year", "void", "Leo tiny on the frozen clock face, 1 SECOND = 1 YEAR", "scope", C, [(0.2, "tick", -10)], V0),
    ("but this time a", "void", "gold ripples reach Leo's head from far away", "scope", C, [(0.3, "shimmer", -14)], V0),
    ("don't breathe out", "void", "whispered gold text: DON'T BREATHE OUT", "scope", C, [], V0),
    ("please", "street", "frozen Nova close-up, eyes on the bus", "scope", C, [], None),
    ("if you do", "street", "frozen wide: bus inches from her front wheel", "scope", C, [(0.0, "hum", -14)], None),
    ("i don't make it", "void", "black: I DON'T MAKE IT fades", "scope", C, [(0.2, "stinger", -12)], None),
    # --- RECAP: the power ---
    ("two weeks earlier", "bedroom", "calm bedroom morning, label TWO WEEKS EARLIER", None, D, [(0.3, "whoosh", -16)], G),
    ("you're leo", "bedroom", "Leo medium, label LEO", None, C, [(0.2, "pop", -12)], G),
    ("hold your breath and", "blueprint", "breath icon -> 1 SECOND = 1 YEAR", "none", Z, [(0.3, "counter", -14)], None),
    ("you can think anything", "void", "Leo frozen, thought bubbles swirl", "scope", C, [(0.2, "shimmer", -18)], V0),
    ("you can't move a", "void", "insert: frozen hand with a lock", "scope", C, [(0.3, "tick", -12)], V0),
    ("last time that year", "kitchen", "flashback: frozen kitchen, Grandpa mid-fall", "scope", D, [(0.2, "freeze", -12)], None),
    ("he's home now", "kitchen", "warm kitchen, Grandpa dancing", None, DW, [(0.2, "pop", -16)], G),
    ("still dancing on sundays", "kitchen", "medium: Grandpa dances", None, C, [], G),
    ("just", "kitchen", "Grandpa dances slower, rubs his back", None, C, [], G),
    ("but something is changing", "bedroom", "Leo at the window at night", None, D, [(0.2, "riser", -16)], G),
    ("the power is growing", "blueprint", "meter POWER fills and overflows", "none", C, [(0.2, "powerup", -12)], None),
    ("it used to wait", "blueprint", "ON PURPOSE -> BY ACCIDENT", "none", C, [(0.2, "pop", -14), (1.5, "glitch", -14)], None),
    ("a slammed door", "bedroom", "door slams, Leo flinches, flash", None, C, [(0.1, "hit", -8), (0.5, "freeze", -16)], None),
    ("a dropped plate", "kitchen", "plate falls and freezes mid-air", None, C, [(0.3, "freeze", -16)], None),
    ("a car horn", "street", "car honks, Leo freezes on the sidewalk", None, C, [(0.0, "horn", -10)], ("city", -26)),
    ("your breath catches", "street", "bigFace Leo gasp", "scope", C, [(0.2, "riser", -14)], None),
    ("and you're gone", "void", "zoom into the void", "scope", Z, [(0.0, "whoosh", -12)], V0),
    ("another year", "void", "calendar flips a whole year", "scope", C, [(0.0, "counter", -14)], V0),
    ("you're fifteen", "bedroom", "Leo AGE 15 label", None, C, [(0.2, "pop", -12)], G),
    ("but inside you've now", "blueprint", "YEARS LIVED INSIDE counter 15 -> 52", "none", C, [(0.3, "counter", -12)], None),
    ("so what happens when", "title", "TITLE CARD PART 2", None, F, [(0.0, "impact", -8)], ("rain", -30)),
    # --- NOVA ---
    ("then in the middle", "void", "frozen year void, Leo alone, a flicker far away", "scope", D, [(0.4, "shimmer", -16)], V0),
    ("a voice", "void", "gold ripple arrives", "scope", C, [(0.0, "blip", -14)], V0),
    ("hello", "void", "gold bubble HELLO?", "scope", C, [(0.1, "pop", -16)], V0),
    ("is someone", "void", "bigFace Leo awe", "scope", C, [], V0),
    ("you can't turn your", "market", "Leo frozen in a shop, eyes strain", "scope", C, [], None),
    ("neither can she", "bedroom", "Nova frozen in her room, tint", "scope", C, [], None),
    ("but somehow you can", "void", "two figures, thoughtLink between their heads", "scope", C, [(0.2, "shimmer", -12)], V0),
    ("her name is nova", "void", "Nova reveal, label NOVA", "scope", C, [(0.2, "pop", -12)], V0),
    ("she's sixteen", "void", "label AGE 16", "scope", C, [(0.2, "pop", -14)], V0),
    ("she lives three streets", "blueprint", "map: two houses, three streets apart", "none", C, [(0.3, "blip", -14)], None),
    ("and she's had the", "void", "Nova bigFace calm", "scope", C, [], V0),
    ("for six years", "blueprint", "6 YEARS stamp", "none", C, [(0.2, "hit", -14)], None),
    ("how many years have", "void", "Leo thinks the question across the link", "scope", C, [], V0),
    ("i stopped counting at", "void", "Nova bigFace smile", "scope", C, [], V0),
    ("two hundred", "blueprint", "counter to 200", "none", Z, [(0.0, "counter", -12)], None),
    ("you thought fifty was", "blueprint", "bars: LEO 52 vs NOVA 200", "none", C, [(0.3, "pop", -14)], None),
    # --- PLUS ---
    ("plus for the first", "void", "PLUS chapter, link glows gold", "scope", C, [(0.2, "ding", -14)], V0),
    ("you talk about everything", "void", "bubbles of topics fly between them", "scope", C, [(0.2, "pop", -16)], V0),
    ("music", "void", "icon: music note", "scope", C, [(0.0, "pop", -14)], V0),
    ("books", "void", "icon: book", "scope", C, [(0.0, "pop", -14)], V0),
    ("why cats knock things", "blueprint", "cat pushes a cup off a table", "none", C, [(1.2, "hit", -16)], None),
    ("you play chess with", "void", "glowing chessboard floats between them", "scope", C, [(0.4, "tick", -16), (1.4, "tick", -16)], V0),
    ("she wins", "void", "checkmate stamp", "scope", C, [(0.2, "hit", -12)], V0),
    ("every time", "blueprint", "tally NOVA WINS races up", "none", C, [(0.0, "counter", -14)], None),
    ("i've had practice leo", "void", "Nova bigFace smirk", "scope", C, [], V0),
    ("about a century of", "blueprint", "100 YEARS OF PRACTICE", "none", C, [(0.2, "pop", -12)], None),
    # --- MINUS ---
    ("minus she knows where", "void", "MINUS chapter, Nova serious", "scope", C, [(0.2, "stinger", -16)], V0),
    ("the years get longer", "blueprint", "timeline bar stretching", "none", C, [(0.2, "riser", -16)], None),
    ("mine used to be", "blueprint", "1 SECOND = 1 YEAR", "none", C, [(0.2, "pop", -14)], None),
    ("now one second feels", "blueprint", "1 SECOND = 2 YEARS stamp", "none", C, [(0.8, "hit", -12)], None),
    ("two years", "void", "bigFace Leo shocked", "scope", C, [], V0),
    ("two years", "void", "Nova bigFace nods", "scope", C, [], V0),
    # --- PARK ---
    ("in the real world", "park", "park bench, Leo and Nova sit", None, D, [], ("wind", -30)),
    ("jake walks past", "park", "Jake walks by, double take", None, C, [(0.3, "footstep", -18), (0.8, "footstep", -18)], ("wind", -30)),
    ("dude", "park", "Jake medium, points at Nova", None, C, [], ("wind", -30)),
    ("a friend", "park", "Leo medium", None, C, [], ("wind", -30)),
    ("a really", "park", "Nova smirks, label 200 YEARS", None, C, [(0.9, "pop", -14)], ("wind", -30)),
    # --- SKY ---
    ("but where it gets", "sky", "tilt up from the bench to the night sky", None, D, [(0.2, "shimmer", -16)], ("wind", -32)),
    ("is the sky", "sky", "stars wide", None, C, [], ("wind", -32)),
    ("in her years nova", "sky", "Nova eyes up, stars tick off", "scope", C, [(1.5, "tick", -18), (2.2, "tick", -18), (2.9, "tick", -18)], V0),
    ("the light from some", "blueprint", "star -> earth light ray, HUNDREDS OF YEARS", "none", C, [(0.4, "whoosh", -16)], None),
    ("we're both looking at", "sky", "both on the bench under the stars, silhouette", None, C, [], ("wind", -32)),
    ("how many have you", "sky", "Leo face in starlight", None, C, [], ("wind", -32)),
    ("four thousand one hundred", "sky", "counter 4,112 STARS", None, C, [(0.0, "counter", -14)], ("wind", -32)),
    # --- THE PRICE ---
    ("the price", "void", "THE PRICE chapter", "scope", C, [(0.0, "stinger", -12)], V0),
    ("nova is tired", "park", "Nova bigFace sleepy", None, C, [], ("wind", -30)),
    ("really tired", "park", "Nova slumped on the bench", None, C, [], ("wind", -30)),
    ("every time she breathes", "street", "busy street rushes too fast around Nova", None, C, [(0.2, "carpass", -14)], ("city", -20)),
    ("too loud", "street", "loud sound rings slam in", None, C, [(0.0, "hit", -12)], ("city", -18)),
    ("too scary", "street", "Nova face scared", None, C, [(0.0, "horn", -16)], ("city", -18)),
    ("so she stays in", "void", "Nova in the void, years counter rising", "scope", D, [(0.2, "counter", -16)], V0),
    ("and longer", "void", "counter faster", "scope", C, [(0.0, "counter", -14)], V0),
    ("who could blame her", "void", "void wide calm", "scope", C, [], V0),
    ("the year is quiet", "void", "Nova floating in the quiet", "scope", C, [], V0),
    ("safe", "void", "Nova eyes closed calm", "scope", C, [], V0),
    ("and empty", "void", "pull back: tiny Nova alone", "scope", C, [], V0),
    ("people returning from long", "blueprint", "research card: long isolation -> noise and crowds overwhelming", "none", C, [(0.3, "pop", -14)], None),
    ("sometimes i think i", "void", "Nova bigFace sad", "scope", C, [], V0),
    ("stay", "void", "word STAY fades in the dark", "scope", C, [(0.0, "hum", -16)], V0),
    ("your old fear comes", "bedroom", "bigFace Leo worried", None, C, [], G),
    ("what if one day", "blueprint", "breath icon locked: CAN'T BREATHE OUT?", "none", C, [(0.4, "glitch", -14)], None),
    ("now someone else is", "void", "Nova drifting deeper into the void", "scope", C, [], V0),
    ("and she's starting to", "void", "Nova face, eerie soft smile", "scope", C, [(0.3, "shimmer", -18)], V0),
    # --- SUNDAY DINNER ---
    ("so you bring her", "kitchen", "kitchen wide: Leo brings Nova, Grandpa waves", None, D, [], G),
    ("grandpa puts on his", "kitchen", "record player, needle drops", None, C, [(0.6, "tick", -12)], G),
    ("boom", "kitchen", "speaker pulse 1", None, C, [(0.0, "kick", -8)], G),
    ("boom", "kitchen", "speaker pulse 2", None, C, [(0.0, "kick", -8)], G),
    ("boom", "kitchen", "speaker pulse 3", None, C, [(0.0, "kick", -8)], G),
    ("about a hundred beats", "blueprint", "100 BPM, heart beats", "none", C, [(0.2, "heartbeat", -12, {"bpm": 100})], None),
    ("nova raises an eyebrow", "kitchen", "Nova face skeptical", None, C, [], G),
    ("you dance to this", "kitchen", "Nova medium talking", None, C, [], G),
    ("it kept me alive", "kitchen", "Grandpa face proud", None, C, [], G),
    ("then he gives her", "kitchen", "Grandpa leans to Nova", None, C, [], G),
    ("a second is plenty", "kitchen", "Grandpa face, gold words", None, C, [(0.2, "shimmer", -18)], G),
    ("if you use it", "kitchen", "words continue: IF YOU USE IT", None, C, [], G),
    ("you notice one thing", "kitchen", "Leo watching Nova", None, C, [], G),
    ("before anything scary nova", "kitchen", "Nova face eyes shut", None, C, [], G),
    ("three", "kitchen", "gold 3", None, C, [(0.0, "tick", -10)], G),
    ("two", "kitchen", "gold 2", None, C, [(0.0, "tick", -10)], G),
    ("one", "kitchen", "gold 1", None, C, [(0.0, "tick", -10)], G),
    ("before a test", "classroom", "Nova at a desk with a test", None, C, [(0.2, "swish", -16)], G),
    ("before a cold swimming", "pool", "Nova at the pool edge", None, C, [(0.2, "swish", -16)], None),
    ("before tasting grandpa's soup", "kitchen", "Nova and a spoon of soup", None, C, [(0.2, "swish", -16)], G),
    ("three", "kitchen", "Nova eyes squeezed, 3", None, C, [(0.0, "tick", -12)], G),
    ("two", "kitchen", "2", None, C, [(0.0, "tick", -12)], G),
    ("one", "kitchen", "1", None, C, [(0.0, "tick", -12)], G),
    ("nova it's soup", "kitchen", "Leo deadpan face", None, C, [], G),
    ("it's very suspicious soup", "kitchen", "Grandpa's green bubbling soup", None, C, [(0.3, "pop", -16)], G),
    # --- FRIDAY ---
    ("friday evening", "street", "rainy street wide, FRIDAY EVENING", None, D, [(0.3, "thunder", -20)], R),
    ("rain", "street", "rain hits a puddle", None, C, [], R),
    ("you're walking home", "street", "Leo walks with his hood up", None, C, [(0.2, "footstep", -18), (0.7, "footstep", -18)], R),
    ("across the street nova", "street", "Nova waits on her bike across the street", None, C, [], R),
    ("the light changes", "street", "traffic light red -> green", None, C, [(0.5, "blip", -14)], R),
    ("she pushes off", "street", "Nova pushes off", None, C, [(0.2, "swish", -14)], R),
    ("and a bus swings", "street", "the bus swings round the corner", None, C, [(0.0, "carpass", -10), (1.4, "horn", -12)], R),
    ("your breath catches", "street", "bigFace Leo gasp", "scope", C, [(0.2, "riser", -12)], R),
    ("the year begins", "street", "FREEZE", "scope", F, [(0.0, "freeze", -5)], None),
    ("and in it", "void", "ripples", "scope", C, [(0.2, "shimmer", -16)], V0),
    ("her voice", "street", "gold link from Nova's frozen head", "scope", C, [], None),
    ("don't breathe out", "void", "gold text again", "scope", C, [], V0),
    ("please", "street", "Nova frozen close-up", "scope", C, [], None),
    ("if you do", "street", "frozen wide: bus at her wheel", "scope", C, [], None),
    ("i don't make it", "void", "text fades", "scope", C, [(0.2, "stinger", -14)], None),
    # --- THE MATH ---
    ("you study the frozen", "street", "frozen wide, blueprint grid overlay", "scope", C, [(0.2, "blip", -14)], None),
    ("the bus is about", "blueprint", "top-down: bus, wheel, 10 m", "none", C, [(0.4, "pop", -14)], None),
    ("at fifty kilometers per", "blueprint", "50 km/h = 14 m/s, UNDER 1 SECOND", "none", C, [(0.3, "counter", -14)], None),
    ("and it needs more", "blueprint", "stopping distance 20+ m past the bike", "none", C, [(0.4, "screech", -16)], None),
    ("braking won't save her", "blueprint", "red X stamp", "none", C, [(0.2, "hit", -10)], None),
    ("you're three steps away", "street", "frozen: three footprints from Leo to Nova", "scope", C, [(0.3, "footstep", -16), (0.6, "footstep", -16), (0.9, "footstep", -16)], None),
    ("your body still needs", "blueprint", "reaction time gauge 0.25 s", "none", C, [(0.4, "tick", -12)], None),
    ("then three steps", "blueprint", "timeline adds STEPS", "none", C, [(0.2, "pop", -14)], None),
    ("then one grab", "blueprint", "timeline adds GRAB", "none", C, [(0.2, "pop", -14)], None),
    ("can you make it", "blueprint", "Leo total vs bus arrival, neck and neck", "none", C, [(0.2, "riser", -16)], None),
    ("maybe", "street", "bigFace Leo worried", "scope", C, [], None),
    # --- TEMPTATION ---
    ("nova's voice gets quiet", "void", "link dims, the two figures", "scope", D, [], V0),
    ("we could just stay", "void", "Nova face soft", "scope", C, [], V0),
    ("here nothing hits me", "street", "frozen bus inches away, calm", "scope", C, [], None),
    ("here you're not alone", "void", "two figures glowing together", "scope", C, [(0.2, "shimmer", -16)], V0),
    ("a thousand years together", "blueprint", "counter 1000 YEARS", "none", C, [(0.0, "counter", -14)], None),
    ("inside one second", "void", "clock 0.0 s", "scope", C, [(0.2, "tick", -12)], V0),
    ("and part of you", "void", "bigFace Leo torn", "scope", C, [], V0),
    ("no more empty years", "void", "Leo's grey empty years fade away", "scope", C, [], V0),
    ("what's one second worth", "blueprint", "balance: STAY FOREVER vs STEP OUT NOW", "none", C, [(0.3, "pop", -14)], None),
    ("stay together forever", "blueprint", "balance tips to STAY", "none", C, [(0.2, "swish", -16)], None),
    ("or step out together", "blueprint", "balance tips to STEP OUT", "none", C, [(0.2, "swish", -16)], None),
    # --- GRANDPA'S BEAT ---
    ("then you hear grandpa's", "kitchen", "memory: warm kitchen, Grandpa dancing", None, DW, [], None),
    ("boom", "void", "heart pulse 1", "scope", C, [(0.0, "kick", -6)], None),
    ("boom", "void", "heart pulse 2", "scope", C, [(0.0, "kick", -6)], None),
    ("boom", "void", "heart pulse 3", "scope", C, [(0.0, "kick", -6)], None),
    ("a second is plenty", "kitchen", "Grandpa memory face, gold words", None, C, [(0.2, "shimmer", -16)], None),
    ("if you use it", "kitchen", "words: IF YOU USE IT", None, C, [], None),
    ("nova", "void", "bigFace Leo determined", "scope", C, [], V0),
    ("we've had our years", "void", "link brightens", "scope", C, [(0.2, "powerup", -16)], V0),
    ("let's use the second", "void", "Leo face determined", "scope", C, [], V0),
    ("ready", "void", "READY?", "scope", C, [(0.0, "pop", -14)], V0),
    ("silence", "void", "darkness, link flickers", "scope", C, [], None),
    ("then", "void", "Nova face", "scope", C, [], None),
    ("a whisper", "void", "thin gold wave", "scope", C, [(0.2, "shimmer", -18)], None),
    ("three", "void", "3", "scope", C, [(0.0, "heartbeat", -10)], None),
    ("two", "void", "2", "scope", C, [(0.0, "heartbeat", -10)], None),
    ("one", "void", "1", "scope", C, [(0.0, "heartbeat", -10)], None),
    # --- THE RESCUE ---
    ("you both breathe out", "street", "unfreeze: colour returns, rain falls", None, DW, [(0.0, "whoosh", -8)], R),
    ("same instant", "street", "split: both exhale", None, C, [], R),
    ("the rain falls again", "street", "wide, rain falls", None, C, [(0.0, "rain", -14)], R),
    ("the horn screams", "street", "bus front, horn, driver shouting", None, C, [(0.0, "horn", -6)], R),
    ("you take three steps", "street", "Leo sprints three steps", None, C, [(0.2, "footstep", -12), (0.6, "footstep", -12), (1.0, "footstep", -12)], R),
    ("you grab her backpack", "street", "insert: hand grabs the backpack strap", None, C, [(0.3, "hit", -14)], R),
    ("you pull", "street", "Leo pulls back hard", None, C, [(0.1, "swish", -10)], R),
    ("she brakes and leans", "street", "Nova brakes, leans back", None, C, [(0.1, "screech", -10)], R),
    ("the bus thunders past", "street", "the bus roars past, motion blur", None, C, [(0.0, "carpass", -6)], R),
    ("close enough to lift", "street", "Nova face, hair lifts", None, C, [(0.0, "whoosh", -12)], R),
    ("her front wheel stops", "street", "insert: front wheel on the curb", None, C, [(0.3, "hit", -16)], R),
    ("the driver leans out", "street", "bus stopped, driver leans out", None, C, [], R),
    ("are you two okay", "street", "driver medium", None, C, [], R),
    ("you're soaked", "street", "Leo and Nova soaked", None, C, [], R),
    ("shaking", "street", "both shaking, then laughing", None, C, [], R),
    ("nova stares at you", "street", "Nova face", None, C, [], R),
    ("longest second of my", "street", "Nova face smiling", None, C, [], R),
    ("and the shortest", "street", "both laughing wide in the rain", None, C, [], R),
    # --- SUNDAY ---
    ("on sunday nova comes", "kitchen", "warm kitchen wide with Nova", None, D, [], G),
    ("grandpa's song plays", "kitchen", "record player spinning, notes", None, C, [(0.1, "tick", -14)], G),
    ("and this time she", "kitchen", "Nova face, no countdown", None, C, [], G),
    ("she just", "kitchen", "Nova medium, starts to move", None, C, [], G),
    ("dances", "kitchen", "all three dance", None, C, [(0.0, "pop", -14)], G),
    ("for the first time", "kitchen", "kitchen wide warm push", None, C, [], G),
    ("neither of you is", "kitchen", "Leo and Nova laughing", None, C, [], G),
    # --- THE OLDER VOICE ---
    ("that night the power", "bedroom", "bedroom night, Leo freezes", "scope", D, [(0.4, "freeze", -12)], G),
    ("and a voice speaks", "void", "dark void, violet ripple", "scope", C, [(0.2, "glitch", -16)], ("hum", -26)),
    ("not nova's", "void", "bigFace Leo scared", "scope", C, [], ("hum", -26)),
    ("older", "void", "stranger silhouette far away", "scope", C, [(0.0, "hit", -16)], ("hum", -26)),
    ("colder", "void", "stranger closer, frost", "scope", C, [(0.0, "hit", -14)], ("wind", -24)),
    ("so", "void", "stranger in shadow", "scope", C, [], ("wind", -24)),
    ("there are two of", "void", "stranger, two gold lights reflected in his glasses", "scope", C, [(0.4, "stinger", -12)], ("wind", -24)),
    ("i've been waiting a", "void", "stranger wide, smoke", "scope", C, [(0.5, "impact", -12)], ("wind", -24)),
    # --- CTA ---
    ("so what would you", "void", "Leo looks up at the clock", "scope", D, [], V0),
    ("tell us who you'd", "end", "END SCREEN: question, cast, PART THREE", "none", Fa, [(0.2, "pop", -12)], None),
]

MUSIC = [  # (cue, mood, intensity)
    ("a busy street at", "tension", 0.55), ("everything stops", "dark", 0.45), ("two weeks earlier", "hopeful", 0.4),
    ("but something is changing", "mystery", 0.45), ("so what happens when", "epic", 0.65), ("then in the middle", "wonder", 0.4),
    ("plus for the first", "playful", 0.45), ("minus she knows where", "mystery", 0.4), ("in the real world", "hopeful", 0.4),
    ("but where it gets", "wonder", 0.45), ("the price", "sad", 0.35), ("so you bring her", "playful", 0.5),
    ("friday evening", "tension", 0.5), ("the year begins", "dark", 0.45), ("you study the frozen", "tension", 0.55),
    ("nova's voice gets quiet", "sad", 0.35), ("then you hear grandpa's", "epic", 0.5), ("you both breathe out", "action", 0.75),
    ("you're soaked", "hopeful", 0.45), ("on sunday nova comes", "triumph", 0.5), ("that night the power", "dark", 0.55),
    ("so what would you", "mystery", 0.4),
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
