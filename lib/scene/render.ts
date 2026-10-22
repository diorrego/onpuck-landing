// Composition shared by the Node poster script and the browser engine: a static base
// (floor, walls) plus depth-sorted sprites in RGBA. Fades are dithered, never blended.

import { P, rgba } from './palette';
import { Raster } from './raster';
import { project } from './sprites';
import { WORLD, tileAt, type Material } from './world';

export const CANVAS_W = 432;
export const CANVAS_H = 280;
export const ORIGIN_X = WORLD.rows * 16 + 8;
export const ORIGIN_Y = 56;
export const WALL_H = 48;

export function screenOf(c: number, r: number, z = 0): [number, number] {
  const [x, y] = project(c, r, z);
  return [x + ORIGIN_X, y + ORIGIN_Y];
}

const hash = (c: number, r: number, k = 0) => {
  let h = (c * 374761393 + r * 668265263 + k * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

function quad(r: Raster, pts: [number, number, number][], color: number) {
  r.polygon(pts.map(([c, rr, z]) => screenOf(c, rr, z)), color);
}

function line(r: Raster, a: [number, number, number], b: [number, number, number], color: number) {
  const [x0, y0] = screenOf(...a);
  const [x1, y1] = screenOf(...b);
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i++) {
    const t = steps ? i / steps : 0;
    r.set(Math.floor(x0 + (x1 - x0) * t), Math.floor(y0 + (y1 - y0) * t), color);
  }
}

function tileColors(material: Material, c: number, r: number): [number, number] {
  switch (material) {
    case 'tile':
      return (c + r) % 2 ? [P.tileDark, P.tileDark] : [P.tileLight, P.tileLight];
    case 'wood':
      return r % 2 ? [P.woodMid, P.woodDark] : [P.woodLight, P.woodMid];
    case 'carpet':
      return [P.carpetLight, P.carpetDark];
    case 'rug':
      return [P.carpetDark, P.carpetLight];
    case 'pavement':
      return [P.pavement, P.pavementDark];
    case 'grass':
      return [P.grassLight, P.grassDark];
    case 'asphalt':
      return [P.asphalt, P.white];
  }
}

function drawFloor(raster: Raster) {
  for (let r = 0; r < WORLD.rows; r++) {
    for (let c = 0; c < WORLD.cols; c++) {
      const { material } = tileAt(c, r);
      const [fill, detail] = tileColors(material, c, r);
      quad(raster, [[c, r, 0], [c + 1, r, 0], [c + 1, r + 1, 0], [c, r + 1, 0]], fill);
      if (material === 'wood') {
        // plank seams along c, staggered
        const s = hash(c, r) > 0.5 ? 0.35 : 0.7;
        line(raster, [c + s, r + 0.02, 0], [c + s, r + 0.98, 0], detail);
        line(raster, [c, r + 0.99, 0], [c + 1, r + 0.99, 0], P.woodDark);
      } else if (material === 'pavement') {
        line(raster, [c, r, 0], [c + 1, r, 0], detail);
        line(raster, [c, r, 0], [c, r + 1, 0], detail);
      } else if (material === 'grass') {
        for (let k = 0; k < 6; k++) {
          const [x, y] = screenOf(c + 0.15 + hash(c, r, k) * 0.7, r + 0.15 + hash(r, c, k + 9) * 0.7);
          raster.set(Math.floor(x), Math.floor(y), detail);
          raster.set(Math.floor(x), Math.floor(y) - 1, detail);
        }
      } else if (material === 'asphalt') {
        if (r === 11 && c < 13 && c % 2 === 0) line(raster, [c + 0.2, r + 0.5, 0], [c + 0.8, r + 0.5, 0], detail);
        if (c === 13 && r < 11 && r % 2 === 0) line(raster, [c + 0.5, r + 0.2, 0], [c + 0.5, r + 0.8, 0], detail);
      } else if (material === 'carpet' && hash(c, r) > 0.6) {
        const [x, y] = screenOf(c + 0.5, r + 0.5);
        raster.set(Math.floor(x), Math.floor(y), detail);
      } else if (material === 'rug') {
        const edge = (cc: number, rr: number) => tileAt(cc, rr).material !== 'rug';
        if (edge(c, r - 1)) line(raster, [c, r + 0.12, 0], [c + 1, r + 0.12, 0], P.white);
        if (edge(c, r + 1)) line(raster, [c, r + 0.88, 0], [c + 1, r + 0.88, 0], P.white);
        if (edge(c - 1, r)) line(raster, [c + 0.12, r, 0], [c + 0.12, r + 1, 0], P.white);
        if (edge(c + 1, r)) line(raster, [c + 0.88, r, 0], [c + 0.88, r + 1, 0], P.white);
      }
    }
  }
  // curb between the street and the buildings
  line(raster, [5, 6, 0], [14, 6, 0], P.pavementDark);
  line(raster, [5, 6, 0], [5, 12, 0], P.pavementDark);
}

function drawSlab(raster: Raster) {
  const T = 6;
  const R = WORLD.rows;
  const C = WORLD.cols;
  quad(raster, [[0, R, 0], [C, R, 0], [C, R, -T], [0, R, -T]], P.wallRight);
  quad(raster, [[C, 0, 0], [C, R, 0], [C, R, -T], [C, 0, -T]], P.baseboard);
}

function drawWalls(raster: Raster) {
  const H = WALL_H;
  const C = WORLD.cols;
  const R = WORLD.rows;
  const t = 0.25;
  // right wall along r = 0, inner face at r = 0
  quad(raster, [[0, 0, 0], [C, 0, 0], [C, 0, H], [0, 0, H]], P.wallLeft);
  quad(raster, [[C, -t, 0], [C, 0, 0], [C, 0, H], [C, -t, H]], P.wallRight);
  quad(raster, [[-t, -t, H], [C, -t, H], [C, 0, H], [0, 0, H]], P.wallTop);
  // left wall along c = 0, inner face at c = 0
  quad(raster, [[0, 0, 0], [0, R, 0], [0, R, H], [0, 0, H]], P.wallRight);
  quad(raster, [[-t, R, 0], [0, R, 0], [0, R, H], [-t, R, H]], P.wallLeft);
  quad(raster, [[-t, -t, H], [0, 0, H], [0, R, H], [-t, R, H]], P.wallTop);
  // baseboards
  for (let k = 0; k < 2; k++) {
    line(raster, [0, 0, k], [C, 0, k], P.baseboard);
    line(raster, [0, 0, k], [0, R, k], P.baseboard);
  }
  // windows
  for (const w of WORLD.windows) {
    const pts = (a: number, b: number, z0: number, z1: number): [number, number, number][] =>
      w.wall === 'right'
        ? [[a, 0, z0], [b, 0, z0], [b, 0, z1], [a, 0, z1]]
        : [[0, a, z0], [0, b, z0], [0, b, z1], [0, a, z1]];
    quad(raster, pts(w.from - 0.08, w.to + 0.08, 15, 40), P.white);
    quad(raster, pts(w.from, w.to, 17, 38), P.water);
    const mid = (w.from + w.to) / 2;
    quad(raster, pts(mid - 0.03, mid + 0.03, 17, 38), P.white);
    // glint
    const at = (k: number, z: number): [number, number, number] =>
      w.wall === 'right' ? [w.from + 0.2 + k, 0, z] : [0, w.from + 0.2 + k, z];
    line(raster, at(0, 24), at(0.3, 33), P.white);
  }
  // whiteboard with a tiny chart (green rises, coral dips)
  const wb = (a: number, b: number, z0: number, z1: number, color: number) =>
    quad(raster, [[a, 0, z0], [b, 0, z0], [b, 0, z1], [a, 0, z1]], color);
  wb(7.75, 9.05, 16, 36, P.deskShade);
  wb(7.82, 8.98, 18, 34, P.white);
  for (let i = 0; i < 6; i++) {
    const c0 = 7.95 + i * 0.16;
    line(raster, [c0, 0, 21 + i * 2], [c0 + 0.16, 0, 23 + i * 2], P.motivation);
    line(raster, [c0, 0, 30 - (i % 3)], [c0 + 0.16, 0, 29 - ((i + 1) % 3)], P.frustration);
  }
  // door on the left wall
  const d = WORLD.door;
  quad(raster, [[0, d.r0 - 0.08, 0], [0, d.r1 + 0.08, 0], [0, d.r1 + 0.08, 36], [0, d.r0 - 0.08, 36]], P.woodDark);
  quad(raster, [[0, d.r0, 0], [0, d.r1, 0], [0, d.r1, 34], [0, d.r0, 34]], P.woodMid);
  quad(raster, [[0, d.r0 + 0.12, 4], [0, d.r1 - 0.12, 4], [0, d.r1 - 0.12, 30], [0, d.r0 + 0.12, 30]], P.woodLight);
  const [kx, ky] = screenOf(0, d.r1 - 0.2, 16);
  raster.set(Math.floor(kx), Math.floor(ky), P.ink);
  // outline the whole set
  raster.outline(P.ink);
}

export function renderBase(): Raster {
  const raster = new Raster(CANVAS_W, CANVAS_H);
  drawSlab(raster);
  drawFloor(raster);
  drawWalls(raster);
  return raster;
}

// ---------------------------------------------------------------- RGBA compose

export type RgbaSprite = { width: number; height: number; px: Uint32Array; anchorX?: number; anchorY?: number };

export function toRgba(indexed: { width: number; height: number; data: Uint8Array }): RgbaSprite {
  const px = new Uint32Array(indexed.width * indexed.height);
  for (let i = 0; i < px.length; i++) px[i] = rgba(indexed.data[i]);
  return { width: indexed.width, height: indexed.height, px };
}

export type Drawable =
  | { kind: 'sprite'; key: string; x: number; y: number; depth: number; mirror?: boolean; alpha?: number }
  | { kind: 'shadow'; x: number; y: number; depth: number; w: number; alpha?: number };

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function darken(word: number): number {
  const r = word & 0xff;
  const g = (word >>> 8) & 0xff;
  const b = (word >>> 16) & 0xff;
  const k = 0.8;
  return ((0xff << 24) | (Math.round(b * k) << 16) | (Math.round(g * k) << 8) | Math.round(r * k)) >>> 0;
}

export function compose(
  target: Uint32Array,
  base: Uint32Array,
  width: number,
  height: number,
  sprites: Map<string, RgbaSprite>,
  drawables: Drawable[],
): void {
  target.set(base);
  const sorted = [...drawables].sort((a, b) => a.depth - b.depth);
  for (const d of sorted) {
    const alpha = d.alpha ?? 1;
    if (alpha <= 0) continue;
    if (d.kind === 'shadow') {
      const half = d.w / 2;
      for (let j = -1; j <= 1; j++) {
        const span = j === 0 ? half : half - 2;
        for (let i = -span; i < span; i++) {
          const x = Math.round(d.x + i);
          const y = Math.round(d.y + j);
          if (x < 0 || y < 0 || x >= width || y >= height) continue;
          if (alpha < 1 && BAYER[(y & 3) * 4 + (x & 3)] > alpha) continue;
          const at = y * width + x;
          if (target[at]) target[at] = darken(target[at]);
        }
      }
      continue;
    }
    const s = sprites.get(d.key);
    if (!s) continue;
    const ox = Math.round(d.x - (s.anchorX ?? 0));
    const oy = Math.round(d.y - (s.anchorY ?? 0));
    for (let j = 0; j < s.height; j++) {
      const y = oy + j;
      if (y < 0 || y >= height) continue;
      for (let i = 0; i < s.width; i++) {
        const x = ox + i;
        if (x < 0 || x >= width) continue;
        const word = s.px[j * s.width + (d.mirror ? s.width - 1 - i : i)];
        if (!word) continue;
        if (alpha < 1 && BAYER[(y & 3) * 4 + (x & 3)] > alpha) continue;
        target[y * width + x] = word;
      }
    }
  }
}
