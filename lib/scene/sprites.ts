// Art as code. People are authored as text grids (head, torso, legs) and painted per skin;
// props and devices are isometric boxes with three tones. Everything gets a 1 px ink outline.
// Generic devices only: no real logos.

import { P } from './palette';
import { Raster, type IndexedSprite } from './raster';

export const TILE_W = 32;
export const TILE_H = 16;
export const FRAME_W = 14;
export const FRAME_H = 19;

// ---------------------------------------------------------------- people

export type Skin = {
  skin: number;
  hair: number;
  shirt: number;
  pants: number;
  style: 'short' | 'long' | 'bun';
};

export const SKINS: Skin[] = [
  { skin: P.skin2, hair: P.hairBrown, shirt: P.shirtBlue, pants: P.pantsNavy, style: 'short' },
  { skin: P.skin5, hair: P.hairBlack, shirt: P.shirtTeal, pants: P.pantsBrown, style: 'bun' },
  { skin: P.skin1, hair: P.hairRed, shirt: P.shirtPurple, pants: P.pantsDenim, style: 'long' },
  { skin: P.skin4, hair: P.hairBlack, shirt: P.shirtBlack, pants: P.pantsDenim, style: 'short' },
  { skin: P.skin3, hair: P.hairBlond, shirt: P.shirtPink, pants: P.pantsDenim, style: 'long' },
  { skin: P.skin6, hair: P.hairGrey, shirt: P.shirtWhite, pants: P.pantsNavy, style: 'short' },
];

export const CHARACTER_POSES = [
  'stand',
  'walkA',
  'walkB',
  'sit',
  'typeA',
  'typeB',
  'phone',
  'tablet',
  'talk',
  'frustrated',
] as const;
export type Pose = (typeof CHARACTER_POSES)[number];
export type View = 'front' | 'back';

// 12 columns each. h hair, s skin, k ink, t shirt, p pants, e shoe, g screen glow, d device body.
const HEAD_FRONT: Record<Skin['style'], string[]> = {
  short: [
    '....hhhhh...',
    '..hhhhhhhhh.',
    '.hhhhhhhhhhh',
    '.hhhhsssshh.',
    '.hhsssssssss',
    '.hssskssskss',
    '.hsssssssss.',
    '..ssssssss..',
  ],
  long: [
    '...hhhhhh...',
    '..hhhhhhhhh.',
    '.hhhhhhhhhhh',
    '.hhhhsssshhh',
    '.hhsssssssss',
    '.hssskssskhh',
    '.hhssssssshh',
    '.hhsssssssh.',
  ],
  bun: [
    '.....hhh....',
    '..hhhhhhhhh.',
    '.hhhhhhhhhhh',
    '.hhssssssshh',
    '.hssssssssss',
    '.hssskssskss',
    '.hsssssssss.',
    '..ssssssss..',
  ],
};

const HEAD_BACK: Record<Skin['style'], string[]> = {
  short: [
    '....hhhhh...',
    '..hhhhhhhhh.',
    '.hhhhhhhhhhh',
    '.hhhhhhhhhhh',
    '.hhhhhhhhhhs',
    '.hhhhhhhhhh.',
    '..hhhhhhhh..',
    '...ssssss...',
  ],
  long: [
    '...hhhhhh...',
    '..hhhhhhhhh.',
    '.hhhhhhhhhhh',
    '.hhhhhhhhhhh',
    '.hhhhhhhhhhh',
    '.hhhhhhhhhhh',
    '.hhhhhhhhhh.',
    '..hhhhhhhh..',
  ],
  bun: [
    '.....hhh....',
    '....hhhhh...',
    '..hhhhhhhhh.',
    '.hhhhhhhhhhh',
    '.hhhhhhhhhhs',
    '.hhhhhhhhhh.',
    '..hhhhhhhh..',
    '...ssssss...',
  ],
};

