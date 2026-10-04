"""Scenes 1-30: hook + discovery"""
from registry import sc
from doodle import *


def faded(c, fn, op=.3):
    c.raw(f'<g opacity="{op}">')
    fn()
    c.raw("</g>")


def grey_person(c, *a, **k):
    old = c.ink
    c.ink = GREY
    c.person(*a, **k)
    c.ink = old


@sc(1, night=True)
def s1(c):
    c.rect(1250, 130, 340, 420, "#0b1228", rx=10)
    c.moon(1420, 330, 70)
    c.stars(5, 3, 170, 500)
    c.line(1420, 130, 1420, 550, w=5)
    c.ground(880)
    c.sleeper(880, 720)
    c.zzz(740, 560)


@sc(2, night=True)
def s2(c):
    c.sleeper(880, 800)
    c.bubble(1000, 330, 760, 360, 760, 700)
    c.path("M820,330 q60,-110 120,0 q60,110 120,0 q60,-110 120,0", color=YEL, w=14)
    c.zzz(560, 640)


@sc(3, env="sky")
def s3(c):
    for i, x in enumerate((110, 700, 1290)):
        c.rect(x, 190, 520, 700, SKY, rx=24)
    c.cloud(250, 330, .8)
    c.person(370, 560, "fly", rot=80, face="happy")
    c.line(120, 430, 230, 430, w=5), c.line(150, 520, 260, 520, w=5)
    c.cloud(880, 300, .6)
    c.person(960, 480, "fall", rot=172, face="surprised")
    c.line(840, 240, 840, 360, w=5), c.line(1080, 280, 1080, 420, w=5), c.line(960, 700, 960, 800, w=5)
    c.person(1560, 640, "run", face="surprised", s=.9)
    c.blob([(1370, 640, 70), (1420, 590, 60), (1340, 700, 55)], DARK)
    c.circle(1380, 625, 10, "#fff", sw=0), c.circle(1420, 625, 10, "#fff", sw=0)


@sc(4, env="sky")
def s4(c):
    grey_person(c, 960, 640, "stand", s=2.0, face="neutral")
    c.qmark(1260, 420, 300, YEL)
    c.text(960, 190, "someone you forgot...", 80)


@sc(5)
def s5(c):
    c.bubble(960, 480, 1000, 560)
    c.person(960, 700, "armsup", s=1.7, face="happy")
    c.sun(520, 330, 55)
    c.text(960, 1010, "REAL", 170, RED)


@sc(6, env="sky")
def s6(c):
    c.sun(1500, 520, 90)
    c.hills(820)
    c.rect(300, 700, 700, 70, "#c9b28a")
    c.person(640, 700, "hold", s=1.6, face="surprised")
    for i, (dx, dy, r) in enumerate([(120, -330, 34), (190, -380, 28), (270, -440, 20), (330, -510, 14), (390, -560, 9)]):
        c.circle(640 + dx, 700 + dy, r, "#e8eefc", sw=4)
    c.text(960, 140, "...and it's gone", 90)


@sc(7)
def s7(c):
    c.timeline(520, "YOUR LIFE", 0.08, "6 YEARS")
    c.text(300, 700, "birth", 50)
    c.text(1620, 700, "", 40)


@sc(8)
def s8(c):
    xs = [250, 610, 970, 1330, 1690]
    icons = ["face", "house", "tree", "sun", "moon"]
    for x, ic in zip(xs, icons):
        c.bubble(x, 520, 300, 260)
        if ic == "face":
            c.circle(x, 520, 60, SKIN), c.circle(x - 20, 510, 6, DARK), c.circle(x + 20, 510, 6, DARK)
            c.path(f"M{x - 22},540 q22,20 44,0", w=5)
        elif ic == "house":
            c.rect(x - 55, 520, 110, 80, "#c98b6b"), c.poly([(x - 70, 520), (x, 450), (x + 70, 520)], "#8a4b3c", close=True)
        elif ic == "tree":
            c.rect(x - 10, 540, 20, 70, BRN), c.circle(x, 500, 55, GRN)
        elif ic == "sun":
            c.sun(x, 520, 38)
        else:
            c.moon(x, 520, 52)
    c.text(960, 880, "faces, places, stories", 90)


@sc(9)
def s9(c):
    c.raw('<g opacity="0.28">')
    xs = [250, 610, 970, 1330, 1690]
    for x in xs:
        c.bubble(x, 520, 300, 260)
        c.circle(x, 520, 50, SKIN)
    c.raw("</g>")
    c.xmark(960, 520, 190)
    c.text(960, 900, "almost none of it", 96)


@sc(10)
def s10(c):
    c.brain(650, 500, 1.9)
    c.text(1280, 560, "FLAW", 190)
    c.xmark(1280, 520, 200)


@sc(11)
def s11(c):
    c.brain(650, 500, 1.9)
    c.text(1280, 560, "FEATURE", 170, GRN)
    c.check(1000, 330, 70)


@sc(12)
def s12(c):
    c.person(700, 640, "shrug", s=2.1, face="think")
    c.qmark(1250, 560, 560, YEL)


@sc(13)
def s13(c):
    c.timeline(580, "HUMAN HISTORY", None)
    for x in (400, 640, 880, 1120, 1360, 1580):
        c.qmark(x, 400, 150, ORG)
    c.text(960, 860, "when do dreams happen?", 80)


@sc(14, env="sky")
def s14(c):
    c.person(760, 760, "hold", s=2.2, face="happy", glasses=True, hat="grad")
    c.rect(930, 520, 190, 250, "#fff", rx=10)
    for i in range(4):
        c.line(955, 565 + i * 45, 1095, 565 + i * 45, GREY, 5)
    c.text(1400, 400, "1953", 250, ORG)
    c.text(1400, 520, "grad student", 70)


