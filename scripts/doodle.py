"""Tiny doodle toolkit: draws Zenn-style stick-figure scenes as SVG (1920x1080)."""
import base64
import math
import os
import random

W, H = 1920, 1080

PAPER = "#ffffff"
NIGHT = "#16203a"
DARK = "#1b1b1b"
LIGHT = "#f5f0e3"
YEL = "#e8b23e"
ORG = "#dd7a3a"
RED = "#d9382f"
BLU = "#5d8fc4"
SKY = "#9dc6e0"
BRN = "#8a6540"
GRN = "#6a9a52"
PUR = "#7a5aa6"
GREY = "#9a9a9a"
PINK = "#e9a6a6"
SKIN = "#ffffff"
SAND = "#c9a85f"
SAGE = "#8aa98a"
STEEL = "#6f93ad"
WALL = "#cfa874"
FLOOR = "#a77b45"
TEAL = "#78b0a4"

_FONT = None


def font_b64():
    global _FONT
    if _FONT is None:
        p = os.path.join(os.path.dirname(__file__), "..", "scenes", "assets", "PatrickHand.woff2")
        with open(p, "rb") as f:
            _FONT = base64.b64encode(f.read()).decode()
    return _FONT


# poses: hip is origin; shoulder at (0,-75); head centre (0,-132)
POSES = {
    "stand": dict(arms=[[(-48, -18)], [(48, -18)]], legs=[[(-30, 105)], [(30, 105)]]),
    "armsup": dict(arms=[[(-62, -140)], [(62, -140)]], legs=[[(-30, 105)], [(30, 105)]]),
    "point": dict(arms=[[(-48, -18)], [(115, -85)]], legs=[[(-30, 105)], [(30, 105)]]),
    "pointup": dict(arms=[[(-48, -18)], [(40, -190)]], legs=[[(-30, 105)], [(30, 105)]]),
    "think": dict(arms=[[(-48, -18)], [(30, -60), (14, -112)]], legs=[[(-30, 105)], [(30, 105)]]),
    "shrug": dict(arms=[[(-50, -40), (-75, -85)], [(50, -40), (75, -85)]], legs=[[(-30, 105)], [(30, 105)]]),
    "hold": dict(arms=[[(-40, -30), (-20, -62)], [(40, -30), (20, -62)]], legs=[[(-30, 105)], [(30, 105)]]),
    "run": dict(arms=[[(-60, -50), (-20, -20)], [(55, -110), (90, -60)]], legs=[[(-40, 50), (-75, 100)], [(55, 30), (110, 60)]]),
    "fly": dict(arms=[[(-70, -100)], [(70, -100)]], legs=[[(-20, 105)], [(25, 100)]]),
    "fall": dict(arms=[[(-65, -150)], [(65, -140)]], legs=[[(-45, 90)], [(40, 100)]]),
    "sit": dict(arms=[[(-48, -18)], [(48, -18)]], legs=[[(70, 5), (75, 100)], [(95, 8), (100, 100)]]),
    "lie": dict(arms=[[(-40, -30)], [(40, -30)]], legs=[[(-18, 105)], [(18, 105)]]),
    "write": dict(arms=[[(-45, -20)], [(52, -30), (80, 5)]], legs=[[(-30, 105)], [(30, 105)]]),
    "walk": dict(arms=[[(-35, -30), (-45, 10)], [(35, -30), (45, 10)]], legs=[[(-40, 105)], [(45, 100)]]),
}


