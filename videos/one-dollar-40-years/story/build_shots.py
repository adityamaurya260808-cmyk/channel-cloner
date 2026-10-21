"""story/build_shots.py — writes story/shots.json from the phrase timings + the shot plan below.

Each plan entry: (anchor, tpl, params, opts)
  anchor: phrase index | (phrase index, seconds offset) | (phrase index, 'word')  -> shot starts ~0.12 s before it
  opts:   bars, in, sfx, amb, talk ('all' | (p_from, p_to)), notes
Run: python3 story/build_shots.py
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
P = json.load(open(os.path.join(ROOT, 'timeline', 'phrases.json')))
WORDS = json.load(open(os.path.join(ROOT, 'timeline', 'words.json')))
WORDS = WORDS['words'] if isinstance(WORDS, dict) else WORDS
CFG = json.load(open(os.path.join(ROOT, 'config.json')))
DUR = round(CFG['duration'] + 1.0, 2)
LEAD = 0.12


def word_time(word, after):
    w0 = re.sub(r"[^\w']", '', word.lower())
    for w in WORDS:
        if w['start'] >= after - 0.05 and re.sub(r"[^\w']", '', w['word'].lower()).startswith(w0):
            return w['start']
    raise SystemExit(f'word not found: {word} after {after}')


def anchor_time(a):
    if isinstance(a, int):
        return P[a]['start']
    i, x = a
    return P[i]['start'] + x if isinstance(x, (int, float)) else word_time(x, P[i]['start'])


# ---------- shorthand ----------
def A(who, x, pose='stand', expr='neutral', facing=1, **kw):
    d = {'who': who, 'x': x, 'facing': facing, **kw}
    if isinstance(pose, list): d['poses'] = pose
    else: d['pose'] = pose
    if isinstance(expr, list): d['exprs'] = expr
    else: d['expr'] = expr
    return d

def W(set_, actors, **kw): return ('wide', {'set': set_, 'actors': actors, **kw})
def F(who, expr, set_='kitchen', **kw):
    d = {'who': who, 'set': set_, **kw}
    d['exprs' if isinstance(expr, list) else 'expr'] = expr
    return ('face', d)
def PH(app, set_='bedroom', **kw): return ('phone', {'app': app, 'set': set_, **kw})
def J(set_='kitchen', **kw): return ('jarMacro', {'set': set_, **kw})
def NUM(**kw): return ('bigNum', kw)
def CH(**kw): return ('chart', kw)
def CARD(items, **kw): return ('card', {'items': items, **kw})
def TX(s, x=0.5, y=0.5, t0=0.2, size=60, color='cream', **kw): return {'kind': 'text', 'str': s, 'x': x, 'y': y, 't0': t0, 'size': size, 'color': color, **kw}
def IC(name, x=0.5, y=0.5, t0=0.2, s=1.0, **kw): return {'kind': 'icon', 'name': name, 'x': x, 'y': y, 't0': t0, 's': s, **kw}
def YC(year, set_='bedroom', **kw): return ('yearCard', {'year': year, 'set': set_, **kw})

KITCHEN_TABLE = dict(table=True, chairs=[{'x': -330, 'facing': 1, 's': 1.3}, {'x': 330, 'facing': -1, 's': 1.3}])
SAM_SIT = lambda expr='neutral', who='SAM', **kw: A(who, -330, 'sit', expr, 1, s=1.3, shadow=False, **kw)
MOM_SIT = lambda expr='smile', who='MOM', pose='sit', **kw: A(who, 330, pose, expr, -1, s=1.3, shadow=False, **kw)
BED_LIE = lambda who='SAM_OLD', expr='sleepy', **kw: A(who, -640, 'lie', expr, 1, y=-96 + 110 - 10, rot=-1.5708, s=1.1, shadow=False, **kw)
BED_SIT = lambda who='SAM_OLD', pose='sit', expr='worried', **kw: A(who, -420, pose, expr, 1, y=6, s=1.2, shadow=False, **kw)
NIGHT = {'mood': 'night'}

# ---------- THE PLAN ----------
PLAN = [
 # ===== COLD OPEN (night, year 33) =====
 (0, *W('bedroom', [BED_LIE()], setOpts={'phone': 1, 'buzz': True, 'rain': True, 'shelf': True}, cam={'z': [1.22, 1.34], 'x': [-400, -440], 'y': [-30, -30]}, badge={'str': '3:00 AM', 't0': 0.3}), {'bars': 'scope', 'sfx': [{'at': 0.15, 'name': 'phonebuzz', 'gain': -8}], 'amb': {'name': 'rain', 'gain': -24}}),
 (1, *PH({'mode': 'call', 'name': 'MOM', 'clock': '3:00', 'avatar': '#8a5ad6'}, buzz=[0, 1.0], thumb=[[0, 'off'], [0.7, 'press']], pressAt=0.7, setOpts={'rain': True}, who='SAM_OLD'), {'bars': 'scope', 'sfx': [{'at': 0.0, 'name': 'phonebuzz', 'gain': -9}, {'at': 0.95, 'name': 'blip', 'gain': -12}]}),
 (2, *W('bedroom', [BED_SIT(pose='phone', expr='worried', prop='phone', rings=True, talk=None)], setOpts={'phone': 0, 'rain': True}, cam={'z': [1.4, 1.48], 'x': [-400, -420], 'y': [40, 40]}), {'bars': 'scope'}),
 (3, *F('SAM_OLD', [[0, 'worried'], [1.3, 'scared'], [2.6, 'shocked']], 'bedroom', setOpts={'rain': True}, phoneEar=True, voice=True, voiceShake=True, push=0.12, rimSide=1), {'bars': 'scope', 'sfx': [{'at': 2.2, 'name': 'heartbeat', 'gain': -10}]}),
 (6, *PH({'mode': 'logo'}, setOpts={'rain': True}, thumb=[[0, [0.5, 0.75]], [0.5, 'off']], who='SAM_OLD'), {'bars': 'scope', 'sfx': [{'at': 0.2, 'name': 'shimmer', 'gain': -14}]}),
 (7, *PH({'mode': 'balance', 'value': 81042, 'chip': '33 YEARS', 'chipColor': '#ffd47e', 'chartP': 1}, setOpts={'rain': True}, push=0.12, who='SAM_OLD'), {'bars': 'scope', 'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -12}]}),
 (8, *NUM(to=81042, label='33 YEARS OF YOUR LIFE', particlesIn=True, sub='IN ONE NUMBER', subAt=2.1, bg='bedroom', bgOpts={'rain': True}), {'bars': 'scope', 'sfx': [{'at': 0.1, 'name': 'riser', 'gain': -14}]}),
 (10, *PH({'mode': 'balance', 'value': 81042, 'button': 'WITHDRAW', 'btnPulse': True, 'chartP': 1}, thumb='hover', setOpts={'rain': True}, push=0.15, who='SAM_OLD'), {'bars': 'scope', 'sfx': [{'at': 0.4, 'name': 'heartbeat', 'gain': -12}]}),
 (11, *PH({'mode': 'balance', 'value': 81042, 'button': 'WITHDRAW', 'btnPulse': True, 'chartP': 1}, thumb=[[0, 'hover'], [0.9, 'press']], pressAt=0.9, pw=1.15, px=0.5, setOpts={'rain': True}, who='SAM_OLD'), {'bars': 'scope', 'sfx': [{'at': 0.2, 'name': 'heartbeat', 'gain': -10}]}),
 (12, *CH(years=[0, 33], maxX=40, start=0.0, cdur=0.6, stopAt={'y': 33, 't0': 0.8, 'label': 'STOPS GROWING'}, valueTag=False, title='IF YOU PRESS IT'), {'bars': 'scope', 'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 0.8, 'name': 'glitch', 'gain': -12}]}),
 (13, *PH({'mode': 'balance', 'value': 81042, 'button': 'WITHDRAW', 'btnPulse': True, 'chartP': 1}, thumb=[[0, 'hover'], [0.5, [0.95, 1.05]]], setOpts={'rain': True}, who='SAM_OLD'), {'bars': 'scope'}),
 (14, *W('houseExt', [], setOpts={'mood': 'night', 'momInWindow': True, 'sign': 'FORECLOSURE'}, cam={'z': [1.0, 1.1], 'x': [0, 40]}), {'bars': 'scope', 'amb': {'name': 'wind', 'gain': -26}}),
 (15, *J('kitchen', setOpts={'night': True}, coins=0, bills=1, glow=1.2, push=0.12), {'bars': 'scope', 'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -12}]}),
 (17, 'title', {'sub': '33 YEARS EARLIER'}, {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.6}, 'sfx': [{'at': 0.0, 'name': 'stinger', 'gain': -6}]}),
 # ===== THE JAR (age 25, warm) =====
 (19, *W('kitchen', [A('SAM', -260, 'stand', 'smile', 1), A('MOM', 260, 'holdFront', 'smile', -1, hold={'kind': 'jar'})], cam={'z': [1.0, 1.06], 'x': [40, -10]}, callout={'actor': 0, 'str': 'SAM', 't0': 0.3}), {'in': {'type': 'fade', 'dur': 0.5}, 'amb': {'name': 'roomtone', 'gain': -28}}),
 (20, *F('SAM', 'smile', 'kitchen', badge={'str': 'AGE 25'}), {}),
 (21, *W('kitchen', [A('SAM', -170, [[0, 'stand'], [1.0, 'reach'], [1.8, 'holdFront']], 'surprised', 1, s=1.6), A('MOM', 200, [[0, 'holdFront'], [1.0, 'reach']], 'smile', -1, s=1.6, hold={'kind': 'jar'})], cam={'z': [1.18, 1.25], 'x': [0, -20], 'y': [-60, -60]}, fg='plant'), {}),
 (22, *J('kitchen', coins=0, bills=[[0, 0], [1.2, 1]], billDrop=0.2, glow=1.0), {'sfx': [{'at': 1.0, 'name': 'ding', 'gain': -12}]}),
 (24, *F('MOM', 'smile', 'kitchen', talk='all', rimSide=1), {}),
 (25, *CARD([TX('STOCK MARKET', 0.5, 0.2, 0.1, 54, 'cream', spacing=6), {'kind': 'arrow', 'from': [0.15, 0.8], 'to': [0.85, 0.35], 't0': 0.2, 'color': 'good'}, IC('coin', 0.15, 0.8, 0.0, 0.9)]), {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 0.2, 'name': 'whoosh', 'gain': -12}]}),
 (26, 'calendarFlip', {'rate': 5}, {'sfx': [{'at': 0.2, 'name': 'tick', 'gain': -14}, {'at': 0.6, 'name': 'tick', 'gain': -14}, {'at': 1.0, 'name': 'tick', 'gain': -14}]}),
 (27, *W('street', [A('SAM', -200, 'holdFront', 'smile', 1, s=1.5, hold={'kind': 'jar'}), A('MAX', 200, [[0, 'stand'], [0.5, 'cheer']], [[0, 'neutral'], [0.4, 'joy']], -1, s=1.5)], cam={'z': [1.12, 1.18], 'x': [0, -30], 'y': [-50, -50]}), {'in': {'type': 'whip', 'dur': 0.35}, 'amb': {'name': 'city', 'gain': -26}, 'sfx': [{'at': 0.0, 'name': 'swish', 'gain': -10}]}),
 (28, *F('MAX', 'smirk', 'street', talk='all', rimSide=1), {}),
 (30, *J('street', coins=0, bills=1, label='TIPS', labelAt=0.3, glow=0.7), {'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -10}]}),
 (31, *F('SAM', 'smirk', 'street'), {}),
 (32, ('card'), {'items': [{'kind': 'icon', 'name': 'cup', 'x': 0.3, 'y': 0.48, 't0': 0.1, 's': 1.6}, {'kind': 'tag', 'str': '$5', 'x': 0.3, 'y': 0.75, 't0': 0.3}, TX('>', 0.5, 0.5, 0.6, 140, 'gold'), {'kind': 'bill', 'x': 0.7, 'y': 0.48, 't0': 0.8, 'w': 300}, {'kind': 'tag', 'str': '$1', 'x': 0.7, 'y': 0.75, 't0': 1.0}]}, {'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -12}, {'at': 1.0, 'name': 'pop', 'gain': -12}]}),
 (33, *NUM(from_=0, to=365, label='ONE YEAR', start=0.9, cdur=1.2, icon='jar'), {'sfx': [{'at': 0.9, 'name': 'counter', 'gain': -14}]}),
 (35, *NUM(from_=365, to=14600, label='FORTY YEARS', start=0.9, cdur=1.2, icon='jar'), {'sfx': [{'at': 0.9, 'name': 'counter', 'gain': -14}]}),
 (37, *CARD([{'kind': 'stack', 'x': 0.5, 'y': 0.62, 't0': 0.1, 'n': 14, 'r': 60}, TX('$14,600', 0.5, 0.25, 0.2, 110, 'gold'), TX('EVERYTHING YOU PUT IN', 0.5, 0.82, 1.2, 46, 'cream', spacing=4)]), {'sfx': [{'at': 0.2, 'name': 'counter', 'gain': -16}]}),
 (39, *W('kitchen', [A('SAM', -200, 'stand', 'neutral', 1, s=1.6), A('MOM', 200, [[0, 'stand'], [0.3, 'pointUp']], 'determined', -1, s=1.6)], cam={'z': [1.2, 1.28], 'y': [-60, -60]}), {'in': {'type': 'whip', 'dur': 0.35, 'dir': -1}}),
 (40, *J('kitchen', coins=8, bills=1, sprout=[[0.3, 0], [2.4, 1]], glow=0.9), {'sfx': [{'at': 0.4, 'name': 'shimmer', 'gain': -14}]}),
 (41, *J('kitchen', coins=8, bills=1, sprout=[[0, 1]], glow=0.7, pull={'t0': 0.2, 'greyAt': 2.0, 'label': 'STOPS GROWING'}), {'sfx': [{'at': 0.3, 'name': 'swish', 'gain': -12}, {'at': 2.0, 'name': 'glitch', 'gain': -14}]}),
 (43, *CARD([IC('coin', 0.5, 0.45, 0.0, 1.8, a=0.6), TX('FOREVER.', 0.5, 0.78, 0.15, 90, 'accent', font='title')], push=0.1), {'bars': 'scope', 'sfx': [{'at': 0.15, 'name': 'impact', 'gain': -10}]}),
 (44, *CARD([IC('car', 0.2, 0.45, 0.1, 1.3), IC('phone', 0.4, 0.45, 0.35, 1.0), IC('tv', 0.6, 0.45, 0.6, 1.1), IC('shirt', 0.8, 0.45, 0.85, 1.0), {'kind': 'tag', 'str': 'BUY BACK', 'x': 0.5, 'y': 0.78, 't0': 1.2, 'size': 44}]), {'sfx': [{'at': 0.1, 'name': 'pop', 'gain': -14}, {'at': 0.6, 'name': 'pop', 'gain': -14}]}),
 (45, 'clockBig', {'label': 'EXCEPT TIME', 'labelAt': 0.3}, {'bars': 'scope', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.0, 'name': 'clock', 'gain': -8}]}),
 (46, 'bigLine', {'set': 'street', 'lines': ['$1 EVERY DAY...', 'FOR 40 YEARS?'], 'stagger': 3.0, 'sizes': [80, 110], 'gap': 150}, {'bars': 'scope', 'sfx': [{'at': 0.1, 'name': 'riser', 'gain': -12}, {'at': 3.3, 'name': 'impact', 'gain': -8}]}),
 # ===== YEAR 1 =====
 (48, *YC(1, 'bedroom', setOpts={'mood': 'dusk', 'lamp': 1}), {'in': {'type': 'dip', 'dur': 0.5}, 'sfx': [{'at': 0.05, 'name': 'whoosh', 'gain': -10}]}),
 (49, *W('bedroom', [BED_SIT('SAM', 'phone', 'neutral', prop='phone')], setOpts={'mood': 'dusk', 'lamp': 1, 'coins': 6}, cam={'z': [1.2, 1.28], 'x': [-380, -400], 'y': [-40, -40]}), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (50, *PH({'mode': 'balance', 'value': 383, 'chartP': 0.1}, setOpts={'mood': 'dusk', 'lamp': 1}), {'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -12}]}),
 (51, *F('SAM', [[0, 'neutral'], [1.6, 'confused']], 'bedroom', setOpts={'mood': 'dusk', 'lamp': 1}, underGlow='#7fb6ff', float=[{'str': '+$15', 't0': 1.7, 'dx': 380, 'dy': -260, 'color': '#5fd39a'}]), {'sfx': [{'at': 1.7, 'name': 'pop', 'gain': -12}]}),
 (53, *W('street', [A('SAM', -220, 'stand', 'neutral', 1, s=1.5), A('MAX', 200, [[0, 'stand'], [0.4, 'pointUp']], 'joy', -1, s=1.5, hold='pizza')], cam={'z': [1.12, 1.2], 'y': [-50, -50]}), {'amb': {'name': 'city', 'gain': -26}}),
 (54, *F('MAX', 'happy', 'street', talk='all', rimSide=1, fgBlur='pizza'), {}),
 (55, *W('street', [A('SAM', -200, [[0, 'stand'], [0.2, 'shrug']], 'smirk', 1, s=1.6), A('MAX', 220, 'stand', 'happy', -1, s=1.6, hold='pizza')], cam={'z': [1.2, 1.25], 'x': [-80, -60], 'y': [-60, -60]}), {}),
 (56, 'grid', {'mode': 'pick', 'xAt': 1.4}, {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 1.4, 'name': 'hit', 'gain': -10}]}),
 (58, 'grid', {'mode': 'fund'}, {'sfx': [{'at': 0.3, 'name': 'whoosh', 'gain': -10}, {'at': 1.3, 'name': 'ding', 'gain': -12}]}),
 (59, 'city500', {}, {'sfx': [{'at': 0.0, 'name': 'whoosh', 'gain': -14}, {'at': 0.6, 'name': 'counter', 'gain': -16}], 'amb': {'name': 'city', 'gain': -28}}),
 (61, 'pie', {'label': 'A TINY SLICE', 'sub': 'ALL AT ONCE', 'subAt': 0.2}, {'sfx': [{'at': 0.6, 'name': 'shimmer', 'gain': -12}]}),
 (62, *PH({'mode': 'toggle', 'on': 0.7}, setOpts={'mood': 'dusk', 'lamp': 1}, thumb=[[0, [0.75, 0.3]], [1.2, 'off']]), {'sfx': [{'at': 0.75, 'name': 'blip', 'gain': -10}]}),
 (63, *W('bedroom', [A('SAM', -320, 'stand', [[0, 'smile'], [0.8, 'sleepy']], -1, s=1.15, walk={'x1': -560, 't0': 0.2}), ], setOpts={'mood': 'dusk', 'phone': 0.4}, cam={'z': [1.0, 1.04], 'x': [-200, -260]}), {}),
 # ===== YEAR 3 =====
 (64, *YC(3, 'bedroom', setOpts={'mood': 'dusk'}), {'in': {'type': 'dip', 'dur': 0.4}, 'sfx': [{'at': 0.05, 'name': 'whoosh', 'gain': -10}]}),
 (65, *F('SAM', 'sleepy', 'bedroom', setOpts={'mood': 'dusk'}, push=0.03), {'sfx': [{'at': 0.2, 'name': 'clock', 'gain': -16}]}),
 (66, 'quitters', {}, {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 0.3, 'name': 'footstep', 'gain': -16}]}),
 (67, *CH(years=[0, 3], maxX=40, start=0.0, cdur=0.8, valueTag=False, title='GROWTH SO FAR', bigText={'str': 'TOO SMALL TO FEEL', 't0': 1.2, 'size': 64, 'x': 0.5, 'y': 0.4}), {}),
 (69, 'brain', {'mode': 'now', 'nowIcon': 'pizza', 'laterAt': 1.9, 'laterLabel': '4 DECADES'}, {'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -12}, {'at': 1.9, 'name': 'pop', 'gain': -14}]}),
 # ===== YEAR 5 =====
 (71, *YC(5, 'street'), {'in': {'type': 'dip', 'dur': 0.4}, 'sfx': [{'at': 0.05, 'name': 'whoosh', 'gain': -10}]}),
 (72, *W('street', [A('SAM', 120, 'stand', 'surprised', -1, s=1.1), A('MAX', -300, [[0, 'stand'], [0.6, 'cheer']], 'joy', 1, s=1.1, hold='keys')], items=[{'kind': 'car', 'x': -560, 'y': 60, 's': 0.95, 'shine': True}], cam={'z': [1.04, 1.1], 'x': [-80, -140], 'y': [20, 20]}), {'amb': {'name': 'city', 'gain': -24}, 'sfx': [{'at': 0.2, 'name': 'carpass', 'gain': -10}]}),
 (73, ('card'), {'bg': 'street', 'items': [{'kind': 'car', 'x': 0.5, 'y': 0.72, 't0': 0.0, 's': 1.8}, TX('SHINY.', 0.5, 0.22, 0.1, 90, 'gold', font='title')]}, {'sfx': [{'at': 0.1, 'name': 'shimmer', 'gain': -10}]}),
 (74, ('card'), {'bg': 'street', 'items': [{'kind': 'car', 'x': 0.48, 'y': 0.74, 't0': 0.0, 's': 1.6}, TX('LOUD.', 0.5, 0.22, 0.05, 110, 'accent', font='title')], 'push': 0.15}, {'sfx': [{'at': 0.05, 'name': 'carpass', 'gain': -6}, {'at': 0.1, 'name': 'impact', 'gain': -10}]}),
 (75, *J('street', coins=40, bills=3, drops=[0.9], glow=0.6), {'sfx': [{'at': 1.4, 'name': 'ding', 'gain': -12}]}),
 (77, *F('MAX', [[0, 'happy'], [1.0, 'smirk']], 'street', talk=(78, 78), rimSide=1), {}),
 (79, *F('SAM', 'smirk', 'street', push=0.04), {}),
 (80, *F('SAM', [[0, 'neutral'], [0.8, 'thinking']], 'bedroom', setOpts={'mood': 'night'}, underGlow='#7fb6ff', look=[0.3, 0.6]), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (81, *CH(years=[0, 5], maxX=10, yMax=8000, start=0.0, cdur=3.4, tangents=[1, 3, 5], title='YOUR ACCOUNT', bigText={'str': 'FASTER EACH YEAR', 't0': 2.2, 'size': 60, 'x': 0.4, 'y': 0.36}), {'sfx': [{'at': 0.2, 'name': 'riser', 'gain': -16}]}),
 (83, 'bigLine', {'set': 'blueprint', 'str': "HERE'S THE SECRET", 'size': 90}, {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 0.1, 'name': 'shimmer', 'gain': -10}]}),
 (84, 'crash', {'show': [0, 1], 'start': 0.2, 'cdur': 3.6, 'title': 'US STOCK MARKET · LONG RUN', 'bigText': {'str': '≈10% A YEAR', 't0': 3.2, 'x': 0.5, 'y': 0.3, 'size': 86, 'color': 'gold'}}, {'sfx': [{'at': 3.2, 'name': 'pop', 'gain': -10}]}),
 (85, *CARD([TX('THE RULE OF', 0.5, 0.36, 0.2, 54, 'cream', spacing=8), TX('72', 0.5, 0.56, 0.6, 230, 'gold', font='title')]), {'sfx': [{'at': 0.6, 'name': 'stinger', 'gain': -10}]}),
 (86, *CARD([TX('72', 0.3, 0.5, 0.0, 180, 'gold', font='title'), TX('÷', 0.47, 0.5, 0.4, 140, 'cream'), TX('YOUR RETURN', 0.7, 0.5, 0.8, 70, 'blue')]), {'sfx': [{'at': 0.8, 'name': 'pop', 'gain': -12}]}),
 (87, *CARD([TX('72 ÷ 10', 0.42, 0.5, 0.0, 150, 'cream', font='title'), TX('≈ 7', 0.76, 0.5, 2.3, 170, 'gold', font='title')]), {'sfx': [{'at': 2.3, 'name': 'ding', 'gain': -10}]}),
 (89, 'stacks', {'mode': 'double', 'vals': [1, 2], 'times': [0.2, 1.3], 'stepLabel': '~7 YEARS'}, {'sfx': [{'at': 1.3, 'name': 'pop', 'gain': -10}]}),
 (90, 'stacks', {'mode': 'double', 'vals': [1, 2, 4, 8], 'times': [0.0, 0.0, 0.3, 1.5]}, {'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -10}, {'at': 1.5, 'name': 'pop', 'gain': -8}]}),
 # ===== YEAR 10 =====
 (92, *YC(10, 'kitchen'), {'in': {'type': 'dip', 'dur': 0.4}, 'sfx': [{'at': 0.05, 'name': 'whoosh', 'gain': -10}]}),
 (93, 'compare', {'rows': [{'label': 'YOU PUT IN', 'v': 3650, 'color': 'cream', 't0': 0.4}], 'max': 6000}, {'sfx': [{'at': 0.4, 'name': 'counter', 'gain': -16}]}),
 (94, *PH({'mode': 'balance', 'value': 5817, 'chartP': 0.3}, setOpts={'mood': 'dusk', 'lamp': 1}), {'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -12}]}),
 (95, 'compare', {'rows': [{'label': 'YOU PUT IN', 'v': 3650, 'color': 'cream', 'always': True, 't0': 0, 'dur': 0.01}, {'label': 'THE ACCOUNT', 'v': 5817, 'color': 'gold', 't0': 0.2, 'split': {'t0': 0.9, 'v': 3650, 'label': 'YOU', 'rest': '+$2,000 GROWTH'}}], 'max': 6000}, {'sfx': [{'at': 0.9, 'name': 'ding', 'gain': -12}]}),
 (96, *J('kitchen', coins=24, bills=2, multiply=True, glow=1.1), {'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -14}]}),
 (98, *W('bedroom', [BED_LIE('SAM', 'sleepy')], setOpts={'mood': 'night', 'phone': 1}, cam={'z': [1.05, 1.12], 'x': [-200, -240]}, float=None, readout={'label': 'ACCOUNT', 'value': '+$1 ... +$2 ... +$5', 't0': 0.2}), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (99, *W('street', [A('MAX', 0, 'holdFront', 'determined', 1, s=1.6, hold={'kind': 'jar'})], cam={'z': [1.18, 1.24], 'x': [40, 0], 'y': [-60, -60]}), {'amb': {'name': 'city', 'gain': -26}}),
 (100, *F('MAX', 'determined', 'street', rimSide=1, badge={'str': 'AGE 35'}), {}),
 (101, 'lanes', {'same': [{'str': 'SAME DOLLAR', 't0': 0.1}, {'str': 'SAME MARKET', 't0': 1.2}], 'gap': 2.5}, {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 0.1, 'name': 'pop', 'gain': -12}, {'at': 1.2, 'name': 'pop', 'gain': -12}, {'at': 2.6, 'name': 'hit', 'gain': -10}]}),
 (104, *F('MAX', 'nervous', 'street', push=0.1, rimSide=1), {'bars': 'scope', 'sfx': [{'at': 0.1, 'name': 'heartbeat', 'gain': -12}]}),
 (105, 'compare', {'rows': [{'label': 'MAX · STARTS AT 35', 'who': 'MAX', 'v': 60040, 'color': '#f2c21a', 't0': 1.2, 'dur': 1.6}], 'max': 165000, 'title': 'AT AGE 65'}, {'sfx': [{'at': 1.2, 'name': 'counter', 'gain': -14}]}),
 (107, 'compare', {'rows': [{'label': 'MAX · STARTS AT 35', 'who': 'MAX', 'v': 60040, 'color': '#f2c21a', 'always': True, 't0': 0, 'dur': 0.01}, {'label': 'YOU · START AT 25', 'who': 'SAM', 'v': 161550, 'color': 'gold', 't0': 0.9, 'dur': 1.5}], 'max': 165000, 'title': 'AT AGE 65'}, {'sfx': [{'at': 0.9, 'name': 'counter', 'gain': -12}]}),
 (109, 'compare', {'rows': [{'label': 'MAX', 'who': 'MAX', 'v': 60040, 'color': '#f2c21a', 'always': True, 't0': 0, 'dur': 0.01}, {'label': 'YOU', 'who': 'SAM', 'v': 161550, 'color': 'gold', 'always': True, 't0': 0, 'dur': 0.01}], 'max': 165000, 'diff': {'a': 60040, 'b': 161550, 'label': '−$100,000', 't0': 1.6}}, {'sfx': [{'at': 1.6, 'name': 'impact', 'gain': -8}]}),
 (111, *F('MAX', [[0, 'confused'], [1.2, 'shocked']], 'street', talk=(111, 112), rimSide=1), {}),
 (113, *W('street', [A('SAM', -200, 'stand', 'neutral', 1, s=1.5), A('MAX', 200, 'handsOnHead', 'shocked', -1, s=1.5)], cam={'z': [1.12, 1.18], 'y': [-50, -50]}), {}),
 (114, *CH(years=[0, 40], maxX=40, start=0.0, cdur=3.0, highlight={'a': 30, 'b': 40, 't0': 2.0, 'label': 'THE VERY END'}), {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 0.2, 'name': 'riser', 'gain': -12}, {'at': 2.0, 'name': 'shimmer', 'gain': -10}]}),
 # ===== YEAR 12: the crash =====
 (116, *YC(12, 'street', color='#ff6f61', setOpts={'mood': 'storm', 'rain': True}), {'in': {'type': 'dip', 'dur': 0.4}, 'sfx': [{'at': 0.05, 'name': 'glitch', 'gain': -8}, {'at': 0.2, 'name': 'thunder', 'gain': -10}], 'amb': {'name': 'rain', 'gain': -22}}),
 (118, 'crash', {'show': [0.3, 0.56], 'start': 0.0, 'cdur': 1.4, 'shake': True, 'pct': '−33%', 'pctAt': 1.0, 'badge': 'YEAR 12'}, {'sfx': [{'at': 0.5, 'name': 'impact', 'gain': -4}]}),
 (119, *PH({'mode': 'balance', 'valueStr': '$6,180', 'valueColor': '#ff6f61', 'chip': '−33% IN 3 WEEKS', 'chipColor': '#ff6f61', 'chartColor': '#ff6f61', 'curveType': 'crash', 'chartP': 1}, setOpts={'mood': 'night', 'rain': True}), {'sfx': [{'at': 0.4, 'name': 'glitch', 'gain': -12}]}),
 (120, *W('street', [A('MAX', -60, 'phone', 'nervous', 1, s=1.6, prop='phone')], setOpts={'mood': 'storm', 'rain': True, 'wet': True}, cam={'z': [1.2, 1.3], 'x': [-80, -100], 'y': [-60, -60], 'shake': 2}), {'amb': {'name': 'rain', 'gain': -20}, 'sfx': [{'at': 0.1, 'name': 'phonering', 'gain': -14}]}),
 (121, *F('MAX', 'shocked', 'street', setOpts={'mood': 'storm', 'rain': True}, talk='all', shake=6, rimSide=1, phoneEar=True), {'sfx': [{'at': 0.1, 'name': 'thunder', 'gain': -12}]}),
 (123, *F('SAM', 'neutral', 'kitchen', setOpts={'night': True}, push=0.03, phoneEar=True, rimSide=-1), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (124, *J('kitchen', setOpts={'night': True}, coins=50, bills=3, drops=[0.3, 1.1], glow=0.9), {'sfx': [{'at': 0.8, 'name': 'ding', 'gain': -12}, {'at': 1.6, 'name': 'ding', 'gain': -12}]}),
 (125, 'stacks', {'mode': 'buyMore', 'second': 1.8}, {'sfx': [{'at': 0.2, 'name': 'pop', 'gain': -12}, {'at': 2.0, 'name': 'ding', 'gain': -10}]}),
 (127, 'crash', {'show': [0.5, 1.0], 'start': 0.3, 'cdur': 2.6, 'buys': True, 'bigText': {'str': 'CLIMBING BACK', 't0': 1.9, 'x': 0.68, 'y': 0.3}}, {'sfx': [{'at': 0.4, 'name': 'riser', 'gain': -14}]}),
 (129, 'crash', {'show': [0.55, 1.0], 'start': 0.0, 'cdur': 1.6, 'sold': {'u': 0.55, 't0': 0.2}, 'ghostAfter': 0.55, 'missed': True, 'missedAt': 1.6}, {'sfx': [{'at': 0.2, 'name': 'hit', 'gain': -10}]}),
 (130, *W('street', [A('MAX', 0, 'facepalm', 'sad', 1, s=1.6)], setOpts={'mood': 'dusk'}, cam={'z': [1.2, 1.26], 'y': [-60, -60]}), {'amb': {'name': 'city', 'gain': -28}}),
 (131, 'sharks', {'label': 'CRASHES BRING SHARKS', 'labelAt': 1.0}, {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'wind', 'gain': -24}, 'sfx': [{'at': 1.0, 'name': 'stinger', 'gain': -8}]}),
 (133, *W('lair', [A('MRBLACK', 0, 'crossArms', 'smirk', 1, s=1.7)], cam={'z': [1.25, 1.32], 'x': [60, 20], 'y': [-70, -70]}, rimDir=[0.6, -1]), {'bars': 'scope', 'amb': {'name': 'hum', 'gain': -24}, 'sfx': [{'at': 0.1, 'name': 'stinger', 'gain': -8}]}),
 ((133, 'slides'), *PH({'mode': 'dm', 'name': 'Mr. Black', 'msgs': [[0.3, 'Hey Sam.', 'them']]}, setOpts={'mood': 'night'}), {'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -10}]}),
 (134, *PH({'mode': 'dm', 'name': 'Mr. Black', 'msgs': [[0, 'Hey Sam.', 'them'], [0.1, 'GUARANTEED 20%', 'them', '#a8352a'], [1.95, 'EVERY MONTH', 'them', '#a8352a'], [3.1, 'ZERO RISK', 'them', '#a8352a']]}, setOpts={'mood': 'night'}, push=0.1), {'sfx': [{'at': 0.1, 'name': 'blip', 'gain': -10}, {'at': 1.95, 'name': 'blip', 'gain': -10}, {'at': 3.1, 'name': 'blip', 'gain': -10}]}),
 (137, *F('SAM', 'thinking', 'bedroom', setOpts={'mood': 'night'}, underGlow='#7fb6ff', float=[{'str': '20% × 12', 't0': 0.3, 'dx': 400, 'dy': -250, 'size': 46}]), {}),
 (138, *CARD([{'kind': 'stack', 'x': 0.1 + i * 0.075, 'y': 0.8, 't0': 0.2 + i * 0.25, 'n': max(1, round(1.2 ** (i + 1) * 3)), 'r': 42} for i in range(11)] + [TX('$1', 0.1, 0.88, 0.2, 40, 'gold'), TX('≈ $8.90', 0.86, 0.88, 3.2, 54, 'gold'), TX('ONE YEAR AT 20% A MONTH', 0.5, 0.15, 0.1, 48, 'cream', spacing=3)]), {'sfx': [{'at': 0.2, 'name': 'counter', 'gain': -16}, {'at': 3.2, 'name': 'pop', 'gain': -10}]}),
 (139, *F('MRBLACK', 'smirk', 'lair', rimColor='#3fd0c0', rimSide=1, push=0.08), {'bars': 'scope'}),
 (141, *PH({'mode': 'dm', 'name': 'Mr. Black', 'msgs': [[0, 'GUARANTEED 20%', 'them', '#a8352a'], [0, 'ZERO RISK', 'them', '#a8352a']], 'blockBtn': 0.6, 'blocked': 0.75}, setOpts={'mood': 'night'}, thumb=[[0, [0.5, 0.95]], [0.4, [0.5, 0.88]], [1.0, 'off']]), {'sfx': [{'at': 0.6, 'name': 'blip', 'gain': -10}, {'at': 0.75, 'name': 'hit', 'gain': -8}]}),
 (142, *CARD([TX('REAL RULE', 0.5, 0.18, 0.0, 50, 'cream', spacing=8), TX('"GUARANTEED"', 0.3, 0.45, 1.3, 64, 'gold'), TX('+', 0.5, 0.45, 1.8, 80, 'cream'), TX('"NO RISK"', 0.7, 0.45, 2.6, 64, 'gold'), {'kind': 'stamp', 'str': 'SCAM', 'x': 0.5, 'y': 0.72, 't0': 4.0, 'size': 120}]), {'sfx': [{'at': 4.0, 'name': 'impact', 'gain': -6}]}),
 # ===== YEARS 20-40: compounding =====
 (145, *YC(20, 'kitchen'), {'in': {'type': 'dip', 'dur': 0.5}, 'sfx': [{'at': 0.05, 'name': 'whoosh', 'gain': -10}]}),
 (146, *PH({'mode': 'balance', 'value': 20906, 'chartP': 0.5}, setOpts={'mood': 'dusk', 'lamp': 1}), {'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -12}]}),
 (147, 'compare', {'rows': [{'label': 'YEAR 20', 'v': 20906, 'color': 'gold', 't0': 0.2, 'split': {'t0': 0.6, 'v': 7300, 'label': 'PUT IN $7,300', 'rest': 'PURE GROWTH'}}], 'max': 22000}, {'sfx': [{'at': 0.6, 'name': 'ding', 'gain': -12}]}),
 (150, *YC(25, 'kitchen', sub='≈ $36,000', subAt=1.4), {'in': {'type': 'dip', 'dur': 0.4}, 'sfx': [{'at': 0.05, 'name': 'whoosh', 'gain': -10}, {'at': 1.4, 'name': 'counter', 'gain': -14}]}),
 (152, *NUM(from_=0, to=3600, prefix='+$', label='ONE GOOD YEAR', start=2.4, cdur=1.6, icon='coin', iconS=0.8, sparkle=True), {'sfx': [{'at': 2.4, 'name': 'counter', 'gain': -12}]}),
 (153, 'stacks', {'mode': 'tenJars', 'braceAt': 1.5, 'label': '= TEN YEARS OF DOLLARS'}, {'sfx': [{'at': 1.5, 'name': 'shimmer', 'gain': -12}]}),
 (155, *W('kitchen', [A('SAM', 120, 'phone', 'smile', -1, s=1.6, prop={'type': 'phone'}), A('MAX', -200, [[0, 'stand'], [0.5, 'reach']], 'confused', 1, s=1.6)], cam={'z': [1.18, 1.26], 'y': [-60, -60]}), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (156, *F('MAX', 'confused', 'kitchen', talk=(156, 157), rimSide=1), {}),
 (158, *F('SAM', [[0, 'smile'], [0.8, 'happy']], 'kitchen', talk='all'), {}),
 (160, 'barCity', {}, {'sfx': [{'at': 0.1, 'name': 'riser', 'gain': -10}]}),
 (162, *CH(years=[25, 30], maxX=40, start=0.0, cdur=1.2, markers=[{'y': 30, 'label': '$60K', 't0': 1.3}], yMax=170000, valueTag=False), {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 1.3, 'name': 'pop', 'gain': -10}]}),
 (164, *CH(years=[30, 40], maxX=40, start=0.0, cdur=2.0, markers=[{'y': 30, 'label': '$60K', 't0': 0, 'color': 'cream'}, {'y': 40, 'label': '$160K', 't0': 1.7, 'size': 60}], yMax=170000, valueTag=False), {'sfx': [{'at': 0.0, 'name': 'riser', 'gain': -12}, {'at': 1.7, 'name': 'impact', 'gain': -8}]}),
 (166, *CH(years=[40, 40], maxX=40, cdur=0.1, yMax=170000, valueTag=False, bracket=[{'a': 0, 'b': 30, 'label': 'FIRST 30 YEARS: $60K', 't0': 0.3, 'color': 'cream'}, {'a': 30, 'b': 40, 'label': 'LAST 10: $100K', 't0': 2.6, 'color': 'gold'}], highlight={'a': 30, 'b': 40, 't0': 2.6}), {'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -12}, {'at': 2.6, 'name': 'ding', 'gain': -10}]}),
 (168, *CH(years=[40, 40], maxX=40, cdur=0.1, yMax=170000, valueTag=False, bigText={'str': 'COMPOUNDING', 't0': 0.1, 'x': 0.42, 'y': 0.32, 'size': 110}), {'sfx': [{'at': 0.1, 'name': 'shimmer', 'gain': -8}]}),
 (169, *CH(years=[0, 22], maxX=40, start=0.0, cdur=3.0, yMax=170000, valueTag=False, markers=[{'y': 5, 'label': 'SLOW', 't0': 0.1, 'color': 'cream', 'size': 36}, {'y': 12, 'label': 'SLOW', 't0': 1.0, 'color': 'cream', 'size': 36}, {'y': 20, 'label': 'SLOW', 't0': 2.1, 'color': 'cream', 'size': 36}]), {'sfx': [{'at': 0.1, 'name': 'tick', 'gain': -14}, {'at': 1.0, 'name': 'tick', 'gain': -14}, {'at': 2.1, 'name': 'tick', 'gain': -14}]}),
 (172, *CH(years=[22, 40], maxX=40, start=1.2, cdur=1.0, yMax=170000, bigText={'str': 'SUDDENLY NOT', 't0': 1.5, 'x': 0.4, 'y': 0.3, 'size': 96}), {'bars': 'scope', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.0, 'name': 'riser', 'gain': -10}, {'at': 1.3, 'name': 'impact', 'gain': -4}]}),
 (174, *J('kitchen', coins=6, bills=[[0, 0], [1.6, 1]], billDrop=0.4, billValue='10', glow=1.0), {'sfx': [{'at': 1.6, 'name': 'ding', 'gain': -12}]}),
 (175, *NUM(from_=0, to=1615500, str=None, label='$10 A DAY · 40 YEARS', start=0.2, cdur=1.2, sparkle=True, size=190), {'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.2, 'name': 'counter', 'gain': -10}, {'at': 1.4, 'name': 'stinger', 'gain': -6}]}),
 # ===== THE PRICE =====
 (176, *W('bedroom', [BED_SIT('SAM', 'sad', 'sad')], setOpts={'mood': 'night', 'coins': 40}, cam={'z': [1.0, 1.06], 'x': [-260, -300]}), {'in': {'type': 'dip', 'dur': 0.5}, 'amb': {'name': 'roomtone', 'gain': -28}}),
 (177, 'timeLapse', {'years': [12, 30], 'speed': 7, 'actors': [A('SAM', -420, 'sit', 'sleepy', 1, y=6, s=1.2, shadow=False)]}, {'sfx': [{'at': 0.2, 'name': 'clock', 'gain': -14}]}),
 (179, *W('street', [A('MAX', -120, 'phone', 'joy', 1, s=1.3, prop={'type': 'phone', 'glow': '#c8a8ff'}), A('SAM', 260, 'stand', 'neutral', -1, s=1.3), A('CALLER', -420, 'phone', 'happy', 1, s=1.2, prop='phone'), A('CALLER', 520, 'cheer', 'joy', -1, s=1.1)], cam={'z': [1.05, 1.1], 'x': [0, -40]}), {'amb': {'name': 'murmur', 'gain': -24}}),
 (180, *PH({'mode': 'balance', 'value': 20906, 'chartP': 0.5}, cracked=True, setOpts={'mood': 'dusk'}), {'sfx': [{'at': 0.2, 'name': 'glitch', 'gain': -16}]}),
 (182, *W('street', [A('SAM', 0, 'stand', 'sad', 1, s=1.4), A('CALLER', -420, 'point', 'smirk', 1, s=1.2), A('CALLER', 420, 'point', 'smirk', -1, s=1.2)], cam={'z': [1.1, 1.16], 'y': [-40, -40]}, bigText={'str': '"CHEAP"', 't0': 0.3, 'y': 260, 'color': '#ff6f61', 'size': 80}), {'sfx': [{'at': 0.3, 'name': 'hit', 'gain': -14}]}),
 (183, 'brain', {'mode': 'fight'}, {'in': {'type': 'zoom', 'dur': 0.4}}),
 (184, 'brain', {'mode': 'grab'}, {'sfx': [{'at': 1.0, 'name': 'pop', 'gain': -12}]}),
 (185, *CARD([IC('coin', 0.5, 0.45, 0.1, 2.4), TX('TODAY', 0.5, 0.8, 0.3, 70, 'gold', font='title')]), {'sfx': [{'at': 0.1, 'name': 'ding', 'gain': -12}]}),
 (186, *CARD([IC('coin', 0.5, 0.45, 0.1, 2.4, ghost=True), TX('IN 40 YEARS?', 0.5, 0.8, 0.5, 70, 'blue', font='title', ghost=True)]), {'sfx': [{'at': 0.1, 'name': 'slowmo', 'gain': -14}]}),
 (187, 'bigLine', {'set': 'blueprint', 'lines': ['ANOTHER CATCH:', 'INFLATION'], 'stagger': 1.3, 'colors': ['#fff1dc', '#ff6f61'], 'sizes': [60, 120], 'gap': 140}, {'sfx': [{'at': 1.4, 'name': 'stinger', 'gain': -8}]}),
 (189, *CARD([IC('cup', 0.3, 0.5, 0.1, 2.0), {'kind': 'tag', 'str': '+3% A YEAR', 'x': 0.65, 'y': 0.35, 't0': 1.5, 'size': 56}, {'kind': 'arrow', 'from': [0.5, 0.75], 'to': [0.85, 0.55], 't0': 2.6, 'color': 'accent'}, TX('LONG-RUN AVERAGE', 0.65, 0.85, 3.6, 40, 'cream', spacing=4)]), {'sfx': [{'at': 1.5, 'name': 'pop', 'gain': -12}]}),
 (190, *CARD([IC('cup', 0.25, 0.5, 0.0, 1.6), {'kind': 'tag', 'str': '$5', 'x': 0.25, 'y': 0.78, 't0': 0.2}, TX('→', 0.5, 0.5, 0.6, 120, 'cream'), IC('cup', 0.75, 0.5, 0.9, 1.6), {'kind': 'tag', 'str': '$16', 'x': 0.75, 'y': 0.78, 't0': 1.3, 'size': 64}, TX('×3 IN 40 YEARS', 0.5, 0.15, 2.0, 64, 'accent', font='title')]), {'sfx': [{'at': 1.3, 'name': 'pop', 'gain': -10}, {'at': 2.0, 'name': 'hit', 'gain': -12}]}),
 (191, 'stacks', {'mode': 'shrink', 'shrinkAt': 2.4}, {'sfx': [{'at': 2.4, 'name': 'slowmo', 'gain': -12}]}),
 (194, *W('bedroom', [BED_SIT('SAM', 'stand', [[0, 'neutral'], [1.6, 'smile']])], setOpts={'mood': 'night', 'coins': 40, 'jarGlow': 1.2, 'lamp': 0.6}, cam={'z': [1.15, 1.22], 'x': [-200, -150], 'y': [-50, -50]}), {'amb': {'name': 'roomtone', 'gain': -28}}),
 # ===== MOM =====
 (197, 'house3D', {'mood': 'golden', 'label': None}, {'in': {'type': 'fade', 'dur': 0.6}, 'amb': {'name': 'wind', 'gain': -28}, 'sfx': [{'at': 0.1, 'name': 'whoosh', 'gain': -16}]}),
 (199, *W('houseExt', [A('SAM', -700, 'stand', 'smile', 1, s=0.9, walk={'x1': -100, 't0': 0.0})], setOpts={'mood': 'golden', 'porch': 0.6}, cam={'z': [1.0, 1.05], 'x': [-100, 0]}, badge={'str': 'SUNDAY', 't0': 0.2}), {'sfx': [{'at': 0.3, 'name': 'footstep', 'gain': -18}, {'at': 0.9, 'name': 'footstep', 'gain': -18}]}),
 (200, *W('kitchen', [SAM_SIT('smile'), MOM_SIT('smile')], tableItems=[{'kind': 'tea', 'x': -90}, {'kind': 'tea', 'x': 90}], cam={'z': [1.02, 1.08], 'x': [-20, 20]}, badge={'str': 'SUNDAY #412', 't0': 0.3}, **KITCHEN_TABLE), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (201, *F('MOM', 'smile', 'kitchen', talk='all', rimSide=1), {}),
 (202, *F('SAM', 'happy', 'kitchen', talk='all'), {}),
 (203, *W('bedroom', [], setOpts={'mood': 'night', 'coins': 50, 'jarGlow': 1.2}, cam={'z': [2.0, 2.25], 'x': [-160, -150], 'y': [-400, -405]}), {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'roomtone', 'gain': -28}}),
 (204, *J('bedroom', setOpts={'mood': 'night'}, coins=50, bills=3, note='front', glow=0.9, js=1.1, push=0.14), {}),
 (205, 'noteMacro', {'set': 'bedroom', 'warm': True}, {'sfx': [{'at': 0.2, 'name': 'shimmer', 'gain': -14}]}),
 ((206, 'There'), 'noteMacro', {'set': 'bedroom', 'ghost': True}, {}),
 (207, *F('SAM', 'thinking', 'bedroom', setOpts={'mood': 'night'}, look=[-0.6, -0.4]), {}),
 (208, 'noteMacro', {'set': 'bedroom', 'flip': [0.3, 1.1], 'backLines': ['~~ ~~~ ~~~~', '~~~~ ~~ ~~~'], 'ghost': True}, {'sfx': [{'at': 0.3, 'name': 'swish', 'gain': -14}]}),
 (209, *W('bedroom', [BED_SIT('SAM', 'sad', 'worried')], setOpts={'mood': 'night', 'coins': 50}, cam={'z': [1.1, 1.16], 'x': [-300, -340], 'y': [-30, -30]}), {}),
 (211, *W('factory', [A('MOM', -60, 'holdFront', 'sleepy', 1, s=1.5), A('CALLER', -480, 'holdFront', 'sleepy', 1, s=1.3, dim=True), A('CALLER', 380, 'holdFront', 'sleepy', 1, s=1.3, dim=True)], cam={'z': [1.1, 1.16], 'x': [0, -40], 'y': [-50, -50]}, badge={'str': '30 YEARS', 't0': 0.4}, flashback=True), {'in': {'type': 'dip', 'dur': 0.5}, 'amb': {'name': 'hum', 'gain': -22}}),
 (212, *W('kitchen', [A('MOM', 120, 'sit', 'sad', -1, s=1.3, shadow=False)], setOpts={'night': True}, chairs=[{'x': 120, 'facing': -1, 's': 1.3}], table=True, tableX=-260, tableItems=[{'kind': 'paper', 'x': -340}], cam={'z': [1.15, 1.2], 'x': [0, -30], 'y': [-50, -50]}, readout={'label': 'INVESTED:', 'value': '$0', 't0': 0.6, 'color': '#ff6f61'}, flashback=True), {}),
 (213, *F('MOM', [[0, 'sad'], [1.8, 'smile']], 'kitchen', talk='all', rimSide=1), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (215, *W('street', [A('SAM', -200, 'stand', 'smile', 1, s=1.5), A('MAX', 200, [[0, 'stand'], [0.4, 'point']], 'joy', -1, s=1.5)], cam={'z': [1.12, 1.18], 'y': [-50, -50]}), {'amb': {'name': 'city', 'gain': -26}}),
 (216, *F('MAX', 'happy', 'street', talk='all', rimSide=1), {}),
 # ===== YEAR 33: the call =====
 (218, *YC(33, 'bedroom', color='#cfe0ff', setOpts={'rain': True}), {'in': {'type': 'dip', 'dur': 0.6}, 'sfx': [{'at': 0.05, 'name': 'whoosh', 'gain': -10}], 'amb': {'name': 'rain', 'gain': -24}}),
 (219, *W('bedroom', [BED_LIE()], setOpts={'phone': 0, 'rain': True}, cam={'z': [1.2, 1.3], 'x': [-420, -440], 'y': [-30, -30]}, badge={'str': '3:00 AM', 't0': 0.2}), {'bars': 'scope'}),
 (220, *PH({'mode': 'call', 'name': 'MOM', 'clock': '3:00', 'avatar': '#8a5ad6'}, buzz=[0, 1.6], setOpts={'rain': True}, who='SAM_OLD'), {'bars': 'scope', 'sfx': [{'at': 0.1, 'name': 'phonebuzz', 'gain': -8}]}),
 (221, *F('MOM_OLD', 'cry', 'kitchen', setOpts={'night': True}, talk='all', phoneEar=True, rimSide=1, shake=1.5), {'bars': 'scope'}),
 (223, 'split', {'left': {'tpl': 'wide', 'set': 'kitchen', 'setOpts': {'night': True}, 'actors': [A('MOM_OLD', -20, 'phone', 'worried', 1, s=1.5, prop='phone')], 'cam': {'z': [1.15, 1.2], 'x': [0, 0], 'y': [-60, -60]}}, 'right': {'tpl': 'wide', 'set': 'lair', 'actors': [A('CALLER', 20, 'phone', 'smirk', -1, s=1.5, prop='phone')], 'cam': {'z': [1.15, 1.2], 'x': [0, 0], 'y': [-60, -60]}, 'rimDir': [-0.6, -1]}}, {'amb': {'name': 'hum', 'gain': -28}}),
 (224, 'scamCenter', {'dialing': True, 'dialer': 0, 'bigText': {'str': '"YOUR BANK"', 't0': 0.3, 'y': 200, 'color': '#9fc0ff'}}, {'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -14}]}),
 (225, *PH({'mode': 'balance', 'header': 'BANK', 'valueStr': 'ACCOUNT HACKED!', 'valueColor': '#ff6f61', 'label': 'FAKE ALERT', 'chartP': 0}, set_='kitchen', setOpts={'night': True}, who='MOM_OLD', sleeve='#8a5ad6', buzz=[0, 3]), {'sfx': [{'at': 0.1, 'name': 'glitch', 'gain': -10}]}),
 (226, *PH({'mode': 'transfer', 'from0': 15000, 'from1': 0, 'to0': 0, 'to1': 15000, 'fromLabel': "MOM'S SAVINGS", 'toLabel': "'SAFE ACCOUNT'", 'toColor': '#ff6f61', 'tStart': 0.8, 'tDur': 1.6}, set_='kitchen', setOpts={'night': True}, who='MOM_OLD', sleeve='#8a5ad6'), {'sfx': [{'at': 0.8, 'name': 'counter', 'gain': -14}]}),
 (227, *F('MOM_OLD', 'nervous', 'kitchen', setOpts={'night': True}, phoneEar=True, voice=True, voiceColor='#ff6f61', voiceShake=True, rimSide=1, shake=3, float=[{'str': 'RIGHT NOW!', 't0': 0.0, 'dx': -480, 'dy': -260, 'color': '#ff6f61', 'size': 50}, {'str': 'HURRY!', 't0': 1.2, 'dx': 470, 'dy': -200, 'color': '#ff6f61', 'size': 50}]), {'sfx': [{'at': 0.0, 'name': 'clock', 'gain': -10}, {'at': 0.2, 'name': 'heartbeat', 'gain': -10}]}),
 (229, *PH({'mode': 'transfer', 'from0': 15000, 'from1': 0, 'to0': 0, 'to1': 15000, 'fromLabel': "MOM'S SAVINGS", 'toLabel': "'SAFE ACCOUNT'", 'toColor': '#ff6f61', 'tStart': 0.3, 'tDur': 0.8}, set_='kitchen', setOpts={'night': True}, who='MOM_OLD', sleeve='#8a5ad6', thumb=[[0, [0.5, 0.5]], [0.3, 'off']]), {'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -10}]}),
 (230, *NUM(from_=15000, to=0, label="MOM'S WHOLE LIFE SAVINGS", start=1.6, cdur=1.4, color='accent', str=None, bg='kitchen', bgOpts={'night': True}, sub='GONE', subAt=3.2, subColor='accent'), {'sfx': [{'at': 1.6, 'name': 'counter', 'gain': -12}, {'at': 3.2, 'name': 'impact', 'gain': -8}]}),
 (232, *W('kitchen', [A('MOM_OLD', 120, 'sit', 'sad', -1, s=1.3, shadow=False)], setOpts={'night': True}, chairs=[{'x': 120, 'facing': -1, 's': 1.3}], table=True, tableX=-260, tableItems=[{'kind': 'phone', 'x': -300, 'glow': True}], cam={'z': [1.0, 1.06], 'x': [-40, -80]}), {'amb': {'name': 'roomtone', 'gain': -30}}),
 (233, *F('MOM_OLD', 'cry', 'kitchen', setOpts={'night': True}, talk='all', rimSide=1, phoneEar=True), {}),
 (234, *F('SAM_OLD', 'sad', 'bedroom', setOpts={'rain': True}, talk='all', phoneEar=True, rimSide=-1), {}),
 (235, 'scamCenter', {'boss': True}, {'amb': {'name': 'hum', 'gain': -24}, 'sfx': [{'at': 0.2, 'name': 'murmur', 'gain': -20}]}),
 (236, 'brain', {'mode': 'urgent'}, {'sfx': [{'at': 0.1, 'name': 'clock', 'gain': -12}, {'at': 0.3, 'name': 'heartbeat', 'gain': -12}]}),
 (238, *W('houseExt', [], setOpts={'mood': 'night', 'momInWindow': True}, cam={'z': [1.0, 1.08]}, bigText={'str': 'PAYMENT DUE: 9 DAYS', 't0': 1.2, 'y': 170, 'color': '#ff6f61', 'size': 64}), {'amb': {'name': 'wind', 'gain': -26}, 'sfx': [{'at': 1.2, 'name': 'clock', 'gain': -12}]}),
 (239, 'house3D', {'mood': 'night', 'label': '40 YEARS IN THIS HOUSE', 'labelAt': 1.6, 'labelColor': '#ffd59a'}, {'sfx': [{'at': 0.1, 'name': 'wind', 'gain': -20}]}),
 (241, *PH({'mode': 'logo'}, setOpts={'rain': True}, who='SAM_OLD', thumb=[[0, [0.5, 0.75]], [0.5, 'off']]), {'bars': 'scope', 'amb': {'name': 'rain', 'gain': -24}}),
 (242, *PH({'mode': 'balance', 'value': 81042, 'chartP': 1}, setOpts={'rain': True}, who='SAM_OLD', push=0.12), {'bars': 'scope', 'sfx': [{'at': 0.2, 'name': 'blip', 'gain': -12}]}),
 (243, *F('SAM_OLD', 'worried', 'bedroom', setOpts={'rain': True}, echo={'str': 'Don\'t touch.', 't0': 0.3}, voice=True, voiceColor='#cfe0ff'), {'bars': 'scope', 'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -12}]}),
 (244, *J('bedroom', setOpts={'rain': True}, coins=40, bills=3, sprout=[[0, 1]], glow=0.5, pull={'t0': 0.1, 'greyAt': 2.0, 'label': 'FOREVER'}, tint=['#1a2a50', 0.25, 'color']), {'bars': 'scope', 'sfx': [{'at': 0.2, 'name': 'swish', 'gain': -12}, {'at': 2.0, 'name': 'glitch', 'gain': -12}]}),
 (247, *F('SAM_OLD', 'thinking', 'bedroom', setOpts={'rain': True}, underGlow='#7fb6ff'), {'bars': 'scope'}),
 (248, 'stacks', {'mode': 'ghost', 'ghostAt': 1.6}, {'sfx': [{'at': 1.6, 'name': 'counter', 'gain': -14}]}),
 (250, 'stacks', {'mode': 'ghost', 'ghostAt': 0.0, 'crumbleAt': 1.7}, {'sfx': [{'at': 1.7, 'name': 'impact', 'gain': -8}]}),
 (252, *W('bedroom', [A('MAX', 160, 'stand', 'worried', -1, s=1.5), A('SAM_OLD', -160, 'phone', 'worried', 1, s=1.5, prop='phone')], setOpts={'rain': True, 'lamp': 0.8}, cam={'z': [1.2, 1.26], 'x': [-80, -60], 'y': [-60, -60]}), {'amb': {'name': 'rain', 'gain': -24}}),
 (253, *F('MAX', 'worried', 'bedroom', setOpts={'rain': True, 'lamp': 0.8}, talk='all', rimSide=1), {}),
 (255, *W('bedroom', [A('SAM_OLD', -260, 'stand', 'thinking', 1, s=1.5, look=[0.6, -0.6])], setOpts={'rain': True, 'jarGlow': 1.4, 'coins': 50}, cam={'z': [1.3, 1.36], 'x': [-100, -80], 'y': [30, 30]}), {}),
 (256, *J('bedroom', setOpts={'rain': True}, coins=50, bills=3, note='front', glow=1.0, badge={'str': '33 YEARS'}), {'sfx': [{'at': 0.2, 'name': 'shimmer', 'gain': -14}]}),
 (257, *J('bedroom', setOpts={'rain': True}, coins=50, bills=3, note='front', glow=0.6, dust=1, js=1.25, push=0.1), {}),
 (258, 'crash', {'show': [0.4, 0.56], 'start': 0.0, 'cdur': 0.8, 'flashback': True, 'title': 'THE CRASH'}, {'sfx': [{'at': 0.1, 'name': 'swish', 'gain': -14}]}),
 (259, *PH({'mode': 'balance', 'value': 20906, 'chartP': 0.5}, cracked=True, setOpts={'mood': 'dusk'}, flashback=True), {'sfx': [{'at': 0.1, 'name': 'swish', 'gain': -14}]}),
 (260, *W('street', [A('MAX', -220, 'cheer', 'joy', 1, s=1.2)], items=[{'kind': 'car', 'x': -560, 'y': 60, 's': 0.95, 'shine': True}], cam={'z': [1.08, 1.14], 'x': [-260, -300], 'y': [20, 20]}, flashback=True), {'sfx': [{'at': 0.1, 'name': 'swish', 'gain': -14}]}),
 (261, *J('bedroom', setOpts={'rain': True}, coins=50, bills=3, note='front', glow=1.2, js=1.1), {'sfx': [{'at': 0.1, 'name': 'heartbeat', 'gain': -12}]}),
 (262, 'split', {'left': {'tpl': 'phone', 'set': 'bedroom', 'setOpts': {'rain': True}, 'app': {'mode': 'balance', 'value': 81042, 'chartP': 1}, 'who': 'SAM_OLD', 'hand': False}, 'right': {'tpl': 'face', 'who': 'MOM_OLD', 'expr': 'sad', 'set': 'kitchen', 'setOpts': {'night': True}, 'rimSide': 1}}, {'bars': 'scope', 'sfx': [{'at': 0.0, 'name': 'heartbeat', 'gain': -10}]}),
 (264, *J('bedroom', setOpts={'rain': True}, coins=50, bills=3, note='front', glow=1.0, reach=0.0, who='SAM_OLD'), {'sfx': [{'at': 0.2, 'name': 'swish', 'gain': -14}]}),
 (265, 'freezeNote', {'flipTo': 1, 'flipAt': 1.4}, {'bars': 'scope', 'in': {'type': 'flash', 'dur': 0.4}, 'sfx': [{'at': 0.0, 'name': 'freeze', 'gain': -5}, {'at': 1.4, 'name': 'slowmo', 'gain': -10}]}),
 (267, *F('SAM_OLD', [[0, 'surprised'], [1.0, 'awe']], 'bedroom', setOpts={'rain': True}, underGlow='#ffcf8a', push=0.1), {'bars': 'scope', 'sfx': [{'at': 0.1, 'name': 'shimmer', 'gain': -12}]}),
 (269, 'noteMacro', {'set': 'bedroom', 'back': True, 'warm': True, 'reveal': 0.1}, {'bars': 'scope', 'sfx': [{'at': 0.1, 'name': 'shimmer', 'gain': -8}]}),
 ((269, 'You'), *F('SAM_OLD', 'joy', 'bedroom', setOpts={'rain': True, 'lamp': 1}, rimColor='#ffcf8a'), {}),
 (270, *F('SAM_OLD', 'cry', 'bedroom', setOpts={'rain': True, 'lamp': 1}, rimColor='#ffcf8a', r=1.1, fx=-60), {}),
 (271, *PH({'mode': 'balance', 'value': 81042, 'button': 'WITHDRAW', 'btnPress': 0.6, 'chartP': 1}, thumb=[[0, 'hover'], [0.35, 'press']], pressAt=0.35, setOpts={'rain': True, 'lamp': 1}, who='SAM_OLD'), {'sfx': [{'at': 0.6, 'name': 'impact', 'gain': -6}]}),
 (272, *PH({'mode': 'transfer', 'from0': 81042, 'from1': 66042, 'to0': 0, 'to1': 15000, 'tStart': 0.4, 'tDur': 2.8}, setOpts={'rain': True, 'lamp': 1}, who='SAM_OLD', push=0.1), {'sfx': [{'at': 0.4, 'name': 'counter', 'gain': -12}, {'at': 3.2, 'name': 'ding', 'gain': -8}]}),
 (275, *PH({'mode': 'call', 'name': 'MOM', 'avatar': '#8a5ad6', 'bg': ['#2a2040', '#1a1424'], 'ringColor': '#ffcf8a'}, setOpts={'lamp': 1}, buzz=[0, 1.2], who='SAM_OLD', thumb=[[0, 'off'], [1.0, 'press']], pressAt=1.0), {'sfx': [{'at': 0.1, 'name': 'phonering', 'gain': -12}]}),
 (276, *F('MOM_OLD', [[0, 'smile'], [0.8, 'happy']], 'kitchen', setOpts={'mood': 'interiorWarm'}, phoneEar=True, rimSide=1, rimColor='#ffcf8a'), {'amb': {'name': 'roomtone', 'gain': -30}}),
 (277, *F('SAM_OLD', 'determined', 'bedroom', setOpts={'lamp': 1}, push=0.08), {'sfx': [{'at': 0.1, 'name': 'whoosh', 'gain': -14}]}),
 (278, *PH({'mode': 'call', 'name': '(555) 013-7744', 'sub': 'last call · 3:02 AM', 'avatar': '#1d1a24', 'initial': '?', 'redFlag': 'SCAMMER', 'bg': ['#1a1020', '#0b0a16']}, setOpts={'lamp': 1}, who='SAM_OLD'), {'sfx': [{'at': 0.2, 'name': 'blip', 'gain': -12}]}),
 (279, *W('office', [A('SAM_OLD', -330, 'talk', 'determined', 1, s=1.4, talk=(279, 279)), A('BANKER', 340, 'explain', 'worried', -1, s=1.4)], desk=True, setOpts={'sign': 'BANK'}, cam={'z': [1.08, 1.14], 'y': [-40, -40]}), {'in': {'type': 'whip', 'dur': 0.35}, 'amb': {'name': 'roomtone', 'gain': -28}, 'sfx': [{'at': 0.0, 'name': 'swish', 'gain': -12}]}),
 (280, *W('office', [A('SAM_OLD', -330, 'explain', 'determined', 1, s=1.4), A('OFFICER', 340, 'think', 'determined', -1, s=1.4)], desk=True, setOpts={'sign': 'POLICE', 'signColor': '#9fc0ff', 'police': True}, cam={'z': [1.08, 1.14], 'x': [40, 0], 'y': [-40, -40]}), {'in': {'type': 'whip', 'dur': 0.35}, 'sfx': [{'at': 0.0, 'name': 'swish', 'gain': -12}]}),
 (281, *W('street', [A('SAM_OLD', -600, 'stand', 'determined', 1, s=1.1, walk={'x1': 100, 't0': 0.0}), A('NEIGHBOR', 360, [[0, 'stand'], [1.4, 'wave']], 'surprised', -1, s=1.1)], setOpts={'mood': 'golden'}, cam={'z': [1.0, 1.06], 'x': [-120, 0]}), {'in': {'type': 'whip', 'dur': 0.35}, 'amb': {'name': 'city', 'gain': -26}, 'sfx': [{'at': 0.0, 'name': 'swish', 'gain': -12}]}),
 (282, *CARD([IC('bank', 0.5, 0.36, 0.1, 1.8), TX('REAL BANKS NEVER ASK YOU', 0.5, 0.62, 0.6, 56, 'cream'), TX("TO MOVE MONEY TO A 'SAFE ACCOUNT'", 0.5, 0.72, 1.4, 56, 'gold'), {'kind': 'stamp', 'str': 'EVER.', 'x': 0.5, 'y': 0.88, 't0': 3.95, 'size': 70}]), {'in': {'type': 'zoom', 'dur': 0.4}, 'sfx': [{'at': 3.95, 'name': 'impact', 'gain': -6}]}),
 (284, 'split', {'left': {'tpl': 'scamCenter', 'dialing': True, 'dialer': 0}, 'right': {'tpl': 'wide', 'set': 'kitchen', 'setOpts': {'mood': 'interiorWarm'}, 'actors': [A('NEIGHBOR', 0, 'phone', 'neutral', 1, s=1.5, prop='phone')], 'cam': {'z': [1.15, 1.2], 'x': [0, 0], 'y': [-60, -60]}}, 'badge': {'str': '2 WEEKS LATER', 't0': 0.2}}, {'in': {'type': 'dip', 'dur': 0.4}, 'sfx': [{'at': 0.5, 'name': 'phonering', 'gain': -14}]}),
 (285, *W('kitchen', [A('NEIGHBOR', 0, [[0, 'phone'], [0.4, 'crossArms']], 'smirk', 1, s=1.6)], setOpts={'mood': 'interiorWarm'}, cam={'z': [1.2, 1.26], 'y': [-60, -60]}), {'sfx': [{'at': 0.4, 'name': 'blip', 'gain': -10}]}),
 (286, *W('kitchen', [A('NEIGHBOR', 0, 'phone', 'determined', 1, s=1.6, prop='phone', rimColor='#9fc0ff')], setOpts={'mood': 'interiorWarm'}, cam={'z': [1.2, 1.26], 'y': [-60, -60]}, tint=['#3a5aff', 0.08, 'source-over'], bigText={'str': 'CALLING POLICE', 't0': 0.4, 'y': 140, 'color': '#9fc0ff', 'size': 64}), {'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -12}]}),
 # ===== RESOLUTION =====
 (287, 'timeLapse', {'set': 'kitchen', 'years': [33, 40], 'speed': 6, 'actors': [A('SAM_OLD', -140, 'stand', 'smile', 1, s=1.2)], 'cam': {'z': [1.0, 1.04]}}, {'in': {'type': 'dip', 'dur': 0.5}, 'sfx': [{'at': 0.1, 'name': 'clock', 'gain': -14}]}),
 (288, *W('kitchen', [A('SAM_OLD', -60, 'phone', 'smile', 1, s=1.6, prop='phone')], cam={'z': [1.2, 1.26], 'y': [-60, -60]}, badge={'str': 'AGE 65', 't0': 0.3}), {'amb': {'name': 'roomtone', 'gain': -28}}),
 (289, *PH({'mode': 'balance', 'value': 161550, 'strike': 0.5, 'chartP': 1}, set_='kitchen'), {'sfx': [{'at': 0.5, 'name': 'swish', 'gain': -14}]}),
 (290, *PH({'mode': 'balance', 'value': 130000, 'chip': 'ABOUT $130K', 'chipColor': '#ffd47e', 'chartP': 1}, set_='kitchen'), {'sfx': [{'at': 0.3, 'name': 'ding', 'gain': -10}]}),
 (291, 'compare', {'rows': [{'label': 'THE PLAN', 'v': 161550, 'color': 'cream', 'dashed': True, 't0': 0.1, 'dur': 0.6}, {'label': 'YOU', 'who': 'SAM_OLD', 'v': 130000, 'color': 'gold', 't0': 0.4, 'dur': 0.8, 'check': 1.5}], 'max': 170000, 'title': 'LESS THAN THE PLAN · MORE THAN ENOUGH'}, {'sfx': [{'at': 1.5, 'name': 'ding', 'gain': -8}]}),
 (293, *W('kitchen', [A('MOM_OLD', 0, 'sit', 'smile', 1, s=1.3, shadow=False)], chairs=[{'x': 0, 'facing': 1, 's': 1.3}], table=True, tableX=420, tableItems=[{'kind': 'tea', 'x': 340}], cam={'z': [1.05, 1.12], 'x': [100, 120]}, badge={'str': 'AGE 90', 't0': 0.3}), {'in': {'type': 'fade', 'dur': 0.4}, 'amb': {'name': 'roomtone', 'gain': -28}}),
 (294, *W('kitchen', [SAM_SIT('smile', who='SAM_OLD'), MOM_SIT('happy', who='MOM_OLD', pose=[[0, 'sit'], [0.4, {'head': [4, -180], 'sh': [1, -146], 'hip': [0, -72], 'eF': [22, -150], 'hF': [36, -196], 'eB': [10, -110], 'hB': [30, -84], 'kF': [44, -74], 'fF': [46, 0], 'kB': [40, -72], 'fB': [38, 0]}]], hold='tea')], tableItems=[{'kind': 'tea', 'x': -90}], cam={'z': [1.06, 1.12]}, **KITCHEN_TABLE), {}),
 (295, *F('MOM_OLD', 'happy', 'kitchen', talk='all', rimSide=1), {}),
 (297, *F('SAM_OLD', 'smile', 'kitchen'), {}),
 (298, *W('kitchen', [SAM_SIT('happy', who='SAM_OLD', talk=(298, 298)), MOM_SIT('joy', who='MOM_OLD')], tableItems=[{'kind': 'tea', 'x': -90}, {'kind': 'tea', 'x': 90}], cam={'z': [1.12, 1.2], 'y': [-30, -30]}, **KITCHEN_TABLE), {'sfx': [{'at': 0.4, 'name': 'shimmer', 'gain': -14}]}),
 (299, *W('kitchen', [A('MAX', -150, [[0, 'stand'], [0.4, 'reach']], 'smile', 1, s=1.5, hold={'kind': 'jar', 'coins': 0, 'bills': 1}), A('MIA', 150, [[0, 'stand'], [1.4, 'reach']], [[0, 'surprised'], [1.6, 'joy']], -1, s=1.5)], cam={'z': [1.15, 1.22], 'y': [-80, -80]}), {}),
 ((299, 'glass'), *J('kitchen', coins=0, bills=1, glow=1.3, push=0.1), {'sfx': [{'at': 0.2, 'name': 'shimmer', 'gain': -10}]}),
 (300, 'house3D', {'mood': 'golden', 'move': 'pullout', 'family': True}, {'sfx': [{'at': 0.1, 'name': 'whoosh', 'gain': -16}]}),
 # ===== IS IT REAL? =====
 (302, 'bigLine', {'set': 'blueprint', 'str': 'IS ANY OF THIS REAL?', 'size': 92}, {'in': {'type': 'dip', 'dur': 0.6}, 'sfx': [{'at': 0.1, 'name': 'shimmer', 'gain': -10}]}),
 (304, *CARD([IC('check', 0.5, 0.42, 0.0, 2.2, color='good'), TX('MOSTLY, YES.', 0.5, 0.7, 0.3, 80, 'good', font='title')]), {'sfx': [{'at': 0.1, 'name': 'ding', 'gain': -10}]}),
 (305, 'pie', {'label': 'THE S&P 500', 'sub': '500 BIG US COMPANIES', 'subAt': 2.0}, {'sfx': [{'at': 0.3, 'name': 'pop', 'gain': -12}]}),
 ((305, 'has'), 'crash', {'show': [0, 1], 'start': 0.2, 'cdur': 3.0, 'title': 'S&P 500 · LONG RUN', 'bigText': {'str': '≈10% A YEAR', 't0': 2.2, 'x': 0.5, 'y': 0.3, 'size': 86, 'color': 'gold'}}, {'sfx': [{'at': 2.2, 'name': 'pop', 'gain': -10}]}),
 ((305, 'with'), *CARD([IC('coin', 0.3, 0.45, 0.0, 1.2), {'kind': 'arrow', 'from': [0.38, 0.45], 'to': [0.6, 0.45], 't0': 0.3, 'color': 'gold'}, IC('jar', 0.72, 0.52, 0.5, 1.2), TX('DIVIDENDS REINVESTED', 0.5, 0.8, 0.6, 60, 'gold')]), {'sfx': [{'at': 0.5, 'name': 'ding', 'gain': -12}]}),
 (306, *CARD([TX('AVERAGE', 0.3, 0.5, 0.0, 84, 'gold', font='title'), TX('≠', 0.5, 0.5, 0.6, 120, 'accent'), TX('PROMISE', 0.7, 0.5, 1.0, 84, 'cream', font='title')]), {'sfx': [{'at': 0.6, 'name': 'hit', 'gain': -12}]}),
 (307, *CARD([TX('2008', 0.5, 0.25, 0.0, 120, 'cream', font='title'), {'kind': 'arrow', 'from': [0.5, 0.42], 'to': [0.5, 0.75], 't0': 2.0, 'color': 'accent'}, TX('−37%', 0.5, 0.86, 2.4, 130, 'accent', font='title'), TX('IN ONE YEAR', 0.78, 0.86, 3.6, 40, 'cream')]), {'sfx': [{'at': 2.4, 'name': 'impact', 'gain': -6}]}),
 (308, *CARD([TX('PAST RETURNS', 0.5, 0.36, 0.1, 80, 'cream', font='title'), TX('NEVER GUARANTEE', 0.5, 0.52, 1.2, 64, 'accent'), TX('FUTURE ONES', 0.5, 0.66, 2.0, 80, 'cream', font='title')]), {'sfx': [{'at': 1.2, 'name': 'hit', 'gain': -12}]}),
 (309, *CARD([TX('1976', 0.5, 0.36, 0.1, 170, 'gold', font='title'), TX('FIRST INDEX FUND FOR EVERYDAY INVESTORS', 0.5, 0.62, 1.6, 50, 'cream')]), {'sfx': [{'at': 0.1, 'name': 'stinger', 'gain': -10}]}),
 ((309, 'started'), *CARD([{'kind': 'figure', 'x': 0.38, 'y': 0.72, 't0': 0.0, 's': 1.4, 'pose': 'explain'}, TX('JOHN BOGLE', 0.64, 0.45, 0.4, 76, 'gold', font='title'), TX('FOUNDER', 0.64, 0.56, 0.8, 40, 'cream', spacing=6)]), {'sfx': [{'at': 0.4, 'name': 'pop', 'gain': -12}]}),
 (310, *J('kitchen', coins=30, bills=2, glow=0.6, label='FEES', labelAt=0.2, multiply=False), {'sfx': [{'at': 0.2, 'name': 'pop', 'gain': -12}]}),
 (311, *CH(years=[0, 40], maxX=40, start=0.2, cdur=2.6, yMax=170000, lines=[{'rate': 0.1, 'color': 'gold', 'label': 'NO EXTRA FEES'}, {'rate': 0.09, 'color': 'accent', 'label': '1% FEES', 'dy': 60}], valueTag=False), {'sfx': [{'at': 0.3, 'name': 'riser', 'gain': -16}]}),
 (312, *CH(years=[40, 40], maxX=40, cdur=0.1, yMax=170000, lines=[{'rate': 0.1, 'color': 'gold'}, {'rate': 0.09, 'color': 'accent'}], valueTag=False, markers=[{'y': 40, 'label': '$160K', 't0': 0.2}, {'y': 40, 'line': 1, 'label': '$123K', 't0': 3.2, 'color': 'accent', 'dy': 110}]), {'sfx': [{'at': 3.2, 'name': 'hit', 'gain': -8}]}),
 (313, *CARD([TX('NOT FINANCIAL ADVICE', 0.5, 0.42, 0.0, 80, 'cream', font='title'), TX('JUST MATH.', 0.5, 0.6, 2.0, 90, 'gold', font='title')]), {'sfx': [{'at': 2.0, 'name': 'ding', 'gain': -12}]}),
 (315, 'clockBig', {'label': 'THE MOST POWERFUL FORCE', 'labelAt': 0.8, 'speed': 2000}, {'sfx': [{'at': 0.1, 'name': 'clock', 'gain': -10}]}),
 (316, 'bigLine', {'set': 'kitchen', 'lines': ['What does waiting one more year', 'really cost you?'], 'serif': True, 'sizes': [64, 80], 'stagger': 1.4, 'color': '#fff1dc'}, {'bars': 'scope', 'sfx': [{'at': 1.4, 'name': 'shimmer', 'gain': -12}]}),
 # ===== EPILOGUE =====
 (317, *W('bedroom', [BED_LIE('SAM_OLD', 'neutral')], setOpts={'phone': 1, 'buzz': True, 'rain': True, 'jarGlow': 1}, cam={'z': [1.22, 1.32], 'x': [-400, -440], 'y': [-30, -30]}), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.6}, 'amb': {'name': 'rain', 'gain': -22}, 'sfx': [{'at': 0.2, 'name': 'phonering', 'gain': -10}]}),
 (318, *PH({'mode': 'call', 'name': 'UNKNOWN', 'sub': 'unknown number', 'avatar': '#2a2a34', 'bg': ['#101018', '#05050a']}, buzz=[0, 1.3], setOpts={'rain': True}, who='SAM_OLD'), {'bars': 'scope', 'sfx': [{'at': 0.1, 'name': 'phonering', 'gain': -10}]}),
 (319, *W('bedroom', [BED_SIT('SAM_OLD', 'phone', 'worried', prop='phone')], setOpts={'rain': True}, cam={'z': [1.25, 1.3], 'x': [-380, -400], 'y': [-40, -40]}), {'bars': 'scope'}),
 (320, *F('SAM_OLD', 'worried', 'bedroom', setOpts={'rain': True}, phoneEar=True, push=0.15, noBlink=True), {'bars': 'scope'}),
 (321, *F('MRBLACK', 'neutral', 'lair', rimColor='#3fd0c0', rimSide=1, veil=0.6, talk=(322, 322), push=0.1), {'bars': 'scope', 'sfx': [{'at': 0.2, 'name': 'hum', 'gain': -20}]}),
 (323, *W('lair', [A('MRBLACK', 60, 'phone', 'smirk', -1, s=1.7, prop='phone', talk=(323, 323))], cam={'z': [1.25, 1.3], 'x': [40, 60], 'y': [-70, -70]}, rimDir=[0.6, -1]), {'bars': 'scope', 'amb': {'name': 'hum', 'gain': -24}}),
 (324, *F('MRBLACK', 'smirk', 'lair', rimColor='#3fd0c0', rimSide=1, push=0.12, bigText={'str': 'MR. BLACK', 't0': 0.3, 'y': 170, 'color': '#3fd0c0', 'size': 70}), {'bars': 'scope', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.0, 'name': 'stinger', 'gain': -4}]}),
 (325, 'end', {'question': 'What do you think?'}, {'in': {'type': 'dip', 'dur': 0.6}, 'sfx': [{'at': 0.6, 'name': 'pop', 'gain': -12}]}),
 (327, 'noteMacro', {'set': 'bedroom', 'back': True, 'warm': True, 'reveal': 0.0, 'bigText': {'str': 'SUBSCRIBE FOR PART TWO', 't0': 2.6, 'y': 960, 'size': 60}}, {'in': {'type': 'fade', 'dur': 0.5}}),
]

# year-badge motif for character shots
YEAR_RANGES = [(82.3, 109.0, 'YEAR 1'), (109.0, 120.6, 'YEAR 3'), (120.6, 159.5, 'YEAR 5'), (159.5, 201.8, 'YEAR 10'), (201.8, 254.4, 'YEAR 12'), (254.4, 263.0, 'YEAR 20'), (263.0, 281.5, 'YEAR 25'), (392.2, 514.2, 'YEAR 33')]
AMB = {'bedroom': ('roomtone', -28), 'kitchen': ('roomtone', -28), 'street': ('city', -26), 'factory': ('hum', -24), 'office': ('roomtone', -28), 'houseExt': ('wind', -28), 'lair': ('hum', -26)}


def normalise(entry):
    anchor, tpl, params, opts = entry
    if isinstance(tpl, tuple):  # *W(...) unpacked -> (anchor, name, params, opts)
        raise SystemExit('bad entry')
    params = dict(params or {})
    if 'from_' in params: params['from'] = params.pop('from_')
    if params.get('str') is None: params.pop('str', None)
    return anchor, tpl, params, dict(opts or {})


def main():
    entries = [normalise(e) for e in PLAN]
    starts = []
    for i, (a, tpl, params, opts) in enumerate(entries):
        st = 0.0 if i == 0 else round(anchor_time(a) - LEAD, 3)
        starts.append(st)
    for i in range(1, len(starts)):
        if starts[i] <= starts[i - 1] + 0.4:
            raise SystemExit(f'shot {i} starts too close to previous: {starts[i - 1]} -> {starts[i]} ({entries[i][0]})')
    shots = []
    for i, (a, tpl, params, opts) in enumerate(entries):
        st, en = starts[i], (starts[i + 1] if i + 1 < len(starts) else DUR)
        dur = en - st
        line = ' '.join(p['text'].replace(' ', ' ') for p in P if p['start'] >= st - 0.05 and p['start'] < en - 0.05)
        # talk ranges: 'all' or (pa, pb) phrase indices -> shot-relative
        def conv(v):
            if v == 'all': return [0.05, round(dur - 0.1, 3)]
            if isinstance(v, (tuple, list)) and len(v) == 2 and all(isinstance(x, int) for x in v) and not isinstance(v, list):
                return [round(P[v[0]]['start'] - st, 3), round(P[v[1]]['end'] - st, 3)]
            return v
        if 'talk' in params: params['talk'] = conv(params['talk'])
        for key in ('actors',):
            for act in params.get(key, []) or []:
                if 'talk' in act and act['talk'] is not None: act['talk'] = conv(act['talk'])
                elif 'talk' in act: act.pop('talk')
        for sub in ('left', 'right'):
            if sub in params:
                for act in params[sub].get('actors', []) or []:
                    if 'talk' in act and act['talk'] is not None: act['talk'] = conv(act['talk'])
        if 'set_' in params: params['set'] = params.pop('set_')
        params['tpl'] = tpl
        mid = (st + en) / 2
        if tpl in ('wide', 'face', 'phone', 'jarMacro') and 'badge' not in params:
            for a0, a1, lab in YEAR_RANGES:
                if a0 <= mid < a1: params['badge'] = {'str': lab, 't0': 0.2}
        shot = {'id': f's{i + 1:03d}', 'start': st, 'end': en, 'line': line, 'scene': f"{tpl}: {params.get('set', params.get('bg', ''))}", 'set': params.get('set'),
                'bars': opts.get('bars'), 'in': opts.get('in', {'type': 'cut'}), 'sfx': opts.get('sfx', []), 'params': params, 'notes': opts.get('notes', '')}
        if 'amb' in opts: shot['amb'] = opts['amb']
        elif params.get('set') in AMB and tpl in ('wide', 'face', 'phone', 'jarMacro', 'noteMacro', 'timeLapse'):
            nm, gn = AMB[params['set']]
            if (params.get('setOpts') or {}).get('rain'): nm, gn = 'rain', -24
            shot['amb'] = {'name': nm, 'gain': gn}
        shots.append(shot)
    music = [
        {'start': 0, 'end': 29.4, 'mood': 'tension', 'intensity': 0.5},
        {'start': 29.4, 'end': 82.3, 'mood': 'hopeful', 'intensity': 0.35},
        {'start': 82.3, 'end': 137.8, 'mood': 'playful', 'intensity': 0.4},
        {'start': 137.8, 'end': 201.8, 'mood': 'wonder', 'intensity': 0.45},
        {'start': 201.8, 'end': 254.4, 'mood': 'tension', 'intensity': 0.6},
        {'start': 254.4, 'end': 308.6, 'mood': 'epic', 'intensity': 0.55},
        {'start': 308.6, 'end': 352.2, 'mood': 'sad', 'intensity': 0.3},
        {'start': 352.2, 'end': 392.2, 'mood': 'calm', 'intensity': 0.3},
        {'start': 392.2, 'end': 434.5, 'mood': 'dark', 'intensity': 0.6},
        {'start': 434.5, 'end': 479.2, 'mood': 'tension', 'intensity': 0.5},
        {'start': 479.2, 'end': 514.2, 'mood': 'hopeful', 'intensity': 0.5},
        {'start': 514.2, 'end': 544.3, 'mood': 'triumph', 'intensity': 0.45},
        {'start': 544.3, 'end': 598.3, 'mood': 'wonder', 'intensity': 0.35},
        {'start': 598.3, 'end': 610.5, 'mood': 'mystery', 'intensity': 0.5},
        {'start': 610.5, 'end': DUR, 'mood': 'hopeful', 'intensity': 0.3},
    ]
    story = {'title': CFG['title'], 'duration': DUR, 'shots': shots, 'music': music, 'sfx': []}
    json.dump(story, open(os.path.join(HERE, 'shots.json'), 'w'), indent=1)
    durs = sorted(s['end'] - s['start'] for s in shots)
    print(f"{len(shots)} shots | median {durs[len(durs) // 2]:.2f}s | min {durs[0]:.2f}s | max {durs[-1]:.2f}s | duration {DUR}")
    long = [(s['id'], round(s['end'] - s['start'], 2)) for s in shots if s['end'] - s['start'] > 6.5]
    if long: print('long shots:', long)


if __name__ == '__main__':
    main()
