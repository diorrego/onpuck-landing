// One fixed palette for the whole world (handheld-game saturation on a cool paper ground).
// Index 0 is transparent. The three state colours are data: never used for props or clothes.

export const P = {
  ink: 1,
  inkSoft: 2,
  white: 3,
  // walls
  wallTop: 4,
  wallLeft: 5,
  wallRight: 6,
  baseboard: 7,
  // floors
  woodLight: 8,
  woodMid: 9,
  woodDark: 10,
  carpetLight: 11,
  carpetDark: 12,
  tileLight: 13,
  tileDark: 14,
  pavement: 15,
  pavementDark: 16,
  asphalt: 17,
  grassLight: 18,
  grassDark: 19,
  // furniture
  deskTop: 20,
  deskSide: 21,
  deskShade: 22,
  metal: 23,
  metalDark: 24,
  sofaTop: 25,
  sofaSide: 26,
  sofaShade: 27,
  leaf: 28,
  leafDark: 29,
  pot: 30,
  // devices
  screen: 31,
  screenGlow: 32,
  screenDark: 33,
  speaker: 34,
  speakerRing: 35,
  // people
  skin1: 36,
  skin2: 37,
  skin3: 38,
  skin4: 39,
  skin5: 40,
  skin6: 41,
  hairBlack: 42,
  hairBrown: 43,
  hairBlond: 44,
  hairRed: 45,
  hairGrey: 46,
  shirtBlue: 47,
  shirtPurple: 48,
  shirtTeal: 49,
  shirtWhite: 50,
  shirtBlack: 51,
  shirtPink: 52,
  pantsNavy: 53,
  pantsBrown: 54,
  pantsDenim: 55,
  shoe: 56,
  // state (data only)
  frustration: 57,
  fatigue: 58,
  motivation: 59,
  // misc
  shadow: 60,
  lampLight: 61,
  water: 62,
  bubble: 63,
} as const;

export type PaletteIndex = (typeof P)[keyof typeof P] | 0;

export const PALETTE: (string | null)[] = [
  null,
  '#1b1d2a', // ink
  '#4a4e66', // inkSoft
  '#fbfbfd', // white
  '#eef0f6', // wallTop
  '#d5dae8', // wallLeft
  '#b6bdd4', // wallRight
  '#7d83a3', // baseboard
  '#e2a76b', // woodLight
  '#c98a52', // woodMid
  '#9c6337', // woodDark
  '#5ec4b6', // carpetLight
  '#3fa093', // carpetDark
  '#f4f1ea', // tileLight
  '#c8d2de', // tileDark
  '#d3cfc6', // pavement
  '#aba69c', // pavementDark
  '#5d6272', // asphalt
  '#7ccf52', // grassLight
  '#55a73a', // grassDark
  '#f6f6f2', // deskTop
  '#d7d6d0', // deskSide
  '#aeada6', // deskShade
  '#8a90a6', // metal
  '#5e6480', // metalDark
  '#6c70de', // sofaTop
  '#5257bd', // sofaSide
  '#3d4196', // sofaShade
  '#63c65a', // leaf
  '#3e9442', // leafDark
  '#b8794a', // pot
  '#2f3a58', // screen
  '#9ef0ff', // screenGlow
  '#1f2740', // screenDark
  '#e4e7f0', // speaker
  '#4fd8ff', // speakerRing
  '#f6d2b0', // skin1
  '#e8b48c', // skin2
  '#cf9268', // skin3
  '#a86d47', // skin4
  '#7f4d2f', // skin5
  '#5e3722', // skin6
  '#2a2128', // hairBlack
  '#6b4226', // hairBrown
  '#e0b04f', // hairBlond
  '#b0442c', // hairRed
  '#c9c7cf', // hairGrey
  '#4b7fe6', // shirtBlue
  '#9461d6', // shirtPurple
  '#22a6a0', // shirtTeal
  '#f2f2ee', // shirtWhite
  '#33364a', // shirtBlack
  '#ec8fbf', // shirtPink
  '#323a62', // pantsNavy
  '#6e5140', // pantsBrown
  '#5175a8', // pantsDenim
  '#262632', // shoe
  '#f0604d', // frustration (coral)
  '#f4ab2f', // fatigue (amber)
  '#35b86b', // motivation (green)
  '#c4c9d8', // shadow
  '#fff3b8', // lampLight
  '#8fd3f4', // water
  '#ffffff', // bubble
];

export const STATE_COLORS = {
  frustration: PALETTE[P.frustration]!,
  fatigue: PALETTE[P.fatigue]!,
  motivation: PALETTE[P.motivation]!,
} as const;

const packed = PALETTE.map((hex) => {
  if (!hex) return 0;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return ((0xff << 24) | (b << 16) | (g << 8) | r) >>> 0;
});

/** Palette index to a little-endian RGBA word (what Uint32Array over ImageData expects). */
export function rgba(index: number): number {
  return packed[index] ?? 0;
}