class Canvas:
    def __init__(self, night=False, bg=None, env="white"):
        self.night = night
        self.ink = LIGHT if night else DARK
        self.bg = bg or (NIGHT if night else PAPER)
        self.el = []
        self.sw = 7
        self.env = env
        if not night:
            if env == "sky":
                self.bg = SKY
                self.raw(f'<path d="M-20,650 Q500,630 1000,650 T1960,640 L1960,1100 L-20,1100 Z" fill="{SAND}" stroke="{DARK}" stroke-width="{self.sw}"/>')
                self.raw(f'<path d="M-20,900 Q600,860 1100,930 T1960,900 L1960,1100 L-20,1100 Z" fill="#c09a50" stroke="none"/>')
                self.bush(120, 800, 1.0), self.bush(1650, 760, 1.2), self.bush(1100, 880, .8)
            elif env == "room":
                self.bg = WALL
                self.raw(f'<rect x="-20" y="860" width="{W + 40}" height="300" fill="{FLOOR}" stroke="{DARK}" stroke-width="{self.sw}"/>')

    # ---- low level -------------------------------------------------
    def raw(self, s):
        self.el.append(s)

    def _st(self, fill="none", stroke=None, w=None, extra=""):
        stroke = self.ink if stroke is None else stroke
        w = self.sw if w is None else w
        return f'fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}'

    def push_ink(self, color=DARK):
        self._old = self.ink
        self.ink = color

    def pop_ink(self):
        self.ink = self._old

    def rect(self, x, y, w, h, fill="none", rx=6, stroke=None, sw=None):
        self.raw(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" {self._st(fill, stroke, sw)}/>')

    def circle(self, x, y, r, fill="none", stroke=None, sw=None):
        self.raw(f'<circle cx="{x}" cy="{y}" r="{r}" {self._st(fill, stroke, sw)}/>')

    def ellipse(self, x, y, rx, ry, fill="none", stroke=None, sw=None):
        self.raw(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" {self._st(fill, stroke, sw)}/>')

    def line(self, x1, y1, x2, y2, color=None, w=None):
        self.raw(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" {self._st("none", color, w)}/>')

    def poly(self, pts, fill="none", color=None, w=None, close=False):
        d = "M" + " L".join(f"{x},{y}" for x, y in pts) + (" Z" if close else "")
        self.raw(f'<path d="{d}" {self._st(fill, color, w)}/>')

    def path(self, d, fill="none", color=None, w=None):
        self.raw(f'<path d="{d}" {self._st(fill, color, w)}/>')

    def text(self, x, y, s, size=64, fill=None, anchor="middle", weight=None, rot=0):
        fill = self.ink if fill is None else fill
        lines = str(s).split("\n")
        tr = f' transform="rotate({rot} {x} {y})"' if rot else ""
        for i, ln in enumerate(lines):
            ln = ln.replace("&", "&amp;").replace("<", "&lt;")
            self.raw(f'<text x="{x}" y="{y + i * size * 1.12}" font-family="Hand" font-size="{size}" fill="{fill}" '
                     f'stroke="{fill}" stroke-width="{max(1.5, size * .045)}" stroke-linejoin="round" '
                     f'text-anchor="{anchor}"{tr}>{ln}</text>')

    def blob(self, circles, fill, stroke=None, sw=None):
        """union-outlined shape from circles [(x,y,r)]"""
        sw = self.sw if sw is None else sw
        stroke = self.ink if stroke is None else stroke
        for x, y, r in circles:
            self.raw(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{stroke}" stroke="{stroke}" stroke-width="{sw * 2}"/>')
        for x, y, r in circles:
            self.raw(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>')

    # ---- scenery ---------------------------------------------------
    def ground(self, y=820, color=None):
        color = color or (BRN if not self.night else "#2c2a3d")
        self.raw(f'<rect x="-20" y="{y}" width="{W + 40}" height="{H - y + 20}" fill="{color}" stroke="{self.ink}" stroke-width="{self.sw}"/>')

    def hills(self, y=800):
        c = "#2b3a5c" if self.night else GRN
        self.raw(f'<path d="M-20,{y} Q300,{y - 140} 640,{y - 20} T1300,{y - 30} T1960,{y - 90} L1960,1100 L-20,1100 Z" '
                 f'fill="{c}" stroke="{self.ink}" stroke-width="{self.sw}"/>')

    def stars(self, n=30, seed=1, y1=40, y2=500):
        rnd = random.Random(seed)
        for _ in range(n):
            x, y = rnd.randint(40, W - 40), rnd.randint(y1, y2)
            s = rnd.choice([6, 8, 11])
            self.raw(f'<path d="M{x},{y - s} L{x + s * .3},{y - s * .3} L{x + s},{y} L{x + s * .3},{y + s * .3} L{x},{y + s} '
                     f'L{x - s * .3},{y + s * .3} L{x - s},{y} L{x - s * .3},{y - s * .3} Z" fill="{YEL}" stroke="none"/>')

    def moon(self, x, y, r=70):
        self.raw(f'<path d="M{x},{y - r} A{r},{r} 0 1,0 {x + r * .9},{y + r * .45} A{r * .8},{r * .8} 0 1,1 {x},{y - r} Z" '
                 f'fill="{YEL}" stroke="{self.ink}" stroke-width="{self.sw}"/>')

    def sun(self, x, y, r=70):
        for i in range(12):
            a = i * math.pi / 6
            self.line(x + math.cos(a) * (r + 18), y + math.sin(a) * (r + 18), x + math.cos(a) * (r + 48), y + math.sin(a) * (r + 48), ORG)
        self.circle(x, y, r, YEL)

    def cloud(self, x, y, s=1, fill=None):
        fill = fill or ("#e8eefc" if not self.night else "#3b4a72")
        self.blob([(x - 60 * s, y, 45 * s), (x, y - 25 * s, 58 * s), (x + 65 * s, y, 45 * s), (x + 10 * s, y + 10 * s, 50 * s)], fill)

    def bush(self, x, y, s=1.0):
        self.path(f"M{x - 90 * s},{y} Q{x - 100 * s},{y - 40 * s} {x - 60 * s},{y - 50 * s} Q{x - 50 * s},{y - 95 * s} {x - 10 * s},{y - 75 * s} "
                  f"Q{x + 20 * s},{y - 110 * s} {x + 45 * s},{y - 70 * s} Q{x + 95 * s},{y - 70 * s} {x + 90 * s},{y} Z", SAGE, w=5)
        self.path(f"M{x - 20 * s},{y} L{x - 25 * s},{y - 45 * s} M{x + 25 * s},{y} L{x + 30 * s},{y - 40 * s}", w=4)

    # ---- people ----------------------------------------------------
    def person(self, x, y, pose="stand", s=1.0, rot=0, face="neutral", color=None, glasses=False, hat=None, flip=False, hair=False, look=1):
        ink = self.ink
        p = POSES[pose]
        sx = -1 if flip else 1
        g = [f'<g transform="translate({x},{y}) rotate({rot}) scale({s * sx},{s})">']
        sw = self.sw / s

        def ln(pts, col=ink):
            d = "M" + " L".join(f"{a},{b}" for a, b in pts)
            g.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')

        ln([(0, -82), (0, 0)])
        for arm in p["arms"]:
            ln([(0, -70)] + arm)
        for leg in p["legs"]:
            ln([(0, 0)] + leg)
        if color:
            g.append(f'<rect x="-20" y="-84" width="40" height="88" rx="14" fill="{color}" stroke="{ink}" stroke-width="{sw}"/>')
        hc = -130
        g.append(f'<g transform="translate(0,{hc}) scale(1.22) translate(0,{-hc})">')
        g.append(f'<circle cx="0" cy="{hc}" r="48" fill="#ffffff" stroke="{ink}" stroke-width="{sw}"/>')
        dk = DARK
        lw = sw * .7
        er = 16 if face not in ("surprised", "wide") else 19
        ey = hc - 4

        def pup(cx):
            return f'<circle cx="{cx + look * 5}" cy="{ey + 1}" r="6" fill="{dk}"/>'

        if face == "closed":
            g.append(f'<path d="M-30,{ey} q12,10 24,0 M6,{ey} q12,10 24,0" fill="none" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        else:
            for cx in (-18, 18):
                g.append(f'<circle cx="{cx}" cy="{ey}" r="{er}" fill="#fff" stroke="{dk}" stroke-width="{lw}"/>' + pup(cx))
        by = ey - er - 8
        if face in ("neutral", "happy", "wide"):
            g.append(f'<path d="M-32,{by} h24 M8,{by} h24" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        elif face == "surprised":
            g.append(f'<path d="M-32,{by - 6} h24 M8,{by - 6} h24" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        elif face == "sad":
            g.append(f'<path d="M-32,{by + 4} l24,-8 M32,{by + 4} l-24,-8" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        elif face == "think":
            g.append(f'<path d="M-32,{by} h24 M8,{by + 2} l24,-10" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        my = hc + 30
        if face in ("happy", "closed"):
            g.append(f'<path d="M-14,{my - 3} q14,12 28,0" fill="none" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        elif face == "surprised":
            g.append(f'<ellipse cx="0" cy="{my}" rx="8" ry="11" fill="{dk}"/>')
        elif face == "wide":
            g.append(f'<circle cx="0" cy="{my}" r="7" fill="none" stroke="{dk}" stroke-width="{lw}"/>')
        elif face == "sad":
            g.append(f'<path d="M-14,{my + 6} q14,-14 28,0" fill="none" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        else:
            g.append(f'<path d="M-12,{my} h24" stroke="{dk}" stroke-width="{lw}" stroke-linecap="round"/>')
        if glasses:
            for cx in (-18, 18):
                g.append(f'<circle cx="{cx}" cy="{ey}" r="{er + 6}" fill="none" stroke="{dk}" stroke-width="{lw}"/>')
            g.append(f'<path d="M-6,{ey} h12 M-44,{ey - 2} l-8,-4 M44,{ey - 2} l8,-4" stroke="{dk}" stroke-width="{lw}"/>')
        if hair:
            g.append(f'<path d="M-14,{hc - 46} l-6,-26 M0,{hc - 48} l0,-30 M14,{hc - 46} l6,-26" stroke="{ink}" stroke-width="{sw}" stroke-linecap="round"/>')
        if hat == "grad":
            g.append(f'<path d="M-58,{hc - 34} L0,{hc - 66} L58,{hc - 34} L0,{hc - 12} Z" fill="{DARK}" stroke="{ink}" stroke-width="{sw * .6}"/>')
        elif hat == "ranger":
            g.append(f'<ellipse cx="0" cy="{hc - 34}" rx="72" ry="16" fill="#8a9a58" stroke="{ink}" stroke-width="{sw}"/>'
                     f'<path d="M-40,{hc - 40} Q-36,{hc - 92} 0,{hc - 90} Q36,{hc - 92} 40,{hc - 40} Z" fill="#8a9a58" stroke="{ink}" stroke-width="{sw}"/>')
        g.append("</g></g>")
        self.raw("".join(g))

    def sleeper(self, x, y, blanket=BLU, bed=True, face="closed"):
        """lying figure; x,y = hip. head to the left."""
        if bed:
            self.rect(x - 260, y + 30, 520, 60, "#c9b28a")
            self.rect(x - 280, y - 30, 70, 120, "#c9b28a")
            self.rect(x - 245, y - 55, 110, 55, "#ffffff", rx=26)
        self.person(x, y, "lie", rot=-90, face=face)
        self.rect(x - 130, y - 62, 360, 105, blanket, rx=30)

    def zzz(self, x, y, s=1):
        for i, (dx, dy, fs) in enumerate([(0, 0, 50), (50, -55, 70), (115, -125, 90)]):
            self.text(x + dx * s, y + dy * s, "Z", int(fs * s), YEL if self.night else ORG)

    def bubble(self, cx, cy, w=520, h=340, tx=None, ty=None, fill=None):
        fill = fill or ("#ffffff" if not self.night else "#2a3a63")
        n = max(3, int(w / 110))
        rows = max(2, int(round((h - 140) / 110)) + 1)
        cs = []
        for j in range(rows):
            yy = cy - h / 2 + 70 + (h - 140) * j / (rows - 1)
            for i in range(n):
                cs.append((cx - w / 2 + 70 + (w - 140) * i / (n - 1), yy, 75))
        self.blob(cs, fill)
        if tx is not None:
            ax, ay = tx, ty
            bx, by = cx, cy + h / 2 + 10
            for k, r in enumerate([30, 20, 12]):
                t = (k + 1) / 4.0
                self.circle(ax + (bx - ax) * t, ay + (by - ay) * t, r, fill, sw=5)

    # ---- symbols ---------------------------------------------------
    def xmark(self, x, y, s=80, color=RED):
        self.line(x - s, y - s, x + s, y + s, color, 14)
        self.line(x + s, y - s, x - s, y + s, color, 14)

    def check(self, x, y, s=60, color=GRN):
        self.poly([(x - s, y), (x - s * .25, y + s * .8), (x + s, y - s * .9)], color=color, w=16)

    def qmark(self, x, y, s=200, color=YEL):
        self.text(x, y, "?", s, color)

    def arrow(self, x1, y1, x2, y2, color=None, w=8):
        color = color or self.ink
        self.line(x1, y1, x2, y2, color, w)
        a = math.atan2(y2 - y1, x2 - x1)
        for da in (2.6, -2.6):
            self.line(x2, y2, x2 + math.cos(a + da) * 34, y2 + math.sin(a + da) * 34, color, w)

    def bulb(self, x, y, s=1):
        self.circle(x, y, 50 * s, YEL)
        self.rect(x - 22 * s, y + 48 * s, 44 * s, 34 * s, GREY, rx=6)
        for a in (-2.4, -1.57, -.75):
            self.line(x + math.cos(a) * 70 * s, y + math.sin(a) * 70 * s, x + math.cos(a) * 100 * s, y + math.sin(a) * 100 * s, ORG, 8)

    def bar(self, x, y, w, h, frac, color=YEL, label=None, size=44):
        self.rect(x, y, w, h, "none", rx=h / 2)
        if frac > 0:
            self.rect(x, y, max(h, w * frac), h, color, rx=h / 2)
        if label:
            self.text(x + w / 2, y - 18, label, size)

    def meter(self, x, y, h, frac, label=None, color=YEL):
        self.rect(x, y, 70, h, "none", rx=20)
        fh = max(10, (h - 12) * frac)
        self.rect(x + 8, y + h - 6 - fh, 54, fh, color, rx=12, sw=0)
        if label:
            self.text(x + 35, y + h + 55, label, 40)

    def pie(self, x, y, r, frac, color=YEL, label=None):
        self.circle(x, y, r, PAPER if not self.night else "#2a3a63")
        a = frac * 2 * math.pi
        ex, ey = x + r * math.sin(a), y - r * math.cos(a)
        big = 1 if frac > .5 else 0
        self.path(f"M{x},{y} L{x},{y - r} A{r},{r} 0 {big},1 {ex},{ey} Z", color)
        if label:
            self.text(x, y + r + 70, label, 52)

    def clock(self, x, y, r=90, h=10, m=10):
        self.circle(x, y, r, "#fff")
        for i in range(12):
            a = i * math.pi / 6
            self.line(x + math.cos(a) * r * .82, y + math.sin(a) * r * .82, x + math.cos(a) * r * .95, y + math.sin(a) * r * .95, DARK, 4)
        ha = (h % 12 + m / 60) / 12 * 2 * math.pi
        ma = m / 60 * 2 * math.pi
        self.line(x, y, x + math.sin(ha) * r * .5, y - math.cos(ha) * r * .5, DARK, 8)
        self.line(x, y, x + math.sin(ma) * r * .75, y - math.cos(ma) * r * .75, DARK, 6)

    def brain(self, x, y, s=1.0, fill=PINK, tint=None, label=None):
        cs = [(-70, 10, 62), (-20, -25, 66), (45, -22, 64), (85, 15, 56), (0, 35, 70), (50, 45, 56), (-45, 45, 50)]
        self.blob([(x + a * s, y + b * s, r * s) for a, b, r in cs], fill)
        sc = self.ink
        self.path(f"M{x - 5 * s},{y - 80 * s} Q{x + 10 * s},{y - 10 * s} {x - 8 * s},{y + 40 * s}", color=sc, w=5)
        self.path(f"M{x - 80 * s},{y} q30,-30 55,-5 M{x + 30 * s},{y - 40 * s} q35,-10 50,25 M{x - 55 * s},{y + 45 * s} q25,20 50,0 M{x + 25 * s},{y + 50 * s} q30,15 50,-10", color=sc, w=5)
        if label:
            self.text(x, y + 150 * s, label, 50)

    def sparks(self, x, y, s=1, n=8, color=YEL):
        for i in range(n):
            a = i * 2 * math.pi / n
            self.line(x + math.cos(a) * 30 * s, y + math.sin(a) * 30 * s, x + math.cos(a) * 62 * s, y + math.sin(a) * 62 * s, color, 8)

    def flame(self, x, y, s=1):
        self.path(f"M{x},{y} C{x - 70 * s},{y - 30 * s} {x - 50 * s},{y - 110 * s} {x},{y - 160 * s} "
                  f"C{x + 20 * s},{y - 100 * s} {x + 70 * s},{y - 70 * s} {x + 60 * s},{y - 20 * s} C{x + 55 * s},{y + 5 * s} {x + 20 * s},{y + 10 * s} {x},{y} Z", ORG)
        self.path(f"M{x},{y - 5 * s} C{x - 30 * s},{y - 20 * s} {x - 15 * s},{y - 70 * s} {x + 5 * s},{y - 85 * s} C{x + 30 * s},{y - 50 * s} {x + 35 * s},{y - 20 * s} {x},{y - 5 * s} Z", YEL, w=0)

    def campfire(self, x, y, s=1):
        self.line(x - 80 * s, y + 10 * s, x + 80 * s, y - 14 * s, BRN, 20)
        self.line(x - 80 * s, y - 14 * s, x + 80 * s, y + 10 * s, BRN, 20)
        self.flame(x, y, s)

    def book(self, x, y, w=220, h=290, color=BLU, title=None, size=36):
        self.rect(x - w / 2, y - h / 2, w, h, color, rx=10)
        self.line(x - w / 2 + 28, y - h / 2, x - w / 2 + 28, y + h / 2, self.ink, 5)
        if title:
            self.text(x + 12, y, title, size, "#fff")

    def phone(self, x, y, s=1, glow=BLU):
        self.rect(x - 45 * s, y - 80 * s, 90 * s, 160 * s, glow, rx=14)
        self.circle(x, y + 66 * s, 5 * s, self.ink)

    def notebook(self, x, y, w=240, h=300):
        self.rect(x - w / 2, y - h / 2, w, h, "#fff", rx=8)
        for i in range(5):
            self.line(x - w / 2 + 30, y - h / 2 + 60 + i * 44, x + w / 2 - 25, y - h / 2 + 60 + i * 44, GREY, 4)
        for i in range(4):
            self.circle(x - w / 2, y - h / 2 + 44 + i * 70, 8, self.ink)

    def pencil(self, x, y, s=1, rot=-35):
        self.raw(f'<g transform="translate({x},{y}) rotate({rot}) scale({s})"><rect x="-14" y="-110" width="28" height="170" fill="{YEL}" '
                 f'stroke="{self.ink}" stroke-width="{self.sw / s}"/><path d="M-14,60 L0,100 L14,60 Z" fill="{SKIN}" stroke="{self.ink}" stroke-width="{self.sw / s}"/>'
                 f'<rect x="-14" y="-110" width="28" height="30" fill="{PINK}" stroke="{self.ink}" stroke-width="{self.sw / s}"/></g>')

    def eye(self, x, y, s=1, closed=False, arrows=False):
        if closed:
            self.path(f"M{x - 70 * s},{y} Q{x},{y + 50 * s} {x + 70 * s},{y}", w=8)
            for i in range(5):
                a = .4 + i * .58
                self.line(x + math.cos(a) * 70 * s * .9 - (0), y + 28 * s + math.sin(a) * 6, x + math.cos(a) * 80 * s, y + 55 * s + math.sin(a) * 12 * s, self.ink, 5)
        else:
            self.path(f"M{x - 80 * s},{y} Q{x},{y - 70 * s} {x + 80 * s},{y} Q{x},{y + 70 * s} {x - 80 * s},{y} Z", "#fff")
            self.circle(x, y, 26 * s, BLU)
            self.circle(x, y, 11 * s, DARK, sw=0)
        if arrows:
            self.arrow(x - 150 * s, y - 100 * s, x - 150 * s + 110 * s, y - 100 * s)
            self.arrow(x + 150 * s, y - 100 * s, x + 150 * s - 110 * s, y - 100 * s)

    def dna(self, x, y, h=420):
        n = 8
        for i in range(n):
            yy = y - h / 2 + h * i / (n - 1)
            off = math.sin(i * 0.9) * 55
            self.line(x - off, yy, x + off, yy, [RED, BLU, GRN, ORG][i % 4], 8)
        pts1 = [(x + math.sin(i * .9) * 55, y - h / 2 + h * i / (n - 1)) for i in range(n)]
        pts2 = [(x - math.sin(i * .9) * 55, y - h / 2 + h * i / (n - 1)) for i in range(n)]
        self.poly(pts1)
        self.poly(pts2)

    def beaker(self, x, y, s=1, liquid=YEL):
        self.path(f"M{x - 50 * s},{y - 120 * s} L{x - 50 * s},{y - 40 * s} L{x - 110 * s},{y + 90 * s} Q{x - 115 * s},{y + 120 * s} {x - 85 * s},{y + 120 * s} "
                  f"L{x + 85 * s},{y + 120 * s} Q{x + 115 * s},{y + 120 * s} {x + 110 * s},{y + 90 * s} L{x + 50 * s},{y - 40 * s} L{x + 50 * s},{y - 120 * s} Z", "#fff")
        self.path(f"M{x - 78 * s},{y + 30 * s} L{x - 110 * s},{y + 90 * s} Q{x - 115 * s},{y + 120 * s} {x - 85 * s},{y + 120 * s} L{x + 85 * s},{y + 120 * s} "
                  f"Q{x + 115 * s},{y + 120 * s} {x + 110 * s},{y + 90 * s} L{x + 78 * s},{y + 30 * s} Z", liquid)
        self.line(x - 62 * s, y - 120 * s, x + 62 * s, y - 120 * s, w=10)

    def battery(self, x, y, frac, w=300, h=140):
        self.rect(x - w / 2, y - h / 2, w, h, "none", rx=18)
        self.rect(x + w / 2, y - 28, 22, 56, self.ink, rx=4)
        self.rect(x - w / 2 + 12, y - h / 2 + 12, max(14, (w - 24) * frac), h - 24, RED if frac < .3 else GRN, rx=8, sw=0)

    def camera(self, x, y, s=1):
        self.rect(x - 110 * s, y - 70 * s, 220 * s, 140 * s, GREY, rx=20)
        self.circle(x + 20 * s, y, 50 * s, "#fff")
        self.circle(x + 20 * s, y, 24 * s, BLU)
        self.rect(x - 80 * s, y - 100 * s, 70 * s, 34 * s, GREY, rx=8)
        self.circle(x - 80 * s, y - 20 * s, 12 * s, RED, sw=0)
        self.line(x, y + 70 * s, x - 60 * s, y + 200 * s)
        self.line(x, y + 70 * s, x + 60 * s, y + 200 * s)
        self.line(x, y + 70 * s, x, y + 200 * s)

    def scissors(self, x, y, s=1, rot=0):
        self.raw(f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
                 f'<line x1="0" y1="0" x2="120" y2="-45" stroke="{self.ink}" stroke-width="{10}" stroke-linecap="round"/>'
                 f'<line x1="0" y1="0" x2="120" y2="45" stroke="{self.ink}" stroke-width="{10}" stroke-linecap="round"/>'
                 f'<circle cx="-30" cy="-30" r="26" fill="none" stroke="{RED}" stroke-width="10"/>'
                 f'<circle cx="-30" cy="30" r="26" fill="none" stroke="{RED}" stroke-width="10"/></g>')

    def film(self, x, y, w=420, h=120):
        self.rect(x - w / 2, y - h / 2, w, h, DARK if not self.night else "#0b1020", rx=8)
        for i in range(8):
            self.rect(x - w / 2 + 14 + i * (w - 28) / 8, y - h / 2 + 8, 30, 22, PAPER, rx=4, sw=0)
            self.rect(x - w / 2 + 14 + i * (w - 28) / 8, y + h / 2 - 30, 30, 22, PAPER, rx=4, sw=0)
        for i in range(3):
            self.rect(x - w / 2 + 40 + i * 130, y - 30, 100, 60, SKY, rx=4, sw=0)

    def gear(self, x, y, r=90, fill=GREY, label=None):
        for i in range(10):
            a = i * math.pi / 5
            self.line(x + math.cos(a) * r, y + math.sin(a) * r, x + math.cos(a) * (r + 24), y + math.sin(a) * (r + 24), self.ink, 30)
        self.circle(x, y, r + 4, fill)
        self.circle(x, y, r * .35, PAPER if not self.night else NIGHT)
        if label:
            self.text(x, y + r + 90, label, 46)

    def key(self, x, y, s=1):
        self.circle(x, y, 50 * s, YEL)
        self.circle(x, y, 18 * s, PAPER)
        self.line(x + 50 * s, y, x + 230 * s, y, YEL, 22 * s)
        self.line(x + 50 * s, y, x + 230 * s, y, w=4)
        self.rect(x + 170 * s, y, 18 * s, 50 * s, YEL, rx=3)
        self.rect(x + 205 * s, y, 18 * s, 38 * s, YEL, rx=3)

    def lock(self, x, y, s=1, open_=False):
        self.rect(x - 60 * s, y - 20 * s, 120 * s, 100 * s, YEL, rx=14)
        if open_:
            self.path(f"M{x - 38 * s},{y - 20 * s} L{x - 38 * s},{y - 70 * s} A{38 * s},{38 * s} 0 0,1 {x + 38 * s},{y - 70 * s}", w=12)
        else:
            self.path(f"M{x - 38 * s},{y - 20 * s} L{x - 38 * s},{y - 55 * s} A{38 * s},{38 * s} 0 0,1 {x + 38 * s},{y - 55 * s} L{x + 38 * s},{y - 20 * s}", w=12)
        self.circle(x, y + 30 * s, 10 * s, DARK, sw=0)

    def scale(self, x, y, s=1):
        self.line(x, y - 160 * s, x, y + 130 * s, w=10)
        self.line(x - 200 * s, y - 130 * s, x + 200 * s, y - 130 * s, w=10)
        for dx in (-200, 200):
            self.line(x + dx * s, y - 130 * s, x + (dx - 60) * s, y - 20 * s)
            self.line(x + dx * s, y - 130 * s, x + (dx + 60) * s, y - 20 * s)
            self.path(f"M{x + (dx - 80) * s},{y - 20 * s} Q{x + dx * s},{y + 50 * s} {x + (dx + 80) * s},{y - 20 * s} Z", YEL)
        self.rect(x - 90 * s, y + 130 * s, 180 * s, 26 * s, GREY)

    def building(self, x, y, w=420, h=300, label=None):
        self.rect(x - w / 2, y - h / 2, w, h, "#c98b6b")
        self.poly([(x - w / 2 - 20, y - h / 2), (x, y - h / 2 - 110), (x + w / 2 + 20, y - h / 2)], "#8a4b3c", close=True)
        for i in range(3):
            self.rect(x - w / 2 + 40 + i * 130, y - 70, 70, 100, SKY)
        self.rect(x - 35, y + h / 2 - 120, 70, 120, BRN)
        if label:
            self.text(x, y + h / 2 + 70, label, 48)

    def temple(self, x, y, w=520, h=320):
        self.poly([(x - w / 2 - 30, y - h / 2 + 60), (x, y - h / 2 - 60), (x + w / 2 + 30, y - h / 2 + 60)], "#e6dcc4", close=True)
        for i in range(5):
            self.rect(x - w / 2 + 20 + i * 110, y - h / 2 + 60, 50, h - 70, "#f1e9d3")
        self.rect(x - w / 2 - 30, y + h / 2 - 10, w + 60, 30, "#e6dcc4")

    def table_chalk(self, x, y, w=620, h=360):
        self.rect(x - w / 2, y - h / 2, w, h, "#2f5d4a", rx=10, sw=10)

    def net(self, x, y, s=1):
        self.line(x, y + 40 * s, x + 90 * s, y + 220 * s, BRN, 14)
        self.path(f"M{x - 80 * s},{y - 40 * s} A{80 * s},{80 * s} 0 1,1 {x + 80 * s},{y - 40 * s} Z", "none")
        for k in (-40, 0, 40):
            self.line(x + k * s, y - 100 * s, x + k * s, y + 30 * s, GREY, 3)

    def butterfly(self, x, y, s=1, color=ORG):
        self.ellipse(x - 28 * s, y - 14 * s, 30 * s, 22 * s, color)
        self.ellipse(x + 28 * s, y - 14 * s, 30 * s, 22 * s, color)
        self.ellipse(x - 20 * s, y + 18 * s, 20 * s, 16 * s, color)
        self.ellipse(x + 20 * s, y + 18 * s, 20 * s, 16 * s, color)
        self.line(x, y - 22 * s, x, y + 30 * s, w=6)

    def trash(self, x, y, s=1):
        self.path(f"M{x - 60 * s},{y - 70 * s} L{x - 48 * s},{y + 90 * s} L{x + 48 * s},{y + 90 * s} L{x + 60 * s},{y - 70 * s} Z", GREY)
        self.line(x - 75 * s, y - 70 * s, x + 75 * s, y - 70 * s, w=10)
        for k in (-22, 0, 22):
            self.line(x + k * s, y - 40 * s, x + k * s * .8, y + 65 * s, DARK, 4)

    def papyrus(self, x, y, w=300, h=380):
        self.rect(x - w / 2, y - h / 2, w, h, "#e9d9a8", rx=24)
        self.eye(x, y - 60, .7)
        for i in range(3):
            self.line(x - 90, y + 40 + i * 40, x + 90, y + 40 + i * 40, BRN, 5)

    def seahorse(self, x, y, s=1, fill=ORG):
        self.path(f"M{x},{y - 100 * s} C{x + 70 * s},{y - 110 * s} {x + 80 * s},{y - 20 * s} {x + 30 * s},{y + 10 * s} "
                  f"C{x + 60 * s},{y + 60 * s} {x + 20 * s},{y + 110 * s} {x - 30 * s},{y + 90 * s} C{x + 10 * s},{y + 80 * s} {x + 10 * s},{y + 50 * s} {x - 20 * s},{y + 30 * s} "
                  f"C{x - 70 * s},{y - 10 * s} {x - 50 * s},{y - 90 * s} {x},{y - 100 * s} Z", fill)
        self.line(x + 6 * s, y - 100 * s, x + 90 * s, y - 118 * s)
        self.circle(x - 10 * s, y - 68 * s, 6 * s, DARK, sw=0)

    def sofa(self, x, y, w=420, color=PUR):
        self.rect(x - w / 2, y - 80, w, 70, color, rx=30)
        self.rect(x - w / 2 - 20, y - 60, 60, 130, color, rx=26)
        self.rect(x + w / 2 - 40, y - 60, 60, 130, color, rx=26)
        self.rect(x - w / 2 + 20, y - 10, w - 40, 70, color, rx=18)

    def lamp_ceiling(self, x, y=0, on=True):
        self.line(x, y, x, y + 130, w=5)
        self.path(f"M{x - 70},{y + 190} A70,60 0 0,1 {x + 70},{y + 190} Z", YEL if on else GREY)
        if on:
            for dx in (-90, -45, 0, 45, 90):
                self.line(x + dx * 1.2, y + 215, x + dx * 2.2, y + 300, YEL, 6)

    def switch(self, x, y):
        self.rect(x - 70, y - 100, 140, 200, "#fff", rx=14)
        self.rect(x - 22, y - 60, 44, 120, GREY, rx=10)
        self.rect(x - 22, y - 60, 44, 55, DARK, rx=10)

    def mouth_shh(self, x, y):
        self.text(x, y, "shh...", 56)

    def theater_seats(self, x, y, n=5):
        for i in range(n):
            xx = x + (i - (n - 1) / 2) * 140
            self.rect(xx - 50, y - 30, 100, 90, RED, rx=18)
            self.rect(xx - 50, y + 60, 100, 40, "#8c1f1f", rx=8)

    def world(self, x, y, r=60, c1=BLU, c2=GRN):
        self.circle(x, y, r, c1)
        self.path(f"M{x - r * .6},{y - r * .2} q{r * .4},{-r * .5} {r * .7},{-r * .1} q{-r * .1},{r * .5} {-r * .5},{r * .6} Z", c2, w=3)
        self.path(f"M{x + r * .1},{y + r * .3} q{r * .4},{-r * .2} {r * .6},{r * .1} q{-r * .2},{r * .3} {-r * .6},{r * .1} Z", c2, w=3)

    def phone_x(self, x, y):
        self.phone(x, y, 1.1, "#555")
        self.xmark(x, y, 70)

    def feet(self, x, y):
        self.ellipse(x - 50, y, 32, 70, SKIN)
        self.ellipse(x + 50, y, 32, 70, SKIN)

    def todo(self, x, y, w=260, h=330):
        self.rect(x - w / 2, y - h / 2, w, h, "#fff", rx=8)
        self.text(x, y - h / 2 + 52, "TO DO", 44)
        for i in range(4):
            self.rect(x - w / 2 + 24, y - h / 2 + 90 + i * 60, 26, 26, "none", rx=4, sw=4)
            self.line(x - w / 2 + 70, y - h / 2 + 106 + i * 60, x + w / 2 - 24, y - h / 2 + 106 + i * 60, GREY, 5)

    def graph(self, x, y, w=560, h=360, pts=None, color=YEL, xlabel=None):
        self.line(x, y, x, y - h, w=7)
        self.line(x, y, x + w, y, w=7)
        pts = pts or [(0, .1), (.25, .3), (.5, .45), (.75, .7), (1, .95)]
        self.poly([(x + a * w, y - b * h) for a, b in pts], color=color, w=12)
        if xlabel:
            self.text(x + w / 2, y + 70, xlabel, 46)

    def wave(self, x, y, w=520, amp=40, color=None, cycles=6, jag=False):
        color = color or self.ink
        pts = []
        rnd = random.Random(int(x + y))
        for i in range(0, 121):
            t = i / 120
            a = amp * (1 if not jag else rnd.uniform(.4, 1.3))
            pts.append((x + t * w, y + math.sin(t * cycles * 2 * math.pi) * a))
        self.poly(pts, color=color, w=6)

    def chip_label(self, x, y, s, size=52, fill="#fff"):
        w = len(s) * size * .5 + 50
        self.rect(x - w / 2, y - size * .85, w, size * 1.35, fill, rx=18)
        self.text(x, y, s, size)

    def timeline(self, y, label, slice_frac=None, slice_label=None, x1=260, x2=1660, h=70):
        self.rect(x1, y, x2 - x1, h, "none", rx=h / 2)
        if slice_frac:
            w = (x2 - x1) * slice_frac
            self.rect(x2 - w, y, w, h, YEL, rx=h / 2)
        self.text((x1 + x2) / 2, y - 30, label, 62)
        if slice_label:
            self.text(x2 - 90, y + h + 80, slice_label, 62, ORG if not self.night else YEL)

    # ---- output ----------------------------------------------------
    def svg(self):
        defs = (
            f'<defs><style>@font-face{{font-family:"Hand";src:url(data:font/woff2;base64,{font_b64()}) format("woff2");}}</style>'
            '<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="n"/>'
            '<feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter></defs>'
        )
        body = "".join(self.el)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{defs}'
                f'<rect width="{W}" height="{H}" fill="{self.bg}"/><g filter="url(#wob)">{body}</g></svg>')
