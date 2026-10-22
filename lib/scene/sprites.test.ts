import { describe, expect, it } from 'vitest';
import { P } from './palette';
import {
  CHARACTER_POSES,
  FRAME_H,
  FRAME_W,
  PROPS,
  SKINS,
  characterFrame,
  propSprite,
  ICONS,
  iconSprite,
} from './sprites';

describe('character frames', () => {
  it('has six skins', () => {
    expect(SKINS).toHaveLength(6);
  });

  it.each(CHARACTER_POSES)('pose %s renders for every skin and view', (pose) => {
    for (let skin = 0; skin < SKINS.length; skin++) {
      for (const view of ['front', 'back'] as const) {
        const f = characterFrame(skin, view, pose);
        expect(f.width).toBe(FRAME_W);
        expect(f.height).toBe(FRAME_H);
        const opaque = f.data.filter(Boolean).length;
        expect(opaque).toBeGreaterThan(60);
      }
    }
  });

  it('outlines every character in ink, with no other colour on the frame border', () => {
    const f = characterFrame(0, 'front', 'stand');
    for (let x = 0; x < FRAME_W; x++) {
      expect([0, P.ink]).toContain(f.data[x]);
      expect([0, P.ink]).toContain(f.data[(FRAME_H - 1) * FRAME_W + x]);
    }
  });

  it('paints skins with their own colours', () => {
    const a = characterFrame(0, 'front', 'stand').data;
    const b = characterFrame(3, 'front', 'stand').data;
    expect(a).not.toEqual(b);
  });

  it('walk frames differ from standing (legs move)', () => {
    const stand = characterFrame(0, 'front', 'stand').data;
    expect(characterFrame(0, 'front', 'walkA').data).not.toEqual(stand);
    expect(characterFrame(0, 'front', 'walkB').data).not.toEqual(stand);
  });

  it('shows a lit screen when holding a phone or tablet', () => {
    for (const pose of ['phone', 'tablet'] as const) {
      expect(characterFrame(1, 'front', pose).data).toContain(P.screenGlow);
    }
  });
});

describe('props', () => {
  it('includes every device in the brief, with no logos', () => {
    for (const device of ['laptop', 'desktop', 'speaker']) expect(PROPS).toContain(device);
  });

  it.each(PROPS)('prop %s renders with an anchor inside the sprite', (name) => {
    const s = propSprite(name);
    expect(s.width).toBeGreaterThan(0);
    expect(s.anchorX).toBeGreaterThanOrEqual(0);
    expect(s.anchorX).toBeLessThanOrEqual(s.width);
    expect(s.anchorY).toBeLessThanOrEqual(s.height);
    expect(s.data.some(Boolean)).toBe(true);
  });
});

describe('icons', () => {
  it.each(ICONS)('icon %s fits in a bubble', (name) => {
    const s = iconSprite(name);
    expect(s.width).toBeLessThanOrEqual(11);
    expect(s.data.some(Boolean)).toBe(true);
  });
});
