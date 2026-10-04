#!/usr/bin/env python3
"""Break the dreams script into scenes -> scenes/dreams-scenes.md + .json

Run: python3 scripts/build_scenes.py
Timestamps are estimated at 150 words/min (min 2s per scene).
"""
import json
import os

STYLE = (
    "Hand-drawn 2D doodle, simple stick figures with black outlines, flat marker-style fills, "
    "deep night-blue background, golden-yellow accent, red for emphasis, bold hand-written sans-serif labels, "
    "16:9, minimal, no shading"
)

# (section, narration, visual)
S = []


def sec(name, rows):
    for n, v in rows:
        S.append((name, n, v))


sec("HOOK", [
    ("Tonight, you're going to close your eyes,", "Stick figure lying in bed, eyes closed, dark blue room, moon in window"),
    ("and within an hour or two, you'll start to dream.", "Swirly thought-cloud rising above the sleeping figure"),
    ("You'll fly, or fall, or run from something you can't see.", "Three panels: figure flying, figure falling, figure running from a black blob"),
    ("You might meet someone you haven't thought about in years.", "Faded grey silhouette of a person with a question mark"),
    ("And it will feel completely real.", "Figure inside dream bubble, big hand-lettered word REAL"),
    ("Then you'll wake up, and it will be gone.", "Sunrise, figure sitting up, thought bubble dissolving into dots"),
    ("Over an average lifetime, you will spend about six years dreaming.", "Long timeline bar labeled YOUR LIFE with a small yellow slice labeled 6 YEARS"),
    ("Six years of stories, faces, and places that no one else will ever see.", "Row of small thought bubbles holding faces and places"),
    ("And you will remember almost none of it.", "Same bubbles fading out, red X over the row"),
    ("That isn't a flaw in your memory.", "Brain doodle with red X over the word FLAW"),
    ("It's a feature.", "Same brain with yellow check mark and the word FEATURE"),
    ("And the reason why is stranger than you'd think.", "Stick figure with raised eyebrow, giant question mark"),
])

sec("1. THE DISCOVERY", [
    ("For most of history, nobody even knew when dreams happened.", "Timeline labeled HUMAN HISTORY filled with question marks"),
    ("Then, in 1953, a graduate student named Eugene Aserinsky", "Stick figure with glasses holding a clipboard, label 1953"),
    ("and his professor, Nathaniel Kleitman, were watching sleeping people", "Two figures standing beside a bed with a sleeper"),
    ("at the University of Chicago.", "Simple building labeled UNIVERSITY OF CHICAGO"),
    ("They noticed something odd.", "Magnifying glass over a sleeper's face"),
    ("Several times a night, a sleeper's eyes would start darting back and forth under closed lids,", "Closed eyes with left-right arrows"),
    ("and their brain activity would suddenly look almost the same as when they were awake.", "Two brainwave squiggles labeled AWAKE and REM, nearly identical"),
    ("They called it rapid eye movement sleep. REM.", "Big text REM = RAPID EYE MOVEMENT"),
    ("Here's the part that surprised everyone.", "Surprised stick figure, exclamation marks"),
    ("When they woke people during REM, most of them could describe a vivid dream.", "Alarm bell, sleeper sitting up with a full colorful thought bubble"),
    ("A few years later, William Dement and Kleitman found", "Two figures, label 1957"),
    ("that people woken from REM sleep reported dreaming around 80 percent of the time.", "Pie chart, 80% yellow slice"),
    ("So dreams weren't rare.", "Figure shaking head, text NOT RARE"),
    ("They were happening constantly.", "Many thought bubbles rising from a sleeper"),
    ("We just weren't carrying them out of the night.", "Figure leaving a dark doorway into sunlight with an empty basket, bubbles left behind"),
    ("Which raises the real question.", "Giant yellow question mark"),
    ("If your brain can build an entire world while you sleep,", "Brain building a tiny globe with hammers"),
    ("why can't it keep it?", "Globe slipping through open hands"),
])

sec("2. THE CHEMICAL SWITCH", [
    ("Part of the answer is chemistry.", "Beaker with glowing yellow liquid"),
    ("During the day, your brain is constantly bathed in a chemical called norepinephrine.", "Brain sitting in yellow liquid labeled NOREPINEPHRINE"),
    ("It's linked to alertness,", "Wide-eyed awake figure under a sun"),
    ("and it plays a major role in helping your brain decide what's worth remembering.", "Brain sorting items into a box labeled KEEP"),
    ("When something surprising happens, norepinephrine rises,", "Startled figure, meter rising"),
    ("and the memory gets stored.", "Memory folder dropping into a brain"),
    ("But during REM sleep, something unusual happens.", "Moon and sleeping figure with REM tag"),
    ("Norepinephrine drops to almost nothing.", "Meter falling to zero"),
    ("A small region in the brainstem that normally produces it goes nearly silent.", "Brain cross-section, brainstem highlighted, figure saying shh"),
    ("Think about what that means.", "Figure with finger on chin, thinking"),
    ("You're having the most vivid experiences of your night,", "Big colorful dream bubble"),
    ("and the chemical that helps your brain write things down is switched off.", "Pencil with an OFF switch"),
    ("Your brain is a camera, recording a movie,", "Camera on tripod with film reel"),
    ("with the film supply cut.", "Scissors cutting the film strip"),
    ("The hippocampus, the region most associated with forming new memories,", "Seahorse-shaped hippocampus inside a brain, labeled"),
    ("is also behaving differently during REM.", "Same seahorse looking sleepy, dimmed"),
    ("So the dream plays out in real time,", "Dream bubble with a ticking clock"),
    ("but the machinery for saving it is running at a fraction of its normal power.", "Battery icon at 10 percent"),
])