const TORSO = {
  stand: ['...tttttt...', '..tttttttt..', '.tttttttttt.', '.tttttttttt.', '.s.tttttt.s.'],
  swing: ['...tttttt...', '..tttttttt..', '.tttttttttt.', 'stttttttttt.', '...tttttt.s.'],
  type: ['...tttttt...', '..tttttttt..', '.tttttttttt.', '.tssttttsst.', '...tttttt...'],
  typeB: ['...tttttt...', '..tttttttt..', '.tssttttsst.', '.tttttttttt.', '...tttttt...'],
  phone: ['...tttttt...', '..tttttttt..', '.ttttsdgttt.', '.ttttssstt..', '...tttttt...'],
  tablet: ['...tttttt...', '..tttttttt..', '.tsddddddst.', '.tsdggggdst.', '...tttttt...'],
  talk: ['...tttttt..s', '..tttttttts.', '.tttttttttt.', '.tttttttttt.', '.s.tttttt...'],
  up: ['s.tttttttt.s', 's.tttttttt.s', '.tttttttttt.', '.tttttttttt.', '...tttttt...'],
  back: ['...tttttt...', '..tttttttt..', '.tttttttttt.', '.tttttttttt.', '.s.tttttt.s.'],
  backType: ['...tttttt...', '..tttttttt..', '.tttttttttt.', 'stttttttttts', '...tttttt...'],
  backTypeB: ['...tttttt...', '..tttttttt..', 'stttttttttts', '.tttttttttt.', '...tttttt...'],
  backPhone: ['...tttttt...', '..tttttttgd.', '.ttttttttts.', '.tttttttttt.', '.s.tttttt...'],
};

const LEGS = {
  stand: ['...pppppp...', '...pp..pp...', '...pp..pp...', '...ee..ee...'],
  walkA: ['...pppppp...', '..pp....pp..', '.pp......pp.', '.ee......ee.'],
  walkB: ['...pppppp...', '....pppp....', '....pp.pp...', '....ee.ee...'],
  sit: ['..pppppppp..', '.pppppppppp.', '..pp....pp..', '..ee....ee..'],
  sitBack: ['..pppppppp..', '.pppppppppp.', '............', '............'],
};

type Parts = { torso: keyof typeof TORSO; legs: keyof typeof LEGS; headUp?: boolean };

const FRONT_PARTS: Record<Pose, Parts> = {
  stand: { torso: 'stand', legs: 'stand' },
  walkA: { torso: 'swing', legs: 'walkA' },
  walkB: { torso: 'stand', legs: 'walkB' },
  sit: { torso: 'stand', legs: 'sit' },
  typeA: { torso: 'type', legs: 'sit' },
  typeB: { torso: 'typeB', legs: 'sit' },
  phone: { torso: 'phone', legs: 'stand' },
  tablet: { torso: 'tablet', legs: 'sit' },
  talk: { torso: 'talk', legs: 'stand' },
  frustrated: { torso: 'up', legs: 'stand', headUp: true },
};

const BACK_PARTS: Record<Pose, Parts> = {
  stand: { torso: 'back', legs: 'stand' },
  walkA: { torso: 'back', legs: 'walkA' },
  walkB: { torso: 'back', legs: 'walkB' },
  sit: { torso: 'back', legs: 'sitBack' },
  typeA: { torso: 'backType', legs: 'sitBack' },
  typeB: { torso: 'backTypeB', legs: 'sitBack' },
  phone: { torso: 'backPhone', legs: 'stand' },
  tablet: { torso: 'backPhone', legs: 'sitBack' },
  talk: { torso: 'back', legs: 'stand' },
  frustrated: { torso: 'up', legs: 'stand', headUp: true },
};

function paint(grid: string[], skin: Skin, raster: Raster, ox: number, oy: number) {
  const map: Record<string, number> = {
    h: skin.hair,
    s: skin.skin,
    k: P.ink,
    t: skin.shirt,
    p: skin.pants,
    e: P.shoe,
    g: P.screenGlow,
    d: P.screenDark,
  };
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = map[row[x]];
      if (c) raster.set(ox + x, oy + y, c);
    }
  });
}

const frameCache = new Map<string, Raster>();

/** One 14x19 frame: front view faces +c (screen down-right), back view faces -r (up-right). */
export function characterFrame(skinIndex: number, view: View, pose: Pose): Raster {
  const key = `${skinIndex}:${view}:${pose}`;
  const cached = frameCache.get(key);
  if (cached) return cached;
  const skin = SKINS[skinIndex % SKINS.length];
  const parts = (view === 'front' ? FRONT_PARTS : BACK_PARTS)[pose];
  const head = (view === 'front' ? HEAD_FRONT : HEAD_BACK)[skin.style];
  const r = new Raster(FRAME_W, FRAME_H);
  const top = 1;
  paint(LEGS[parts.legs], skin, r, 1, top + 13);
  paint(TORSO[parts.torso], skin, r, 1, top + 8);
  paint(head, skin, r, 1, top);
  if (parts.headUp && view === 'front') {
    // hands on the head
    r.set(1, top + 2, skin.skin);
    r.set(12, top + 2, skin.skin);
  }
  r.outline(P.ink);
  frameCache.set(key, r);
  return r;
}

