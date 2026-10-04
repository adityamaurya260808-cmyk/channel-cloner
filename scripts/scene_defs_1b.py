"""Redesigned scenes 1-5 (rich Zenn-style)."""
from registry import sc
from doodle import *

WALL_N = "#34506e"
FLOOR_N = "#6b4a2f"
TEAL_B = "#78b0a4"


def bedroom(c, zoom=1.0):
    c.rect(-20, -20, W + 40, 900, WALL_N, rx=0, sw=0)
    c.raw(f'<rect x="-20" y="820" width="{W + 40}" height="300" fill="{FLOOR_N}" stroke="{c.ink}" stroke-width="{c.sw}"/>')
    # window with moon
    c.rect(1280, 130, 420, 480, "#14233a", rx=8, sw=12)
    c.moon(1490, 330, 85)
    c.stars(7, 21, 170, 560)
    c.line(1490, 130, 1490, 610, w=10), c.line(1280, 370, 1700, 370, w=10)
    c.rect(1250, 600, 480, 34, "#a07a4c", rx=6)
    # bedside table with lamp
    c.rect(1130, 700, 170, 140, "#8a6540", rx=6)
    c.rect(1150, 840, 24, 50, "#8a6540", rx=3), c.rect(1256, 840, 24, 50, "#8a6540", rx=3)
    c.rect(1196, 640, 34, 60, "#c9b28a", rx=4)
    c.path("M1160,640 L1190,560 L1236,560 L1266,640 Z", "#f2d98c")


def bed_with_sleeper(c, face="closed"):
    # frame
    c.rect(250, 540, 70, 330, "#8a6540", rx=10)
    c.rect(250, 780, 880, 60, "#8a6540", rx=8)
    c.rect(1080, 700, 50, 190, "#8a6540", rx=8)
    c.rect(310, 700, 790, 90, "#efe4c8", rx=16)
    # pillow
    c.ellipse(450, 670, 130, 52, "#ffffff")
    # head on pillow
    c.circle(455, 610, 74, "#ffffff")
    if face == "closed":
        c.path("M420,607 q14,14 28,0 M470,607 q14,14 28,0", w=6)
        c.path("M445,645 q14,10 28,0", w=6)
    # blanket
    c.path("M520,690 Q560,630 640,650 Q760,640 900,660 Q1040,640 1100,690 L1100,770 L520,770 Z", TEAL_B)
    c.line(620, 700, 620, 765, w=5), c.line(820, 700, 820, 765, w=5)


@sc(1)
def n1(c):
    bedroom(c)
    bed_with_sleeper(c)
    c.text(700, 520, "Z", 100, YEL)
    c.text(770, 450, "Z", 130, YEL)
    c.text(860, 360, "Z", 160, YEL)


@sc(2)
def n2(c):
    bedroom(c)
    bed_with_sleeper(c)
    for r, x, y in ((24, 520, 500), (36, 560, 430)):
        c.circle(x, y, r, "#fff", sw=6)
    c.bubble(760, 220, 760, 330, None, None)
    c.path("M520,230 q70,-110 140,0 q70,110 140,0 q70,-110 140,0", color=BLU, w=16)
    c.circle(520, 520, 18, "#fff", sw=6)


@sc(3, env="white")
def n3(c):
    xs = (90, 700, 1310)
    cols = ("#8fc2e8", "#9fcbe8", "#e6b07a")
    for x, col in zip(xs, cols):
        c.rect(x, 160, 520, 780, col, rx=22, sw=9)
    # panel 1: flying over clouds
    c.cloud(250, 330, .9, "#fff"), c.cloud(470, 800, 1.1, "#fff")
    c.person(350, 560, "fly", s=1.7, rot=78, face="happy")
    for yy in (470, 560, 650):
        c.line(120, yy, 200, yy, w=6)
    # panel 2: falling
    c.cloud(800, 300, .7, "#fff")
    c.path("M700,900 L700,800 L760,800 L760,740 L820,740 L820,820 L900,820 L900,700 L980,700 L980,830 L1040,830 L1040,900 Z", "#8a97a8")
    c.person(960, 470, "fall", s=1.5, rot=172, face="surprised")
    for xx in (780, 1100):
        c.line(xx, 300, xx, 420, w=6)
    # panel 3: running from monster
    c.rect(1310, 700, 520, 240, "#a07a4c", rx=10, sw=0)
    c.blob([(1450, 650, 110), (1530, 580, 95), (1400, 740, 80), (1560, 700, 85)], "#2b2b2b")
    for dx, dy in ((-30, -20), (40, -10)):
        c.circle(1470 + dx, 640 + dy, 18, "#fff", sw=4), c.circle(1475 + dx, 640 + dy, 7, DARK, sw=0)
    c.path("M1410,700 l30,40 l30,-40 l30,40 l30,-40", color="#fff", w=6)
    c.person(1690, 700, "run", s=1.4, face="surprised")


@sc(4)
def n4(c):
    c.rect(-20, -20, W + 40, H + 40, "#59687d", sw=0)
    c.circle(960, 540, 460, "#6e7f96", sw=0)
    c.circle(960, 540, 330, "#8394ab", sw=0)
    # faded silhouette
    c.raw('<g opacity="0.55">')
    c.circle(960, 400, 120, "#dfe6ee", sw=7)
    c.line(960, 520, 960, 800, "#dfe6ee", 9)
    c.line(960, 580, 820, 720, "#dfe6ee", 9), c.line(960, 580, 1100, 720, "#dfe6ee", 9)
    c.line(960, 800, 880, 980, "#dfe6ee", 9), c.line(960, 800, 1040, 980, "#dfe6ee", 9)
    c.raw("</g>")
    c.text(1320, 330, "?", 300, YEL)
    c.text(520, 460, "?", 190, YEL)
    c.text(1230, 700, "?", 140, YEL)


@sc(5)
def n5(c):
    c.rect(-20, -20, W + 40, 700, "#c9b6e0", sw=0)
    c.circle(1500, 250, 140, "#fff2b8", sw=8)
    c.raw(f'<path d="M-20,700 Q400,600 900,680 T1960,640 L1960,1100 L-20,1100 Z" fill="#7bb26a" stroke="{c.ink}" stroke-width="{c.sw}"/>')
    for x, y, col in ((250, 820, PINK), (1650, 800, ORG), (500, 940, YEL), (1400, 930, PINK)):
        c.line(x, y, x, y + 110, GRN, 9)
        for a in range(6):
            import math
            c.circle(x + math.cos(a * 1.05) * 28, y + math.sin(a * 1.05) * 28, 18, col, sw=4)
        c.circle(x, y, 14, YEL, sw=4)
    c.person(900, 800, "armsup", s=2.1, face="surprised")
    c.text(1450, 640, "REAL", 200, RED)