sec("3. DREAM TO FORGET", [
    ("But some scientists think there's a deeper reason.", "Scientist figure with a lightbulb"),
    ("Maybe forgetting dreams isn't a bug at all.", "Red X over the word BUG"),
    ("In 1983, Francis Crick,", "Figure labeled 1983 FRANCIS CRICK"),
    ("the man who helped discover the structure of DNA,", "DNA double helix"),
    ("and his colleague Graeme Mitchison, proposed a surprising idea.", "Two figures sharing a lightbulb"),
    ("They suggested that we dream in order to forget.", "Sleeper whose dream bubble says TO FORGET"),
    ("Their argument went like this.", "Chalkboard with a stick-figure teacher"),
    ("During the day, your brain absorbs an enormous amount of information.", "Brain with many arrows flowing in"),
    ("Some of it is useful.", "Yellow check marks"),
    ("A lot of it is noise, random connections that don't mean anything.", "Tangled grey scribbles"),
    ("If the brain kept everything, it would become overloaded,", "Brain stuffed like an overflowing backpack"),
    ("and useful memories would get buried under useless ones.", "Gold nugget buried under a junk pile"),
    ("So during REM sleep, they proposed, the brain runs a kind of cleanup.", "Broom sweeping inside a brain"),
    ("It fires off random patterns of activity,", "Brain with yellow sparks"),
    ("and in doing so, it weakens weak or unnecessary connections.", "Thin connection lines fading out"),
    ("They called it reverse learning.", "Text REVERSE LEARNING with a rewind arrow"),
    ("If that's true, then dreams are the sound of the brain taking out the trash.", "Figure carrying a trash bag out of a head"),
    ("And you don't keep the trash.", "Trash can lid closing"),
    ("Not every scientist agrees with this theory, and it's still debated.", "Two scientists, one thumbs up, one thumbs down"),
    ("But it points to something important.", "Arrow pointing at a glowing word"),
    ("Forgetting is not the opposite of memory.", "Text FORGETTING is not the OPPOSITE of MEMORY"),
    ("It's part of how memory works.", "Gear labeled FORGETTING inside memory gears"),
])

sec("4. THE PEOPLE WHO REMEMBER", [
    ("Now, not everyone forgets equally.", "Row of five sleepers with different-sized bubbles"),
    ("Some people wake up every morning with detailed dreams.", "Figure waking with a huge detailed bubble"),
    ("Others say they almost never dream at all.", "Figure waking with an empty bubble"),
    ("And for years, researchers wondered", "Researcher with a question mark"),
    ("whether those two groups simply had different brains.", "Two brains side by side"),
    ("In 2014, a team led by Perrine Ruby in Lyon, France,", "Map pin labeled LYON, FRANCE and 2014"),
    ("scanned the brains of people who recalled dreams often and people who rarely did.", "Brain scanner machine with a person inside"),
    ("They found real differences.", "Two brain scans compared, one area circled"),
    ("In the frequent dreamers, an area called the temporoparietal junction was more active,", "Brain with a glowing highlighted area labeled TPJ"),
    ("both when awake and during sleep.", "Sun and moon icons with glow"),
    ("It's a region involved in processing information from the outside world and shifting your attention.", "Eye and ear with arrows into a brain"),
    ("But here's the twist.", "Twisting spiral arrow"),
    ("The people who remembered more dreams also woke up more often during the night.", "Sleep graph with small spikes upward"),
    ("About twice as long, in fact.", "Two bars labeled AWAKE TIME, one twice as tall"),
    ("That's the key.", "Yellow key icon"),
    ("You don't remember dreams by dreaming harder.", "Straining figure with a red X"),
    ("You remember them by being awake just long enough,", "Figure with eyes half open"),
    ("in just the right moment, for the memory to be saved.", "Memory folder dropping with a SAVE label"),
    ("A dream you wake up inside of is a dream you can keep.", "Figure cupping a glowing bubble in both hands"),
    ("A dream you sleep straight through is gone forever.", "Bubble popping into dust"),
])

