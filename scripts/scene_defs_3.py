"""Scenes 71-105: people who remember + history"""
import random
from registry import sc
from doodle import *
import math


@sc(71, night=True)
def s71(c):
    dims = [(150, 130), (320, 260), (210, 170), (400, 310), (170, 140)]
    for i, (w, h) in enumerate(dims):
        x = 220 + i * 370
        c.person(x + 60, 860, "lie", s=.7, rot=-90, face="closed")
        c.rect(x - 110, 820, 300, 60, BLU, rx=24)
        c.bubble(x + 10, 560 - h / 2 + 100, w, h)


@sc(72, env="room")
def s72(c):
    c.rect(300, 790, 600, 60, "#c9b28a")
    c.person(600, 790, "armsup", s=1.7, face="happy")
    c.bubble(1240, 400, 880, 520, 760, 520)
    for x, y, r, col in ((1000, 360, 80, ORG), (1180, 300, 60, YEL), (1360, 400, 90, GRN), (1180, 480, 50, BLU), (1480, 300, 40, PINK), (1050, 500, 36, PURPLE if False else PUR)):
        c.circle(x, y, r, col)


@sc(73, env="room")
def s73(c):
    c.rect(300, 790, 600, 60, "#c9b28a")
    c.person(600, 790, "stand", s=1.7, face="neutral")
    c.bubble(1240, 400, 880, 520, 760, 520, fill="none")
    c.text(1240, 470, "...", 200, GREY)


@sc(74, env="sky")
def s74(c):
    c.person(620, 780, "think", s=2.3, glasses=True, face="think")
    c.qmark(1250, 650, 600, YEL)


@sc(75)
def s75(c):
    c.brain(520, 540, 2.0)
    c.brain(1400, 540, 2.0, fill="#f4c28f")
    c.qmark(960, 620, 420, YEL)


@sc(76)
def s76(c):
    c.path("M700,820 C560,640 540,520 540,470 A160,160 0 1,1 860,470 C860,520 840,640 700,820 Z", RED)
    c.circle(700, 470, 60, PAPER)
    c.text(1300, 440, "LYON,", 150)
    c.text(1300, 580, "FRANCE", 150)
    c.text(1300, 800, "2014", 230, ORG)


@sc(77)
def s77(c):
    c.rect(220, 560, 900, 50, GREY, rx=14)
    c.person(560, 530, "lie", s=1.0, rot=90, face="closed")
    c.circle(1180, 480, 330, GREY)
    c.circle(1180, 480, 210, PAPER)
    c.text(1180, 990, "brain scan", 90)


@sc(78)
def s78(c):
    c.brain(560, 520, 2.0)
    c.brain(1360, 520, 2.0)
    c.circle(1500, 450, 80, "none", RED, 12)
    c.text(960, 940, "real differences", 90)


@sc(79)
def s79(c):
    c.brain(800, 520, 3.0)
    c.circle(930, 450, 95, YEL, sw=0)
    c.sparks(930, 450, 2.2, 10, YEL)
    c.text(1470, 400, "TPJ", 200, ORG)
    c.arrow(1300, 440, 1060, 450, ORG, 12)


@sc(80)
def s80(c):
    c.sun(560, 520, 110)
    c.moon(1360, 520, 120)
    c.text(560, 800, "awake", 100)
    c.text(1360, 800, "asleep", 100)
    c.text(960, 190, "more active in both", 90)


@sc(81)
def s81(c):
    c.eye(420, 450, 1.7)
    c.text(420, 700, "👂", 190)
    c.arrow(640, 480, 940, 520, ORG, 12)
    c.arrow(640, 700, 940, 600, ORG, 12)
    c.brain(1340, 540, 1.8)
    c.text(960, 990, "outside world + attention", 80)


