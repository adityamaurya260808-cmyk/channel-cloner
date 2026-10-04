"""Scenes 31-70: chemical switch + dream to forget"""
import random
from registry import sc
from doodle import *


@sc(31)
def s31(c):
    c.beaker(960, 560, 3.0)
    c.sparks(960, 190, 1.2, 8, ORG)
    c.circle(900, 700, 24, "#fff"), c.circle(1030, 640, 16, "#fff"), c.circle(980, 760, 12, "#fff")
    c.text(960, 1010, "chemistry", 90)


@sc(32)
def s32(c):
    c.rect(450, 400, 1020, 520, YEL, rx=40)
    c.brain(960, 650, 2.2)
    c.text(960, 330, "NOREPINEPHRINE", 130, ORG)


@sc(33, env="sky")
def s33(c):
    c.sun(1500, 280, 100)
    c.person(780, 780, "stand", s=2.4, face="wide")
    c.text(1400, 700, "ALERT", 190, ORG)
    for dx in (-90, 0, 90):
        c.line(780 + dx, 360, 780 + dx * 1.3, 310, RED, 7)


@sc(34)
def s34(c):
    c.brain(560, 560, 1.9)
    c.rect(1150, 480, 480, 320, "#c9b28a", rx=10)
    c.text(1390, 670, "KEEP", 120)
    c.arrow(800, 560, 1100, 540, ORG, 12)
    c.text(1000, 460, "★", 90, YEL)
    c.text(1280, 380, "♥", 90, RED)
    c.text(1470, 400, "★", 70, YEL)


@sc(35, env="sky")
def s35(c):
    c.person(560, 780, "armsup", s=2.3, face="surprised")
    c.text(560, 280, "surprise!", 110, RED)
    c.meter(1200, 220, 600, .88)
    c.arrow(1420, 700, 1420, 330, ORG, 14)
    c.text(1320, 940, "norepinephrine rises", 60)


@sc(36)
def s36(c):
    c.brain(960, 760, 2.0)
    c.rect(820, 170, 280, 200, YEL, rx=14)
    c.rect(820, 140, 120, 36, YEL, rx=10)
    c.text(960, 285, "MEMORY", 70)
    c.arrow(960, 400, 960, 540, RED, 14)


@sc(37, night=True)
def s37(c):
    c.moon(1450, 250, 90)
    c.stars(14, 5, 60, 420)
    c.sleeper(800, 760)
    c.chip_label(1100, 560, "REM", 100, YEL)
    c.push_ink()
    c.text(1100, 560, "REM", 100)
    c.pop_ink()


@sc(38)
def s38(c):
    c.meter(850, 230, 600, .03)
    c.text(1180, 560, "≈ 0", 190, RED)
    c.arrow(760, 300, 760, 640, RED, 14)
    c.text(960, 980, "norepinephrine", 70)


@sc(39)
def s39(c):
    c.brain(800, 450, 2.4)
    c.rect(760, 720, 90, 230, ORG, rx=30)
    c.text(1180, 880, "brainstem", 90)
    c.arrow(1000, 840, 880, 830, ORG, 10)
    c.text(1350, 300, "shh...", 100, GREY)


@sc(40, env="sky")
def s40(c):
    c.person(960, 740, "think", s=2.5, face="think")
    c.text(1350, 420, "...", 200)


@sc(41, night=True)
def s41(c):
    c.sleeper(900, 900, bed=True)
    c.bubble(960, 400, 1100, 560, 780, 800)
    for x, y, r, col in ((700, 380, 100, ORG), (900, 300, 80, YEL), (1100, 420, 110, GRN), (1280, 330, 70, PINK), (850, 520, 60, BLU)):
        c.circle(x, y, r, col)


@sc(42)
def s42(c):
    c.pencil(640, 520, 3.0, -35)
    c.switch(1320, 520)
    c.text(1320, 800, "OFF", 120, RED)
    c.text(960, 960, "can't write it down", 80)


@sc(43)
def s43(c):
    c.camera(620, 440, 2.2)
    c.film(1330, 520, 560, 150)
    c.arrow(900, 480, 1020, 500, ORG, 10)
    c.text(1330, 700, "recording", 80)