sec("5. A HISTORY OF GETTING IT WRONG", [
    ("For thousands of years, people believed forgotten dreams meant something.", "Ancient scroll with an eye symbol"),
    ("Ancient Egyptians wrote dream books.", "Egyptian-style figure holding a papyrus"),
    ("The Greeks built temples for dream healing.", "Temple columns with a sleeper inside"),
    ("In 1899, Sigmund Freud published The Interpretation of Dreams,", "Book cover with label 1899"),
    ("arguing that dreams were disguised wishes from the unconscious,", "Figure wearing a mask inside a bubble"),
    ("and that forgetting them was the mind's way of protecting you from your own secrets.", "Locked box inside a head"),
    ("Today, most researchers see it differently.", "Figure shaking head"),
    ("In 1977, J. Allan Hobson and Robert McCarley proposed", "Two figures, label 1977"),
    ("that dreams begin as random signals from the brainstem,", "Zigzag signals rising from the brainstem"),
    ("and the forebrain does its best to stitch them into a story.", "Needle and thread stitching scribbles into a story"),
    ("That's why dreams jump from place to place,", "Arrows hopping beach, school, space"),
    ("and why a person can be your teacher and your cousin at the same time.", "One figure drawn half teacher, half cousin"),
    ("Whether dreams carry hidden meaning is still debated.", "Balance scale with a question mark"),
    ("But one thing is clear.", "Raised finger"),
    ("Whatever the mystery of the dream, the forgetting is a matter of biology, not secrets.", "Open lock beside the word BIOLOGY"),
])

sec("6. HOW TO KEEP THEM", [
    ("If you want to remember more, the research is surprisingly practical.", "Clipboard checklist"),
    ("Keep a notebook beside your bed.", "Nightstand with a notebook and pen"),
    ("The moment you wake up, before you look at your phone, before you stand up,", "Phone and feet each with a red X"),
    ("stay still and write down whatever you have,", "Figure lying in bed writing"),
    ("even if it's just a feeling or a single image.", "Notebook page with one scribble and a heart"),
    ("Studies of people who keep dream journals suggest recall improves with practice.", "Rising line graph labeled DAYS"),
    ("Don't open your eyes right away.", "Closed eyes"),
    ("The moment you start thinking about your day, the dream starts dissolving.", "To-do list replacing a fading bubble"),
    ("And don't worry if nothing comes.", "Relaxed shrugging figure"),
    ("Everyone dreams.", "Row of different people sleeping with bubbles"),
    ("You're just not catching them.", "Net missing a flock of butterflies"),
])

sec("ENDING", [
    ("So tonight, when you fall asleep, remember what's happening.", "Figure in bed, moon outside"),
    ("For about two hours, your brain will build entire worlds,", "Small planets rising out of a sleeping head"),
    ("with no chemical to save them, and no one to watch.", "Empty theater seats facing a glowing dream"),
    ("You'll live in them, and you'll leave them behind.", "Figure walking out of a bubble world"),
    ("Six years of your life, spent in places that never existed,", "Timeline slice labeled 6 YEARS with empty planets"),
    ("with people who were only ever you.", "Crowd of faces all drawn as the same stick figure"),
    ("And the strangest part isn't that you forget them.", "Red X over the word FORGET"),
    ("It's that you wake up the next morning,", "Sunrise, figure waking up"),
    ("and you were there the whole time.", "Figure silhouette smiling inside a faded dream bubble"),
])

WPS = 150 / 60.0
t = 0.0
scenes = []
for i, (section, narr, vis) in enumerate(S, 1):
    words = len(narr.split())
    dur = max(2.0, round(words / WPS, 1))
    scenes.append({
        "scene": i,
        "section": section,
        "start": round(t, 1),
        "duration": dur,
        "narration": narr,
        "visual": vis,
        "prompt": f"{vis}. {STYLE}",
    })
    t += dur


def mmss(x):
    return f"{int(x // 60)}:{int(x % 60):02d}"


os.makedirs("scenes", exist_ok=True)
with open("scenes/dreams-scenes.json", "w") as f:
    json.dump(scenes, f, indent=2, ensure_ascii=False)

with open("scenes/dreams-scenes.md", "w") as f:
    f.write("# Why Do You Forget Most of Your Dreams? - Scene breakdown\n\n")
    f.write(f"{len(scenes)} scenes, ~{mmss(t)} estimated runtime, avg {t/len(scenes):.1f}s per scene.\n\n")
    f.write(f"**Global style:** {STYLE}\n\n")
    cur = None
    for s in scenes:
        if s["section"] != cur:
            cur = s["section"]
            f.write(f"\n## {cur}\n\n")
        f.write(f"**{s['scene']}** `{mmss(s['start'])}` ({s['duration']}s)  \n")
        f.write(f"> {s['narration']}\n\n")
        f.write(f"Visual: {s['visual']}\n\n")

print(len(scenes), "scenes,", mmss(t), "total, avg", round(t / len(scenes), 1), "s")
