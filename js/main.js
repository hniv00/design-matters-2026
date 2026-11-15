import { site, places, curiosities } from './content.js';
import { WORLD, buildWorld } from './world.js';
import { C, INK, PAPER, crayon, drawBike, heartPath } from './sketch.js';

const $ = (s) => document.querySelector(s);
const canvas = $('#world');
const ctx = canvas.getContext('2d');
const dialog = $('#panel');
const panelKicker = $('#panel-kicker');
const panelTitle = $('#panel-title');
const panelBody = $('#panel-body');
const hint = $('#hint');
const progressEl = $('#progress');
const stampsBtn = $('#stamps');
const menu = $('#menu');
const menuList = $('#menu-list');
const toast = $('#toast');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPEED = 250;
const BIKE_BOOST = 1.75;
const RADIUS = 12;
const REACH = 64;
const LABEL_FONT = '700 26px Gaegu, "Comic Sans MS", cursive';
const BUBBLE_FONT = '700 20px Gaegu, "Comic Sans MS", cursive';
const SPEECH_FONT = '700 19px Gaegu, "Comic Sans MS", cursive';

const things = [...places, ...curiosities];
const isPlace = (t) => places.includes(t);

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
let clock = 0;
const cam = { x: 0, y: 0 };
const keys = new Set();
let target = null;
let autoUse = null;
let near = null;
let bubble = null;
let speech = null;
let stuck = 0;
let side = 1;
let bestDist = Infinity;
let touchy = matchMedia('(pointer: coarse)').matches;
let pendingToast = null;
const particles = [];
const gulls = [];

// ── Chrome ──
$('#brand-name').textContent = site.name;
$('#brand-tagline').textContent = site.tagline;
document.title = `${site.name} · ${site.tagline}`;

const countOf = (list) => list.filter((t) => visited.has(t.id)).length;

