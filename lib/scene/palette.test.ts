import { describe, expect, it } from 'vitest';
import { PALETTE, P, rgba, STATE_COLORS } from './palette';

describe('palette', () => {
  it('uses index 0 as transparent and valid hex colours elsewhere', () => {
    expect(PALETTE[0]).toBeNull();
    for (const hex of PALETTE.slice(1)) expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('has unique colours', () => {
    const hexes = PALETTE.slice(1);
    expect(new Set(hexes).size).toBe(hexes.length);
  });

  it('names every index once', () => {
    const indexes = Object.values(P);
    expect(new Set(indexes).size).toBe(indexes.length);
    expect(Math.max(...indexes)).toBe(PALETTE.length - 1);
  });

  it('packs colours as little-endian RGBA for Uint32 pixel buffers', () => {
    expect(rgba(0)).toBe(0);
    const ink = rgba(P.ink);
    expect(ink & 0xff).toBe(parseInt(PALETTE[P.ink]!.slice(1, 3), 16));
    expect(ink >>> 24).toBe(0xff);
  });

  it('keeps the three state colours for data only', () => {
    expect(Object.keys(STATE_COLORS)).toEqual(['frustration', 'fatigue', 'motivation']);
  });
});
