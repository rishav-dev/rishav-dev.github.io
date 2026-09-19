(function (G) {
  const P = (G.Prodose = G.Prodose || {});

  P.DT = 2; // physics sub-step in ms (500 Hz) — small so 3 mm pills cannot tunnel through walls
  P.G_MM_MS2 = 0.00981;

  P.SHAPES = {
    round:   { label: 'Round tablet',       fragile: 1.00, friction: 0.38, restitution: 0.22, kind: 'tablet'  },
    oval:    { label: 'Oval tablet',        fragile: 1.00, friction: 0.36, restitution: 0.20, kind: 'tablet'  },
    caplet:  { label: 'Caplet',             fragile: 0.95, friction: 0.34, restitution: 0.20, kind: 'tablet'  },
    capsule: { label: 'Hard capsule',       fragile: 0.80, friction: 0.30, restitution: 0.14, kind: 'capsule' },
    softgel: { label: 'Softgel',            fragile: 0.45, friction: 0.50, restitution: 0.05, kind: 'softgel' },
  };

  P.COLORS = {
    white:   { label: 'White',          a: '#f6f3ea', b: '#f6f3ea', edge: '#bdb8aa' },
    tan:     { label: 'Tan',            a: '#dcc39a', b: '#dcc39a', edge: '#a78d62' },
    orange:  { label: 'Orange',         a: '#f0a04b', b: '#f0a04b', edge: '#b96f1e' },
    pink:    { label: 'Pink',           a: '#f2a9b9', b: '#f2a9b9', edge: '#c0708a' },
    blue:    { label: 'Blue',           a: '#8db7e8', b: '#8db7e8', edge: '#4f7db3' },
    gold:    { label: 'Gold (softgel)', a: '#f2c14e', b: '#e79a24', edge: '#b9791a' },
    amber:   { label: 'Amber (softgel)',a: '#e8a63a', b: '#c97d12', edge: '#8f5608' },
    duo:     { label: 'Two-tone capsule', a: '#7d4fa8', b: '#f1ecf5', edge: '#5b3a80' },
    duo2:    { label: 'Green/white capsule', a: '#3f9a6c', b: '#f3f1e7', edge: '#2b6b49' },
  };

  P.BOTTLES = {
    vial:   { label: 'Rx vial (straight)',       neck: 3,  slope: 0.30, dome: false, color: 'amber' },
    boston: { label: 'Boston round (narrow neck)', neck: 12, slope: 0.85, dome: true,  color: 'amber' },
    jar:    { label: 'Wide-mouth jar',           neck: 7,  slope: 0.45, dome: false, color: 'white' },
    packer: { label: 'Square packer (supplement)', neck: 9,  slope: 0.55, dome: false, color: 'white' },
  };

  P.BOTTLE_COLORS = {
    amber: { label: 'Amber',  fill: 'rgba(196,110,24,0.62)', edge: '#8a4a07', inner: 'rgba(214,132,40,0.16)' },
    white: { label: 'White',  fill: 'rgba(246,246,242,0.92)', edge: '#a7a9ab', inner: 'rgba(255,255,255,0.10)' },
    clear: { label: 'Clear',  fill: 'rgba(170,205,225,0.45)', edge: '#6d93a8', inner: 'rgba(190,220,235,0.10)' },
    green: { label: 'Green',  fill: 'rgba(52,128,84,0.62)',  edge: '#1f5a38', inner: 'rgba(70,150,100,0.14)' },
    blue:  { label: 'Cobalt', fill: 'rgba(40,74,150,0.62)',  edge: '#1a2f68', inner: 'rgba(70,100,180,0.14)' },
  };

  P.PRESETS = {
    otc_ibuprofen: { label: 'OTC · Ibuprofen 200 mg (round)',   shape: 'round',   L: 9.5, W: 9.5, color: 'orange',
                     bottle: { style: 'vial',   D: 40, H: 92,  mouth: 34, color: 'amber' }, fill: 70 },
    rx_small:      { label: 'Rx · Small round tablet (6 mm)',   shape: 'round',   L: 6.5, W: 6.5, color: 'white',
                     bottle: { style: 'vial',   D: 30, H: 74,  mouth: 25, color: 'amber' }, fill: 75 },
    mini_pill:     { label: 'Mini tablet (4 mm)',               shape: 'round',   L: 4.2, W: 4.2, color: 'pink',
                     bottle: { style: 'vial',   D: 28, H: 62,  mouth: 22, color: 'amber' }, fill: 60 },
    apap_caplet:   { label: 'OTC · Acetaminophen caplet',       shape: 'caplet',  L: 17,  W: 7,   color: 'white',
                     bottle: { style: 'vial',   D: 42, H: 96,  mouth: 37, color: 'white' }, fill: 65 },
    vitd_softgel:  { label: 'Supp · Vitamin D3 softgel',        shape: 'softgel', L: 11,  W: 6.5, color: 'gold',
                     bottle: { style: 'boston', D: 48, H: 108, mouth: 30, color: 'white' }, fill: 70 },
    bcomplex:      { label: 'Supp · B-complex capsule',         shape: 'capsule', L: 19,  W: 7.5, color: 'duo',
                     bottle: { style: 'boston', D: 52, H: 112, mouth: 32, color: 'blue'  }, fill: 65 },
    fish_oil:      { label: 'Supp · Omega-3 fish oil (large)',  shape: 'softgel', L: 24,  W: 11,  color: 'amber',
                     bottle: { style: 'jar',    D: 66, H: 124, mouth: 48, color: 'white' }, fill: 60 },
    multivit:      { label: 'Supp · Multivitamin (jumbo caplet)', shape: 'caplet', L: 23, W: 10.5, color: 'orange',
                     bottle: { style: 'packer', D: 72, H: 132, mouth: 52, color: 'white' }, fill: 55 },
  };

  P.SLOT_WIDTHS = [4.8, 5.9, 7.3, 9.0, 11.1, 13.7, 17.0, 21.0, 25.9, 32.0];

  P.DEFAULT_PRESET = 'otc_ibuprofen';

  P.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  P.lerp = (a, b, t) => a + (b - a) * t;
  P.rot = (v, a) => { const c = Math.cos(a), s = Math.sin(a); return { x: v.x * c - v.y * s, y: v.x * s + v.y * c }; };
  P.ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
  P.wrap2pi = (a) => { a %= Math.PI * 2; return a < 0 ? a + Math.PI * 2 : a; };

  P.rng = function (seed) {
    let s = seed >>> 0 || 1;
    return function () {
      s += 0x6d2b79f5; let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  P.Mover = function (pos) { this.pos = pos || 0; this.vel = 0; };
  P.Mover.prototype.step = function (target, vmax, acc, dt) {
    const s = dt / 1000, d = target - this.pos;
    const vDes = Math.sign(d) * Math.min(vmax, Math.sqrt(2 * acc * Math.abs(d)));
    const maxdv = acc * s;
    this.vel += Math.max(-maxdv, Math.min(maxdv, vDes - this.vel));
    let np = this.pos + this.vel * s;
    if ((target - this.pos) * (target - np) <= 0) { np = target; this.vel = 0; }
    this.pos = np;
    if (Math.abs(target - this.pos) < 1e-6) { this.vel = 0; return true; }
    return false;
  };
  P.Mover.prototype.arrived = function (target, tol) { return Math.abs(target - this.pos) <= (tol || 1e-4) && Math.abs(this.vel) < 1e-3; };
})(typeof window !== 'undefined' ? window : globalThis);
