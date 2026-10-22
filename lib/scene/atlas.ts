// Every runtime sprite under one key space, packed into one sheet (public/scene/sprites.png +
// sprites.json). The engine reads the sheet, so the art can be repainted by hand in an editor.

import { P } from './palette';
import { Raster, type IndexedSprite } from './raster';
import {
  CHARACTER_POSES,
  FRAME_H,
  FRAME_W,
  ICONS,
  PROPS,
  SKINS,
  characterFrame,
  iconSprite,
  propSprite,
  type IconName,
  type Pose,
  type PropName,
  type View,
} from './sprites';

export type AnchoredSprite = IndexedSprite & { anchorX: number; anchorY: number };
export type AtlasFrame = { x: number; y: number; w: number; h: number; ax: number; ay: number };

export const atlasKey = {
  char: (skin: number, view: View, pose: Pose) => `char:${skin}:${view}:${pose}`,
  prop: (name: PropName) => `prop:${name}`,
  bubble: (icon: IconName) => `bubble:${icon}`,
};

function bubble(icon: IconName): AnchoredSprite {
  const glyph = iconSprite(icon);
  const w = glyph.width + 4;
  const h = glyph.height + 4;
  const r = new Raster(w + 2, h + 4);
  // body with clipped corners, then a tail
  for (let y = 1; y < h + 1; y++) {
    for (let x = 1; x < w + 1; x++) {
      const corner = (x === 1 || x === w) && (y === 1 || y === h);
      if (!corner) r.set(x, y, P.bubble);
    }
  }
  const mid = Math.floor((w + 2) / 2);
  r.set(mid - 1, h + 1, P.bubble);
  r.set(mid, h + 1, P.bubble);
  r.set(mid - 1, h + 2, P.bubble);
  r.outline(P.ink);
  r.blit(glyph, 3, 3);
  return Object.assign(r, { anchorX: mid - 1, anchorY: h + 3 });
}

/** Small down arrow over the person whose state card is open. */
function marker(): AnchoredSprite {
  const rows = ['wwwwwww', '.wwwww.', '..www..', '...w...'];
  const r = new Raster(9, 6);
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === 'w') r.set(x + 1, y + 1, P.bubble);
  });
  r.outline(P.ink);
  return Object.assign(r, { anchorX: 4, anchorY: 5 });
}

export function buildAtlas(): Map<string, AnchoredSprite> {
  const atlas = new Map<string, AnchoredSprite>();
  SKINS.forEach((_, skin) => {
    for (const view of ['front', 'back'] as const) {
      for (const pose of CHARACTER_POSES) {
        const frame = characterFrame(skin, view, pose);
        atlas.set(atlasKey.char(skin, view, pose), Object.assign(frame, { anchorX: Math.floor(FRAME_W / 2), anchorY: FRAME_H - 1 }));
      }
    }
  });
  for (const name of PROPS) atlas.set(atlasKey.prop(name), propSprite(name));
  for (const icon of ICONS) atlas.set(atlasKey.bubble(icon), bubble(icon));
  atlas.set('marker', marker());
  return atlas;
}

/** Shelf packing into a 512 px wide sheet with 1 px gutters. */
export function packAtlas(atlas: Map<string, AnchoredSprite>) {
  const WIDTH = 512;
  const entries = [...atlas.entries()].sort((a, b) => b[1].height - a[1].height);
  const frames: Record<string, AtlasFrame> = {};
  let x = 0;
  let y = 0;
  let shelf = 0;
  for (const [key, s] of entries) {
    if (x + s.width > WIDTH) {
      x = 0;
      y += shelf + 1;
      shelf = 0;
    }
    frames[key] = { x, y, w: s.width, h: s.height, ax: s.anchorX, ay: s.anchorY };
    x += s.width + 1;
    shelf = Math.max(shelf, s.height);
  }
  const sheet = new Raster(WIDTH, y + shelf);
  for (const [key, s] of entries) sheet.blit(s, frames[key].x, frames[key].y);
  return { sheet, frames };
}
