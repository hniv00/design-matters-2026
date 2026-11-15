// The Seto Inland Sea art islands, drawn in oil pastel.
//
// The sea, islands and island names are painted once onto a big
// "ground" canvas. Buildings, trees and the ferry are small pre-drawn
// sprites that get depth-sorted with the player every frame.

import {
  C, INK, PAPER, mulberry32, shape, line, rect, ellipse, curve, scribble, hatch, crayon, trace, pointInPoly,
  drawBike, heartPath,
} from './sketch.js';

export const WORLD = { w: 2000, h: 1620 };

// Loosely following the real map (north is up). Takamatsu is the mainland port.
export const ISLANDS = [
  { name: 'Naoshima', x: 480, y: 900, rx: 270, ry: 190, seed: 11 },
  { name: 'Teshima', x: 1060, y: 500, rx: 250, ry: 160, seed: 12 },
  { name: 'Inujima', x: 1580, y: 250, rx: 150, ry: 100, seed: 13 },
  { name: 'Shodoshima', x: 1660, y: 810, rx: 290, ry: 220, seed: 14 },
  { name: 'Megijima', x: 890, y: 1085, rx: 100, ry: 72, seed: 15 },
  { name: 'Ogijima', x: 1200, y: 1050, rx: 125, ry: 88, seed: 16 },
];

const PORT = [1000, 1318];
export const FERRY_ROUTES = [
  [PORT, [610, 1080], -0.12],
  [PORT, [1075, 655], 0.04],
  [PORT, [1170, 1132], 0.1],
  [PORT, [1450, 960], 0.12],
  [[1300, 470], [1480, 318], -0.15],
];

// Ground footprint (blocks walking) per kind: width × depth.
const FOOT = {
  sign: [90, 14], museum: [220, 44], drop: [220, 40], chimney: [150, 40], terminal: [96, 30],
  pumpkin: [64, 18], pine: [16, 10], olive: [14, 8], house: [60, 20], torii: [80, 10],
  lighthouse: [26, 14], redPumpkin: [76, 20], bikes: [96, 22], vending: [40, 12], cat: [18, 6],
  heartHut: [86, 22], oni: [30, 12], bigOlive: [22, 10], windmill: [70, 26], cave: [150, 34],
};

// Sprite canvas box: [width, height, anchorX, anchorY] — anchor is the front-centre base.
const BOX = {
  sign: [130, 120, 65, 104], museum: [300, 170, 150, 150], drop: [270, 110, 135, 95],
  chimney: [200, 240, 100, 216], terminal: [290, 150, 145, 128], pumpkin: [110, 100, 55, 88],
  pine: [110, 125, 55, 112], olive: [90, 90, 45, 82], house: [90, 85, 45, 72], torii: [130, 120, 65, 106],
  lighthouse: [60, 150, 30, 136], ferry: [150, 90, 75, 70], redPumpkin: [120, 110, 60, 98],
  bikes: [200, 125, 100, 112], vending: [60, 100, 30, 90], cat: [60, 50, 28, 44], heartHut: [120, 105, 60, 94],
  oni: [80, 95, 38, 86], bigOlive: [150, 145, 75, 132], windmill: [190, 210, 95, 196],
  cave: [200, 120, 100, 104],
};

