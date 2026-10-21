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
R = ("rain", -22)
RH = ("rain", -16)
WN = ("wind", -32)
CT = ("city", -26)
V0 = ("hum", -32)
SHOTS = [
    # --- COLD OPEN ---
    ("you look at a", "kitchen", "Kai at the kitchen table, a scrambled Rubik's cube in front of him", None, Fa, [], G),
    ("once", "kitchen", "bigFace Kai, one glance, eyes flick", None, C, [(0.1, "blip", -14)], G),
    ("you hand it back", "kitchen", "Kai hands the cube back", None, C, [(0.3, "swish", -16)], G),
    ("solved", "kitchen", "insert: cube solved, six clean faces", None, C, [(0.0, "ding", -12)], G),
    ("you read a physics", "kitchen", "Kai reads a thick PHYSICS book with cereal", None, C, [(0.4, "swish", -18)], G),
    ("then you find a", "kitchen", "insert: page 200, red circle around a mistake", None, C, [(0.6, "pop", -12)], G),
    ("your dad's car makes", "street", "driveway: Dad's car rattles, smoke puff", None, C, [(0.2, "buzz", -18)], CT),
    ("you tell him which", "kitchen", "Kai at the kitchen window points out", None, C, [], G),
    ("from the kitchen", "blueprint", "X-ray car diagram, one part glows: BELT", "none", C, [(0.3, "blip", -14)], None),
    ("how", "street", "Dad face, stunned", None, C, [], CT),
    ("it told me", "kitchen", "Kai face, shrugging smile", None, C, [], G),
    ("and your little sister", "bedroom", "hide and seek: Kai counting at the wall", None, C, [], G),
    ("at hide and seek", "bedroom", "Mia hidden behind the curtain, giggling", None, C, [(0.3, "pop", -18)], G),
    ("every single time", "bedroom", "Kai searching, confused, Mia's feet poke out", None, C, [], G),
    # --- WHO + RULES ---
    ("your name is kai", "classroom", "Kai medium, label KAI", None, D, [(0.2, "pop", -12)], G),
    ("you're thirteen", "classroom", "label AGE 13", None, C, [(0.2, "pop", -14)], G),
    ("most people score around", "blueprint", "bell curve, peak at 100", "none", Z, [(0.3, "whoosh", -16)], None),
    ("fewer than one in", "blueprint", "tail past 145 highlighted: 1 IN 700", "none", C, [(0.5, "pop", -14)], None),
    ("you", "blueprint", "curve, a dot far off the chart", "none", C, [], None),
    ("one thousand", "blueprint", "1,000 slams in, chart breaks", "none", Z, [(0.0, "impact", -10)], None),
    ("no test can even", "blueprint", "test sheet with ERROR", "none", C, [(0.3, "glitch", -16)], None),
    ("most stop working well", "blueprint", "scale tops out at 160", "none", C, [], None),
    ("but there's a rule", "void", "BUT THERE'S A RULE", "scope", C, [(0.2, "stinger", -14)], V0),
    ("your brain got smarter", "void", "Kai with glowing big brain", "scope", C, [(0.2, "powerup", -14)], V0),
    ("your body didn't", "void", "Kai's normal small body, gauge", "scope", C, [], V0),
    ("your brain is only", "blueprint", "body silhouette, brain 2% WEIGHT", "none", C, [(0.4, "pop", -14)], None),
    ("yet it burns about", "blueprint", "brain 20% ENERGY bar", "none", C, [(0.4, "pop", -14)], None),
    ("running at full power", "blueprint", "Kai's brain meter overflows", "none", C, [(0.3, "riser", -14)], None),
    ("push it too hard", "void", "Kai strains, sparks", "scope", C, [(0.3, "buzz", -18)], V0),
    ("and it shuts down", "void", "lights out: SHUT DOWN", "scope", C, [(0.2, "hit", -10)], None),
    ("so what if you", "title", "TITLE CARD: WHAT IF YOU HAD 1,000 IQ?", None, F, [(0.0, "impact", -8)], ("wind", -30)),
    # --- PLUS ---
    ("plus school becomes a", "classroom", "PLUS chapter, Kai bored in class", None, D, [(0.2, "ding", -14)], G),
    ("you finish the year's", "classroom", "a year of worksheets flies into DONE", None, C, [(0.3, "whoosh", -14)], G),
    ("then the next five", "blueprint", "grades 8-13 stamped DONE", "none", C, [(0.0, "pop", -14), (0.4, "pop", -14), (0.8, "pop", -14)], None),
    ("your teacher stares at", "classroom", "teacher holds homework, squinting", None, C, [], G),
    ("kai", "classroom", "teacher face, confused", None, C, [], G),
    ("i don't understand your", "classroom", "insert: homework full of wild equations", None, C, [], G),
    ("that's okay", "classroom", "Kai face, kind", None, C, [], G),
    ("i wrote you a", "classroom", "Kai hands a page: SIMPLER VERSION", None, C, [(0.3, "swish", -16)], G),
    ("languages", "blueprint", "LANGUAGES", "none", C, [(0.0, "pop", -14)], None),
    ("you learn spanish on", "blueprint", "SAT: HOLA", "none", C, [(0.2, "pop", -14)], None),
    ("japanese on sunday", "blueprint", "SUN: こんにちは", "none", C, [(0.2, "pop", -14)], None),
    ("your best friend ben", "classroom", "Ben counting on fingers: 7 x 8 = ?", None, C, [], G),
    ("show-off", "classroom", "Ben face, eye roll", None, C, [], G),
    ("chess", "park", "chess table in the park", None, C, [], WN),
    ("you beat the town", "park", "Kai blindfolded vs champion", None, C, [(0.5, "tick", -16)], WN),
    ("while eating cereal", "park", "Kai eats cereal; champion shocked, CHECKMATE", None, C, [(0.3, "hit", -14)], WN),
    ("the world record for", "blueprint", "WORLD RECORD ~3 s timer", "none", C, [(0.3, "tick", -14), (1.3, "tick", -14)], None),
    ("you don't time yourself", "kitchen", "Kai solves a cube, no timer", None, C, [], G),
    ("it feels rude", "kitchen", "Kai face, polite smile", None, C, [], G),
    ("then everyone wants something", "street", "crowd with requests surrounding Kai", None, C, [(0.3, "murmur", -18)], CT),
    ("your uncle wants lottery", "kitchen", "Uncle with a lottery ticket", None, C, [], G),
    ("kai just one lucky", "kitchen", "Uncle face, pleading", None, C, [], G),
    ("lotteries are random uncle", "kitchen", "Kai face, deadpan", None, C, [], G),
    ("that's the whole point", "blueprint", "random balls bouncing: RANDOM", "none", C, [(0.2, "pop", -16)], None),
    ("then you fix something", "street", "Kai on a bench with a laptop by the road", None, C, [], CT),
    ("the town's traffic lights", "street", "traffic jam at red lights", None, C, [(0.2, "horn", -18)], CT),
    ("you rewrite the pattern", "blueprint", "map of junctions, green wave flows", "none", C, [(0.3, "blip", -14)], None),
    ("rush hour gets twelve", "blueprint", "-12 MINUTES", "none", C, [(0.3, "ding", -14)], None),
    ("nobody knows it was", "street", "cars flowing, Kai unnoticed", None, C, [(0.2, "carpass", -16)], CT),
    ("which", "street", "Kai face, small smile", None, C, [], CT),
    # --- MINUS ---
    ("minus the headaches", "bedroom", "MINUS chapter, Kai holding his head", None, D, [(0.2, "stinger", -16)], G),
    ("think too fast for", "void", "pulsing red rings around Kai's head", "scope", C, [(0.2, "heartbeat", -12, {"bpm": 110})], V0),
    ("your brain has about", "blueprint", "neuron network: 86 BILLION", "none", C, [(0.3, "counter", -14)], None),
    ("yours fire like they're", "blueprint", "neurons firing rapidly", "none", C, [(0.2, "buzz", -18)], None),
    ("you sleep twelve hours", "bedroom", "Kai asleep, clock spins 12 h", None, C, [], G),
    ("and you're always hungry", "kitchen", "Kai eating, plates stacked", None, C, [], G),
    ("is that your third", "kitchen", "Mom face, eyebrows up", None, C, [], G),
    ("fourth", "kitchen", "Kai mouth full, 4 fingers", None, C, [], G),
    ("brains are expensive", "blueprint", "brain + burger fuel gauge", "none", C, [], None),
    # --- WEATHER ---
    ("but where it gets", "park", "Kai looks up at dark clouds", None, D, [(0.3, "thunder", -22)], WN),
    ("you start predicting storms", "blueprint", "Kai's forecast vs official: Kai wins", "none", C, [(0.3, "pop", -14)], None),
    ("a scientist named dr", "floodcenter", "Dr. Lee at her screens notices", None, C, [], G),
    ("she invites you to", "floodcenter", "Kai enters the flood center", None, C, [(0.3, "footstep", -18)], G),
    ("how did you know", "floodcenter", "Dr. Lee face, curious", None, C, [], G),
    ("the clouds told me", "floodcenter", "Kai face, simple", None, C, [], G),
    ("you just weren't listening", "floodcenter", "clouds whisper data", None, C, [(0.2, "shimmer", -18)], G),
    ("she doesn't laugh", "floodcenter", "Dr. Lee face, serious", None, C, [], G),
    ("she gives you a", "floodcenter", "a desk with KAI nameplate", None, C, [(0.3, "pop", -14)], G),
    # --- THE PRICE ---
    ("and there's a cost", "void", "void dims", "scope", D, [], V0),
    ("the price", "void", "THE PRICE chapter", "scope", C, [(0.0, "stinger", -12)], V0),
    ("people stop seeing a", "classroom", "Kai among classmates, faded", None, C, [], G),
    ("they see a calculator", "classroom", "Kai's head becomes a calculator", None, C, [(0.2, "blip", -14)], G),
    ("teachers ask you for", "classroom", "teachers queue with papers", None, C, [], G),
    ("adults ask you for", "street", "adults with money signs", None, C, [], CT),
    ("even ben stops joking", "classroom", "Ben quiet, distant", None, C, [], G),
    ("mate", "classroom", "Ben face", None, C, [], G),
    ("are you even still", "classroom", "Ben face, worried", None, C, [], G),
    ("you don't know", "classroom", "Kai face, unsure", None, C, [], G),
    ("everything feels slow", "classroom", "classroom in slow motion, blur", None, C, [(0.2, "slowmo", -16)], G),
    ("conversations feel like waiting", "street", "Kai at a bus stop, clock crawling", None, C, [], CT),
    ("mom finds you awake", "bedroom", "night bedroom, Kai awake on bed, Mom at door", None, D, [], G),
    ("what are you thinking", "bedroom", "Mom face, soft", None, C, [], G),
    ("everything", "bedroom", "Kai face, overwhelmed", None, C, [], G),
    ("all at once", "void", "thousand thoughts swirling", "scope", C, [(0.2, "riser", -16)], V0),
    ("it's loud in here", "void", "noise rings slam", "scope", C, [(0.0, "glitch", -16)], V0),
    ("and the more you", "void", "Kai head pain rings", "scope", C, [], V0),
    ("dr lee warns you", "floodcenter", "Dr. Lee talks to Kai", None, C, [], G),
    ("full power for too", "floodcenter", "Dr. Lee face, warning", None, C, [], G),
    ("and you might not", "blueprint", "brain meter in the red: DANGER", "none", C, [(0.2, "stinger", -16)], None),
    ("being smart is easy", "floodcenter", "Kai face, gold words", None, C, [(0.2, "shimmer", -18)], G),
    ("being useful is the", "floodcenter", "gold words continue", None, C, [], G),
    # --- MIA ---
    ("only one person treats", "bedroom", "Mia's room, Mia drawing", None, D, [], G),
    ("your little sister mia", "bedroom", "Mia medium, label MIA", None, C, [(0.2, "pop", -12)], G),
    ("she's eight", "bedroom", "label AGE 8", None, C, [(0.2, "pop", -14)], G),
    ("she thinks your brain", "bedroom", "Mia face, bored", None, C, [], G),
    ("she wins at hide", "bedroom", "Kai pretends not to see Mia", None, C, [], G),
    ("and she draws you", "bedroom", "drawing: Kai with a tiny head", None, C, [(0.3, "pop", -16)], G),
    ("i like you better", "bedroom", "Mia face, grin", None, C, [], G),
    ("every friday you two", "park", "Kai and Mia lie on the grass, clouds", None, D, [], WN),
    ("you could name every", "park", "cloud labels flicker: CUMULUS, CIRRUS", None, C, [(0.3, "shimmer", -18)], WN),
    ("you don't", "park", "labels vanish", None, C, [], WN),
    ("that one's a dragon", "park", "a cloud shaped like a dragon", None, C, [], WN),
    ("definitely a dragon", "park", "Kai and Mia grin", None, C, [], WN),
    ("when storms come you", "bedroom", "Kai teaches Mia, rain on the window", None, D, [], R),
    ("turn around", "blueprint", "TURN AROUND", "none", C, [(0.0, "pop", -14)], None),
    ("don't drown", "blueprint", "DON'T DROWN", "none", C, [(0.0, "hit", -14)], None),
    ("if water's on the", "blueprint", "figure at flooded road: X", "none", C, [], None),
    ("you go up", "blueprint", "arrow up to high ground", "none", C, [(0.2, "pop", -14)], None),
    ("moving water just fifteen", "blueprint", "15 cm water knocks a figure over", "none", C, [(0.4, "whoosh", -16)], None),
    ("thirty centimeters can float", "blueprint", "30 cm: car floats", "none", C, [], None),
    ("mia rolls her eyes", "bedroom", "Mia face, eye roll", None, C, [], R),
    ("i know kai", "bedroom", "Mia talking", None, C, [], R),
    ("up", "bedroom", "Mia points up: UP", None, C, [(0.0, "pop", -14)], R),
    ("not through", "bedroom", "NOT THROUGH", None, C, [(0.0, "pop", -14)], R),
    # --- THE STORM ---
    ("then comes the storm", "river", "storm over the river and levee", None, D, [(0.2, "thunder", -12)], RH),
    ("three days of rain", "river", "rain, calendar 3 days", None, C, [], RH),
    ("at the flood center", "floodcenter", "every screen glowing blue", None, C, [(0.2, "blip", -16)], R),
    ("the river is rising", "river", "river level rising on the levee", None, C, [], RH),
    ("the water is climbing", "blueprint", "gauge: +10 cm / HOUR", "none", C, [(0.3, "tick", -12)], None),
    ("the official forecast says", "floodcenter", "screen: FORECAST: LEVEE HOLDS", None, C, [], R),
    ("you look at the", "floodcenter", "Kai stares at numbers", None, C, [], R),
    ("and your stomach drops", "floodcenter", "bigFace Kai, dread", None, C, [(0.2, "riser", -14)], R),
    ("it won't", "floodcenter", "IT WON'T", None, C, [(0.0, "hit", -10)], R),
    ("somewhere along twelve kilometers", "blueprint", "12 km levee line, risk flickers", "none", C, [(0.3, "pop", -16)], None),
    ("but where", "blueprint", "WHERE?", "none", C, [(0.0, "pop", -14)], None),
    ("and when", "blueprint", "WHEN?", "none", C, [(0.0, "pop", -14)], None),
    ("can you even be", "floodcenter", "Kai face, doubt", None, C, [], R),
    ("to find out you'd", "void", "all data streams converge on Kai", "scope", C, [(0.3, "riser", -14)], V0),
    ("full power", "void", "FULL POWER warning", "scope", C, [(0.0, "stinger", -12)], V0),
    ("the one thing dr", "floodcenter", "memory: Dr. Lee warning", None, C, [], R),
    ("then your phone buzzes", "floodcenter", "phone buzzes on the desk", None, C, [(0.1, "phonebuzz", -10)], R),
    ("mia's school is on", "floodcenter", "phone screen: FIELD TRIP TODAY", None, C, [], R),
    ("to the riverside museum", "river", "the museum by the river", None, C, [], RH),
    ("right beside the levee", "river", "wide: museum next to the levee wall", None, C, [(0.2, "thunder", -18)], RH),
    ("you call mia's teacher", "floodcenter", "Kai on the phone", None, C, [(0.2, "phonering", -14)], R),
    ("no answer", "floodcenter", "phone: CALL FAILED", None, C, [(0.1, "glitch", -16)], R),
    ("the storm has knocked", "river", "phone towers dark, lightning", None, C, [(0.1, "thunder", -12)], RH),
    ("buses would need twenty", "blueprint", "bus to museum: 20 MIN", "none", C, [(0.3, "pop", -14)], None),
    ("if the wall breaks", "blueprint", "timeline: wall break before bus", "none", C, [(0.2, "stinger", -16)], None),
    ("you could stay safe", "blueprint", "balance: KEEP THE GIFT vs MIA", "none", D, [], None),
    ("keep your thousand iq", "blueprint", "balance tips to KEEP", "none", C, [], None),
    ("hope the forecast is", "floodcenter", "forecast screen: HOLDS", None, C, [], R),
    ("or you could push", "void", "Kai's brain glowing, cracks", "scope", C, [(0.3, "riser", -14)], V0),
    ("and maybe lose it", "void", "glow fades out", "scope", C, [], V0),
    ("dr lee grabs your", "floodcenter", "Dr. Lee grabs Kai's arm", None, C, [(0.2, "hit", -16)], R),
    ("kai", "floodcenter", "Dr. Lee face", None, C, [], R),
    ("if you do this", "floodcenter", "Dr. Lee face, scared", None, C, [], R),
    ("what's the point of", "floodcenter", "Kai face, determined", None, C, [], R),
    ("if it just watches", "floodcenter", "Kai face", None, C, [], R),
    ("keep the gift", "blueprint", "balance: THE GIFT", "none", C, [], None),
    ("or keep your sister", "blueprint", "balance tips to MIA", "none", C, [(0.2, "swish", -16)], None),
    ("being smart is easy", "void", "gold words", "scope", C, [(0.2, "shimmer", -16)], V0),
    ("being useful is the", "void", "gold words continue", "scope", C, [], V0),
    # --- FULL POWER ---
    ("you close your eyes", "floodcenter", "bigFace Kai closes his eyes", "scope", C, [(0.2, "hum", -14)], None),
    ("and you open the", "void", "floodgates open: data floods in", "scope", F, [(0.0, "powerup", -8)], V0),
    ("every rain gauge", "void", "rain gauges fly in", "scope", C, [(0.2, "blip", -14)], V0),
    ("every crack report since", "void", "crack reports 2007-2024 fly in", "scope", C, [(0.2, "blip", -14)], V0),
    ("every bend in the", "void", "river map draws itself", "scope", C, [(0.2, "whoosh", -16)], V0),
    ("your head burns", "void", "Kai's head glows red hot", "scope", C, [(0.0, "buzz", -12)], V0),
    ("the room tilts", "floodcenter", "the room tilts, dutch angle", "scope", C, [(0.2, "slowmo", -14)], R),
    ("but the answer arrives", "void", "everything clicks into one point", "scope", C, [(0.3, "ding", -10)], V0),
    ("section nine", "blueprint", "levee map: SECTION 9 flashes red", "none", Z, [(0.0, "impact", -10)], None),
    ("thirty-eight minutes", "blueprint", "countdown 38:00", "none", C, [(0.0, "tick", -10)], None),
    ("right behind the museum", "blueprint", "section 9 is behind the museum", "none", C, [(0.3, "stinger", -14)], None),
    # --- PROOF ---
    ("nobody listens to a", "floodcenter", "adults ignore Kai", None, C, [], R),
    ("so you don't give", "floodcenter", "Kai face, determined", None, C, [], R),
    ("you give them proof", "floodcenter", "Kai slaps data on the big screen", None, C, [(0.2, "hit", -12)], R),
    ("the man in charge", "floodcenter", "the chief folds his arms", None, C, [], R),
    ("the forecast says it", "floodcenter", "chief face, stubborn", None, C, [], R),
    ("the forecast is using", "floodcenter", "Kai face, firm", None, C, [], R),
    ("the river moved", "blueprint", "old vs new river path overlay", "none", C, [(0.3, "whoosh", -16)], None),
    ("you show him the", "floodcenter", "screen: PRESSURE numbers", None, C, [(0.2, "blip", -14)], R),
    ("the old crack nobody", "blueprint", "the old crack zooms in", "none", C, [(0.3, "glitch", -16)], None),
    ("dr lee checks it", "floodcenter", "Dr. Lee checks the screen", None, C, [], R),
    ("and goes pale", "floodcenter", "Dr. Lee face, pale", None, C, [], R),
    ("evacuate", "floodcenter", "red alarm lights: EVACUATE", None, C, [(0.0, "stinger", -8)], R),
    ("now", "floodcenter", "NOW", None, C, [(0.0, "hit", -10)], R),
    ("then the floor rushes", "floodcenter", "Kai collapses, camera falls", None, C, [(0.3, "whoosh", -12)], R),
    ("everything goes dark", "void", "black", "scope", C, [(0.2, "impact", -14)], None),
    # --- AFTER ---
    ("you wake up two", "hospital", "hospital bed, Kai wakes, TWO DAYS LATER", None, D, [(0.3, "heartbeat", -18)], G),
    ("mom is crying", "hospital", "Mom face, tears", None, C, [], G),
    ("ben is holding a", "hospital", "Ben holding a sandwich", None, C, [], G),
    ("you did it mate", "hospital", "Ben face, grin", None, C, [], G),
    ("you're still you", "hospital", "Ben face", None, C, [], G),
    ("the levee broke at", "river", "levee breaks at section 9, water bursts", None, D, [(0.0, "impact", -8), (0.3, "rain", -14)], RH),
    ("thirty-eight minutes later", "blueprint", "38:00 matched", "none", C, [(0.2, "ding", -12)], None),
    ("nobody was hurt", "river", "empty museum steps, people safe on the hill", None, C, [], R),
    ("and mia", "hospital", "Kai face, worried", None, C, [], G),
    ("when the alarm went", "river", "flashback: alarm, Mia grabs teacher's hand", None, C, [(0.0, "stinger", -14)], RH),
    ("not through", "river", "Mia shouting: NOT THROUGH!", None, C, [(0.0, "pop", -12)], RH),
    ("up", "river", "UP!", None, C, [(0.0, "hit", -12)], RH),
    ("her whole class climbed", "river", "class climbs to the museum's top floor", None, C, [(0.3, "footstep", -16), (0.7, "footstep", -16)], RH),
    ("then dr lee hands", "hospital", "Dr. Lee hands Kai a test", None, D, [], G),
    ("your new iq", "blueprint", "IQ counter falling from 1,000", "none", C, [(0.0, "counter", -12)], None),
    ("one hundred and thirty-two", "blueprint", "132", "none", C, [(0.2, "ding", -12)], None),
    ("still clever", "hospital", "Kai face, smiling", None, C, [], G),
    ("just", "hospital", "Kai face", None, C, [], G),
    ("human", "hospital", "HUMAN", None, C, [(0.0, "shimmer", -16)], G),
    ("mia hands you a", "hospital", "Mia gives Kai a drawing", None, C, [], G),
    ("your head is normal-sized", "hospital", "drawing: Kai with a normal head", None, C, [(0.3, "pop", -16)], G),
    ("much better", "hospital", "Mia face, grin", None, C, [], G),
    ("and for the first", "hospital", "Ben joking, Kai laughing", None, C, [], G),
    ("that friday you lie", "park", "Kai and Mia on the grass", None, D, [], WN),
    ("look she says", "park", "Mia points up", None, C, [], WN),
    ("a dragon", "park", "dragon cloud", None, C, [], WN),
    ("you squint", "park", "Kai face, squinting", None, C, [], WN),
    ("you can't remember a", "park", "blank cloud labels: ???", None, C, [], WN),
    ("definitely a dragon", "park", "Kai and Mia laughing", None, C, [], WN),
    ("being smart is easy", "park", "gold words over the sky", None, C, [(0.2, "shimmer", -16)], WN),
    ("being useful is the", "park", "gold words continue, pull back", None, C, [], WN),
    # --- IS ANY OF THIS REAL ---
    ("is any of this", "blueprint", "IS ANY OF THIS REAL?", "none", D, [(0.2, "whoosh", -16)], None),
    ("iq tests compare you", "blueprint", "IQ = compared with your age group; 1,000 off the scale", "none", C, [(0.4, "pop", -14)], None),
    ("your brain really does", "blueprint", "brain = 1/5 of energy: TRUE", "none", C, [(0.3, "ding", -14)], None),
    ("though honestly hard thinking", "blueprint", "hard thinking: + a little", "none", C, [], None),
    ("and the flood advice", "blueprint", "flood advice: REAL", "none", C, [(0.2, "ding", -14)], None),
    ("never walk or drive", "blueprint", "no walking / driving through water", "none", C, [], None),
    ("go up not through", "blueprint", "UP, NOT THROUGH", "none", C, [(0.2, "pop", -12)], None),
    ("so could anyone ever", "void", "Kai and Mia look at the sky", "scope", D, [], V0),
    ("what do you think", "end", "END SCREEN: question, cast, MORE WHAT IFS", "none", Fa, [(0.2, "pop", -12)], None),
]

MUSIC = [  # (cue, mood, intensity)
    ("you look at a", "playful", 0.45), ("but there's a rule", "mystery", 0.45), ("so what if you", "epic", 0.65),
    ("plus school becomes a", "playful", 0.5), ("then everyone wants something", "playful", 0.45), ("minus the headaches", "tension", 0.45),
    ("but where it gets", "mystery", 0.45), ("and there's a cost", "sad", 0.35), ("only one person treats", "hopeful", 0.4),
    ("then comes the storm", "tension", 0.55), ("then your phone buzzes", "dark", 0.55), ("you could stay safe", "sad", 0.4),
    ("you close your eyes", "epic", 0.7), ("nobody listens to a", "action", 0.65), ("everything goes dark", "dark", 0.3),
    ("you wake up two", "hopeful", 0.4), ("the levee broke at", "triumph", 0.55), ("then dr lee hands", "hopeful", 0.45),
    ("that friday you lie", "wonder", 0.45), ("is any of this", "wonder", 0.4), ("so could anyone ever", "mystery", 0.4),
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