@sc(82)
def s82(c):
    pts = []
    for i in range(0, 200):
        t = i / 200 * 5.5 * math.pi
        r = 20 + i * 1.5
        pts.append((960 + math.cos(t) * r, 540 + math.sin(t) * r * .8))
    c.poly(pts, color=ORG, w=14)
    c.text(960, 1010, "TWIST", 130, RED)


@sc(83)
def s83(c):
    c.line(300, 760, 1620, 760, w=8)
    pts = [(300, 760), (700, 760), (730, 540), (760, 760), (1050, 760), (1075, 480), (1100, 760), (1350, 760), (1375, 560), (1400, 760), (1620, 760)]
    c.poly(pts, color=YEL, w=14)
    c.text(960, 880, "sleep", 70)
    c.text(960, 330, "tiny wake-ups at night", 90)


@sc(84)
def s84(c):
    c.rect(560, 600, 250, 200, GREY, rx=8)
    c.rect(1060, 400, 250, 400, YEL, rx=8)
    c.text(685, 860, "rarely\nremember", 56)
    c.text(1185, 860, "often\nremember", 56)
    c.text(960, 220, "AWAKE TIME", 120)
    c.text(1450, 520, "2x", 220, ORG)


@sc(85)
def s85(c):
    c.key(520, 540, 3.4)
    c.text(1400, 380, "THE", 120)
    c.text(1400, 520, "KEY", 220, ORG)


@sc(86, env="sky")
def s86(c):
    c.person(640, 780, "armsup", s=2.4, face="sad")
    for dx in (-110, 110):
        c.circle(640 + dx, 330, 16, SKY)
    c.xmark(1350, 520, 190)
    c.text(1350, 840, "dreaming harder", 80)


@sc(87, env="room")
def s87(c):
    c.person(640, 760, "sit", s=2.2, face="neutral")
    c.rect(300, 780, 760, 60, "#c9b28a")
    c.clock(1400, 420, 150, 3, 0)
    c.text(1400, 700, "awake just\nlong enough", 90)


@sc(88)
def s88(c):
    c.rect(780, 120, 280, 200, YEL, rx=14)
    c.text(920, 235, "MEMORY", 70)
    c.arrow(920, 350, 920, 470, RED, 14)
    c.brain(920, 700, 1.8)
    c.chip_label(1450, 640, "SAVE", 130, GRN)
    c.check(1450, 840, 80)


@sc(89, env="sky")
def s89(c):
    c.person(960, 800, "hold", s=2.4, face="happy")
    c.bubble(960, 480, 260, 210)
    c.sparks(960, 480, 3.2, 10, YEL)
    c.text(960, 1020, "keep it", 90)


@sc(90, night=True)
def s90(c):
    c.sparks(960, 520, 4.5, 12, GREY)
    rnd = random.Random(4)
    for _ in range(36):
        c.circle(960 + rnd.randint(-480, 480), 520 + rnd.randint(-300, 300), rnd.randint(5, 16), "#6b7a9e", sw=3)
    c.text(960, 960, "gone forever", 130, YEL)


@sc(91)
def s91(c):
    c.papyrus(780, 540)
    c.text(1300, 440, "dreams =", 100)
    c.text(1300, 580, "messages?", 140, ORG)


@sc(92)
def s92(c):
    c.person(600, 800, "hold", s=2.2, face="neutral")
    c.rect(520, 350, 160, 40, YEL, rx=14)
    c.papyrus(1240, 560)
    c.text(960, 190, "Ancient Egypt", 110)


@sc(93)
def s93(c):
    c.temple(960, 480, 980, 540)
    c.person(960, 960, "lie", s=.55, rot=-90, face="closed")
    c.text(1560, 230, "Greece", 110)


@sc(94)
def s94(c):
    c.book(700, 540, 420, 580, PUR, "The\nInterpretation\nof Dreams", 46)
    c.text(1330, 480, "1899", 270, ORG)
    c.text(1330, 640, "Sigmund Freud", 100)