const shadow = (ctx, rx, ry) => {
  ctx.save();
  ctx.fillStyle = 'rgba(29,27,30,0.14)';
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const dot = (ctx, x, y, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

function dottedLobes(ctx, rng, lobes, color) {
  for (const [x, y, rx, ry] of lobes) {
    shape(ctx, rng, ellipse(x, y, rx, ry, rng, 0.04), { fill: color, holes: 0.12 });
    for (let row = -2; row <= 2; row++) {
      const yy = y + row * ry * 0.36;
      const span = rx * Math.sqrt(1 - (row / 2.8) ** 2) * 0.62;
      const n = Math.max(1, Math.round(span / 6));
      for (let i = 0; i <= n; i++) {
        dot(ctx, x - span + (2 * span * i) / n, yy, 3.2 - Math.abs(row) * 0.5 + rng() * 0.6, INK);
      }
    }
  }
}

// ── Sprite painters (origin = front-centre base, up is negative y) ──

const PAINT = {
  sign(ctx, rng, color) {
    shadow(ctx, 46, 8);
    shape(ctx, rng, rect(-36, -62, 8, 62), { fill: C.bark });
    shape(ctx, rng, rect(28, -62, 8, 62), { fill: C.bark });
    const board = rect(-54, -100, 108, 50);
    shape(ctx, rng, board, { fill: color || C.marigold });
    scribble(ctx, rng, board, C.pink, { r: 5, spacing: 12, alpha: 0.7 });
    line(ctx, rng, [[-30, -80], [30, -80]], { stroke: C.cobalt, width: 4 });
    line(ctx, rng, [[-22, -68], [22, -68]], { stroke: C.cobalt, width: 4 });
  },

  // Low concrete museum tucked into a green hill.
  museum(ctx, rng) {
    shadow(ctx, 140, 14);
    const hill = [];
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI + (i / 20) * Math.PI;
      hill.push([Math.cos(a) * 150, -30 + Math.sin(a) * 110]);
    }
    shape(ctx, rng, hill, { fill: C.green, stroke: C.deep });
    scribble(ctx, rng, hill, C.deep, { r: 6, spacing: 13, alpha: 0.7 });
    hatch(ctx, rng, hill, C.yellow, { spacing: 16, alpha: 0.5, width: 2.5 });
    const box = rect(-112, -64, 224, 64);
    shape(ctx, rng, box, { fill: C.concrete });
    hatch(ctx, rng, box, C.grey, { spacing: 10, alpha: 0.35 });
    for (let x = -96; x <= 96; x += 24) for (let y = -52; y <= -12; y += 20) dot(ctx, x, y, 1.6, INK);
    shape(ctx, rng, rect(-96, -50, 70, 8), { fill: INK, base: INK, passes: 1 });
    shape(ctx, rng, rect(-18, -46, 36, 46), { fill: INK, base: INK, passes: 1 });
  },

  // Flat white water-drop dome.
  drop(ctx, rng) {
    shadow(ctx, 125, 12);
    const dome = [];
    for (let i = 0; i <= 26; i++) {
      const a = Math.PI + (i / 26) * Math.PI;
      dome.push([Math.cos(a) * 118, Math.sin(a) * 52]);
    }
    shape(ctx, rng, dome, { fill: C.white, holes: 0.1 });
    hatch(ctx, rng, dome, C.sky, { spacing: 14, alpha: 0.25 });
    shape(ctx, rng, ellipse(52, -36, 20, 7, rng), { fill: INK, base: INK, passes: 1 });
    shape(ctx, rng, ellipse(-58, -26, 13, 5, rng), { fill: INK, base: INK, passes: 1 });
    const door = [];
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI + (i / 12) * Math.PI;
      door.push([Math.cos(a) * 22, Math.sin(a) * 26]);
    }
    shape(ctx, rng, door, { fill: INK, base: INK, passes: 1 });
  },

  // Old brick smelter with tall chimneys.
  chimney(ctx, rng) {
    shadow(ctx, 92, 12);
    for (const [x, y, r] of [[-38, -170, 16], [-24, -192, 20], [36, -196, 18], [52, -214, 14]]) {
      shape(ctx, rng, ellipse(x, y, r, r * 0.8, rng, 0.2), { fill: C.lavender, base: null, stroke: null, alpha: 0.85 });
    }
    shape(ctx, rng, rect(-52, -152, 24, 100), { fill: C.brick });
    shape(ctx, rng, rect(24, -176, 26, 124), { fill: C.brick });
    hatch(ctx, rng, rect(24, -176, 26, 124), INK, { spacing: 9, alpha: 0.25, width: 1.4 });
    const body = rect(-76, -64, 152, 64);
    shape(ctx, rng, body, { fill: C.orange });
    hatch(ctx, rng, body, C.brick, { spacing: 7, alpha: 0.5 });
    const saw = [[-82, -62]];
    for (let x = -82; x < 82; x += 33) saw.push([x + 30, -88], [x + 30, -62]);
    saw.push([82, -62]);
    shape(ctx, rng, saw, { fill: C.marigold });
    for (const x of [-56, 40]) shape(ctx, rng, rect(x, -46, 16, 20), { fill: C.cobalt });
    shape(ctx, rng, rect(-16, -42, 32, 42), { fill: INK, base: INK, passes: 1 });
  },

  // Ferry terminal: a floating white roof covered in letters.
  terminal(ctx, rng) {
    shadow(ctx, 130, 14);
    for (const x of [-110, -66, 66, 110]) line(ctx, rng, [[x, 0], [x, -78]], { width: 2.4 });
    shape(ctx, rng, rect(-48, -52, 96, 52), { fill: C.sky, holes: 0.35 });
    shape(ctx, rng, rect(-14, -40, 28, 40), { fill: C.white });
    const roof = ellipse(0, -86, 132, 20, rng, 0.08, 30);
    shape(ctx, rng, roof, { fill: C.white, holes: 0.1 });
    const cols = [C.pink, C.cobalt, C.orange, C.green, C.lavender];
    ctx.save();
    trace(ctx, roof);
    ctx.clip();
    for (let i = 0; i < 26; i++) {
      const x = -118 + i * 9.3 + (rng() - 0.5) * 4;
      const y = -92 + (rng() - 0.5) * 16;
      const k = Math.floor(rng() * 3);
      const pts = k === 0
        ? [[x - 3, y + 4], [x, y - 4], [x + 3, y + 4]]
        : k === 1
          ? [[x - 3, y - 3], [x + 3, y - 3], [x - 3, y + 4], [x + 3, y + 4]]
          : ellipse(x, y, 3, 3.5, rng, 0, 8);
      line(ctx, rng, pts, { stroke: cols[i % cols.length], width: 1.8, amp: 0.6, closed: k === 2 });
    }
    ctx.restore();
  },

  // Big yellow pumpkin covered in black dots.
  pumpkin(ctx, rng) {
    shadow(ctx, 44, 9);
    dottedLobes(ctx, rng, [[-20, -34, 22, 32], [20, -34, 22, 32], [0, -36, 24, 35]], C.yellow);
    shape(ctx, rng, rect(-4, -78, 8, 10), { fill: C.green });
  },

  // Red pumpkin with holes you can peek into.
  redPumpkin(ctx, rng) {
    shadow(ctx, 52, 10);
    dottedLobes(ctx, rng, [[-25, -40, 27, 38], [25, -40, 27, 38], [0, -42, 29, 42]], C.red);
    for (const [x, y, rx, ry] of [[-18, -44, 8, 11], [16, -56, 6, 8], [6, -18, 9, 7]]) {
      shape(ctx, rng, ellipse(x, y, rx, ry, rng, 0.15), { fill: INK, base: INK, passes: 1 });
    }
    shape(ctx, rng, rect(-5, -94, 10, 12), { fill: INK, base: INK });
  },

  // Bike rental kiosk with a striped awning.
  bikes(ctx, rng) {
    shadow(ctx, 92, 10);
    shape(ctx, rng, rect(-44, -64, 88, 64), { fill: C.white });
    shape(ctx, rng, rect(-30, -50, 60, 22), { fill: C.sky });
    shape(ctx, rng, rect(-12, -26, 24, 26), { fill: C.bark });
    for (let x = -50; x <= 50; x += 20) shape(ctx, rng, ellipse(x, -64, 10, 7, rng), { fill: C.pink, width: 2, passes: 1 });
    const aw = [[-56, -64], [56, -64], [46, -84], [-46, -84]];
    shape(ctx, rng, aw, { fill: C.pink });
    ctx.save();
    trace(ctx, aw);
    ctx.clip();
    for (let x = -60; x <= 60; x += 20) line(ctx, rng, [[x, -86], [x * 1.15, -62]], { stroke: C.white, width: 6 });
    ctx.restore();
    shape(ctx, rng, rect(-34, -110, 68, 26), { fill: C.yellow });
    ctx.fillStyle = INK;
    ctx.font = '700 19px Gaegu, "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BIKES', 0, -96);
    ctx.save();
    ctx.translate(-70, 0);
    drawBike(ctx, C.cobalt, 0.4);
    ctx.restore();
    ctx.save();
    ctx.translate(72, 0);
    ctx.scale(-1, 1);
    drawBike(ctx, C.orange, 1.1);
    ctx.restore();
  },

  vending(ctx, rng) {
    shadow(ctx, 26, 6);
    shape(ctx, rng, rect(-21, -82, 42, 82), { fill: C.cobalt });
    shape(ctx, rng, rect(-15, -76, 30, 36), { fill: C.white, passes: 1 });
    const cans = [C.pink, C.orange, C.yellow, C.green];
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = crayon(ctx, cans[(r + k) % 4], 0.1);
        ctx.fillRect(-12 + k * 6.5, -72 + r * 11, 4.5, 8);
      }
    }
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = C.red;
      ctx.beginPath();
      ctx.arc(-10 + k * 6.5, -34, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    shape(ctx, rng, rect(-13, -22, 26, 9), { fill: INK, base: INK, passes: 1 });
  },

  cat(ctx, rng, color) {
    const fur = color || C.marigold;
    shadow(ctx, 15, 4);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    trace(ctx, [[8, -5], [19, -8], [18, -20], [14, -24]], false);
    ctx.stroke();
    ctx.strokeStyle = crayon(ctx, fur, 0.1);
    ctx.lineWidth = 3.4;
    ctx.stroke();
    ctx.restore();
    shape(ctx, rng, ellipse(1, -11, 12, 11, rng), { fill: fur, width: 2.2, passes: 1, amp: 1 });
    shape(ctx, rng, [[-10, -27], [-9, -38], [-3, -32]], { fill: fur, width: 2, passes: 1, amp: 0.8 });
    shape(ctx, rng, [[1, -32], [6, -38], [7, -27]], { fill: fur, width: 2, passes: 1, amp: 0.8 });
    shape(ctx, rng, ellipse(-2, -25, 10, 8.5, rng), { fill: fur, width: 2.2, passes: 1, amp: 1 });
    dot(ctx, -5.5, -26, 1.5, INK);
    dot(ctx, 1.5, -26, 1.5, INK);
    dot(ctx, -2, -23, 1.4, C.pink);
    dot(ctx, -8, -22, 2, C.blush);
    dot(ctx, 4, -22, 2, C.blush);
  },

  // A small dark hut that keeps recorded heartbeats.
  heartHut(ctx, rng) {
    shadow(ctx, 56, 8);
    const wall = rect(-42, -56, 84, 56);
    shape(ctx, rng, wall, { fill: '#3b3035' });
    hatch(ctx, rng, wall, C.grey, { spacing: 7, slant: 0, alpha: 0.35, width: 1.4 });
    shape(ctx, rng, [[-50, -52], [0, -84], [50, -52]], { fill: '#2a2326' });
    shape(ctx, rng, rect(-11, -26, 22, 26), { fill: C.white, passes: 1 });
    ctx.save();
    heartPath(ctx, 0, -40, 11);
    ctx.fillStyle = C.red;
    ctx.fill();
    ctx.strokeStyle = C.pink;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  },

  // Megijima is said to be the ogre island. This one just waves.
  oni(ctx, rng) {
    shadow(ctx, 22, 5);
    shape(ctx, rng, rect(-11, -16, 8, 16), { fill: C.red, width: 2, passes: 1 });
    shape(ctx, rng, rect(3, -16, 8, 16), { fill: C.red, width: 2, passes: 1 });
    const pants = rect(-14, -30, 28, 15);
    shape(ctx, rng, pants, { fill: C.yellow, width: 2.2 });
    hatch(ctx, rng, pants, INK, { spacing: 6, slant: 0.2, alpha: 0.8, width: 2 });
    ctx.save();
    ctx.lineCap = 'round';
    for (const [w, col] of [[8, INK], [5, C.red]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(11, -44);
      ctx.lineTo(23, -60);
      ctx.stroke();
    }
    ctx.restore();
    shape(ctx, rng, ellipse(0, -42, 15, 15, rng), { fill: C.red, width: 2.4 });
    shape(ctx, rng, [[-10, -70], [-8, -82], [-3, -72]], { fill: C.yellow, width: 2, passes: 1, amp: 0.6 });
    shape(ctx, rng, [[3, -72], [8, -82], [10, -70]], { fill: C.yellow, width: 2, passes: 1, amp: 0.6 });
    shape(ctx, rng, ellipse(0, -62, 13, 12, rng), { fill: C.red, width: 2.4 });
    dot(ctx, -4.5, -64, 1.8, INK);
    dot(ctx, 4.5, -64, 1.8, INK);
    ctx.save();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -59, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();
  },

  bigOlive(ctx, rng) {
    shadow(ctx, 30, 7);
    line(ctx, rng, [[-4, 0], [4, -20], [-6, -40], [2, -58]], { stroke: C.grey, width: 9 });
    line(ctx, rng, [[2, -36], [16, -52]], { stroke: C.grey, width: 5 });
    const b = ellipse(0, -84, 60, 42, rng, 0.22, 26);
    shape(ctx, rng, b, { fill: C.sage, stroke: C.deep, width: 2.4 });
    scribble(ctx, rng, b, C.deep, { r: 5, spacing: 10, alpha: 0.45, width: 1.4 });
    for (let i = 0; i < 16; i++) dot(ctx, (rng() - 0.5) * 90, -84 + (rng() - 0.5) * 60, 2.8, '#4b3a78');
  },

  // The white windmill of Shodoshima's olive park.
  windmill(ctx, rng) {
    shadow(ctx, 60, 10);
    const tower = [[-34, 0], [34, 0], [26, -112], [-26, -112]];
    shape(ctx, rng, tower, { fill: C.white, holes: 0.1 });
    hatch(ctx, rng, tower, C.sky, { spacing: 12, alpha: 0.3 });
    shape(ctx, rng, [[-32, -110], [0, -150], [32, -110]], { fill: C.pink });
    shape(ctx, rng, rect(-12, -40, 24, 40), { fill: C.cobalt });
    shape(ctx, rng, rect(-8, -86, 16, 18), { fill: C.sky, passes: 1 });
    // Sails: four lattice blades around the hub
    const hub = [0, -118];
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 4 + (k * Math.PI) / 2;
      const ux = Math.cos(a);
      const uy = Math.sin(a);
      const px = -uy;
      const py = ux;
      const p0 = [hub[0] + ux * 10, hub[1] + uy * 10];
      const p1 = [hub[0] + ux * 82, hub[1] + uy * 82];
      const blade = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p1[0] + px * 16, p1[1] + py * 16],
        [p0[0] + px * 12, p0[1] + py * 12],
      ];
      shape(ctx, rng, blade, { fill: C.sand, width: 2, passes: 1, amp: 1 });
      for (let t = 0.25; t < 1; t += 0.25) {
        const x = p0[0] + (p1[0] - p0[0]) * t;
        const y = p0[1] + (p1[1] - p0[1]) * t;
        line(ctx, rng, [[x, y], [x + px * 14, y + py * 14]], { width: 1.4, amp: 0.5 });
      }
      line(ctx, rng, [p0, p1], { stroke: C.bark, width: 3, amp: 0.8 });
    }
    dot(ctx, hub[0], hub[1], 5, INK);
  },

  // A rocky hill with the ogre cave in it.
  cave(ctx, rng) {
    shadow(ctx, 96, 12);
    const hill = [];
    for (let i = 0; i <= 22; i++) {
      const a = Math.PI + (i / 22) * Math.PI;
      hill.push([Math.cos(a) * 96, Math.sin(a) * (78 + Math.sin(i * 1.7) * 6)]);
    }
    shape(ctx, rng, hill, { fill: C.grey });
    scribble(ctx, rng, hill, C.lavender, { r: 7, spacing: 14, alpha: 0.7 });
    for (const [x, y, r] of [[-60, -22, 12], [58, -30, 14], [-30, -58, 10], [36, -62, 9]]) {
      shape(ctx, rng, ellipse(x, y, r, r * 0.75, rng, 0.25), { fill: C.concrete, width: 2, passes: 1 });
    }
    const mouth = [];
    for (let i = 0; i <= 14; i++) {
      const a = Math.PI + (i / 14) * Math.PI;
      mouth.push([Math.cos(a) * 30, Math.sin(a) * 44]);
    }
    shape(ctx, rng, mouth, { fill: INK, base: INK });
    // two little glowing eyes in the dark
    dot(ctx, -8, -24, 2.6, C.yellow);
    dot(ctx, 8, -24, 2.6, C.yellow);
    // a red rope with paper streamers over the entrance
    line(ctx, rng, curve([-38, -40], [38, -40], -0.12, 10), { stroke: C.red, width: 4 });
    for (const x of [-20, 0, 20]) line(ctx, rng, [[x, -45], [x - 2, -32]], { stroke: C.white, width: 3 });
  },

  pine(ctx, rng) {
    shadow(ctx, 18, 5);
    line(ctx, rng, [[0, 0], [-5, -24], [6, -50], [0, -78]], { stroke: C.bark, width: 6 });
    for (const [x, y, rx, ry] of [[-14, -66, 28, 12], [14, -82, 26, 11], [-4, -98, 20, 10]]) {
      const b = ellipse(x, y, rx, ry, rng, 0.25, 18);
      shape(ctx, rng, b, { fill: C.deep, stroke: INK, width: 2 });
      scribble(ctx, rng, b, C.green, { r: 4, spacing: 7, width: 1.4 });
    }
  },

  olive(ctx, rng) {
    shadow(ctx, 16, 5);
    line(ctx, rng, [[0, 0], [2, -14], [-3, -30]], { stroke: C.grey, width: 5 });
    const b = ellipse(0, -48, 30, 24, rng, 0.25, 20);
    shape(ctx, rng, b, { fill: C.sage, stroke: C.deep, width: 2 });
    hatch(ctx, rng, b, C.deep, { spacing: 7, alpha: 0.35, width: 1.4 });
    for (let i = 0; i < 6; i++) dot(ctx, (rng() - 0.5) * 36, -48 + (rng() - 0.5) * 28, 2.3, '#4b3a78');
  },

  house(ctx, rng) {
    shadow(ctx, 34, 6);
    const roof = [C.pink, C.cobalt, C.orange, C.lavender][Math.floor(rng() * 4)];
    shape(ctx, rng, rect(-28, -36, 56, 36), { fill: C.white });
    shape(ctx, rng, [[-36, -32], [0, -62], [36, -32]], { fill: roof });
    shape(ctx, rng, rect(-8, -22, 16, 22), { fill: C.bark });
  },

  torii(ctx, rng) {
    shadow(ctx, 50, 6);
    shape(ctx, rng, rect(-38, -86, 10, 86), { fill: C.orange });
    shape(ctx, rng, rect(28, -86, 10, 86), { fill: C.orange });
    shape(ctx, rng, rect(-46, -72, 92, 9), { fill: C.orange });
    shape(ctx, rng, [[-60, -86], [60, -86], [54, -100], [-54, -100]], { fill: INK, base: INK, passes: 1 });
    shape(ctx, rng, rect(-52, -92, 104, 8), { fill: C.orange });
  },

  lighthouse(ctx, rng) {
    shadow(ctx, 20, 5);
    shape(ctx, rng, [[-13, 0], [13, 0], [9, -96], [-9, -96]], { fill: C.orange, holes: 0.15 });
    hatch(ctx, rng, [[-13, 0], [13, 0], [9, -96], [-9, -96]], C.pink, { spacing: 6, alpha: 0.45 });
    shape(ctx, rng, rect(-11, -116, 22, 20), { fill: C.yellow });
    shape(ctx, rng, [[-13, -116], [0, -132], [13, -116]], { fill: C.orange });
  },

  ferry(ctx, rng) {
    ctx.save();
    ctx.strokeStyle = 'rgba(251,248,243,0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(-6, 0, 66, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    shape(ctx, rng, [[-62, -24], [64, -24], [50, 2], [-54, 2]], { fill: C.white });
    line(ctx, rng, [[-58, -12], [58, -12]], { stroke: C.cobalt, width: 5 });
    shape(ctx, rng, rect(-34, -46, 60, 22), { fill: C.white });
    for (let x = -28; x < 22; x += 13) shape(ctx, rng, rect(x, -40, 8, 8), { fill: C.sky, passes: 1, width: 1.6 });
    shape(ctx, rng, rect(28, -58, 13, 34), { fill: C.orange });
  },
};