function renderMenu() {
  menuList.innerHTML = '';
  for (const p of places) {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<span>${esc(p.title)}</span><small>${esc(p.island)}${visited.has(p.id) ? ' ✓' : ''}</small>`;
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
  progressEl.textContent = `${countOf(places)}/${places.length} found`;
  stampsBtn.textContent = `Stamps ${countOf(curiosities)}/${curiosities.length}`;
}

document.addEventListener('pointerdown', (e) => {
  if (menu.open && !menu.contains(e.target)) menu.open = false;
});

function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => (toast.hidden = true), 6000);
}

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

function showPanel(kicker, title, html, accent) {
  target = null;
  autoUse = null;
  speech = null;
  keys.clear();
  panelKicker.textContent = kicker || '';
  panelTitle.textContent = title;
  panelBody.innerHTML = html;
  dialog.style.setProperty('--accent', accent || C.pink);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function collect(id) {
  if (visited.has(id)) return false;
  visited.add(id);
  saveVisited();
  renderMenu();
  return true;
}

function openPlace(p) {
  showPanel(p.island, p.title, renderBody(p), p.color);
  if (collect(p.id) && countOf(places) === places.length) {
    pendingToast = 'You found every island. Thanks for sailing by!';
  }
}

function stampImage(q) {
  if (!q.stampSrc) q.stampSrc = q.sprite.img.toDataURL();
  return q.stampSrc;
}

function openStamps() {
  const got = countOf(curiosities);
  const items = curiosities
    .map((q, i) => {
      const has = visited.has(q.id);
      return `
        <li class="stamp${has ? '' : ' missing'}" style="--tilt:${((i * 37) % 11) - 5}deg">
          <div class="stamp-ring"><img src="${stampImage(q)}" alt=""></div>
          <p>${has ? esc(q.name) : '???'}<small>${esc(q.island)}</small></p>
        </li>`;
    })
    .join('');
  showPanel(
    'Collected on your travels',
    'Stamp book',
    `<p>Little things are hidden all over the islands. Walk up to anything curious and press <kbd>E</kbd>
       (or tap it) to collect its stamp. <strong>${got} of ${curiosities.length}</strong> so far.</p>
     <ul class="stamps">${items}</ul>`,
    C.pink,
  );
}
stampsBtn.addEventListener('click', openStamps);

dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  canvas.focus({ preventScroll: true });
  if (pendingToast) {
    showToast(pendingToast);
    pendingToast = null;
  }
});

// ── Poking at curiosities ──
function burst(x, y, kind) {
  if (reduced) return;
  for (let i = 0; i < 9; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y,
      vx: (Math.random() - 0.5) * 70,
      vy: -40 - Math.random() * 50,
      life: 1,
      size: 6 + Math.random() * 5,
      kind,
      color: [C.pink, C.yellow, C.orange, C.lavender][i % 4],
    });
  }
}

function poke(q) {
  target = null;
  autoUse = null;
  let text;
  if (q.action === 'bike') {
    player.bike = !player.bike;
    text = player.bike ? q.rentText : q.returnText;
  } else {
    q.lineIndex = ((q.lineIndex ?? -1) + 1) % q.lines.length;
    text = q.lines[q.lineIndex];
  }
  speech = { thing: q, text, until: clock + 3 + text.length * 0.045 };
  burst(q.x, q.topY + 20, q.burst || 'sparkles');
  if (collect(q.id)) {
    stampsBtn.classList.remove('bump');
    void stampsBtn.offsetWidth;
    stampsBtn.classList.add('bump');
    if (countOf(curiosities) === curiosities.length) showToast('Stamp book complete! You are now an honorary islander.');
  }
}

const interact = (t) => (isPlace(t) ? openPlace(t) : poke(t));

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
    if (!e.repeat) interact(near);
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
  if (near && inBox(pt, bubble, 14)) return interact(near);
  const hit = things.filter((t) => inBox(pt, t.bounds)).sort((a, b) => b.y - a.y)[0];
  bestDist = Infinity;
  if (hit) {
    if (hit === near) return interact(hit);
    target = { ...hit.door };
    autoUse = hit;
  } else {
    target = pt;
    autoUse = null;
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

function updatePlayer(dt) {
  let dx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
  let dy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
  let maxStep = Infinity;

  if (dx || dy) {
    target = null;
    autoUse = null;
  } else if (target) {
    const tx = target.x - player.x;
    const ty = target.y - player.y;
    const d = Math.hypot(tx, ty);
    if (d < 3) {
      target = null;
      if (autoUse) interact(autoUse);
      autoUse = null;
    } else {
      dx = tx / d;
      dy = ty / d;
      maxStep = d;
    }
  }

  player.moving = !!(dx || dy);
  if (!player.moving) return;

  const len = Math.hypot(dx, dy);
  dx /= len;
  dy /= len;
  const boost = player.onWater ? 0.85 : player.bike ? BIKE_BOOST : 1;
  const step = Math.min(SPEED * boost * dt, maxStep);
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
  const moved = Math.hypot(player.x - ox, player.y - oy);
  player.dist += moved;
  if (moved < step * 0.1 && target) stuck += 1;

  if (stuck > 1.2 && target) {
    if (autoUse && Math.hypot(player.x - autoUse.door.x, player.y - autoUse.door.y) < REACH * 1.5) interact(autoUse);
    target = null;
    autoUse = null;
    stuck = 0;
  }
  hint.classList.add('hidden');
}

function update(dt) {
  updatePlayer(dt);
  player.onWater = !world.isLand(player.x, player.y);

  near = null;
  let best = REACH;
  for (const t of things) {
    const d = Math.hypot(player.x - t.door.x, player.y - t.door.y);
    if (d < best) {
      best = d;
      near = t;
    }
  }
  if (speech && (clock > speech.until || Math.hypot(player.x - speech.thing.door.x, player.y - speech.thing.door.y) > REACH * 3)) {
    speech = null;
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

function updateAmbient(dt) {
  if (reduced) return;
  for (const g of gulls) {
    g.x += g.v * dt;
    g.y += Math.sin(clock * 0.6 + g.phase) * 6 * dt;
    if (g.x > WORLD.w + 120) {
      g.x = -120;
      g.y = 80 + Math.random() * (WORLD.h - 300);
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.97;
    p.life -= dt * 0.8;
    if (p.life <= 0) particles.splice(i, 1);
  }
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

// A little round bird in a pink beanie. Faces right; flipped when moving left.
function drawBird(c, p, t) {
  const moving = p.moving && !reduced;
  const riding = p.bike && !p.onWater;
  const hop = moving && !p.onWater && !riding ? Math.abs(Math.sin(t * 11)) * 4 : 0;
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
    ell(c, 0, 0, riding ? 28 : 15, 5);
    c.fill();
  }
  if (p.flip) c.scale(-1, 1);

  c.strokeStyle = INK;
  c.lineWidth = 2.4;
  if (p.onWater) {
    // Boat (with the rented bike tucked in the back)
    if (p.bike) {
      c.save();
      c.translate(-14, -19);
      c.scale(0.6, 0.6);
      drawBike(c, C.cobalt, 0);
      c.restore();
    }
    c.beginPath();
    c.moveTo(-32, -16);
    c.lineTo(32, -16);
    c.lineTo(22, 2);
    c.lineTo(-24, 2);
    c.closePath();
    paint(c, C.orange);
    c.strokeStyle = INK;
    c.lineWidth = 2.4;
    c.stroke();
    c.strokeStyle = C.white;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-26, -8);
    c.lineTo(26, -8);
    c.stroke();
    c.strokeStyle = INK;
    c.lineWidth = 2.4;
    c.translate(0, -12);
  } else if (riding) {
    drawBike(c, C.cobalt, p.dist / 10);
    // Pedalling legs
    const a = reduced ? 0 : p.dist / 10;
    c.strokeStyle = C.orange;
    c.beginPath();
    c.moveTo(-3, -30);
    c.lineTo(Math.cos(a) * 5, -10 + Math.sin(a) * 5);
    c.moveTo(1, -30);
    c.lineTo(-Math.cos(a) * 5, -10 - Math.sin(a) * 5);
    c.stroke();
    c.strokeStyle = INK;
    c.translate(-4, -26);
  } else {
    const step = moving ? Math.sin(t * 22) * 3 : 0;
    c.strokeStyle = C.orange;
    c.beginPath();
    c.moveTo(-4, -10);
    c.lineTo(-5 + step, 0);
    c.moveTo(5, -10);
    c.lineTo(5 - step, 0);
    c.stroke();
    c.strokeStyle = INK;
    c.translate(0, -6 - hop);
  }

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

function sparkle(c, x, y, r, color = C.yellow) {
  c.beginPath();
  c.moveTo(x, y - r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.quadraticCurveTo(x, y, x, y + r);
  c.quadraticCurveTo(x, y, x - r, y);
  c.quadraticCurveTo(x, y, x, y - r);
  c.fillStyle = color;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.stroke();
}

function drawGull(c, g, t) {
  const flap = reduced ? 0 : Math.sin(t * 7 + g.phase) * 4;
  c.save();
  c.fillStyle = 'rgba(29,27,30,0.08)';
  ell(c, g.x + 30, g.y + 120, 10, 3);
  c.fill();
  c.translate(g.x, g.y);
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(-12, 0);
  c.quadraticCurveTo(-6, -8 - flap, 0, 0);
  c.quadraticCurveTo(6, -8 - flap, 12, 0);
  c.strokeStyle = INK;
  c.lineWidth = 4.5;
  c.stroke();
  c.strokeStyle = C.white;
  c.lineWidth = 2.2;
  c.stroke();
  c.restore();
}

function wrap(c, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (c.measureText(next).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawSpeech(c, s) {
  c.font = SPEECH_FONT;
  const lines = wrap(c, s.text, 230);
  const lh = 22;
  const w = Math.max(...lines.map((l) => c.measureText(l).width)) + 28;
  const h = lines.length * lh + 18;
  const x = Math.max(cam.x + 8, Math.min(s.thing.x - w / 2, cam.x + vw / zoom - w - 8));
  const y = Math.max(cam.y + 70, s.thing.topY - h - 18);
  const tipX = Math.max(x + 18, Math.min(s.thing.x, x + w - 18));
  c.save();
  c.beginPath();
  c.roundRect(x, y, w, h, 16);
  c.moveTo(tipX - 9, y + h);
  c.lineTo(tipX, y + h + 13);
  c.lineTo(tipX + 9, y + h);
  c.fillStyle = C.white;
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 2.6;
  c.stroke();
  c.beginPath();
  c.moveTo(tipX - 8, y + h);
  c.lineTo(tipX + 8, y + h);
  c.strokeStyle = C.white;
  c.lineWidth = 3;
  c.stroke();
  c.fillStyle = INK;
  c.textAlign = 'left';
  c.textBaseline = 'top';
  lines.forEach((l, i) => c.fillText(l, x + 14, y + 10 + i * lh));
  c.restore();
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

function promptFor(t) {
  const key = touchy ? 'Tap' : 'E';
  if (isPlace(t)) return touchy ? `Tap to enter ${t.title}` : `Press E · ${t.title}`;
  if (t.action === 'bike') return `${key} · ${player.bike ? 'Return the bike' : 'Rent a bike'}`;
  return `${key} · ${t.name}`;
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

  for (const g of gulls) drawGull(ctx, g, t);

  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.5));
    if (p.kind === 'hearts') {
      heartPath(ctx, p.x, p.y, p.size);
      ctx.fillStyle = p.color === C.yellow ? C.pink : p.color;
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    } else {
      sparkle(ctx, p.x, p.y, p.size * 0.8, p.color);
    }
  }
  ctx.globalAlpha = 1;

  if (speech) drawSpeech(ctx, speech);

  bubble = null;
  if (near && !dialog.open && speech?.thing !== near) {
    bubble = pill(ctx, promptFor(near), player.x, player.y - (player.onWater ? 78 : player.bike ? 96 : 70), BUBBLE_FONT);
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  clock += dt;
  if (!dialog.open) update(dt);
  updateAmbient(dt);
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
  world = buildWorld(places, curiosities, Math.min(devicePixelRatio || 1, 1.5));
  player = { ...world.spawn, flip: false, moving: false, onWater: false, bike: false, dist: 0 };
  for (let i = 0; i < 4; i++) {
    gulls.push({ x: Math.random() * WORLD.w, y: 80 + Math.random() * (WORLD.h - 300), v: 35 + Math.random() * 30, phase: Math.random() * 6 });
  }
  snapCamera();
  renderMenu();
  if (touchy) hint.textContent = 'Tap anywhere to walk · tap things to poke them';
  requestAnimationFrame(loop);
  if (!visited.has(places[0].id)) openPlace(places[0]);
}

start();
