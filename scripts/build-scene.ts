// Renders the scene assets from code into public/scene/:
//   sprites.png + sprites.json  the atlas the engine reads (repaintable by hand)
//   base.png                    floor and walls, the engine's background
//   poster.png                  the full scene at a fixed moment: LCP image, reduced motion, no JS
//   poster-ab.png               Fig. 3 still
// Run: npm run build:scene
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildAtlas, packAtlas } from '../lib/scene/atlas';
import { encodePng } from '../lib/scene/png';
import { CANVAS_H, CANVAS_W, compose, renderBase, toRgba, type RgbaSprite } from '../lib/scene/render';
import { Simulation } from '../lib/scene/sim';
import type { Raster } from '../lib/scene/raster';

const OUT = join(__dirname, '..', 'public', 'scene');
mkdirSync(OUT, { recursive: true });

const toBytes = (px: Uint32Array) => new Uint8Array(px.buffer, px.byteOffset, px.byteLength);
const savePng = (name: string, w: number, h: number, px: Uint32Array) => {
  const png = encodePng(w, h, toBytes(px));
  writeFileSync(join(OUT, name), png);
  console.log(`${name.padEnd(16)} ${w}x${h} ${(png.length / 1024).toFixed(1)} KB`);
};
const saveRaster = (name: string, r: Raster) => savePng(name, r.width, r.height, toRgba(r).px);

const atlas = buildAtlas();
const { sheet, frames } = packAtlas(atlas);
saveRaster('sprites.png', sheet);
writeFileSync(join(OUT, 'sprites.json'), JSON.stringify({ width: sheet.width, height: sheet.height, frames }));

const base = renderBase();
saveRaster('base.png', base);

const sprites = new Map<string, RgbaSprite>();
for (const [key, s] of atlas) sprites.set(key, { ...toRgba(s), anchorX: s.anchorX, anchorY: s.anchorY });
const basePx = toRgba(base).px;

function upscale(px: Uint32Array, w: number, h: number, k: number): Uint32Array {
  const out = new Uint32Array(w * k * h * k);
  for (let y = 0; y < h * k; y++) for (let x = 0; x < w * k; x++) out[y * w * k + x] = px[Math.floor(y / k) * w + Math.floor(x / k)];
  return out;
}

/** Nearest-neighbour resample to any size (used for the 1.5x Open Graph still). */
function resample(px: Uint32Array, w: number, h: number, w2: number, h2: number): Uint32Array {
  const out = new Uint32Array(w2 * h2);
  for (let y = 0; y < h2; y++) for (let x = 0; x < w2; x++) out[y * w2 + x] = px[Math.floor((y * h) / h2) * w + Math.floor((x * w) / w2)];
  return out;
}

function poster(name: string, sim: Simulation, seconds: number, twoX?: string) {
  for (let t = 0; t < seconds; t += 1 / 15) sim.step(1 / 15);
  const target = new Uint32Array(CANVAS_W * CANVAS_H);
  compose(target, basePx, CANVAS_W, CANVAS_H, sprites, sim.drawables(sim.time));
  savePng(name, CANVAS_W, CANVAS_H, target);
  // nearest-neighbour 2x for places that cannot scale pixel art crisply (the OG image)
  if (twoX) {
    savePng(twoX, CANVAS_W * 2, CANVAS_H * 2, upscale(target, CANVAS_W, CANVAS_H, 2));
    // the whole scene at 1.5x for the 1200x630 Open Graph image
    savePng('poster-og.png', CANVAS_W * 1.5, CANVAS_H * 1.5, resample(target, CANVAS_W, CANVAS_H, CANVAS_W * 1.5, CANVAS_H * 1.5));
  }
  return sim;
}

// Callouts for the still (reduced motion, no JS): three people whose state tells the story.
function callouts(sim: Simulation) {
  const live = sim.agents.filter((a) => a.state === 'using');
  const byIcon = (icons: string[]) => live.find((a) => a.bubble && icons.includes(a.bubble.icon));
  const picks = [
    { kind: 'frustrated', agent: byIcon(['alert', 'question']) ?? [...live].sort((a, b) => b.R - a.R)[0] },
    { kind: 'done', agent: byIcon(['check']) ?? [...live].sort((a, b) => b.P - a.P)[0] },
    { kind: 'tired', agent: byIcon(['tired', 'leave']) ?? [...live].sort((a, b) => b.F - a.F)[0] },
  ];
  const seen = new Set<number>();
  return picks
    .filter((p) => p.agent && !seen.has(p.agent.id) && seen.add(p.agent.id))
    .map(({ kind, agent }) => {
      const card = sim.inspect(agent!.id)!;
      const [x, y] = sim.screenPosition(agent!);
      const round = (v: number) => Math.round(v * 100) / 100;
      return { kind, x: Math.round(x), y: Math.round(y - 12), label: card.label, device: card.device, task: card.task, R: round(card.R), F: round(card.F), M: round(card.M), risk: card.risk };
    });
}

const life = poster('poster.png', new Simulation({ population: 24, seed: 42 }), Number(process.env.POSTER_T ?? 26), 'poster-2x.png');
poster('poster-ab.png', new Simulation({ population: 12, seed: 7, mode: 'ab', arm: 'test' }), 9);
writeFileSync(
  join(__dirname, '..', 'lib', 'scene', 'poster-callouts.json'),
  JSON.stringify({ width: CANVAS_W, height: CANVAS_H, callouts: callouts(life) }, null, 2) + '\n',
);
