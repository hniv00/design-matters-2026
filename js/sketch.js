// Crayon / oil-pastel rendering helpers.
//
// Everything is drawn with slightly wobbly outlines and grainy "pastel"
// fills: a colour tile with tiny holes and horizontal streaks, so the paper
// shows through like oil pastel on a sketchbook page. A seeded random
// generator keeps every wobble stable from frame to frame.

export const PAPER = '#f6f1e6';
export const INK = '#1d1b1e';

// Palette pulled from the reference sketches.
export const C = {
  paper: PAPER,
  ink: INK,
  white: '#fbf8f3',
  pink: '#ef5a98',
  blush: '#f6b3c8',
  orange: '#f2552c',
  marigold: '#f5a623',
  yellow: '#f7d046',
  sand: '#f3d9a4',
  cobalt: '#2453c8',
  sky: '#86c9ee',
  sea: '#5ea6e2',
  turquoise: '#3fb8c9',
  lavender: '#a5a0f2',
  leaf: '#62b86e',
  green: '#2fa36b',
  deep: '#1f6b4f',
  sage: '#9fb07a',
  grey: '#8b8f99',
  concrete: '#cfccc6',
  brick: '#c4553a',
  bark: '#6b3f2a',
};

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Pastel grain ────────────────────────────────────────────

const tiles = new Map();
function grainTile(color, holes) {
  const key = `${color}|${holes}`;
  if (tiles.has(key)) return tiles.get(key);
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = color;
  g.fillRect(0, 0, S, S);
  const im = g.getImageData(0, 0, S, S);
  const d = im.data;
  let seed = 7;
  for (const ch of key) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rng = mulberry32(seed);
  // Horizontal runs of varying pressure, like pastel dragged across paper.
  for (let y = 0; y < S; y++) {
    const rowPressure = 0.7 + rng() * 0.3;
    for (let x = 0; x < S; ) {
      const len = 2 + Math.floor(rng() * 18);
      const gap = rng() < holes;
      const a = gap ? rng() * 0.25 : rowPressure * (0.72 + rng() * 0.28);
      for (let k = 0; k < len && x < S; k++, x++) {
        d[(y * S + x) * 4 + 3] = Math.round(Math.min(1, a + (rng() - 0.5) * 0.12) * 255);
      }
    }
  }
  g.putImageData(im, 0, 0);
  tiles.set(key, c);
  return c;
}

const patterns = new WeakMap();
/** A grainy oil-pastel fill/stroke style for `color`. */
export function crayon(ctx, color, holes = 0.24) {
  let m = patterns.get(ctx);
  if (!m) patterns.set(ctx, (m = new Map()));
  const key = `${color}|${holes}`;
  if (!m.has(key)) m.set(key, ctx.createPattern(grainTile(color, holes), 'repeat'));
  return m.get(key);
}

// ── Paths ───────────────────────────────────────────────────

const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function wobble(points, rng, amp, closed) {
  const out = [];
  const n = points.length;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % n];
    const steps = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 16));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      out.push([x1 + (x2 - x1) * t + (rng() - 0.5) * amp, y1 + (y2 - y1) * t + (rng() - 0.5) * amp]);
    }
  }
  if (!closed) {
    const [x, y] = points[n - 1];
    out.push([x + (rng() - 0.5) * amp, y + (rng() - 0.5) * amp]);
  }
  return out;
}

/** Trace points as a smooth curve through their midpoints. */
export function trace(ctx, pts, closed = true) {
  ctx.beginPath();
  if (closed) {
    const n = pts.length;
    const s = mid(pts[n - 1], pts[0]);
    ctx.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) {
      const m = mid(pts[i], pts[(i + 1) % n]);
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
    }
    ctx.closePath();
  } else {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) {
      const m = mid(pts[i], pts[i + 1]);
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
    }
    const l = pts[pts.length - 1];
    ctx.lineTo(l[0], l[1]);
  }
}

