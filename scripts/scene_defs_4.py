"""Scenes 106-125: how to keep them + ending"""
import random
import math
from registry import sc
from doodle import *


@sc(106)
def s106(c):
    c.rect(600, 120, 720, 860, "#c9b28a", rx=24)
    c.rect(660, 200, 600, 740, "#fff", rx=10)
    c.rect(870, 90, 180, 70, GREY, rx=14)
    for i in range(4):
        c.check(740, 330 + i * 150, 38)
        c.line(830, 340 + i * 150, 1190, 340 + i * 150, GREY, 7)


@sc(107)
def s107(c):
    c.rect(500, 700, 920, 60, "#c9b28a")
    c.rect(560, 760, 80, 240, "#c9b28a")
    c.rect(1280, 760, 80, 240, "#c9b28a")
    c.notebook(860, 520, 300, 360)
    c.pencil(1100, 560, 1.4, -75)
    c.text(960, 1040, "", 10)
    c.text(960, 190, "notebook by the bed", 100)


@sc(108)
def s108(c):
    c.phone_x(620, 520)
    c.feet(1300, 560)
    c.xmark(1300, 560, 130)
    c.text(620, 860, "no phone", 90)
    c.text(1300, 860, "don't stand up", 90)


@sc(109, night=True, env="room")
def s109(c):
    c.rect(300, 800, 860, 60, "#c9b28a")
    c.person(640, 800, "sit", s=1.8, face="neutral", color=BLU)
    c.push_ink()
    c.rect(850, 570, 150, 190, "#fff", rx=6)
    c.pop_ink()
    c.pencil(960, 590, 1.0, -30)
    c.moon(1500, 260, 90)
    c.text(1150, 960, "write it down", 90)


@sc(110)
def s110(c):
    c.notebook(960, 540, 640, 820)
    c.path("M760,420 q60,-60 120,0 t120,40 t120,-30", color=BLU, w=12)
    c.text(1160, 640, "♥", 190, RED)
    c.text(780, 750, "a feeling", 80, GREY)


@sc(111)
def s111(c):
    c.graph(360, 850, 1150, 560, xlabel="days of practice")
    c.text(1650, 330, "better\nrecall", 90, GRN)
    c.arrow(1450, 380, 1560, 330, GRN, 12)


@sc(112)
def s112(c):
    c.eye(960, 520, 3.4, closed=True)
    c.text(960, 940, "eyes still closed", 100)


@sc(113)
def s113(c):
    c.raw('<g opacity="0.3">')
    c.bubble(540, 520, 620, 420)
    c.circle(540, 520, 80, ORG)
    c.raw("</g>")
    c.arrow(900, 520, 1020, 520, RED, 14)
    c.todo(1380, 520, 440, 560)
    c.text(960, 960, "thinking about the day...", 80)


@sc(114, env="sky")
def s114(c):
    c.person(960, 740, "shrug", s=2.4, face="happy")
    c.text(1450, 400, "no worries", 120)


@sc(115, night=True)
def s115(c):
    cols = [BLU, GRN, PUR, ORG]
    for i, col in enumerate(cols):
        x = 330 + i * 420
        c.person(x + 60, 880, "lie", s=.65, rot=-90, face="closed")
        c.rect(x - 70, 840, 280, 60, col, rx=22)
        c.bubble(x + 20, 520, 250, 190)
        c.circle(x + 20, 520, 36, [YEL, PINK, ORG, SKY][i])
    c.text(960, 170, "everyone dreams", 110, YEL)


@sc(116)
def s116(c):
    c.net(540, 470, 3.0)
    for x, y, col in ((1050, 420, ORG), (1300, 560, PINK), (1520, 380, YEL), (1180, 760, SKY), (1620, 720, PUR)):
        c.butterfly(x, y, 1.7, col)
    c.text(960, 990, "not catching them", 90)


@sc(117, night=True)
def s117(c):
    c.moon(1450, 280, 100)
    c.stars(20, 12, 60, 500)
    c.sleeper(860, 780)
    c.zzz(700, 560, 1.2)


@sc(118, night=True)
def s118(c):
    c.sleeper(960, 900)
    for x, y, r, a, b in ((680, 560, 90, BLU, GRN), (960, 380, 120, ORG, YEL), (1240, 560, 90, PUR, PINK), (800, 250, 50, GRN, BLU), (1140, 230, 55, YEL, ORG)):
        c.world(x, y, r, a, b)
    c.text(960, 120, "entire worlds", 100, YEL)


@sc(119, night=True)
def s119(c):
    c.bubble(960, 360, 1000, 460)
    c.sparks(960, 360, 3.4, 14, YEL)
    c.world(960, 360, 140)
    c.theater_seats(960, 840, 5)
    c.text(960, 1030, "no one watching", 70)


@sc(120, env="sky")
def s120(c):
    c.bubble(600, 480, 700, 600)
    c.world(600, 480, 160, SKY, GRN)
    c.person(1250, 800, "walk", s=2.3, face="sad")
    c.arrow(1000, 560, 1160, 540, ORG, 12)


@sc(121)
def s121(c):
    c.timeline(620, "YOUR LIFE", 0.08, "6 YEARS")
    for x in (1380, 1480, 1580):
        c.raw('<g opacity="0.4">')
        c.world(x, 380, 55, GREY, GREY)
        c.raw("</g>")
    c.text(1480, 280, "places that never existed", 70)


@sc(122, env="sky")
def s122(c):
    for r in range(2):
        for i in range(6):
            c.person(220 + i * 295, 470 + r * 400, "stand", s=.85, face="happy")
    c.text(960, 1040, "all of them were you", 90)


@sc(123)
def s123(c):
    c.text(960, 600, "FORGET", 330)
    c.xmark(960, 520, 300)


@sc(124, env="sky")
def s124(c):
    c.sun(960, 560, 140)
    c.hills(800)
    c.rect(300, 880, 700, 50, "#c9b28a")
    c.person(650, 880, "armsup", s=1.6, face="happy")


@sc(125, night=True)
def s125(c):
    c.bubble(960, 480, 1000, 620, fill="#2a3a63")
    c.raw('<g opacity="0.55">')
    c.person(960, 680, "stand", s=2.0, face="happy")
    c.raw("</g>")
    c.text(960, 1020, "you were there the whole time", 100, YEL)