// ---------------------------------------------------------------- props

export type PropSprite = IndexedSprite & { anchorX: number; anchorY: number };

type Box = {
  c: number;
  r: number;
  z: number;
  a: number; // extent along c (tiles)
  b: number; // extent along r (tiles)
  h: number; // height (px)
  top: number;
  left: number; // face at r + b, facing the viewer's left
  right: number; // face at c + a, facing the viewer's right
};

export function project(c: number, r: number, z = 0): [number, number] {
  return [(c - r) * (TILE_W / 2), (c + r) * (TILE_H / 2) - z];
}

function drawBox(raster: Raster, box: Box, ox: number, oy: number) {
  const { c, r, z, a, b, h } = box;
  const pt = (pc: number, pr: number, pz: number): [number, number] => {
    const [x, y] = project(pc, pr, pz);
    return [x + ox, y + oy];
  };
  raster.polygon([pt(c, r + b, z), pt(c + a, r + b, z), pt(c + a, r + b, z + h), pt(c, r + b, z + h)], box.left);
  raster.polygon([pt(c + a, r, z), pt(c + a, r + b, z), pt(c + a, r + b, z + h), pt(c + a, r, z + h)], box.right);
  raster.polygon([pt(c, r, z + h), pt(c + a, r, z + h), pt(c + a, r + b, z + h), pt(c, r + b, z + h)], box.top);
}

function circle(raster: Raster, cx: number, cy: number, radius: number, color: number, squash = 1) {
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      if (x * x + (y * y) / (squash * squash) <= radius * radius + radius * 0.6) raster.set(cx + x, cy + y, color);
    }
  }
}

const wood = { top: P.woodLight, left: P.woodMid, right: P.woodDark };
const white = { top: P.deskTop, left: P.deskSide, right: P.deskShade };
const metal = { top: P.metal, left: P.metal, right: P.metalDark };

type PropDef = { boxes: Box[]; extra?: (r: Raster, ox: number, oy: number) => void };

const box = (
  c: number,
  r: number,
  z: number,
  a: number,
  b: number,
  h: number,
  colors: { top: number; left: number; right: number },
): Box => ({ c, r, z, a, b, h, ...colors });

function legs(a: number, b: number, h: number, inset = 0.06): Box[] {
  const s = 0.07;
  return [
    box(inset, inset, 0, s, s, h, metal),
    box(a - inset - s, inset, 0, s, s, h, metal),
    box(inset, b - inset - s, 0, s, s, h, metal),
    box(a - inset - s, b - inset - s, 0, s, s, h, metal),
  ];
}