@sc(15, env="sky")
def s15(c):
    c.person(380, 760, "stand", s=1.6, glasses=True, face="neutral")
    c.person(620, 760, "point", s=1.6, glasses=True, face="neutral", color="#fff")
    c.sleeper(1330, 800, bed=True)
    c.text(960, 190, "watching people sleep", 90)


@sc(16)
def s16(c):
    c.building(960, 500, 760, 460)
    c.text(960, 940, "UNIVERSITY OF CHICAGO", 90)


@sc(17, night=True)
def s17(c):
    c.sleeper(700, 800, bed=True)
    c.line(1050, 650, 840, 820, BRN, 28)
    c.push_ink()
    c.circle(1220, 480, 250, "#fff")
    c.eye(1220, 480, 1.9, closed=True)
    c.pop_ink()
    c.text(1220, 800, "", 20)
    c.text(960, 130, "something odd...", 90)


@sc(18)
def s18(c):
    c.eye(700, 500, 2.0, closed=True)
    c.eye(1220, 500, 2.0, closed=True)
    c.arrow(600, 800, 780, 800, RED, 12)
    c.arrow(780, 800, 600, 800, RED, 12)
    c.arrow(1130, 800, 1310, 800, RED, 12)
    c.arrow(1310, 800, 1130, 800, RED, 12)


@sc(19)
def s19(c):
    c.text(330, 320, "AWAKE", 90)
    c.wave(600, 290, 1200, 60, DARK, 14, True)
    c.text(330, 720, "REM", 90, RED)
    c.wave(600, 690, 1200, 60, RED, 14, True)
    c.text(960, 940, "almost identical!", 80)


@sc(20)
def s20(c):
    c.rect(560, 270, 800, 300, YEL, rx=30)
    c.text(960, 480, "REM", 260)
    c.text(960, 720, "RAPID EYE MOVEMENT", 100)


@sc(21, env="sky")
def s21(c):
    c.person(960, 700, "armsup", s=2.3, face="surprised")
    for x, y in ((520, 330), (1400, 300), (640, 520), (1300, 540)):
        c.text(x, y, "!", 190, RED)


@sc(22, night=True)
def s22(c):
    c.rect(500, 790, 800, 90, "#c9b28a")
    c.person(900, 790, "sit", s=1.5, face="surprised", color=BLU)
    c.bubble(1130, 340, 760, 380, 960, 560)
    c.circle(1000, 340, 70, ORG), c.circle(1130, 300, 55, YEL), c.circle(1260, 360, 75, GRN), c.circle(1170, 410, 40, PINK)
    c.clock(380, 500, 90, 3, 12)
    c.line(300, 400, 330, 430, RED, 8), c.line(460, 400, 430, 430, RED, 8), c.text(380, 640, "RING!", 70, RED)


@sc(23, env="sky")
def s23(c):
    c.person(560, 740, "stand", s=1.8, glasses=True, face="happy")
    c.person(820, 740, "stand", s=1.8, glasses=True, face="neutral", color="#fff")
    c.text(1350, 520, "1957", 260, ORG)
    c.text(1350, 640, "Dement & Kleitman", 70)


@sc(24)
def s24(c):
    c.pie(640, 520, 270, .8)
    c.text(1330, 540, "80%", 280, ORG)
    c.text(1330, 680, "of REM wake-ups", 70)


@sc(25, env="sky")
def s25(c):
    c.person(560, 700, "stand", s=2.2, face="neutral")
    c.text(1280, 520, "NOT RARE", 190)
    c.xmark(1280, 380, 60, RED)


@sc(26, night=True)
def s26(c):
    c.sleeper(960, 860)
    for x, y, w, h in ((1120, 520, 300, 200), (1450, 380, 360, 240), (820, 280, 260, 170), (520, 470, 240, 160)):
        c.bubble(x, y, w, h)
    c.circle(1120, 520, 50, ORG), c.circle(1450, 380, 70, YEL), c.circle(820, 280, 40, GRN), c.circle(520, 470, 36, PINK)


@sc(27, env="sky")
def s27(c):
    c.rect(150, 260, 480, 640, NIGHT, rx=12)
    c.stars(6, 8, 300, 560)
    c.bubble(390, 640, 280, 200)
    c.person(980, 780, "walk", s=1.6, face="sad")
    c.path("M1120,700 q60,70 120,0", color=BRN, w=8)
    c.line(1120, 700, 1240, 700, BRN, 8)
    c.sun(1600, 300, 100)
    c.arrow(700, 560, 840, 560, w=8)
    c.text(1300, 960, "empty basket", 70)


@sc(28)
def s28(c):
    c.qmark(1250, 800, 780, YEL)
    c.person(560, 780, "think", s=2.0, face="think")


@sc(29)
def s29(c):
    c.brain(620, 540, 2.0)
    c.world(1330, 450, 150)
    c.line(1180, 700, 1330, 580, BRN, 22)
    c.rect(1130, 680, 100, 55, GREY, rx=8)
    c.sparks(1330, 270, 1.1, 8, YEL)
    c.text(960, 960, "building a whole world", 80)


@sc(30)
def s30(c):
    c.world(960, 560, 140)
    c.line(960, 740, 960, 860, GREY, 6), c.line(900, 730, 900, 830, GREY, 6), c.line(1020, 730, 1020, 830, GREY, 6)
    c.path("M620,960 Q760,820 880,900", color=ink_of(c), w=8)
    c.path("M1300,960 Q1160,820 1040,900", color=ink_of(c), w=8)
    c.ellipse(840, 920, 100, 36, SKIN)
    c.ellipse(1080, 920, 100, 36, SKIN)
    c.text(960, 190, "...but can't keep it", 90)


def ink_of(c):
    return c.ink
