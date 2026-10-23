// Renders the hero scene as a social clip (MP4 4:5 + GIF) from the same code and sprites as the
// page: one simulated person is marked, their frustration, fatigue and motivation drawn live,
// until they give up and leave. Not shipped with the site.
// Run: CLIP_OUT=/path/to/dir npx tsx scripts/render-clip.ts   (needs ffmpeg with drawtext)
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildAtlas } from '../lib/scene/atlas';
import { CANVAS_H, CANVAS_W, compose, renderBase, toRgba, type RgbaSprite } from '../lib/scene/render';
import { Simulation, type Agent } from '../lib/scene/sim';

const OUT = process.env.CLIP_OUT ?? join(__dirname, '..', 'out', 'clip');
const FONT = join(__dirname, '..', 'assets-og', 'cmu-serif-500-roman.ttf');
const SEED = Number(process.env.CLIP_SEED ?? 42);
const FPS = 30;
const DT = 1 / FPS;
const W = 1080;
const H = 1350;
const K = 2; // whole-pixel scale for the scene: 864 x 560
const SCENE_X = (W - CANVAS_W * K) / 2;
const SCENE_Y = 300;
mkdirSync(OUT, { recursive: true });

// ---- pass 1: find someone who gets frustrated and quits (not someone who finished)
type Quit = { id: number; at: number; from: number; label: string; device: string; task: string };
function scout(): Quit {
  const sim = new Simulation({ population: 24, seed: SEED });
  const seen = new Set<number>();
  const frustratedAt = new Map<number, number[]>();
  const prevR = new Map<number, number>();
  for (let t = 0; t < 240; t += DT) {
    const before = sim.stats.quit;
    sim.step(DT);
    for (const a of sim.agents) {
      // a friction event adds 0.25 to 0.5 to R at once
      if (a.R - (prevR.get(a.id) ?? a.R) > 0.2) frustratedAt.set(a.id, [...(frustratedAt.get(a.id) ?? []), sim.time]);
      prevR.set(a.id, a.R);
    }
    if (sim.stats.quit === before) continue;
    const quitter = sim.agents.find((a: Agent) => a.leaveAt && a.bubble?.icon === 'leave' && !seen.has(a.id) && a.R > a.F);
    if (!quitter) continue;
    seen.add(quitter.id);
    const hits = (frustratedAt.get(quitter.id) ?? []).filter((x) => x > sim.time - 12);
    // a quit worth showing: frustration that builds (two hits or more) and a seated start
    if (sim.time > 16 && hits.length >= 2) {
      const card = sim.inspect(quitter.id)!;
      return { id: quitter.id, at: sim.time, from: hits[0] - 1.5, label: card.label, device: card.device, task: card.task };
    }
  }
  throw new Error('no frustrated quit found; try another CLIP_SEED');
}

const quit = scout();
const START = Math.max(quit.from, quit.at - 12);
const END = quit.at + 5;
const QUIT_T = quit.at - START; // seconds into the clip
console.log(`${quit.label} (${quit.device}) quits at ${quit.at.toFixed(1)} s; clip ${START.toFixed(1)} to ${END.toFixed(1)} s`);

// ---- colours (page tokens) as packed RGBA words, little endian
const word = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return ((0xff << 24) | ((n & 0xff) << 16) | (((n >> 8) & 0xff) << 8) | ((n >> 16) & 0xff)) >>> 0;
};
const C = {
  paper: word('#ffffff'),
  line: word('#e5e5e5'),
  track: word('#f5f5f5'),
  frustration: word('#f0604d'),
  fatigue: word('#f4ab2f'),
  motivation: word('#35b86b'),
};

const frame = new Uint32Array(W * H);
const rect = (x: number, y: number, w: number, h: number, c: number, r = 0) => {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      // rounded corners: skip pixels outside the corner circles
      const dx = i < r ? r - i - 0.5 : i >= w - r ? i - (w - r) + 0.5 : 0;
      const dy = j < r ? r - j - 0.5 : j >= h - r ? j - (h - r) + 0.5 : 0;
      if (dx * dx + dy * dy > r * r) continue;
      frame[(y + j) * W + x + i] = c;
    }
};

// card geometry (labels are drawn by ffmpeg at the same coordinates)
const CARD = { x: 170, y: 920, w: 740, h: 300 };
const BAR = { x: CARD.x + 260, w: 420, h: 22, rows: [CARD.y + 110, CARD.y + 160, CARD.y + 210] };
const RING = { r: 36, stroke: 5, color: word('#1d4ed8') };
const ring = (cx: number, cy: number) => {
  for (let y = -RING.r - RING.stroke; y <= RING.r + RING.stroke; y++)
    for (let x = -RING.r - RING.stroke; x <= RING.r + RING.stroke; x++) {
      const d = Math.hypot(x, y);
      if (d >= RING.r && d < RING.r + RING.stroke) {
        const i = (cy + y) * W + cx + x;
        if (i >= 0 && i < frame.length) frame[i] = RING.color;
      }
    }
};

