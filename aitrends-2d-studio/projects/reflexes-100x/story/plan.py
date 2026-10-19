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
    # --- COLD OPEN: garden, kitchen ---
    ("a wasp drifts", "garden", "garden wide: Theo at picnic table with sandwich, wasp drifts in from right, slow push", None, Fa, [(0.3, "buzz", -14)], ("wind", -28)),
    ("you watch it come", "garden", "bigFace Theo calm, eyes track the blurred wasp across frame", None, C, [(0.1, "buzz", -18)], ("wind", -30)),
    ("slowly", "garden", "TIME SLOW: wasp macro hanging in golden air, wings barely moving, 100x badge", "scope", F, [(0.0, "slowmo", -6)], None),
    ("like a feather", "void", "metaphor: a feather sinking through amber honey, bubbles, slow", "scope", C, [(0.2, "shimmer", -16)], None),
    ("you have time to count", "garden", "wasp close-up, stripes counted 1-2-3-4 with gold tick labels", "scope", C, [(0.4, "blip", -14), (0.8, "blip", -14), (1.2, "blip", -14)], None),
    ("and step aside", "garden", "garden medium: Theo leans aside casually, wasp sails past, sandwich in hand", None, C, [(0.2, "swish", -10)], ("wind", -28)),
    ("your mom drops a glass", "kitchen", "kitchen wide morning: Mom at counter, glass slips from her hand; Theo at table, Sam beside", None, D, [(0.9, "swish", -14)], ("roomtone", -26)),
    ("you see it tip", "kitchen", "insert: glass tipping off fingertips, slow, cool rim", None, C, [], None),
    ("you see it fall", "kitchen", "TIME SLOW: glass falling, water drops frozen in air", "scope", F, [(0.0, "freeze", -8)], None),
    ("you remember where", "kitchen", "bigFace Theo thinking; thought callout: dustpan in the cupboard (blueprint line art)", None, C, [(0.5, "pop", -12)], ("roomtone", -28)),
    ("before it even reaches", "kitchen", "low insert: glass hangs a hand above the floor tiles, Theo's hand already holding the dustpan", None, C, [], None),
    ("your little brother blinks", "kitchen", "medium: Sam at the table, eyelids starting to close", None, C, [], ("roomtone", -28)),
    ("to you that blink takes", "kitchen", "bigFace Sam mid-blink; readout NORMAL 0.1 s vs YOU 10 s", None, C, [(0.6, "counter", -16)], None),
    ("theo why are you staring", "kitchen", "OTS: Theo's blurred shoulder fg, Sam half-blinking, talking", None, C, [], ("roomtone", -28)),
    ("because sam", "kitchen", "bigFace Theo deadpan, talking", None, C, [], ("roomtone", -28)),
    ("and your toast", "kitchen", "insert: toaster, glowing coils, bread waiting", None, C, [(0.3, "hum", -22)], None),
    ("you've been waiting for", "kitchen", "Theo slumped at the toaster, chin on hand, wall clock crawling", None, C, [(0.2, "clock", -18)], ("roomtone", -28)),
    ("your name is theo", "kitchen", "Theo turns to camera in kitchen light; callout THEO, then 14", None, C, [(0.3, "pop", -12), (1.9, "pop", -12)], ("roomtone", -28)),
    ("a normal person reacts", "blueprint", "blueprint: NORMAL HUMAN reaction bar fills to 0.25 s", "none", Z, [(0.4, "counter", -16)], None),
    ("you", "blueprint", "blueprint: YOU row appears, tiny gold bar 0.0025 s", "none", C, [(1.3, "ding", -10)], None),
    ("a hundred times faster", "blueprint", "giant gold 100x stamps in with shimmer", "none", C, [(0.1, "shimmer", -10)], None),
    ("drop a ruler between", "blueprint", "blueprint ruler drop: ruler falls between line-art fingers, dimension 30 cm", "none", C, [(3.2, "hit", -14)], None),
    ("drop one for you", "blueprint", "macro: ruler barely moved, magnifier, dimension 0.03 mm in gold", "none", C, [(2.2, "ding", -12)], None),
    ("the catch", "void", "bigLine THE CATCH? over dark haze", "scope", D, [(0.0, "stinger", -10)], None),
    ("your brain got a hundred", "blueprint", "blueprint: line-art head, brain glowing gold, 100x", "none", C, [(0.3, "powerup", -12)], None),
    ("your body did not", "blueprint", "same figure, body stays dull blue, 1x", "none", C, [(0.2, "blip", -14)], None),
    ("your nerves still carry", "blueprint", "nerve path brain to arm, a slow pulse crawls along it, ~100 m/s", "none", C, [(0.4, "counter", -18)], None),
    ("your legs still run", "track", "track side view: Theo jogs past at ordinary speed", None, C, [(0.2, "footstep", -14), (0.6, "footstep", -14), (1.0, "footstep", -14)], ("wind", -26)),
    ("you see everything coming", "track", "bigFace Theo, eyes wide, sees everything", None, C, [], ("wind", -28)),
    ("you just can't move", "track", "Theo strains forward, ghost afterimages of his mind racing ahead; body lagging", "scope", C, [(0.2, "slowmo", -10)], None),
    ("so what if your reflexes", "title", "TITLE CARD over sunset city: WHAT IF YOUR REFLEXES WERE 100X FASTER?", "scope", Fa, [(0.05, "stinger", -6)], None),
    # --- PLUS ---
    ("plus you never lose", "park", "park wide at golden hour, Theo and Mia with a ball; PLUS badge", None, D, [(0.3, "pop", -10)], ("wind", -28)),
    ("your best friend mia throws", "park", "medium two-shot: Mia winds up and throws the ball at Theo's face", None, C, [(1.2, "swish", -8)], ("wind", -28)),
    ("you have time to yawn", "park", "TIME SLOW: bigFace Theo yawning, ball frozen inches away, 100x badge", "scope", F, [(0.0, "freeze", -8)], None),
    ("then you catch it", "park", "snap: Theo catches the ball one-handed, shockwave rings", None, C, [(0.15, "swish", -8), (0.3, "hit", -8)], ("wind", -28)),
    ("how", "park", "bigFace Mia shocked, talking: How... how did you even see that?", None, C, [], ("wind", -30)),
    ("i see everything mia", "park", "medium: Theo smirks, tossing the ball, talking", None, C, [], ("wind", -30)),
    ("okay", "park", "two-shot: Mia steps back, nervous, talking: That's actually creepy", None, C, [], ("wind", -30)),
    ("video games", "bedroom", "bedroom at night: Theo in gaming chair lit by monitor", None, Wh, [(0.0, "whoosh", -12)], ("hum", -28)),
    ("you read every enemy", "bedroom", "screen insert: enemies with prediction arrows drawn before they move", None, C, [(0.5, "blip", -14), (1.0, "blip", -14), (1.5, "blip", -14)], None),
    ("forty wins in a row", "bedroom", "screen: WINS counter races to 40", None, C, [(0.2, "counter", -14)], None),
    ("then the game bans you", "bedroom", "screen turns red: BANNED - SUSPECTED CHEATING", None, C, [(0.5, "glitch", -8)], None),
    ("dude", "bedroom", "bigFace Theo in red monitor light, talking: Dude.", None, C, [], ("hum", -28)),
    ("even the computer", "bedroom", "wide: Theo facepalms in his chair, red glow", None, C, [], ("hum", -28)),
    ("movies", "cinema", "cinema: Theo and Mia in a dark row, projector beam", None, Wh, [(0.0, "whoosh", -12)], ("murmur", -30)),
    ("a film shows twenty-four", "cinema", "insert: film strip racing past, counter 24 / s", None, C, [(0.3, "counter", -16)], None),
    ("everyone else sees motion", "cinema", "screen: smooth running horse silhouette, motion blur, Mia smiling", None, C, [], ("murmur", -30)),
    ("you see", "cinema", "Theo's view: same screen as stepped single frames, black gaps", "scope", C, [], None),
    ("click", "cinema", "bigFace Theo blank, screen light snaps on his face on each Click", "scope", C, [(0.0, "tick", -6), (0.95, "tick", -6), (2.05, "tick", -6)], None),
    ("great movie right", "cinema", "two-shot in seats: Mia beams, talking", None, C, [], ("murmur", -32)),
    ("very", "cinema", "bigFace Theo deadpan, talking: Very... clicky.", None, C, [], ("murmur", -32)),
    ("minus some old lights", "hallway", "MINUS badge; school hallway, fluorescent tubes flickering, 100 Hz label", None, D, [(0.3, "pop", -10), (0.5, "buzz", -18)], ("hum", -24)),
    ("nobody notices", "hallway", "students walk normally; Theo squints at the ceiling", None, C, [], ("murmur", -28)),
    ("your school hallway strobes", "hallway", "hallway strobing like a nightclub, coloured flashes, figures in stop-motion", "scope", C, [(0.2, "glitch", -14)], ("hum", -24)),
    ("then there's track", "track3d", "3D: athletics track at dusk, floodlights, slow crane", None, D, [(0.0, "whoosh", -14)], ("wind", -24)),
    ("coach lee fires", "track", "Coach Lee raises the starting pistol and fires; smoke puff", None, C, [(1.25, "impact", -8)], ("wind", -26)),
    ("you're gone before", "track", "Theo explodes out of the blocks, speed trail, smoke still hanging", None, C, [(0.1, "whoosh", -6)], ("wind", -26)),
    ("and disqualified", "track", "red DQ stamp slams over Theo, coach blows whistle", None, C, [(0.15, "hit", -6), (0.4, "whistle", -10)], None),
    ("leave the blocks less", "blueprint", "blueprint timeline after the gun: 0 to 0.30 s, red FALSE START zone under 0.10 s", "none", Z, [(0.5, "blip", -14), (3.4, "blip", -14)], None),
    ("the best sprinters react", "blueprint", "marker BEST SPRINTERS at 0.15 s", "none", C, [(0.4, "pop", -12)], None),
    ("nobody beats a tenth", "blueprint", "red wall at 0.10 s", "none", C, [(0.3, "hit", -12)], None),
    ("nobody except you", "blueprint", "gold YOU marker beyond the wall at 0.0025 s", "none", C, [(1.1, "ding", -10)], None),
    ("so you learn the strangest", "track", "Theo in the blocks, Coach standing over him, dusk", None, C, [], ("wind", -26)),
    ("waiting", "track", "bigFace Theo eyes closed, breathing, slow tick", "scope", C, [(0.0, "tick", -14), (0.5, "tick", -14)], None),
    ("coach lee hands you", "track", "Coach hands Theo a small card", None, C, [(1.0, "swish", -14)], ("wind", -28)),
    ("count theo", "track", "bigFace Coach Lee talking: Count, Theo.", None, C, [], ("wind", -30)),
    ("count to what", "track", "two-shot: Theo confused, talking", None, C, [], ("wind", -30)),
    ("count until you're on time", "track", "two-shot: Coach explains, pointing", None, C, [], ("wind", -30)),
    ("fast doesn't matter", "track", "bigLine FAST DOESN'T MATTER. / ON TIME DOES. over dusk track", "scope", C, [(0.1, "shimmer", -14)], None),
    # --- THE ROAD & THE COST ---
    ("but where it gets really", "road", "night road: Theo on the sidewalk, headlights streaming, rain-slick", None, D, [(0.5, "carpass", -12)], ("city", -22)),
    ("a car at fifty", "road", "car passes; readout 50 km/h, then dimension 14 m per second", None, C, [(0.2, "carpass", -10)], ("city", -24)),
    ("you see every one", "road", "TIME SLOW: car frozen, 14 metre ticks light up one by one", "scope", F, [(0.0, "freeze", -10)], None),
    ("you see drivers glance", "road", "insert: driver silhouette lit by a phone screen", None, C, [(0.3, "phonebuzz", -16)], ("city", -26)),
    ("you see near-misses", "road", "top-down: car and cyclist paths almost touch, 0.4 m gap", None, C, [(0.6, "riser", -16)], ("city", -26)),
    ("and there's a cost", "road", "bigFace Theo sad, rain light", "scope", D, [], ("rain", -26)),
    ("the price", "void", "bigLine THE PRICE? in coral", "scope", C, [(0.0, "stinger", -12)], None),
    ("every second feels like", "void", "clock: 1 SECOND = 1 MIN 40 S, second hand crawling", None, C, [(0.2, "clock", -16)], None),
    ("a ten-minute lesson", "classroom", "classroom: teacher at board, Theo slumped, readout 10 MIN = 16+ HOURS", None, C, [], ("roomtone", -26)),
    ("mia says good morning", "hallway", "hallway morning: Mia waves and starts to talk", None, C, [], ("murmur", -28)),
    ("and you plan your", "hallway", "Theo with a thought bubble: drafts written, crossed out twice", None, C, [(0.7, "swish", -16), (1.9, "swish", -16)], ("murmur", -28)),
    ("and get bored waiting", "hallway", "bigFace Theo sleepy while Mia's mouth moves in slow motion behind", None, C, [], ("murmur", -30)),
    ("your mind lives", "blueprint", "blueprint calendar: 1 day vs a grid of 100 days filling", "none", Z, [(0.4, "counter", -14)], None),
    ("people start to feel", "hallway", "TIME SLOW: crowded hallway frozen like grey statues, Theo moves between them", "scope", F, [(0.0, "freeze", -10)], None),
    ("beautiful", "hallway", "statues in golden window light, dust hanging", "scope", C, [(0.0, "shimmer", -18)], None),
    ("and lonely", "hallway", "pull-out: Theo small and alone among the statues", "scope", C, [], None),
    ("who talks to statues", "hallway", "Theo sits on a bench beside a frozen classmate", None, C, [], ("hum", -30)),
    ("and who is going", "hallway", "empty corridor, Theo walks away into the light", None, C, [], ("hum", -30)),
    # --- SAM ---
    ("sam does", "gate", "school gate golden afternoon: Sam jumps up waving", None, DW, [(0.2, "ding", -12)], ("wind", -28)),
    ("your seven-year-old", "gate", "medium: Sam grinning, yellow cap; label 7", None, C, [(0.3, "pop", -12)], ("wind", -28)),
    ("the only person who", "gate", "Sam hugs Theo's leg, Theo smiles", None, C, [], ("wind", -28)),
    ("he waits for you", "gate", "wide: Sam sitting on the gate wall, swinging legs, waiting", None, C, [], ("wind", -28)),
    ("he listens to your", "street", "walking home at sunset, Theo talking, story bubbles; Sam listening, joy", None, C, [], ("city", -30)),
    ("he never once says", "street", "bigFace Sam smiling up at Theo", None, C, [], ("city", -30)),
    ("years ago you taught", "garden", "flashback (soft, faded): backyard, Theo younger teaching little Sam", None, Fa, [], ("wind", -30)),
    ("a whistle", "garden", "insert: Theo whistles, musical rings", None, C, [(0.1, "whistle", -10)], None),
    ("two notes", "blueprint", "two notes on a staff: HIGH then LOW, waveform", "none", C, [(0.1, "blip", -12), (1.2, "blip", -14, {"pitch": 0.75})], None),
    ("it means freeze", "garden", "FREEZE in big letters; Sam stops mid-run", "scope", F, [(0.6, "freeze", -10)], None),
    ("whenever you whistle", "garden", "Sam frozen mid-step like a robot, Theo laughing", None, C, [(0.2, "whistle", -14)], ("wind", -30)),
    ("every single time", "garden", "triptych: Sam frozen in three different places", None, C, [(0.1, "pop", -14), (0.4, "pop", -14), (0.7, "pop", -14)], None),
    ("even in the supermarket", "market", "supermarket aisle: Sam frozen mid-step, shoppers stare", None, Wh, [(0.0, "whoosh", -12)], ("murmur", -26)),
    ("sam", "market", "Theo, embarrassed, talking: Sam! Not in the cereal aisle!", None, C, [], ("murmur", -28)),
    ("robots don't choose", "market", "bigFace Sam deadpan, frozen, talking", None, C, [], ("murmur", -30)),
    # --- SPORTS DAY ---
    ("sports day", "track3d", "3D: stadium on sports day, crowd, flags, main road beside it", None, D, [(0.0, "whoosh", -12), (0.3, "cheer", -18)], ("murmur", -22)),
    ("the hundred-meter final", "track", "finalists line up; giant screen 100 M FINAL", None, C, [(0.2, "pop", -12)], ("murmur", -24)),
    ("the track sits right", "track", "wide: track, fence, an open gate, the main road beyond", None, C, [(0.5, "carpass", -16)], ("murmur", -24)),
    ("your whole family", "track", "stands: Mom, Sam and Mia cheering", None, C, [(0.2, "cheer", -14)], ("murmur", -22)),
    ("you crouch in the blocks", "track", "Theo crouches into the blocks, side view", None, C, [], ("murmur", -26)),
    ("on your marks", "track", "Coach Lee lifts the pistol, talking", None, C, [], ("murmur", -30)),
    ("set", "track", "Theo hips up, frozen tension, crowd hushed", "scope", C, [(0.0, "heartbeat", -10)], None),
    ("your brain waits", "track", "bigFace Theo determined, heartbeat", "scope", C, [(0.2, "heartbeat", -12)], None),
    ("and then", "track", "extreme close on Theo's eye, it flicks right", "scope", C, [(0.4, "riser", -12)], None),
    ("a red ball bouncing", "track", "red ball bouncing through the open gate toward the road", None, C, [(0.4, "pop", -16), (1.0, "pop", -18)], ("murmur", -28)),
    ("and a small boy", "track", "Sam runs after the ball", None, C, [(0.1, "footstep", -16), (0.5, "footstep", -16)], ("murmur", -28)),
    ("sam", "track", "bigFace Theo shocked", "scope", F, [(0.0, "impact", -6)], None),
    ("down the road comes", "road", "golden road: delivery truck rolling toward camera", None, C, [(0.2, "carpass", -10)], ("city", -24)),
    ("fifty kilometers per hour", "road", "truck; readouts 50 km/h, 40 m, 2.9 s countdown", None, C, [(0.2, "blip", -12), (2.1, "blip", -12), (3.7, "counter", -14)], ("city", -26)),
    ("you do the math", "track", "TIME FREEZE: blueprint math lines over the frozen stadium, Theo blinks", "scope", F, [(0.0, "freeze", -6)], None),
    ("you're sixty meters", "blueprint", "top-down map: Theo at the blocks, gate 60 m away, truck, Sam", "none", C, [(0.6, "pop", -12)], None),
    ("even the fastest man", "blueprint", "blueprint: fastest sprinter line-figure, 60 m in 6+ s", "none", C, [(0.4, "counter", -16)], None),
    ("you'd need eight", "blueprint", "YOU 8 s bar in coral vs truck 2.9 s", "none", C, [(0.2, "hit", -10)], None),
    ("your brain is fast", "blueprint", "brain gold / legs grey", "none", C, [(0.2, "ding", -14), (1.6, "blip", -14)], None),
    ("you can't reach him", "track", "frozen wide: Theo far from the gate, Sam near the curb", "scope", C, [], None),
    ("and the gun hasn't", "track", "insert: pistol, finger on trigger, frozen", "scope", C, [], None),
    ("move now", "track", "Theo in blocks; red DQ ghost flickers over him", "scope", C, [(1.2, "glitch", -16)], None),
    ("months of training", "track", "memories of training as fading frames, then GONE", "scope", C, [(1.2, "whoosh", -16)], None),
    ("the race or your brother", "track", "split: finish line left, Sam right", "scope", C, [(0.0, "heartbeat", -10)], None),
    ("you stand up", "track", "Theo rises out of the blocks", None, C, [(0.2, "swish", -12)], ("murmur", -26)),
    ("before the gun", "track", "Coach Lee, pistol raised, startled", None, C, [], ("murmur", -26)),
    ("the crowd groans", "track", "crowd slumps, groan", None, C, [(0.1, "murmur", -10)], ("murmur", -22)),
    ("false start", "track", "stadium screen flashes FALSE START", None, C, [(0.1, "hit", -8)], ("murmur", -24)),
    ("but you don't run", "track", "Theo standing still while others stay crouched", None, C, [], ("murmur", -26)),
    ("running won't work", "blueprint", "top-down: dotted run path to the gate, crossed out", "none", C, [(0.5, "hit", -14)], None),
    ("instead you whistle", "track", "bigFace Theo whistling, rings", "scope", C, [(0.5, "whistle", -6)], None),
    ("two notes high then low", "track", "two gold note rings leave Theo and sweep across the field", "scope", C, [(0.0, "whistle", -10)], None),
    ("sound travels at about", "blueprint", "blueprint: sound wave arcs crossing 60 m, 340 m/s", "none", Z, [(0.4, "counter", -16)], None),
    ("it reaches sam in", "blueprint", "timer: 0.18 s, wave hits Sam's icon", "none", C, [(1.8, "ding", -10)], None),
    ("you watch the sound arrive", "track", "TIME FREEZE: wide, gold rings crawling across the field toward Sam", "scope", F, [(0.0, "freeze", -8)], None),
    ("you watch him hear it", "track", "Sam's head, the ring touches it, eyes widen", "scope", C, [(0.4, "shimmer", -14)], None),
    ("and sam freezes", "track", "Sam stops dead, mid-step", "scope", C, [(0.8, "hit", -14)], None),
    ("one foot in the air", "road", "low insert: Sam's foot hovering over the curb edge, truck lights growing", "scope", C, [(0.3, "riser", -12)], None),
    ("the truck rushes past", "road", "truck blurs past between camera and Sam, shake", None, C, [(0.0, "carpass", -4), (0.1, "whoosh", -8)], ("wind", -20)),
    ("the ball rolls under", "road", "red ball rolls under the giant wheel", None, C, [], ("wind", -24)),
    ("pop", "road", "POP: ball bursts, flash and rings", None, C, [(0.0, "hit", -4), (0.0, "pop", -4)], None),
    ("silence", "road", "still wide: empty road, dust settling, Sam frozen at the curb", None, C, [], ("wind", -32)),
    ("then sam turns around", "road", "Sam turns around and waves", None, C, [], ("wind", -30)),
    ("the whole stadium saw", "track", "crowd on its feet, stunned", None, C, [(0.2, "murmur", -12)], ("murmur", -24)),
    ("coach lee walks over", "track", "Coach Lee walks over to Theo", None, C, [(0.2, "footstep", -16), (0.7, "footstep", -16)], ("murmur", -28)),
    ("you know you're disqualified", "track", "bigFace Coach smiling, talking", None, C, [], ("murmur", -30)),
    ("i know", "track", "two-shot: Theo smiles, talking; Coach's hand on his shoulder", None, C, [], ("murmur", -30)),
    ("mia is crying", "track", "bigFace Mia crying happy tears", None, C, [], ("murmur", -28)),
    ("your mom is running", "track", "Mom runs across the field", None, C, [(0.2, "footstep", -14), (0.5, "footstep", -14)], ("murmur", -26)),
    ("and sam crashes", "track", "Sam leaps into Theo's arms", None, C, [(0.9, "hit", -14)], ("murmur", -26)),
    ("for once you don't", "track", "warm slow push on the hug, sunset, dust", "scope", C, [], ("wind", -30)),
    ("you want this one", "track3d", "3D: slow orbit around the hug in the evening light", "scope", Fa, [(0.0, "shimmer", -16)], None),
    # --- THE LETTER ---
    ("that night a letter", "bedroom", "bedroom night, moonlight; a letter slides under the door", None, D, [(1.0, "swish", -16)], ("hum", -30)),
    ("no name", "bedroom", "insert: blank envelope in Theo's hands, moonlight", None, C, [], ("hum", -30)),
    ("we saw what you did", "bedroom", "the letter's single line appears", "scope", C, [(0.0, "riser", -14)], None),
    ("we would like", "bedroom", "bigFace Theo reading, moonlit, awe", "scope", C, [(0.8, "stinger", -10)], None),
    # --- IS IT REAL ---
    ("is any of this real", "blueprint", "bigLine IS ANY OF THIS REAL?", "none", D, [(0.0, "whoosh", -14)], None),
    ("partly", "blueprint", "blueprint: PARTLY. stamp", "none", C, [(0.0, "pop", -12)], None),
    ("human visual reaction", "blueprint", "blueprint: real human reaction bar 0.25 s", "none", C, [(0.5, "counter", -16)], None),
    ("sprinting really does", "blueprint", "blueprint: false-start rule under 0.10 s", "none", C, [(0.5, "blip", -14)], None),
    ("and some animals", "blueprint", "blueprint: eyes of animals, fly eye glowing", "none", C, [(0.4, "pop", -14)], None),
    ("houseflies notice flicker", "blueprint", "blueprint: lamp light smooth for human vs strobing for the fly", "none", C, [(0.4, "blip", -14)], None),
    ("which helps explain", "kitchen", "kitchen: a hand swats, the fly casually dodges", None, C, [(1.6, "swish", -10), (1.9, "buzz", -16)], ("roomtone", -28)),
    ("but a human brain", "blueprint", "brain 100x with a question mark", "none", C, [], None),
    ("your nerves are simply", "blueprint", "nerve pulse crawling, too slow", "none", C, [], None),
    ("so could anything ever", "bedroom", "Theo at the moonlit window holding the letter, slow push", "scope", D, [], ("hum", -30)),
    ("what do you think", "end", "END SCREEN: question, comment bubble, subscribe, cast lined up", "none", Fa, [(0.2, "pop", -12)], None),
]

MUSIC = [  # (cue, mood, intensity)
    ("a wasp drifts", "wonder", 0.35), ("your mom drops", "playful", 0.4), ("a normal person", "mystery", 0.45),
    ("so what if your reflexes", "epic", 0.65), ("plus you never lose", "playful", 0.5), ("minus some old", "mystery", 0.45),
    ("then there's track", "hopeful", 0.55), ("but where it gets", "tension", 0.5), ("and there's a cost", "sad", 0.35),
    ("sam does", "hopeful", 0.4), ("sports day", "action", 0.55), ("and then", "tension", 0.75),
    ("you stand up", "epic", 0.7), ("silence", "calm", 0.2), ("the whole stadium", "triumph", 0.6),
    ("that night a letter", "mystery", 0.45), ("is any of this real", "wonder", 0.4),
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
