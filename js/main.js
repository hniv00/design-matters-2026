import { site, places } from './content.js';
import { WORLD, buildWorld } from './world.js';
import { C, INK, PAPER, crayon } from './sketch.js';

const $ = (s) => document.querySelector(s);
const canvas = $('#world');
const ctx = canvas.getContext('2d');
const dialog = $('#panel');
const panelKicker = $('#panel-kicker');
const panelTitle = $('#panel-title');
const panelBody = $('#panel-body');
const hint = $('#hint');
const progressEl = $('#progress');
const menu = $('#menu');
const menuList = $('#menu-list');
const toast = $('#toast');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPEED = 250;
const RADIUS = 12;
const REACH = 64;
const LABEL_FONT = '700 26px Gaegu, "Comic Sans MS", cursive';
const BUBBLE_FONT = '700 20px Gaegu, "Comic Sans MS", cursive';

// ── Saved progress (per browser; the site works fine without it) ──
const STORE = 'setouchi-world:visited';
const visited = (() => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE)) || []);
  } catch {
    return new Set();
  }
})();
const saveVisited = () => {
  try {
    localStorage.setItem(STORE, JSON.stringify([...visited]));
  } catch {}
};

// ── State ──
let world;
let player;
let dpr = 1;
let zoom = 1;
let vw = 0;
let vh = 0;
const cam = { x: 0, y: 0 };
const keys = new Set();
let target = null;
let autoOpen = null;
let near = null;
let bubble = null;
let stuck = 0;
let side = 1;
let bestDist = Infinity;
let touchy = matchMedia('(pointer: coarse)').matches;
let celebrate = false;

// ── Chrome ──
$('#brand-name').textContent = site.name;
$('#brand-tagline').textContent = site.tagline;
document.title = `${site.name} · ${site.tagline}`;