// ---- pass 2: render
const atlas = buildAtlas();
const sprites = new Map<string, RgbaSprite>();
for (const [key, s] of atlas) sprites.set(key, { ...toRgba(s), anchorX: s.anchorX, anchorY: s.anchorY });
const basePx = toRgba(renderBase()).px;
const scene = new Uint32Array(CANVAS_W * CANVAS_H);

const sim = new Simulation({ population: 24, seed: SEED });
for (let t = 0; t < START; t += DT) sim.step(DT);
let last = sim.inspect(quit.id)!;

const mp4 = join(OUT, 'onpuck-simulated-user-4x5.mp4');
const text = (name: string, value: string) => {
  const path = join(OUT, `${name}.txt`);
  writeFileSync(path, value);
  return path.replace(/:/g, '\\:');
};
const font = FONT.replace(/:/g, '\\:');
const draw = (file: string, x: string, y: number, size: number, color: string, extra = '') =>
  `drawtext=fontfile=${font}:textfile=${file}:x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}${extra}`;
const filters = [
  draw(text('t1', 'Simulated users that get tired,'), '(w-text_w)/2', 110, 60, '0x171717'),
  draw(text('t2', 'frustrated and quit'), '(w-text_w)/2', 185, 60, '0x171717'),
  draw(text('who', `${quit.label} · ${quit.device}`), `${CARD.x + 40}`, CARD.y + 34, 34, '0x171717'),
  draw(text('fr', 'Frustration'), `${CARD.x + 40}`, BAR.rows[0] - 8, 30, '0x525252'),
  draw(text('fa', 'Fatigue'), `${CARD.x + 40}`, BAR.rows[1] - 8, 30, '0x525252'),
  draw(text('mo', 'Motivation'), `${CARD.x + 40}`, BAR.rows[2] - 8, 30, '0x525252'),
  draw(text('st1', 'Still trying'), `${CARD.x + 40}`, CARD.y + 248, 30, '0x737373', `:enable='lt(t,${QUIT_T.toFixed(2)})'`),
  draw(text('st2', 'Gave up and left'), `${CARD.x + 40}`, CARD.y + 248, 30, '0xb3291a', `:enable='gte(t,${QUIT_T.toFixed(2)})'`),
  draw(text('url', 'onpuck.com'), '(w-text_w)/2', 1268, 32, '0x1d4ed8'),
].join(',');

const ff = spawn(
  'ffmpeg',
  ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-vf', filters, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4],
  { stdio: ['pipe', 'inherit', 'inherit'] },
);

async function render() {
  const frames = Math.round((END - START) * FPS);
  for (let f = 0; f < frames; f++) {
    sim.step(DT);
    last = sim.inspect(quit.id) ?? last;
    scene.fill(0);
    compose(scene, basePx, CANVAS_W, CANVAS_H, sprites, sim.drawables(sim.time, quit.id));
    frame.fill(C.paper);
    for (let y = 0; y < CANVAS_H * K; y++)
      for (let x = 0; x < CANVAS_W * K; x++) {
        const px = scene[Math.floor(y / K) * CANVAS_W + Math.floor(x / K)];
        if (px >>> 24) frame[(SCENE_Y + y) * W + SCENE_X + x] = px;
      }
    // the tracked person: a blue ring that follows them until they are gone
    const who = sim.agents.find((a) => a.id === quit.id);
    if (who && who.state !== 'gone' && who.alpha > 0.3) {
      const [sx, sy] = sim.screenPosition(who);
      ring(Math.round(SCENE_X + sx * K), Math.round(SCENE_Y + (sy - 9) * K));
    }
    rect(CARD.x, CARD.y, CARD.w, CARD.h, C.line, 24);
    rect(CARD.x + 2, CARD.y + 2, CARD.w - 4, CARD.h - 4, C.paper, 22);
    const values = [last.R, last.F, last.M];
    const colors = [C.frustration, C.fatigue, C.motivation];
    BAR.rows.forEach((y, i) => {
      rect(BAR.x, y, BAR.w, BAR.h, C.track, 9);
      const w = Math.max(BAR.h, Math.round(BAR.w * values[i]));
      rect(BAR.x, y, w, BAR.h, colors[i], 9);
    });
    const bytes = new Uint8Array(frame.buffer);
    if (!ff.stdin.write(bytes)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(`wrote ${mp4}`);

  // GIF at exactly half size, so the 2x pixel art lands on whole pixels again
  const gif = join(OUT, 'onpuck-simulated-user-4x5.gif');
  const g = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', mp4, '-vf',
    'fps=15,scale=540:675:flags=area,split[a][b];[a]palettegen=max_colors=128:stats_mode=full[p];[b][p]paletteuse=dither=none', gif], { stdio: 'inherit' });
  if (g.status === 0) console.log(`wrote ${gif}`);
}

render();