function makeSprite(kind, res, rng, color) {
  const [w, h, ax, ay] = BOX[kind] || BOX.sign;
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * res);
  c.height = Math.ceil(h * res);
  const ctx = c.getContext('2d');
  ctx.scale(res, res);
  ctx.translate(ax, ay);
  (PAINT[kind] || PAINT.sign)(ctx, rng, color);
  return { img: c, w, h, ax, ay };
}

function islandPoly(is) {
  const rng = mulberry32(is.seed * 7919);
  const f1 = 2 + Math.floor(rng() * 2);
  const f2 = 5 + Math.floor(rng() * 3);
  const p1 = rng() * 6.28;
  const p2 = rng() * 6.28;
  const pts = [];
  for (let i = 0; i < 52; i++) {
    const a = (i / 52) * Math.PI * 2;
    const r = 1 + Math.sin(a * f1 + p1) * 0.08 + Math.sin(a * f2 + p2) * 0.05 + (rng() - 0.5) * 0.03;
    pts.push([is.x + Math.cos(a) * is.rx * r, is.y + Math.sin(a) * is.ry * r]);
  }
  return pts;
}

function mainlandPoly() {
  const pts = [];
  for (let x = -40; x <= WORLD.w + 40; x += 40) pts.push([x, 1330 + Math.sin(x / 190) * 22 + Math.sin(x / 53) * 6]);
  pts.push([WORLD.w + 40, WORLD.h + 40], [-40, WORLD.h + 40]);
  return pts;
}