@sc(95, env="sky")
def s95(c):
    c.bubble(960, 440, 1000, 640)
    c.person(960, 650, "stand", s=1.8, face="neutral")
    c.ellipse(960, 410, 46, 24, YEL)
    c.circle(944, 410, 7, DARK, sw=0), c.circle(976, 410, 7, DARK, sw=0)
    c.text(960, 1010, "disguised wishes", 100)


@sc(96)
def s96(c):
    c.circle(960, 540, 360, SKIN)
    c.lock(960, 560, 2.8)
    c.text(960, 1040, "locked secrets", 90)


@sc(97, env="sky")
def s97(c):
    c.person(960, 780, "stand", s=2.4, face="neutral")
    c.path("M700,420 q-60,100 0,200", color=ORG, w=12)
    c.path("M1220,420 q60,100 0,200", color=ORG, w=12)
    c.text(1480, 330, "nope", 130, RED)


@sc(98, env="sky")
def s98(c):
    c.person(560, 740, "stand", s=1.8, glasses=True, face="happy")
    c.person(820, 740, "stand", s=1.8, glasses=True, face="happy", color="#fff")
    c.text(1350, 520, "1977", 260, ORG)
    c.text(1350, 640, "Hobson & McCarley", 70)


@sc(99)
def s99(c):
    c.rect(930, 700, 70, 250, ORG, rx=28)
    for i in range(4):
        c.poly([(930 + i * 25, 690), (950 + i * 25, 640), (920 + i * 25, 590), (960 + i * 25, 540)], color=YEL, w=10)
    c.brain(960, 330, 1.5)
    c.text(1450, 840, "brainstem noise", 80)
    c.arrow(1250, 800, 1030, 800, ORG, 10)


@sc(100)
def s100(c):
    cols = [ORG, GRN, BLU, PINK]
    for i, col in enumerate(cols):
        c.poly([(380 + i * 330, 380), (640 + i * 330, 380), (640 + i * 330, 640), (380 + i * 330, 640)], col, close=True)
    c.path("M380,510 Q620,420 700,520 T1020,500 T1360,520 T1700,510", color=RED, w=8)
    c.line(1650, 440, 1830, 330, GREY, 8)
    c.text(960, 900, "stitched into a story", 100)


@sc(101)
def s101(c):
    c.rect(100, 260, 480, 480, SKY, rx=18)
    c.sun(240, 380, 50), c.path("M100,640 q60,-40 120,0 t120,0 t120,0 t120,0", color=BLU, w=10)
    c.text(340, 820, "beach", 80)
    c.arrow(610, 500, 700, 500, w=12)
    c.building(960, 500, 430, 300)
    c.text(960, 820, "school", 80)
    c.arrow(1230, 500, 1320, 500, w=12)
    c.rect(1340, 260, 480, 480, NIGHT, rx=18)
    c.stars(9, 11, 300, 700)
    c.world(1620, 500, 90, ORG, YEL)
    c.text(1580, 820, "space", 80)


@sc(102, env="sky")
def s102(c):
    c.person(960, 800, "stand", s=2.4, face="think", hat="grad")
    c.text(480, 340, "TEACHER", 120)
    c.text(1470, 340, "COUSIN", 120, ORG)
    c.arrow(480, 410, 840, 540, w=10)
    c.arrow(1470, 410, 1080, 540, ORG, 10)


@sc(103, env="sky")
def s103(c):
    c.scale(960, 560, 2.2)
    c.qmark(660, 540, 200, RED)
    c.qmark(1260, 540, 200, GRN)


@sc(104, env="sky")
def s104(c):
    c.person(700, 800, "pointup", s=2.4, face="happy")
    c.text(1330, 480, "ONE", 230, ORG)
    c.text(1330, 650, "thing is clear", 110)


@sc(105)
def s105(c):
    c.lock(520, 520, 3.0, open_=True)
    c.dna(1000, 520, 520)
    c.text(1450, 520, "BIOLOGY", 150, GRN)
    c.text(960, 960, "not secrets", 90)
