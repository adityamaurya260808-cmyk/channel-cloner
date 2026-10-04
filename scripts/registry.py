SCENES = {}
ENV = {}


def sc(n, night=False, env=None):
    def deco(fn):
        SCENES[n] = (fn, night)
        if env:
            ENV[n] = env
        return fn
    return deco
