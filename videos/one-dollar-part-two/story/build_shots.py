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
PLAN = []

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
    import sys; sys.path.insert(0, HERE)
    from plan_p2 import PLAN as PLAN2, YEAR_RANGES as YR2, MUSIC as MUSIC2
    global YEAR_RANGES; YEAR_RANGES = YR2
    entries = [normalise(e) for e in PLAN2]
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
    music = [dict(m, end=min(m['end'], DUR)) for m in MUSIC2]
    story = {'title': CFG['title'], 'duration': DUR, 'shots': shots, 'music': music, 'sfx': []}
    json.dump(story, open(os.path.join(HERE, 'shots.json'), 'w'), indent=1)
    durs = sorted(s['end'] - s['start'] for s in shots)
    print(f"{len(shots)} shots | median {durs[len(durs) // 2]:.2f}s | min {durs[0]:.2f}s | max {durs[-1]:.2f}s | duration {DUR}")
    long = [(s['id'], round(s['end'] - s['start'], 2)) for s in shots if s['end'] - s['start'] > 6.5]
    if long: print('long shots:', long)


if __name__ == '__main__':
    main()