/**
 * Draw a sketchy shape.
 *  fill    colour (pastel grain over an opaque `base`)
 *  base    solid under-colour so shapes hide what's behind (null = see-through)
 *  stroke  outline colour (null = none)
 */
export function shape(ctx, rng, points, opts = {}) {
  const {
    fill,
    base = PAPER,
    stroke = INK,
    width = 2.6,
    closed = true,
    amp = 2.2,
    passes = 2,
    alpha = 1,
    holes = 0.24,
  } = opts;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (fill && closed) {
    const p = wobble(points, rng, amp * 0.5, true);
    ctx.globalAlpha = alpha;
    if (base) {
      ctx.fillStyle = base;
      trace(ctx, p, true);
      ctx.fill();
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.globalAlpha = alpha;
    } else {
      trace(ctx, p, true);
    }
    ctx.fillStyle = crayon(ctx, fill, holes);
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = crayon(ctx, stroke, 0.18);
    ctx.lineWidth = width;
    for (let i = 0; i < passes; i++) {
      ctx.globalAlpha = alpha * (i ? 0.5 : 1);
      trace(ctx, wobble(points, rng, amp, closed), closed);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export const line = (ctx, rng, pts, opts = {}) =>
  shape(ctx, rng, pts, { closed: false, passes: 1, ...opts });

export const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

export function ellipse(cx, cy, rx, ry, rng, lump = 0, n = 22) {
  const pts = [];
  const phase = rng() * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = lump ? 1 + Math.sin(a * 3 + phase) * lump * 0.5 + (rng() - 0.5) * lump : 1;
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
}

/** Quadratic curve from a to b, bent sideways by `bend` (fraction of length). */
export function curve(a, b, bend = 0, n = 24) {
  const m = mid(a, b);
  const c = [m[0] - (b[1] - a[1]) * bend, m[1] + (b[0] - a[0]) * bend];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    pts.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
  }
  return pts;
}

function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
}

/** Loopy "eeee" scribble fill, clipped to a shape (like the blue poodle). */
export function scribble(ctx, rng, pts, color, opts = {}) {
  const { r = 6, spacing = 12, width = 1.6, alpha = 0.9, holes = 0.25 } = opts;
  const b = bbox(pts);
  ctx.save();
  trace(ctx, pts, true);
  ctx.clip();
  ctx.strokeStyle = crayon(ctx, color, holes);
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let y = b.y0 + spacing * 0.5; y < b.y1 + r; y += spacing) {
    const yy = y + (rng() - 0.5) * spacing * 0.4;
    let x = b.x0 - r * 2 - rng() * r * 2;
    let th = rng() * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(th) * r, yy + Math.sin(th) * r * 0.8);
    while (x < b.x1 + r * 2) {
      th += 0.45;
      x += (1.7 * r * 0.45) / (Math.PI * 2);
      const rr = r * (0.85 + rng() * 0.3);
      ctx.lineTo(x + Math.cos(th) * rr, yy + Math.sin(th) * rr * 0.8);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** Diagonal pastel hatching clipped to a shape. */
export function hatch(ctx, rng, pts, color, opts = {}) {
  const { spacing = 8, slant = 0.6, width = 2, alpha = 0.6, holes = 0.3 } = opts;
  const b = bbox(pts);
  const h = b.y1 - b.y0;
  ctx.save();
  trace(ctx, pts, true);
  ctx.clip();
  ctx.strokeStyle = crayon(ctx, color, holes);
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  for (let x = b.x0 - h * slant; x < b.x1; x += spacing * (0.7 + rng() * 0.6)) {
    ctx.beginPath();
    ctx.moveTo(x + (rng() - 0.5) * 3, b.y1 + 2);
    ctx.lineTo(x + h * slant + (rng() - 0.5) * 3, b.y0 - 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function pointInPoly(pts, x, y) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