const PROP_DEFS = {
  // desk with its long side along c; people sit on the +r side (facing it, back view)
  desk: { boxes: [...legs(1, 0.6, 11), box(0, 0, 11, 1, 0.6, 2, white)] },
  // the same desk turned along r; people sit on its -c side, facing the viewer
  deskR: { boxes: [...legs(0.6, 0.9, 11), box(0, 0, 11, 0.6, 0.9, 2, white)] },
  // laptop, screen toward +r (lit, seen by the viewer)
  laptop: {
    boxes: [
      box(0, 0, 0, 0.42, 0.3, 1, metal),
      box(0, 0, 1, 0.42, 0.04, 9, { top: P.metal, left: P.screenGlow, right: P.metalDark }),
    ],
  },
  // laptop seen from behind (screen toward -c, user faces the viewer)
  laptopBack: {
    boxes: [
      box(0, 0, 0, 0.3, 0.42, 1, metal),
      box(0.26, 0, 1, 0.04, 0.42, 9, { top: P.metal, left: P.metalDark, right: P.metal }),
    ],
  },
  desktop: {
    boxes: [
      box(0.16, 0.06, 0, 0.18, 0.12, 1, metal),
      box(0.22, 0.08, 1, 0.06, 0.04, 4, metal),
      box(0, 0, 5, 0.5, 0.05, 12, { top: P.metal, left: P.screenGlow, right: P.metalDark }),
    ],
    extra: (r, ox, oy) => {
      // keyboard in front of the monitor
      drawBox(r, box(0.05, 0.22, 0, 0.4, 0.14, 1, { top: P.inkSoft, left: P.ink, right: P.ink }), ox, oy);
    },
  },
  stool: { boxes: [box(0.12, 0.12, 0, 0.06, 0.06, 6, metal), box(0, 0, 6, 0.3, 0.3, 2, wood)] },
  sofa: {
    boxes: [
      box(0, 0, 0, 0.7, 2, 6, { top: P.sofaTop, left: P.sofaSide, right: P.sofaSide }),
      box(0, 0, 6, 0.24, 2, 9, { top: P.sofaTop, left: P.sofaShade, right: P.sofaSide }),
      box(0, 0, 6, 0.7, 0.22, 5, { top: P.sofaTop, left: P.sofaShade, right: P.sofaSide }),
      box(0, 1.78, 6, 0.7, 0.22, 5, { top: P.sofaTop, left: P.sofaShade, right: P.sofaSide }),
    ],
  },
  sideTable: { boxes: [...legs(0.4, 0.4, 9, 0.03), box(0, 0, 9, 0.4, 0.4, 2, wood)] },
  // generic cylinder-ish smart speaker with a light ring on top
  speaker: {
    boxes: [box(0, 0, 0, 0.18, 0.18, 9, { top: P.speakerRing, left: P.speaker, right: P.shadow })],
  },
  counter: {
    boxes: [box(0, 0, 0, 2, 0.6, 15, { top: P.tileLight, left: P.woodMid, right: P.woodDark })],
    extra: (r, ox, oy) => {
      // cabinet doors
      for (let i = 0; i < 4; i++) {
        const [x0, y0] = project(0.15 + i * 0.48, 0.6, 3);
        for (let k = 0; k < 9; k++) r.set(ox + x0 + 6, oy + y0 + 3 - k + Math.floor(k / 9), P.woodDark);
      }
    },
  },
  fridge: {
    boxes: [box(0, 0, 0, 0.7, 0.7, 32, white)],
    extra: (r, ox, oy) => {
      const [x, y] = project(0.7, 0.4, 0);
      for (let k = 6; k < 26; k++) if (k !== 16) r.set(ox + x - 4, oy + y - k, P.metalDark);
      const [lx, ly] = project(0, 0.7, 0);
      for (let k = 0; k < 22; k++) r.set(ox + lx + k, oy + ly - 18 + Math.floor(k / 2), P.deskShade);
    },
  },
  plant: {
    boxes: [box(0, 0, 0, 0.3, 0.3, 7, { top: P.woodDark, left: P.pot, right: P.woodDark })],
    extra: (r, ox, oy) => {
      const [x, y] = project(0.15, 0.15, 7);
      circle(r, ox + x, oy + y - 8, 7, P.leafDark);
      circle(r, ox + x - 1, oy + y - 10, 5, P.leaf);
      r.set(ox + x - 3, oy + y - 13, P.grassLight);
      r.set(ox + x + 2, oy + y - 11, P.grassLight);
    },
  },
  tree: {
    boxes: [box(0, 0, 0, 0.14, 0.14, 18, { top: P.woodDark, left: P.woodMid, right: P.woodDark })],
    extra: (r, ox, oy) => {
      const [x, y] = project(0.07, 0.07, 18);
      circle(r, ox + x, oy + y - 6, 13, P.leafDark);
      circle(r, ox + x - 3, oy + y - 10, 9, P.leaf);
      circle(r, ox + x - 6, oy + y - 14, 3, P.grassLight);
    },
  },
  lamp: {
    boxes: [
      box(0, 0, 0, 0.08, 0.08, 40, { top: P.metalDark, left: P.metal, right: P.metalDark }),
      box(-0.08, -0.08, 40, 0.24, 0.24, 4, { top: P.metalDark, left: P.lampLight, right: P.lampLight }),
    ],
  },
  bench: {
    boxes: [
      ...legs(1.2, 0.36, 5, 0.08),
      box(0, 0, 5, 1.2, 0.36, 2, wood),
      box(0, 0, 7, 1.2, 0.06, 6, wood),
    ],
  },
  bookshelf: {
    boxes: [box(0, 0, 0, 0.9, 0.3, 26, wood)],
    extra: (r, ox, oy) => {
      const colors = [P.shirtBlue, P.shirtPink, P.shirtTeal, P.shirtPurple, P.hairBlond, P.shirtWhite];
      for (let shelf = 0; shelf < 3; shelf++) {
        for (let i = 0; i < 6; i++) {
          const [x, y] = project(0.08 + i * 0.13, 0.3, 4 + shelf * 8);
          for (let k = 0; k < 5; k++) r.set(ox + x, oy + y - k - (i % 2), colors[(i + shelf) % colors.length]);
          for (let k = 0; k < 5; k++) r.set(ox + x + 1, oy + y - k - (i % 2) + 1, colors[(i + shelf) % colors.length]);
        }
      }
    },
  },
  mug: { boxes: [box(0, 0, 0, 0.08, 0.08, 4, { top: P.inkSoft, left: P.shirtWhite, right: P.deskSide })] },
} satisfies Record<string, PropDef>;

