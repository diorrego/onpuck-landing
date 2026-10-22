import { describe, expect, it } from 'vitest';
import { Raster } from './raster';

const count = (r: Raster, value: number) => r.data.filter((v) => v === value).length;

describe('Raster', () => {
  it('clips writes outside the buffer', () => {
    const r = new Raster(4, 4);
    r.set(-1, 0, 1);
    r.set(4, 4, 1);
    r.set(1, 1, 1);
    expect(count(r, 1)).toBe(1);
  });

  it('fills a 2:1 isometric diamond symmetric on both axes', () => {
    const r = new Raster(40, 20);
    r.diamond(4, 2, 32, 16, 3);
    const rows = Array.from({ length: 20 }, (_, y) =>
      Array.from({ length: 40 }, (_, x) => r.get(x, y)).filter((v) => v === 3).length,
    );
    const filled = rows.filter((n) => n > 0);
    expect(filled.length).toBe(16);
    expect(filled).toEqual([...filled].reverse());
    expect(Math.max(...filled)).toBe(32);
    // 2:1 slope: each row grows by 4 pixels (2 per side)
    expect(filled[1] - filled[0]).toBe(4);
  });

  it('blits a sprite with transparency, mirrored on request', () => {
    const sprite = { width: 3, height: 1, data: new Uint8Array([1, 0, 2]) };
    const r = new Raster(3, 1);
    r.fill(9);
    r.blit(sprite, 0, 0);
    expect([...r.data]).toEqual([1, 9, 2]);
    r.fill(9);
    r.blit(sprite, 0, 0, true);
    expect([...r.data]).toEqual([2, 9, 1]);
  });

  it('draws an outline around opaque pixels without overwriting them', () => {
    const r = new Raster(5, 5);
    r.set(2, 2, 4);
    r.outline(1);
    expect(r.get(2, 2)).toBe(4);
    expect(r.get(1, 2)).toBe(1);
    expect(r.get(2, 1)).toBe(1);
    expect(r.get(1, 1)).toBe(0);
  });
});

describe('Raster.polygon', () => {
  it('fills a rectangle exactly', () => {
    const r = new Raster(10, 10);
    r.polygon([[2, 2], [6, 2], [6, 5], [2, 5]], 1);
    expect(r.data.filter((v) => v === 1).length).toBe(12);
    expect(r.get(2, 2)).toBe(1);
    expect(r.get(6, 2)).toBe(0);
  });
});
