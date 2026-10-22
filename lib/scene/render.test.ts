import { describe, expect, it } from 'vitest';
import { rgba, P } from './palette';
import { Raster } from './raster';
import { buildAtlas, packAtlas, atlasKey } from './atlas';
import { CANVAS_H, CANVAS_W, compose, renderBase, screenOf, toRgba, type Drawable } from './render';

describe('renderBase', () => {
  const base = renderBase();

  it('fills the canvas size', () => {
    expect(base.width).toBe(CANVAS_W);
    expect(base.height).toBe(CANVAS_H);
  });

  it('leaves the corners transparent so the paper shows through', () => {
    expect(base.get(0, CANVAS_H - 1)).toBe(0);
    expect(base.get(CANVAS_W - 1, CANVAS_H - 1)).toBe(0);
  });

  it('paints each zone material where it belongs', () => {
    const at = (c: number, r: number) => {
      const [x, y] = screenOf(c + 0.5, r + 0.5);
      return base.get(Math.round(x), Math.round(y));
    };
    expect([P.tileLight, P.tileDark]).toContain(at(3, 1));
    expect([P.woodLight, P.woodMid, P.woodDark]).toContain(at(9, 2));
    expect([P.carpetLight, P.carpetDark]).toContain(at(2, 10));
    expect([P.asphalt, P.white]).toContain(at(8, 11));
  });
});

describe('atlas', () => {
  it('packs every sprite into one sheet and reads them back unchanged', () => {
    const atlas = buildAtlas();
    const { sheet, frames } = packAtlas(atlas);
    expect(sheet.width).toBeLessThanOrEqual(1024);
    const key = atlasKey.char(2, 'front', 'walkA');
    const f = frames[key];
    const original = atlas.get(key)!;
    for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
      expect(sheet.get(f.x + x, f.y + y)).toBe(original.data[y * original.width + x]);
    }
  });
});

describe('compose', () => {
  const sprite = (color: number) => {
    const r = new Raster(2, 2);
    r.fill(color);
    return { ...toRgba(r), anchorX: 0, anchorY: 0 };
  };

  it('draws drawables back to front by depth', () => {
    const target = new Uint32Array(4 * 4);
    const base = new Uint32Array(4 * 4);
    const sprites = new Map([
      ['a', sprite(P.ink)],
      ['b', sprite(P.white)],
    ]);
    const list: Drawable[] = [
      { kind: 'sprite', key: 'b', x: 1, y: 1, depth: 2 },
      { kind: 'sprite', key: 'a', x: 0, y: 0, depth: 1 },
    ];
    compose(target, base, 4, 4, sprites, list);
    expect(target[1 * 4 + 1]).toBe(rgba(P.white));
    expect(target[0]).toBe(rgba(P.ink));
  });

  it('dithers partial opacity instead of blending (pixel-art fade)', () => {
    const target = new Uint32Array(4 * 4);
    const base = new Uint32Array(4 * 4);
    const sprites = new Map([['a', { ...toRgba(Object.assign(new Raster(4, 4), {})), anchorX: 0, anchorY: 0 }]]);
    const full = new Raster(4, 4);
    full.fill(P.ink);
    sprites.set('a', { ...toRgba(full), anchorX: 0, anchorY: 0 });
    compose(target, base, 4, 4, sprites, [{ kind: 'sprite', key: 'a', x: 0, y: 0, depth: 0, alpha: 0.5 }]);
    const drawn = [...target].filter((v) => v === rgba(P.ink)).length;
    expect(drawn).toBe(8);
  });
});
