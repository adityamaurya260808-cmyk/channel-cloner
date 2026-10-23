"""story/plan.py — the shot list in compact form. Run it to (re)write story/shots.json.

Each shot starts on a cue phrase (the first words it illustrates); the start time is snapped to the real word
timings in timeline/words.json, 0.15 s before the cue word. Shots are contiguous; the last one ends at
voiceover length + 1.5 s.   python projects/wake-12/story/plan.py
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
GN = ("roomtone", -34)
V0 = ("hum", -32)
OUT = ("wind", -32)
RN = ("rain", -24)
SHOTS = [
    # --- COLD OPEN ---
    ("you open your eyes", "bedroom", "bigFace Eli eyes opening, morning light", None, Fa, [(0.2, "shimmer", -20)], G),
    ("the ceiling has glow-in-the-dark", "bedroom", "POV: ceiling with glow-in-the-dark stars", None, C, [], G),
    ("you haven't seen those", "bedroom", "stars glow, label 20 YEARS", None, C, [(0.3, "shimmer", -18)], G),
    ("your feet don't reach", "bedroom", "wide: tiny Eli in a big bed, feet far from the end", None, C, [], G),
    ("your hands are small", "bedroom", "insert: small hands held up", None, C, [], G),
    ("your voice cracks when", "bedroom", "Eli says hello, voice crack squiggle", None, C, [(0.4, "glitch", -20)], G),
    ("then a voice shouts", "bedroom", "door, kitchen light, sound rings", None, C, [], G),
    ("eli", "kitchen", "Mom at the stove shouting", None, C, [(0.0, "pop", -14)], G),
    ("pancakes", "kitchen", "pancake stack flips", None, C, [(0.1, "swish", -16)], G),
    ("you're going to be", "kitchen", "Mom face, LATE FOR SCHOOL", None, C, [], G),
    ("school", "bedroom", "bigFace Eli, confused", None, C, [], G),
    ("yesterday you were thirty-two", "void", "adult Eli, 32, in a grey office", "scope", D, [(0.2, "whoosh", -16)], V0),
    ("you had a mortgage", "void", "icons: MORTGAGE, BAD BACK, JOB", "scope", C, [(0.3, "pop", -16), (1.3, "pop", -16), (2.4, "pop", -16)], V0),
    ("today", "bedroom", "match cut: adult Eli shrinks to kid Eli", None, F, [(0.0, "whoosh", -12)], G),
    ("you're twelve", "bedroom", "label AGE 12", None, C, [(0.2, "pop", -12)], G),
    ("and you remember everything", "void", "memory frames swirl around Eli", "scope", C, [(0.3, "shimmer", -16)], V0),
    ("every exam answer", "void", "frame: test answers", "scope", C, [(0.2, "pop", -16)], V0),
    ("every mistake", "void", "frame: a red X", "scope", C, [(0.2, "pop", -16)], V0),
    ("every person you lost", "void", "frame: two faded figures", "scope", C, [], V0),
    ("along the way", "void", "frames drift away", "scope", C, [], V0),
    ("most people remember almost", "blueprint", "memory timeline: ages 0-4 blank", "none", Z, [(0.3, "whoosh", -16)], None),
    ("and by thirty the", "blueprint", "age 12 memories blurry and rebuilt", "none", C, [(0.4, "glitch", -18)], None),
    ("you", "blueprint", "Eli's timeline: sharp", "none", C, [], None),
    ("you have twenty extra", "void", "+20 YEARS of memories pour into a small head", "scope", C, [(0.2, "counter", -14)], V0),
    ("in a twelve-year-old head", "void", "tiny head, huge glow", "scope", C, [], V0),
    # --- THE RULE ---
    ("but there's a rule", "void", "BUT THERE'S A RULE", "scope", C, [(0.2, "stinger", -14)], V0),
    ("you find it on", "kitchen", "first morning, Eli at breakfast", None, D, [], G),
    ("you warn mom that", "kitchen", "Eli points to bathroom, Mom listens", None, C, [], G),
    ("she checks it", "bedroom", "bathroom pipe insert", None, C, [(0.3, "tick", -16)], G),
    ("it's cracked", "bedroom", "crack in the pipe", None, C, [(0.1, "hit", -16)], G),
    ("she fixes it", "bedroom", "Mom tightens the pipe, CHANGED", None, C, [(0.3, "pop", -14)], G),
    ("and that night", "bedroom", "night bedroom, Eli thinking", None, D, [], GN),
    ("you can't remember the", "void", "memory frame: first car fades to grey", "scope", C, [(0.3, "glitch", -16)], V0),
    ("every time you change", "blueprint", "CHANGE -> MEMORY LOST diagram", "none", C, [(0.3, "pop", -14)], None),
    ("change something small lose", "blueprint", "small change, small loss", "none", C, [(0.2, "pop", -16)], None),
    ("change something big", "blueprint", "big change", "none", C, [(0.2, "riser", -16)], None),
    ("and your whole future", "blueprint", "whole timeline vanishes", "none", C, [(0.2, "whoosh", -12)], None),
    ("so what if you", "title", "TITLE CARD", None, F, [(0.0, "impact", -8)], ("wind", -30)),
    # --- PLUS ---
    ("plus school becomes very", "classroom", "PLUS chapter, Eli relaxed in class", None, D, [(0.2, "ding", -14)], G),
    ("you've done algebra", "blueprint", "x + 5 = 12 solved", "none", C, [(0.2, "pop", -16)], None),
    ("you've done taxes", "blueprint", "tax form", "none", C, [(0.2, "pop", -16)], None),
    ("your teacher ms reyes", "classroom", "Ms. Reyes hands back a test", None, C, [], G),
    ("one hundred percent", "classroom", "test: 100%", None, C, [(0.1, "ding", -12)], G),
    ("eli", "classroom", "Ms. Reyes face, suspicious", None, C, [], G),
    ("for about twenty years", "classroom", "Eli face, deadpan", None, C, [], G),
    ("minus you forgot long", "blueprint", "MINUS: long division ???", "none", D, [(0.2, "stinger", -16)], None),
    ("completely", "classroom", "Eli face, blank", None, C, [], G),
    ("turns out adults just", "blueprint", "calculator", "none", C, [(0.2, "blip", -14)], None),
    ("money", "blueprint", "MONEY?", "none", C, [(0.0, "pop", -14)], None),
    ("everyone thinks you'd be", "blueprint", "lottery ticket with ? numbers", "none", C, [], None),
    ("who does that", "kitchen", "Eli face, shrug", None, C, [], G),
    ("what you do remember", "blueprint", "maths: compound interest", "none", C, [], None),
    ("save money that grows", "blueprint", "7% doubling every 10 years curve", "none", C, [(0.4, "counter", -14)], None),
    ("start at twelve", "blueprint", "curve from age 12 to 72", "none", C, [], None),
    ("so you open a", "kitchen", "Eli drops coins into a jar", None, C, [(0.3, "pop", -16), (0.6, "pop", -16)], G),
    ("mom is very confused", "kitchen", "Mom face, confused", None, C, [], G),
    ("languages", "blueprint", "LANGUAGES?", "none", C, [(0.0, "pop", -14)], None),
    ("kids pick up accents", "blueprint", "kid vs adult accent bars", "none", C, [], None),
    ("your adult self spent", "classroom", "adult Eli failing Spanish, F grade", None, C, [], G),
    ("your twelve-year-old mouth gets", "classroom", "Eli speaks Spanish: ¡HOLA! 3 MONTHS", None, C, [(0.3, "ding", -14)], G),
    # --- UNDERSTANDING PARENTS ---
    ("plus you finally understand", "kitchen", "PLUS chapter, night kitchen", None, D, [], GN),
    ("you see mom checking", "kitchen", "Mom at the table with bills, midnight", None, C, [], GN),
    ("so you quietly do", "kitchen", "Eli washes dishes", None, C, [(0.3, "swish", -18)], GN),
    ("every night", "kitchen", "dish stack, nights flip", None, C, [], GN),
    ("mom stares at you", "kitchen", "Mom face, staring", None, C, [], GN),
    ("who are you and", "kitchen", "Mom face talking, half smile", None, C, [], GN),
    # --- THE HARD PARTS ---
    ("then the hard parts", "bedroom", "bedroom night", None, D, [], GN),
    ("bedtime is nine o'clock", "bedroom", "clock 9:00, Mom at door", None, C, [(0.2, "tick", -14)], GN),
    ("you argue like a", "bedroom", "Eli arguing, gavel icon", None, C, [], GN),
    ("but a twelve-year-old body", "blueprint", "sleep need: 9-12 HOURS", "none", C, [], None),
    ("you fall asleep", "bedroom", "Eli mid-gesture, asleep", None, C, [], GN),
    ("in the middle of", "bedroom", "zzz", None, C, [], GN),
    ("and your feelings", "void", "emotion meter swinging", "scope", C, [], V0),
    ("out of control", "void", "meter breaks", "scope", C, [(0.1, "glitch", -16)], V0),
    ("the part of the", "blueprint", "brain: prefrontal cortex develops until ~25", "none", C, [(0.4, "pop", -14)], None),
    ("yours is twelve", "blueprint", "progress bar at 12/25", "none", C, [], None),
    ("so you know better", "bedroom", "Eli with a game controller", None, C, [], G),
    ("and you still cry", "bedroom", "GAME OVER, Eli crying", None, C, [(0.3, "hit", -16)], G),
    ("your best friend omar", "classroom", "Omar squinting, label OMAR", None, C, [(0.2, "pop", -14)], G),
    ("dude", "classroom", "Omar face", None, C, [], G),
    ("you've been weird all", "classroom", "Omar face talking", None, C, [], G),
    # --- KNOWING WHAT'S COMING ---
    ("but where it gets", "void", "Eli in the void, future frames ahead", "scope", D, [(0.2, "riser", -16)], V0),
    ("is knowing what's coming", "void", "future frames line up", "scope", C, [], V0),
    ("you know which teacher", "classroom", "teacher with a moving box", None, C, [], G),
    ("you know which song", "blueprint", "music chart: #1 NEXT SUMMER", "none", C, [(0.3, "ding", -16)], None),
    ("you know mom will", "kitchen", "Mom future frame: new job", None, C, [], G),
    ("and be happier", "kitchen", "Mom smiling in the future frame", None, C, [], G),
    ("you stay quiet about", "kitchen", "Eli zips his lips", None, C, [], G),
    ("it's better as a", "kitchen", "Eli smiling", None, C, [], G),
    ("each time you fix", "void", "a memory frame cracks", "scope", C, [(0.2, "glitch", -16)], V0),
    ("so you stop fixing", "void", "Eli lowers his hand", "scope", C, [], V0),
    # --- THE PRICE ---
    ("and there's a cost", "void", "void dims", "scope", D, [], V0),
    ("the price", "void", "THE PRICE chapter", "scope", C, [(0.0, "stinger", -12)], V0),
    ("you're lonely in a", "classroom", "Eli alone among classmates", None, C, [], G),
    ("you can't tell anyone", "classroom", "Eli face", None, C, [], G),
    ("who would believe you", "classroom", "speech bubble: ?", None, C, [], G),
    ("your friends talk about", "classroom", "kids with cartoon bubbles", None, C, [], G),
    ("you want to talk", "classroom", "Eli's bubble: RENT", None, C, [], G),
    ("your mind is thirty-two", "void", "split: adult shadow / kid body", "scope", C, [], V0),
    ("your life is twelve", "void", "kid body", "scope", C, [], V0),
    ("and every small change", "void", "memory frames shatter one by one", "scope", C, [(0.3, "glitch", -16)], V0),
    ("your first apartment", "void", "frame: apartment fades", "scope", C, [], V0),
    ("your college roommate's name", "void", "frame: name tag ????", "scope", C, [], V0),
    ("the taste of your", "void", "frame: a dish fades", "scope", C, [], V0),
    ("you start to wonder", "void", "Eli surrounded by grey frames", "scope", C, [], V0),
    ("how much of your", "void", "Eli's adult shadow fading", "scope", C, [], V0),
    # --- THE ONE THING ---
    ("and there's one thing", "bedroom", "night, Eli on bed staring", None, D, [(0.2, "hum", -18)], GN),
    ("one day you've never", "bedroom", "calendar day circled", None, C, [], GN),
    ("you whisper it to", "bedroom", "bigFace Eli whispering", None, C, [], GN),
    ("you didn't come back", "bedroom", "gold words", None, C, [(0.2, "shimmer", -18)], GN),
    ("you came back to", "bedroom", "gold words continue", None, C, [], GN),
    # --- OMAR ---
    ("omar has been your", "classroom", "Omar and Eli at desks, SINCE AGE 6", None, D, [], G),
    ("he laughs too loud", "classroom", "Omar laughing, rings", None, C, [(0.1, "pop", -16)], G),
    ("he shares his lunch", "classroom", "Omar shoves a sandwich over", None, C, [], G),
    ("and you two have", "classroom", "SECRET SIGNAL", None, C, [], G),
    ("two taps on the", "classroom", "insert: two taps on the desk", None, C, [(0.1, "tick", -10), (0.4, "tick", -10)], G),
    ("then a thumbs-up", "classroom", "insert: thumbs up", None, C, [(0.2, "pop", -12)], G),
    ("it means i've got", "classroom", "label I'VE GOT YOUR BACK", None, C, [], G),
    ("omar notices everything", "classroom", "Omar squints", None, C, [], G),
    ("you talk like my", "classroom", "Omar face talking", None, C, [], G),
    ("is that a bad", "classroom", "Eli face", None, C, [], G),
    ("kind of", "classroom", "Omar face, grin", None, C, [], G),
    ("in your old life", "void", "old timeline: signal stops at 12", "scope", D, [], V0),
    ("because last week someone", "hallway", "fire alarm on the wall, flashback", None, C, [(0.3, "buzz", -12)], G),
    ("it was you", "hallway", "Eli's hand on the alarm", None, C, [(0.0, "hit", -12)], G),
    ("a dare", "hallway", "kids daring, laughing", None, C, [], G),
    ("omar was standing next", "hallway", "Omar standing by the alarm", None, C, [], G),
    ("the teachers caught him", "hallway", "teacher grabs Omar's arm", None, C, [(0.2, "hit", -16)], G),
    ("and you said", "hallway", "Eli face, silent", None, C, [], G),
    ("nothing", "hallway", "NOTHING", None, C, [], G),
    ("on friday there's a", "blueprint", "calendar: FRIDAY HEARING", "none", C, [(0.2, "pop", -14)], None),
    ("in your old life", "void", "old future: Omar EXPELLED stamp", "scope", C, [(0.2, "hit", -14)], V0),
    ("his family moved away", "street", "moving truck drives away", None, C, [(0.3, "carpass", -16)], OUT),
    ("you never spoke again", "street", "Eli alone on the sidewalk", None, C, [], OUT),
    # --- DAD ---
    ("and there's dad", "hospital", "Dad at the hospital laundry, night", None, D, [], ("hum", -28)),
    ("dad works nights at", "hospital", "laundry machines, Dad folding sheets", None, C, [], ("hum", -28)),
    ("every sunday he calls", "hospital", "Dad on a break with a phone", None, C, [(0.3, "phonering", -16)], ("hum", -28)),
    ("hey kiddo", "hospital", "Dad face, tired smile", None, C, [], ("hum", -28)),
    ("just calling", "hospital", "Dad talking", None, C, [], ("hum", -28)),
    ("no reason", "hospital", "Dad face", None, C, [], ("hum", -28)),
    ("in your old life", "void", "adult Eli ignores a buzzing phone", "scope", C, [(0.2, "phonebuzz", -16)], V0),
    ("your phone filled with", "blueprint", "voicemail list: DAD", "none", C, [], None),
    ("no reason", "blueprint", "voicemail: NO REASON", "none", C, [(0.0, "blip", -16)], None),
    ("no reason", "blueprint", "NO REASON", "none", C, [(0.0, "blip", -16)], None),
    ("no reason", "blueprint", "NO REASON", "none", C, [(0.0, "blip", -16)], None),
    ("you never once called", "void", "adult Eli alone, phone face down", "scope", C, [(0.2, "stinger", -16)], V0),
    # --- FRIDAY: THE OFFICE ---
    ("friday comes", "office", "principal's office wide", None, D, [(0.2, "tick", -16)], G),
    ("the principal's office smells", "office", "steam from a coffee mug", None, C, [], G),
    ("omar sits in the", "office", "Omar in the chair by the window", None, C, [], G),
    ("his mom holds his", "office", "Omar's mom holding his hand", None, C, [], G),
    ("his eyes are red", "office", "Omar face, red eyes", None, C, [], G),
    ("principal hart folds her", "office", "Principal Hart behind the desk", None, C, [], G),
    ("someone pulled that alarm", "office", "Hart face talking", None, C, [], G),
    ("three hundred students went", "blueprint", "300 students in the rain", "none", C, [(0.2, "rain", -16)], None),
    ("if nobody speaks", "office", "Hart face", None, C, [], G),
    ("omar is expelled", "office", "EXPELLED stamp over Omar", None, C, [(0.1, "hit", -12)], G),
    ("and then she smiles", "office", "Hart smiles at Eli", None, C, [], G),
    ("eli on a happier", "office", "Hart face talking", None, C, [], G),
    ("you've been picked for", "office", "scholarship letter, gold seal", None, C, [(0.3, "ding", -12)], G),
    ("your stomach drops", "office", "bigFace Eli, dread", None, C, [(0.2, "riser", -16)], G),
    ("you remember this moment", "void", "old timeline lights up", "scope", C, [], V0),
    ("in your old life", "void", "doors opening", "scope", C, [], V0),
    ("the top school", "void", "door 1: TOP SCHOOL", "scope", C, [(0.0, "pop", -16)], V0),
    ("the top university", "void", "door 2: UNIVERSITY", "scope", C, [(0.0, "pop", -16)], V0),
    ("the good job", "void", "door 3: GOOD JOB", "scope", C, [(0.0, "pop", -16)], V0),
    ("the quiet apartment", "void", "adult Eli in a quiet empty apartment", "scope", C, [], V0),
    ("the phone you never", "void", "phone buzzing, unanswered", "scope", C, [(0.0, "phonebuzz", -16)], V0),
    ("if you confess the", "blueprint", "scholarship: GONE", "none", C, [(0.4, "hit", -14)], None),
    ("rules are rules", "office", "Hart face, firm", None, C, [], G),
    ("and a change this", "void", "BIG CHANGE warning", "scope", C, [(0.2, "riser", -14)], V0),
    ("could wipe out every", "void", "all memory frames tremble", "scope", C, [], V0),
    ("all twenty years", "blueprint", "20 YEARS", "none", C, [(0.0, "counter", -14)], None),
    ("every answer", "void", "frames: answers", "scope", C, [], V0),
    ("every advantage", "void", "frames: advantages", "scope", C, [], V0),
    ("you'd just be", "void", "frames fall away", "scope", C, [], V0),
    ("twelve", "void", "just a kid", "scope", C, [], V0),
    ("the clock on the", "office", "wall clock ticking", None, C, [(0.1, "tick", -10), (0.6, "tick", -10), (1.1, "tick", -10)], G),
    ("every second the old", "void", "dark hands of the old future pull at Eli", "scope", C, [(0.2, "riser", -14)], V0),
    ("omar looks at you", "office", "Omar face", None, C, [], G),
    ("he taps the desk", "office", "insert: two taps", None, C, [(0.1, "tick", -10), (0.5, "tick", -10)], G),
    ("then he stops", "office", "hand stops, no thumbs-up", None, C, [], G),
    ("he doesn't finish the", "office", "Omar lowers his hand", None, C, [], G),
    ("he doesn't think you'll", "office", "Omar face, sad", None, C, [], G),
    ("why would he", "office", "Omar looks away", None, C, [], G),
    ("last time", "void", "old memory: silent Eli", "scope", C, [], V0),
    ("you didn't", "void", "Omar walks away in the old memory", "scope", C, [], V0),
    ("your perfect future", "blueprint", "balance: PERFECT FUTURE", "none", D, [], None),
    ("or your best friend", "blueprint", "balance: BEST FRIEND", "none", C, [(0.2, "swish", -16)], None),
    ("you think about the", "void", "the quiet apartment", "scope", C, [], V0),
    ("the messages", "blueprint", "voicemail list", "none", C, [], None),
    ("no reason", "blueprint", "NO REASON", "none", C, [(0.0, "blip", -16)], None),
    ("no reason", "blueprint", "NO REASON", "none", C, [(0.0, "blip", -16)], None),
    ("you didn't come back", "office", "Eli face, gold words", None, C, [(0.2, "shimmer", -16)], G),
    ("you came back to", "office", "gold words continue", None, C, [], G),
    # --- THE CONFESSION ---
    ("you stand up", "office", "Eli stands up", None, C, [(0.1, "swish", -14)], G),
    ("it was me", "office", "Eli face, firm", None, C, [], G),
    ("silence", "office", "everyone frozen", None, C, [], None),
    ("i pulled the alarm", "office", "Eli talking", None, C, [], G),
    ("on a dare", "office", "Eli face", None, C, [], G),
    ("omar was just standing", "office", "Eli points at Omar's innocence", None, C, [], G),
    ("omar's mouth falls open", "office", "Omar face, mouth open", None, C, [], G),
    ("principal hart takes a", "office", "Hart breathes", None, C, [], G),
    ("eli", "office", "Hart face talking", None, C, [], G),
    ("i do", "office", "Eli face", None, C, [], G),
    ("two weeks of detention", "blueprint", "DETENTION: 2 WEEKS", "none", C, [(0.2, "hit", -14)], None),
    ("one letter home", "blueprint", "letter", "none", C, [(0.2, "pop", -14)], None),
    ("no scholarship", "blueprint", "scholarship crossed out", "none", C, [(0.2, "hit", -14)], None),
    ("omar stays", "office", "Omar's mom hugs him", None, C, [(0.2, "ding", -14)], G),
    ("in the hallway he", "hallway", "Omar grabs Eli's shoulder", None, D, [], G),
    ("why", "hallway", "Omar face", None, C, [], G),
    ("you could've said nothing", "hallway", "Omar face talking", None, C, [], G),
    ("i already did that", "hallway", "Eli face, small smile", None, C, [], G),
    ("he doesn't understand", "hallway", "Omar confused", None, C, [], G),
    ("he doesn't need to", "hallway", "two friends, hallway", None, C, [], G),
    ("he taps the wall", "hallway", "insert: two taps on the wall", None, C, [(0.1, "tick", -10), (0.4, "tick", -10)], G),
    ("and gives you a", "hallway", "thumbs-up", None, C, [(0.2, "ding", -12)], G),
    ("the next morning the", "classroom", "class whispering", None, D, [(0.2, "murmur", -20)], G),
    ("some kids think you're", "classroom", "CRAZY bubbles", None, C, [], G),
    ("most think you're brave", "classroom", "BRAVE bubbles", None, C, [], G),
    # --- THE FADE ---
    ("that night it starts", "bedroom", "night bedroom, Eli on bed", None, D, [(0.2, "hum", -18)], GN),
    ("your memories begin to", "void", "frames dissolve to dust", "scope", C, [(0.2, "shimmer", -16)], V0),
    ("your old office", "void", "office frame fades", "scope", C, [], V0),
    ("your old street", "void", "street frame fades", "scope", C, [], V0),
    ("the faces of people", "void", "faces fade", "scope", C, [], V0),
    ("you grab a notebook", "bedroom", "Eli writing fast", None, C, [(0.2, "swish", -18)], GN),
    ("keep omar", "bedroom", "note: KEEP OMAR", None, C, [], GN),
    ("answer dad", "bedroom", "note: ANSWER DAD", None, C, [], GN),
    ("learn spanish", "bedroom", "note: LEARN SPANISH", None, C, [], GN),
    ("save the coins", "bedroom", "note: SAVE THE COINS", None, C, [], GN),
    ("by morning", "bedroom", "morning light, Eli wakes", None, D, [], G),
    ("you can't remember why", "bedroom", "Eli reads the note, confused", None, C, [], G),
    ("you're just twelve", "bedroom", "Eli face, normal", None, C, [], G),
    ("normal", "bedroom", "NORMAL", None, C, [], G),
    ("kind of behind in", "classroom", "Eli scratching his head at maths", None, C, [], G),
    # --- SUNDAY CALL ---
    ("then on sunday the", "kitchen", "phone ringing on the counter", None, D, [(0.0, "phonering", -12)], G),
    ("hey kiddo", "hospital", "Dad on break, phone", None, C, [], ("hum", -28)),
    ("just calling", "hospital", "Dad talking", None, C, [], ("hum", -28)),
    ("no reason", "hospital", "Dad face, soft", None, C, [], ("hum", -28)),
    ("you don't know why", "kitchen", "bigFace Eli, eyes glistening", None, C, [], G),
    ("you just hold the", "kitchen", "Eli holds the phone tight", None, C, [], G),
    ("hey dad", "kitchen", "Eli face talking", None, C, [], G),
    ("tell me everything", "kitchen", "split: Eli and Dad both smiling", None, C, [(0.2, "shimmer", -18)], G),
    ("and somewhere deep down", "kitchen", "warm kitchen, pull back", None, C, [], G),
    ("something feels fixed", "kitchen", "gold glow: FIXED", None, C, [(0.2, "ding", -14)], G),
    # --- IS ANY OF THIS REAL ---
    ("is any of this", "blueprint", "IS ANY OF THIS REAL?", "none", D, [(0.2, "whoosh", -16)], None),
    ("nobody can wake up", "blueprint", "NOT POSSIBLE stamp", "none", C, [(0.4, "hit", -12)], None),
    ("but some parts are", "blueprint", "BUT...", "none", C, [], None),
    ("your memories aren't stored", "blueprint", "video tape crossed out", "none", C, [(0.3, "pop", -16)], None),
    ("every time you remember", "blueprint", "memory rebuilt from pieces", "none", C, [], None),
    ("the part of the", "blueprint", "brain develops into mid-20s", "none", C, [], None),
    ("and in 1995 psychologists", "blueprint", "research card: Gilovich & Medvec, 1995", "none", C, [(0.4, "pop", -14)], None),
    ("over the long run", "blueprint", "regret bars: DIDN'T DO > DID", "none", C, [], None),
    ("like staying quiet", "blueprint", "icon: silence", "none", C, [], None),
    ("like not calling back", "blueprint", "icon: unanswered phone", "none", C, [], None),
    ("so if you could", "void", "Eli looks at the stars", "scope", D, [], V0),
    ("what do you think", "end", "END SCREEN", "none", Fa, [(0.2, "pop", -12)], None),
]

MUSIC = [  # (cue, mood, intensity)
    ("you open your eyes", "wonder", 0.4), ("yesterday you were thirty-two", "mystery", 0.4), ("but there's a rule", "mystery", 0.45),
    ("so what if you", "epic", 0.6), ("plus school becomes very", "playful", 0.5), ("plus you finally understand", "hopeful", 0.4),
    ("then the hard parts", "playful", 0.45), ("but where it gets", "mystery", 0.45), ("and there's a cost", "sad", 0.35),
    ("and there's one thing", "sad", 0.4), ("omar has been your", "hopeful", 0.45), ("because last week someone", "tension", 0.5),
    ("and there's dad", "sad", 0.4), ("friday comes", "tension", 0.5), ("your stomach drops", "dark", 0.5),
    ("you didn't come back", "epic", 0.5), ("you stand up", "triumph", 0.5), ("that night it starts", "sad", 0.4),
    ("then on sunday the", "hopeful", 0.45), ("is any of this", "wonder", 0.4), ("so if you could", "mystery", 0.4),
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