@sc(44)
def s44(c):
    c.film(960, 540, 1100, 180)
    c.rect(870, 420, 180, 250, PAPER, rx=0, stroke=PAPER)
    c.scissors(840, 540, 1.8, 0)
    c.text(960, 880, "cut!", 130, RED)


@sc(45)
def s45(c):
    c.brain(560, 520, 2.0)
    c.seahorse(1360, 520, 2.4)
    c.arrow(790, 520, 1130, 520, ORG, 12)
    c.text(1360, 860, "HIPPOCAMPUS", 100)


@sc(46, night=True)
def s46(c):
    c.seahorse(960, 560, 2.4, "#c4a98f")
    c.zzz(1250, 480, 1.3)
    c.text(960, 960, "sleepy hippocampus", 90)


@sc(47)
def s47(c):
    c.bubble(960, 450, 800, 460, 760, 830)
    c.clock(960, 450, 160, 4, 20)
    c.text(960, 940, "real time", 110)


@sc(48)
def s48(c):
    c.battery(900, 520, .1, 640, 300)
    c.text(900, 540, "", 10)
    c.text(1500, 560, "10%", 200, RED)
    c.text(960, 880, "saving at a fraction of power", 80)


@sc(49, env="sky")
def s49(c):
    c.person(700, 780, "point", s=2.2, face="think", glasses=True, color="#fff")
    c.bulb(1250, 340, 2.0)


@sc(50)
def s50(c):
    c.ellipse(560, 560, 130, 85, RED)
    c.circle(700, 540, 50, DARK)
    for i in range(3):
        c.line(500 + i * 60, 620, 480 + i * 60, 700, w=8)
        c.line(500 + i * 60, 500, 480 + i * 60, 420, w=8)
    c.line(730, 500, 790, 430, w=6), c.line(740, 530, 810, 500, w=6)
    c.text(1280, 590, "BUG", 230)
    c.xmark(1280, 520, 190)


@sc(51, env="sky")
def s51(c):
    c.person(600, 800, "stand", s=2.4, glasses=True, face="happy")
    c.text(1330, 470, "1983", 260, ORG)
    c.text(1330, 620, "Francis Crick", 100)


@sc(52)
def s52(c):
    c.dna(960, 540, 760)
    c.text(1400, 540, "DNA", 200, BLU)


@sc(53, env="sky")
def s53(c):
    c.person(560, 800, "stand", s=2.1, glasses=True, face="happy")
    c.person(1360, 800, "stand", s=2.1, glasses=True, face="happy", color="#fff")
    c.bulb(960, 400, 2.3)


@sc(54, night=True)
def s54(c):
    c.sleeper(900, 900)
    c.bubble(1000, 430, 1000, 400, 780, 800)
    c.text(1000, 470, "TO FORGET", 150, YEL)


@sc(55)
def s55(c):
    c.table_chalk(1100, 500, 1100, 600)
    c.push_ink(LIGHT)
    c.text(1100, 440, "Their idea:", 100)
    c.text(1100, 600, "dream  =  forget", 120, YEL)
    c.pop_ink()
    c.person(380, 800, "point", s=2.1, face="happy", glasses=True)


@sc(56)
def s56(c):
    c.brain(960, 540, 2.2)
    for x1, y1, x2, y2 in ((260, 260, 640, 440), (1660, 260, 1280, 440), (260, 820, 640, 660), (1660, 820, 1280, 660)):
        c.arrow(x1, y1, x2, y2, ORG, 12)
    c.text(960, 980, "tons of information", 90)


@sc(57)
def s57(c):
    for i in range(4):
        c.check(480 + i * 320, 520, 90)
    c.text(960, 840, "USEFUL", 150, GRN)


@sc(58)
def s58(c):
    rnd = random.Random(7)
    pts = [(960, 520)]
    for _ in range(46):
        x, y = pts[-1]
        pts.append((min(1500, max(420, x + rnd.randint(-190, 190))), min(760, max(280, y + rnd.randint(-150, 150)))))
    c.poly(pts, color=GREY, w=7)
    c.text(960, 930, "NOISE", 150)


@sc(59)
def s59(c):
    c.brain(960, 560, 2.5)
    c.circle(960, 440, 0)
    for a, b, t in ((330, 380, "★"), (1560, 320, "♥"), (420, 780, "?"), (1500, 800, "★"), (960, 160, "♪")):
        c.text(a, b, t, 120, ORG)
    c.sparks(960, 560, 3.2, 12, RED)
    c.text(960, 1000, "TOO MUCH!", 120, RED)