export type PropName = keyof typeof PROP_DEFS;

/** Footprint (a along c, b along r) in tiles, for depth sorting. */
export const PROP_FOOTPRINT: Record<PropName, [number, number]> = {
  desk: [1, 0.6],
  deskR: [0.6, 0.9],
  laptop: [0.42, 0.3],
  laptopBack: [0.3, 0.42],
  desktop: [0.5, 0.36],
  stool: [0.3, 0.3],
  sofa: [0.7, 2],
  sideTable: [0.4, 0.4],
  speaker: [0.18, 0.18],
  counter: [2, 0.6],
  fridge: [0.7, 0.7],
  plant: [0.3, 0.3],
  tree: [0.14, 0.14],
  lamp: [0.08, 0.08],
  bench: [1.2, 0.36],
  bookshelf: [0.9, 0.3],
  mug: [0.08, 0.08],
};
export const PROPS = Object.keys(PROP_DEFS) as PropName[];

const propCache = new Map<PropName, PropSprite>();

/** A prop sprite; (anchorX, anchorY) is where its footprint origin (c, r, z = 0) lands. */
export function propSprite(name: PropName): PropSprite {
  const cached = propCache.get(name);
  if (cached) return cached;
  const def: PropDef = PROP_DEFS[name];
  // generous canvas, then crop to content
  const big = new Raster(160, 140);
  const ox = 80;
  const oy = 100;
  const sorted = [...def.boxes].sort((p, q) => p.z - q.z || p.c + p.r - (q.c + q.r));
  for (const b of sorted) drawBox(big, b, ox, oy);
  def.extra?.(big, ox, oy);
  big.outline(P.ink);
  let minX = big.width;
  let minY = big.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < big.height; y++) {
    for (let x = 0; x < big.width; x++) {
      if (!big.get(x, y)) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const data = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data[y * w + x] = big.get(minX + x, minY + y);
  const sprite: PropSprite = { width: w, height: h, data, anchorX: ox - minX, anchorY: oy - minY };
  propCache.set(name, sprite);
  return sprite;
}

// ---------------------------------------------------------------- bubble icons

// a alert (frustration), z tired, c check, w writing, x star, n sound, q question, l leave
const ICON_GRIDS = {
  alert: ['...ff...', '...ff...', '...ff...', '...ff...', '........', '...ff...'],
  tired: ['aaaa....', '..a.....', '.a......', 'aaaa.aaa', '......a.', '.....aaa'],
  check: ['.......m', '......mm', 'm....mm.', 'mm..mm..', '.mmmm...', '..mm....'],
  writing: ['.....kk.', '....kwwk', '...kwwk.', '..kwwk..', '.kkwk...', '.kkk....'],
  star: ['....k....', '...kwk...', 'kkkkwkkkk', '.kwwwwwk.', '..kwwwk..', '.kwk.kwk.', 'kk.....kk'],
  sound: ['..r.....', '.r..r...', '.r.r..r.', '.r.r..r.', '.r..r...', '..r.....'],
  question: ['..kkkk..', '.kk..kk.', '.....kk.', '...kk...', '........', '...kk...'],
  leave: ['ff......', 'ff..f...', 'ff..ff..', 'fffffff.', 'ff..ff..', 'ff..f...'],
} as const;

export type IconName = keyof typeof ICON_GRIDS;
export const ICONS = Object.keys(ICON_GRIDS) as IconName[];

export function iconSprite(name: IconName): IndexedSprite {
  const grid = ICON_GRIDS[name];
  const map: Record<string, number> = {
    f: P.frustration,
    a: P.fatigue,
    m: P.motivation,
    k: P.ink,
    w: P.bubble,
    r: P.speakerRing,
  };
  const w = grid[0].length;
  const r = new Raster(w, grid.length);
  grid.forEach((row, y) => {
    for (let x = 0; x < w; x++) if (map[row[x]]) r.set(x, y, map[row[x]]);
  });
  return r;
}