function renderMenu() {
  menuList.innerHTML = '';
  for (const p of places) {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<span>${p.title}</span><small>${p.island || ''}${visited.has(p.id) ? ' ✓' : ''}</small>`;
    b.addEventListener('click', () => {
      menu.open = false;
      player.x = p.door.x;
      player.y = p.door.y;
      snapCamera();
      openPlace(p);
    });
    li.append(b);
    menuList.append(li);
  }
  const found = places.filter((p) => visited.has(p.id)).length;
  progressEl.textContent = `${found}/${places.length} found`;
}

document.addEventListener('pointerdown', (e) => {
  if (menu.open && !menu.contains(e.target)) menu.open = false;
});

// ── Panel ──
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function renderBody(p) {
  let html = p.body || '';
  if (p.projects?.length) {
    html += '<div class="cards">';
    for (const pr of p.projects) {
      const meta = [pr.year, ...(pr.tags || [])].filter(Boolean).map(esc).join(' · ');
      html += `
        <article class="card" style="--card:${esc(pr.color || p.color)}">
          ${pr.image ? `<img src="${esc(pr.image)}" alt="${esc(pr.imageAlt)}" loading="lazy">` : '<div class="card-art" aria-hidden="true"></div>'}
          <div class="card-body">
            <h3>${esc(pr.title)}</h3>
            ${meta ? `<p class="meta">${meta}</p>` : ''}
            <p>${esc(pr.description)}</p>
            ${pr.link ? `<a href="${esc(pr.link)}" target="_blank" rel="noopener">See the project →</a>` : ''}
          </div>
        </article>`;
    }
    html += '</div>';
  }
  return html;
}

function openPlace(p) {
  target = null;
  autoOpen = null;
  keys.clear();
  panelKicker.textContent = p.island || '';
  panelTitle.textContent = p.title;
  panelBody.innerHTML = renderBody(p);
  dialog.style.setProperty('--accent', p.color || C.pink);
  if (!dialog.open) dialog.showModal();
  panelBody.scrollTop = 0;
  if (!visited.has(p.id)) {
    visited.add(p.id);
    saveVisited();
    if (places.every((q) => visited.has(q.id))) celebrate = true;
  }
  renderMenu();
}

dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  canvas.focus({ preventScroll: true });
  if (celebrate) {
    celebrate = false;
    toast.hidden = false;
    setTimeout(() => (toast.hidden = true), 6000);
  }
});

// ── Input ──
const KEYMAP = {
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
};

addEventListener('keydown', (e) => {
  if (dialog.open || e.metaKey || e.ctrlKey || e.altKey) return;
  const dir = KEYMAP[e.key];
  if (dir) {
    keys.add(dir);
    touchy = false;
    e.preventDefault();
    return;
  }
  const inChrome = e.target.closest?.('.hud');
  if (!inChrome && near && ['e', 'E', 'Enter', ' '].includes(e.key)) {
    e.preventDefault();
    openPlace(near);
  }
});
addEventListener('keyup', (e) => {
  const dir = KEYMAP[e.key];
  if (dir) keys.delete(dir);
});
addEventListener('blur', () => keys.clear());

const toWorld = (cx, cy) => ({ x: cx / zoom + cam.x, y: cy / zoom + cam.y });
const inBox = (pt, b, pad = 0) => b && pt.x > b.x - pad && pt.x < b.x + b.w + pad && pt.y > b.y - pad && pt.y < b.y + b.h + pad;

canvas.addEventListener('pointerdown', (e) => {
  touchy = e.pointerType !== 'mouse';
  canvas.focus({ preventScroll: true });
  const pt = toWorld(e.clientX, e.clientY);
  if (near && inBox(pt, bubble, 14)) return openPlace(near);
  const hit = places
    .filter((p) => inBox(pt, p.bounds))
    .sort((a, b) => b.y - a.y)[0];
  if (hit) {
    if (hit === near) return openPlace(hit);
    target = { ...hit.door };
    autoOpen = hit;
    bestDist = Infinity;
  } else {
    target = pt;
    autoOpen = null;
    bestDist = Infinity;
  }
});

// ── Simulation ──
function blocked(x, y) {
  if (x < 20 || x > WORLD.w - 20 || y < 30 || y > WORLD.h - 20) return true;
  for (const r of world.colliders) {
    const cx = Math.max(r.x, Math.min(x, r.x + r.w));
    const cy = Math.max(r.y, Math.min(y, r.y + r.h));
    if ((x - cx) ** 2 + (y - cy) ** 2 < RADIUS * RADIUS) return true;
  }
  return false;
}

function update(dt) {
  let dx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
  let dy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
  let maxStep = Infinity;

  if (dx || dy) {
    target = null;
    autoOpen = null;
  } else if (target) {
    const tx = target.x - player.x;
    const ty = target.y - player.y;
    const d = Math.hypot(tx, ty);
    if (d < 3) {
      target = null;
      if (autoOpen) openPlace(autoOpen);
    } else {
      dx = tx / d;
      dy = ty / d;
      maxStep = d;
    }
  }

  player.moving = !!(dx || dy);
  if (player.moving) {
    const len = Math.hypot(dx, dy);
    dx /= len;
    dy /= len;
    const step = Math.min(SPEED * (player.onWater ? 0.85 : 1) * dt, maxStep);
    const ox = player.x;
    const oy = player.y;
    if (target) {
      // Walk towards the target, veering around anything in the way.
      const base = Math.atan2(dy, dx);
      for (const off of [0, 0.5, 1, 1.5, 2].flatMap((o) => (o ? [o * side, -o * side] : [0]))) {
        const ax = Math.cos(base + off);
        const ay = Math.sin(base + off);
        if (!blocked(player.x + ax * step, player.y + ay * step)) {
          player.x += ax * step;
          player.y += ay * step;
          if (off) side = Math.sign(off);
          dx = ax;
          break;
        }
      }
      const d = Math.hypot(target.x - player.x, target.y - player.y);
      if (d < bestDist - 1) {
        bestDist = d;
        stuck = 0;
      } else stuck += dt;
    } else {
      if (!blocked(player.x + dx * step, player.y)) player.x += dx * step;
      if (!blocked(player.x, player.y + dy * step)) player.y += dy * step;
      stuck = 0;
    }
    if (Math.abs(dx) > 0.2) player.flip = dx < 0;
    if (Math.hypot(player.x - ox, player.y - oy) < step * 0.1 && target) stuck += 1;

    if (stuck > 1.2 && target) {
      if (autoOpen && Math.hypot(player.x - autoOpen.door.x, player.y - autoOpen.door.y) < REACH * 1.5) openPlace(autoOpen);
      target = null;
      autoOpen = null;
      stuck = 0;
    }
    hint.classList.add('hidden');
  }
  player.onWater = !world.isLand(player.x, player.y);

  near = null;
  let best = REACH;
  for (const p of places) {
    const d = Math.hypot(player.x - p.door.x, player.y - p.door.y);
    if (d < best) {
      best = d;
      near = p;
    }
  }

  // Ferry
  const f = world.ferry;
  if (f.wait > 0) f.wait -= dt;
  else {
    f.t += (f.dir * 45 * dt) / 520;
    if (f.t >= 1 || f.t <= 0) {
      f.t = Math.max(0, Math.min(1, f.t));
      f.dir *= -1;
      f.wait = 2.5;
    }
  }
  const i = f.t * (f.route.length - 1);
  const a = f.route[Math.floor(i)];
  const b = f.route[Math.min(f.route.length - 1, Math.floor(i) + 1)];
  const k = i - Math.floor(i);
  f.x = a[0] + (b[0] - a[0]) * k;
  f.y = a[1] + (b[1] - a[1]) * k;
  f.flip = (b[0] - a[0]) * f.dir < 0;
}

// ── Camera ──
function camGoal() {
  const viewW = vw / zoom;
  const viewH = vh / zoom;
  const clamp = (v, size, world) => (size >= world ? (world - size) / 2 : Math.max(0, Math.min(world - size, v)));
  return { x: clamp(player.x - viewW / 2, viewW, WORLD.w), y: clamp(player.y - viewH / 2, viewH, WORLD.h) };
}
function snapCamera() {
  Object.assign(cam, camGoal());
}
function updateCamera(dt) {
  const g = camGoal();
  const k = reduced ? 1 : 1 - Math.exp(-dt * 7);
  cam.x += (g.x - cam.x) * k;
  cam.y += (g.y - cam.y) * k;
}

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  vw = innerWidth;
  vh = innerHeight;
  canvas.width = Math.round(vw * dpr);
  canvas.height = Math.round(vh * dpr);
  canvas.style.width = `${vw}px`;
  canvas.style.height = `${vh}px`;
  zoom = Math.max(0.62, Math.min(1.25, Math.min(vw / 1050, vh / 800)));
}
addEventListener('resize', () => {
  resize();
  if (player) snapCamera();
});

// ── Drawing ──
function paint(c, color) {
  c.fillStyle = color;
  c.globalAlpha = 0.6;
  c.fill();
  c.globalAlpha = 1;
  c.fillStyle = crayon(c, color, 0.2);
  c.fill();
}

function ell(c, x, y, rx, ry) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

// A little round bird in a pink beanie. Faces right; flipped when walking left.
function drawBird(c, p, t) {
  const moving = p.moving && !reduced;
  const hop = moving && !p.onWater ? Math.abs(Math.sin(t * 11)) * 4 : 0;
  c.save();
  c.translate(p.x, p.y);
  c.lineJoin = 'round';
  c.lineCap = 'round';

  if (p.onWater) {
    c.strokeStyle = 'rgba(251,248,243,0.85)';
    c.lineWidth = 2.5;
    const r = reduced ? 0 : (t * 0.8) % 1;
    ell(c, 0, 0, 30 + r * 14, 7 + r * 3);
    c.globalAlpha = 1 - r;
    c.stroke();
    c.globalAlpha = 1;
    c.rotate(reduced ? 0 : Math.sin(t * 2.4) * 0.05);
  } else {
    c.fillStyle = 'rgba(29,27,30,0.15)';
    ell(c, 0, 0, 15, 5);
    c.fill();
  }
  if (p.flip) c.scale(-1, 1);

  c.strokeStyle = INK;
  c.lineWidth = 2.4;
  if (p.onWater) {
    // Boat
    c.beginPath();
    c.moveTo(-32, -16);
    c.lineTo(32, -16);
    c.lineTo(22, 2);
    c.lineTo(-24, 2);
    c.closePath();
    paint(c, C.orange);
    c.stroke();
    c.strokeStyle = C.white;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-26, -8);
    c.lineTo(26, -8);
    c.stroke();
    c.strokeStyle = INK;
    c.lineWidth = 2.4;
  } else {
    // Legs
    const step = moving ? Math.sin(t * 22) * 3 : 0;
    c.strokeStyle = C.orange;
    c.beginPath();
    c.moveTo(-4, -10);
    c.lineTo(-5 + step, 0);
    c.moveTo(5, -10);
    c.lineTo(5 - step, 0);
    c.stroke();
    c.strokeStyle = INK;
  }

  c.translate(0, (p.onWater ? -12 : -6) - hop);
  // Tail
  c.beginPath();
  c.moveTo(-14, -14);
  c.lineTo(-28, -8);
  c.lineTo(-24, -18);
  c.closePath();
  paint(c, C.grey);
  c.stroke();
  // Body
  ell(c, 0, -16, 18, 15);
  c.fillStyle = PAPER;
  c.fill();
  paint(c, C.grey);
  c.stroke();
  // Wing with loops
  ell(c, -3, -15, 11, 8);
  c.fillStyle = C.white;
  c.fill();
  c.stroke();
  c.lineWidth = 1.4;
  c.beginPath();
  for (let i = 0; i < 3; i++) c.arc(-9 + i * 5, -15, 2.4, Math.PI, 0);
  c.stroke();
  c.lineWidth = 2.4;
  // Neck bands
  c.lineWidth = 4;
  c.strokeStyle = crayon(c, C.turquoise, 0.2);
  c.beginPath();
  c.arc(9, -26, 9, 0.6, 2.2);
  c.stroke();
  c.strokeStyle = crayon(c, C.pink, 0.2);
  c.beginPath();
  c.arc(9, -24, 11, 0.9, 2.4);
  c.stroke();
  c.strokeStyle = INK;
  c.lineWidth = 2.4;
  // Head
  ell(c, 11, -31, 9.5, 9.5);
  c.fillStyle = PAPER;
  c.fill();
  paint(c, C.grey);
  c.stroke();
  // Beak
  c.beginPath();
  c.moveTo(19, -33);
  c.lineTo(27, -30);
  c.lineTo(19, -28);
  c.closePath();
  c.fillStyle = C.marigold;
  c.fill();
  c.lineWidth = 1.6;
  c.stroke();
  // Eye + cheek
  ell(c, 14, -33, 3, 3);
  c.fillStyle = C.orange;
  c.fill();
  ell(c, 14, -33, 1.4, 1.4);
  c.fillStyle = INK;
  c.fill();
  ell(c, 11, -27, 3, 2);
  c.fillStyle = C.blush;
  c.fill();
  // Beanie
  c.lineWidth = 2;
  c.beginPath();
  c.arc(10, -35, 10.5, Math.PI * 1.02, Math.PI * 1.98);
  c.closePath();
  paint(c, C.pink);
  c.stroke();
  c.beginPath();
  c.rect(-1, -37, 22, 5);
  paint(c, C.pink);
  c.stroke();
  ell(c, 9, -48, 4.5, 4.5);
  paint(c, C.pink);
  c.stroke();
  c.restore();
}

function sparkle(c, x, y, r) {
  c.beginPath();
  c.moveTo(x, y - r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.quadraticCurveTo(x, y, x, y + r);
  c.quadraticCurveTo(x, y, x - r, y);
  c.quadraticCurveTo(x, y, x, y - r);
  c.fillStyle = C.yellow;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.stroke();
}

function pill(c, text, x, y, font) {
  c.font = font;
  const w = c.measureText(text).width + 22;
  const h = 30;
  const bx = x - w / 2;
  const by = y - h;
  c.beginPath();
  c.roundRect(bx, by, w, h, 12);
  c.fillStyle = C.white;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 2.4;
  c.stroke();
  c.fillStyle = INK;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, x, by + h / 2 + 1);
  return { x: bx, y: by, w, h };
}

function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = C.sea;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const s = dpr * zoom;
  ctx.setTransform(s, 0, 0, s, -cam.x * s, -cam.y * s);
  ctx.drawImage(world.ground, 0, 0, WORLD.w, WORLD.h);

  if (target) {
    ctx.strokeStyle = C.pink;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(target.x - 7, target.y - 7);
    ctx.lineTo(target.x + 7, target.y + 7);
    ctx.moveTo(target.x + 7, target.y - 7);
    ctx.lineTo(target.x - 7, target.y + 7);
    ctx.stroke();
  }

  const items = [...world.objects, player].sort((a, b) => a.y - b.y);
  for (const o of items) {
    if (o === player) {
      drawBird(ctx, player, t);
      continue;
    }
    const sp = o.sprite;
    if (o.flip) {
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.scale(-1, 1);
      ctx.drawImage(sp.img, -sp.ax, -sp.ay, sp.w, sp.h);
      ctx.restore();
    } else {
      ctx.drawImage(sp.img, o.x - sp.ax, o.y - sp.ay, sp.w, sp.h);
    }
  }

  // Place labels
  ctx.font = LABEL_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  for (const p of places) {
    ctx.lineWidth = 7;
    ctx.strokeStyle = C.white;
    ctx.strokeText(p.title, p.x, p.labelY);
    ctx.fillStyle = INK;
    ctx.fillText(p.title, p.x, p.labelY);
    if (!visited.has(p.id)) {
      const w = ctx.measureText(p.title).width;
      const pulse = reduced ? 1 : 1 + Math.sin(t * 4) * 0.2;
      sparkle(ctx, p.x + w / 2 + 14, p.labelY - 18, 8 * pulse);
    }
  }

  bubble = null;
  if (near && !dialog.open) {
    bubble = pill(ctx, touchy ? `Tap to enter ${near.title}` : `Press E · ${near.title}`, player.x, player.y - (player.onWater ? 78 : 70), BUBBLE_FONT);
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!dialog.open) update(dt);
  updateCamera(dt);
  draw(now / 1000);
  requestAnimationFrame(loop);
}

// ── Start ──
async function start() {
  try {
    await Promise.race([
      Promise.all([document.fonts.load(LABEL_FONT), document.fonts.load('400 20px Gaegu')]),
      new Promise((r) => setTimeout(r, 2000)),
    ]);
  } catch {}
  resize();
  world = buildWorld(places, Math.min(devicePixelRatio || 1, 1.5));
  player = { ...world.spawn, flip: false, moving: false, onWater: false };
  snapCamera();
  renderMenu();
  document.body.classList.add('ready');
  if (touchy) hint.textContent = 'Tap anywhere to walk · tap a building to go in';
  requestAnimationFrame(loop);
  if (!visited.has(places[0].id)) openPlace(places[0]);
}

start();