@sc(60)
def s60(c):
    c.poly([(960, 720), (1060, 830), (960, 940), (860, 830)], YEL, close=True)
    c.blob([(740, 640, 100), (880, 590, 120), (1060, 600, 130), (1190, 650, 90), (960, 680, 150), (820, 700, 90), (1120, 710, 90)], GREY)
    c.text(960, 980, "good memory buried under junk", 80)


@sc(61)
def s61(c):
    c.brain(800, 540, 2.3)
    c.raw(f'<g transform="translate(1120,640) rotate(55)"><rect x="-8" y="-300" width="16" height="320" fill="{BRN}" stroke="{c.ink}" stroke-width="5"/>'
          f'<path d="M-50,20 L50,20 L70,120 L-70,120 Z" fill="{YEL}" stroke="{c.ink}" stroke-width="5"/></g>')
    for x, y in ((1250, 760), (1300, 820), (1360, 790)):
        c.circle(x, y, 12, GREY)
    c.text(960, 980, "cleanup", 100)


@sc(62)
def s62(c):
    c.brain(960, 540, 2.3)
    for x, y in ((520, 330), (1400, 330), (460, 700), (1450, 720), (960, 190)):
        c.sparks(x, y, 1.2, 8, YEL)
    c.text(960, 1000, "random firing", 90)


@sc(63)
def s63(c):
    nodes = [(500, 400), (800, 300), (1100, 420), (1420, 330), (650, 700), (1000, 760), (1350, 700)]
    links = [(0, 1, 1), (1, 2, 1), (2, 3, .3), (0, 4, .3), (1, 5, .3), (2, 5, 1), (3, 6, .3), (4, 5, 1), (5, 6, .3)]
    for a, b, op in links:
        c.raw(f'<g opacity="{op}">')
        c.line(*nodes[a], *nodes[b], w=10 if op == 1 else 5)
        c.raw("</g>")
    for x, y in nodes:
        c.circle(x, y, 38, YEL)
    c.text(960, 960, "weak links fade", 90)


@sc(64)
def s64(c):
    c.text(960, 470, "REVERSE", 200, RED)
    c.text(960, 690, "LEARNING", 200)
    c.arrow(760, 860, 480, 860, ORG, 16)
    c.arrow(1180, 860, 900, 860, ORG, 16)


@sc(65)
def s65(c):
    c.brain(560, 540, 2.0)
    c.person(1240, 780, "walk", s=2.0, face="neutral")
    c.blob([(1400, 760, 70), (1440, 720, 50)], GREY)
    c.line(1360, 700, 1330, 640, w=6)
    c.arrow(840, 520, 1040, 520, ORG, 12)
    c.text(960, 1000, "taking out the trash", 80)


@sc(66)
def s66(c):
    c.trash(960, 700, 3.0)
    c.raw(f'<g transform="rotate(-18 960 450)"><rect x="760" y="420" width="400" height="44" rx="12" fill="{GREY}" stroke="{c.ink}" stroke-width="{c.sw}"/></g>')
    c.text(960, 190, "gone", 140)


@sc(67, env="sky")
def s67(c):
    c.person(560, 780, "stand", s=2.2, glasses=True, face="happy")
    c.person(1360, 780, "stand", s=2.2, glasses=True, face="sad", color="#fff")
    c.text(560, 320, "👍", 170)
    c.text(1360, 320, "👎", 170)
    c.text(960, 980, "still debated", 80)


@sc(68)
def s68(c):
    c.sparks(1000, 440, 3.4, 12, YEL)
    c.text(1000, 480, "IMPORTANT", 160)
    c.arrow(380, 700, 700, 540, RED, 16)


@sc(69)
def s69(c):
    c.chip_label(560, 450, "FORGETTING", 130, YEL)
    c.text(960, 650, "is NOT the opposite of", 90)
    c.chip_label(1360, 820, "MEMORY", 130, PINK)
    c.xmark(960, 450, 40)


@sc(70)
def s70(c):
    c.gear(760, 520, 150, YEL, "FORGETTING")
    c.gear(1160, 520, 190, PINK, "MEMORY")
    c.arrow(1000, 330, 1060, 330, ORG, 8)