const grow = (pts, cx, cy, k) => pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);

// ── Build ───────────────────────────────────────────────────

export function buildWorld(places, curiosities = [], res = 1) {
  const rng = mulberry32(2026);
  const lands = ISLANDS.map((is) => ({ ...is, poly: islandPoly(is) }));
  const mainland = { name: 'Takamatsu', poly: mainlandPoly() };
  const allLand = [...lands, mainland];
  const isLand = (x, y) => allLand.some((l) => pointInPoly(l.poly, x, y));

  const objects = [];
  const colliders = [];
  const keepClear = []; // rects where scenery may not grow

  const add = (kind, x, y, color, place) => {
    const sprite = makeSprite(kind, res, mulberry32(Math.round(x * 13 + y * 7)), color);
    const o = { kind, x, y, sprite, place };
    objects.push(o);
    const f = FOOT[kind];
    if (f) colliders.push({ x: x - f[0] / 2, y: y - f[1], w: f[0], h: f[1] });
    return o;
  };

  // Portfolio places
  for (const p of places) {
    const o = add(p.kind, p.x, p.y, p.color, p);
    const s = o.sprite;
    p.door = { x: p.x, y: p.y + 30 };
    p.bounds = { x: p.x - s.ax, y: p.y - s.ay, w: s.w, h: s.h };
    p.labelY = p.y - s.ay + 4;
    keepClear.push({ x: p.bounds.x - 20, y: p.bounds.y, w: p.bounds.w + 40, h: p.bounds.h + 20 });
    keepClear.push({ x: p.x - 70, y: p.y, w: 140, h: 170 });
  }

  // Curiosities: little things to poke at and collect stamps from
  for (const q of curiosities) {
    const o = add(q.kind, q.x, q.y, q.color, q);
    const s = o.sprite;
    q.sprite = s;
    q.door = { x: q.x, y: q.y + 22 };
    q.bounds = { x: q.x - s.ax, y: q.y - s.ay, w: s.w, h: s.h };
    q.topY = q.y - s.ay;
    keepClear.push({ x: q.bounds.x - 20, y: q.bounds.y, w: q.bounds.w + 40, h: q.bounds.h + 50 });
  }

  const spawn = { x: places[0]?.x ?? 1000, y: (places[0]?.y ?? 1385) + 90 };
  keepClear.push({ x: spawn.x - 80, y: spawn.y - 60, w: 160, h: 120 });

  // Scenery
  const inRect = (x, y, r) => r && x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h;
  const scatter = (land, kind, count, gap) => {
    for (let tries = 0, made = 0; made < count && tries < count * 60; tries++) {
      const x = land.x - land.rx + rng() * land.rx * 2;
      const y = land.y - land.ry + rng() * land.ry * 2;
      const ok = [[0, 0], [-22, 0], [22, 0], [0, 14], [0, -45]].every(([dx, dy]) => pointInPoly(land.poly, x + dx, y + dy));
      if (!ok || keepClear.some((r) => inRect(x, y, r))) continue;
      if (objects.some((o) => Math.hypot(o.x - x, o.y - y) < gap)) continue;
      add(kind, x, y);
      made++;
    }
  };
  const byName = Object.fromEntries(lands.map((l) => [l.name, l]));
  scatter(byName.Naoshima, 'pine', 6, 70);
  scatter(byName.Teshima, 'pine', 6, 60);
  scatter(byName.Teshima, 'olive', 4, 50);
  scatter(byName.Inujima, 'pine', 3, 60);
  scatter(byName.Shodoshima, 'olive', 20, 46);
  scatter(byName.Shodoshima, 'pine', 4, 60);
  scatter(byName.Megijima, 'pine', 4, 50);
  scatter(byName.Ogijima, 'house', 4, 55);
  scatter(byName.Ogijima, 'pine', 2, 50);
  const coast = { ...mainland, x: 1000, y: 1470, rx: 1000, ry: 140 };
  scatter(coast, 'house', 9, 90);
  scatter(coast, 'pine', 12, 70);

  // Ferry on the Naoshima route
  const route = curve(...FERRY_ROUTES[0].slice(0, 2), FERRY_ROUTES[0][2], 60).slice(14, -6);
  const ferry = add('ferry', route[0][0], route[0][1]);
  colliders.pop(); // the ferry doesn't block
  ferry.route = route;
  ferry.t = 0;
  ferry.dir = 1;
  ferry.wait = 0;

  // ── Paint the ground ──
  const W = WORLD.w;
  const H = WORLD.h;
  const ground = document.createElement('canvas');
  ground.width = Math.ceil(W * res);
  ground.height = Math.ceil(H * res);
  const g = ground.getContext('2d');
  g.scale(res, res);

  g.fillStyle = PAPER;
  g.fillRect(0, 0, W, H);
  g.fillStyle = crayon(g, C.sea, 0.2);
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 18; i++) {
    const b = ellipse(rng() * W, rng() * H, 120 + rng() * 200, 50 + rng() * 80, rng, 0.3);
    shape(g, rng, b, { fill: rng() < 0.5 ? C.lavender : C.sky, base: null, stroke: null, alpha: 0.45 });
  }
  for (let i = 0; i < 320; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const len = 30 + rng() * 60;
    const pts = [];
    for (let k = 0; k <= 8; k++) pts.push([x + (k / 8) * len, y + Math.sin(k * 1.4) * 4]);
    const col = [C.cobalt, C.cobalt, C.white, C.turquoise][Math.floor(rng() * 4)];
    line(g, rng, pts, { stroke: col, width: 2.4, amp: 1.5, alpha: 0.75 });
  }

  // Ferry routes (dotted)
  g.save();
  g.strokeStyle = 'rgba(251,248,243,0.9)';
  g.lineWidth = 5;
  g.lineCap = 'round';
  g.setLineDash([1, 14]);
  for (const [a, b, bend] of FERRY_ROUTES) {
    trace(g, curve(a, b, bend, 30), false);
    g.stroke();
  }
  g.restore();

  // Islands
  for (const land of allLand) {
    const cx = land.x ?? 1000;
    const cy = land.y ?? 1500;
    const rim = land === mainland ? land.poly.map(([x, y]) => [x, y - 12]) : grow(land.poly, cx, cy, 1.07);
    shape(g, rng, rim, { fill: C.sand, stroke: C.pink, width: 4, passes: 1, amp: 3 });
    shape(g, rng, land.poly, { fill: C.leaf, stroke: C.deep, width: 2.4, amp: 3 });
    scribble(g, rng, land.poly, C.green, { r: 9, spacing: 22, width: 1.8, alpha: 0.55 });
    hatch(g, rng, land.poly, C.yellow, { spacing: 26, alpha: 0.35, width: 3 });
    for (let i = 0; i < (land.rx || 600) / 4; i++) {
      const x = cx - (land.rx || 1000) + rng() * (land.rx || 1000) * 2;
      const y = cy - (land.ry || 200) + rng() * (land.ry || 200) * 2;
      if (!pointInPoly(land.poly, x, y)) continue;
      dot(g, x, y, 2 + rng() * 2.2, [C.pink, C.orange, C.white, C.yellow, C.lavender][Math.floor(rng() * 5)]);
    }
  }

  // Teshima rice terraces
  const tes = byName.Teshima;
  g.save();
  trace(g, tes.poly);
  g.clip();
  for (let i = 0; i < 7; i++) {
    line(g, rng, curve([1150, 400 + i * 16], [1300, 440 + i * 16], -0.15, 12), { stroke: i % 2 ? C.yellow : C.deep, width: 4, alpha: 0.7 });
  }
  g.restore();

  // Island names, written in white pastel on the water
  g.save();
  g.font = '700 38px Gaegu, "Comic Sans MS", cursive';
  g.textAlign = 'center';
  g.fillStyle = crayon(g, C.white, 0.08);
  g.strokeStyle = C.cobalt;
  g.lineWidth = 6;
  g.lineJoin = 'round';
  for (const l of lands) {
    g.strokeText(l.name, l.x, l.y + l.ry + 42);
    g.fillText(l.name, l.x, l.y + l.ry + 42);
  }
  g.fillStyle = crayon(g, C.deep, 0.2);
  g.fillText('Takamatsu', 260, 1470);
  g.restore();

  return { ground, objects, colliders, isLand, ferry, spawn };
}
