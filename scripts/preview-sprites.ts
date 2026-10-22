// Dev aid: every character pose and prop on one sheet, scaled up, for visual review.
import { writeFileSync } from 'node:fs';
import { encodePng } from '../lib/scene/png';
import { rgba, P } from '../lib/scene/palette';
import { Raster } from '../lib/scene/raster';
import { CHARACTER_POSES, FRAME_H, FRAME_W, PROPS, SKINS, characterFrame, propSprite, ICONS, iconSprite } from '../lib/scene/sprites';

const out = process.argv[2] ?? 'preview.png';
const scale = Number(process.argv[3] ?? 4);
const sheet = new Raster(CHARACTER_POSES.length * 2 * (FRAME_W + 2) + 4, SKINS.length * (FRAME_H + 2) + 160);
sheet.fill(P.wallTop);
SKINS.forEach((_, s) => {
  CHARACTER_POSES.forEach((pose, i) => {
    sheet.blit(characterFrame(s, 'front', pose), 2 + i * (FRAME_W + 2), 2 + s * (FRAME_H + 2));
    sheet.blit(characterFrame(s, 'back', pose), 2 + (CHARACTER_POSES.length + i) * (FRAME_W + 2), 2 + s * (FRAME_H + 2));
  });
});
let x = 2;
let y = SKINS.length * (FRAME_H + 2) + 6;
let rowH = 0;
for (const name of PROPS) {
  const s = propSprite(name);
  if (x + s.width > sheet.width) { x = 2; y += rowH + 4; rowH = 0; }
  sheet.blit(s, x, y);
  x += s.width + 4;
  rowH = Math.max(rowH, s.height);
}
x = 2; y += rowH + 4;
for (const name of ICONS) { sheet.blit(iconSprite(name), x, y); x += 12; }
const w = sheet.width * scale;
const h = sheet.height * scale;
const px = new Uint8Array(w * h * 4);
const view = new DataView(px.buffer);
for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
  view.setUint32((j * w + i) * 4, rgba(sheet.get(Math.floor(i / scale), Math.floor(j / scale))), true);
}
writeFileSync(out, encodePng(w, h, px));
console.log(out, w, h);
