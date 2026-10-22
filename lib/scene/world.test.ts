import { describe, expect, it } from 'vitest';
import { WORLD, findPath, isWalkable, tileAt } from './world';

describe('world layout', () => {
  it('covers the four places in the brief', () => {
    const zones = new Set<string>();
    for (let r = 0; r < WORLD.rows; r++) for (let c = 0; c < WORLD.cols; c++) zones.add(tileAt(c, r).zone);
    expect([...zones].sort()).toEqual(['coworking', 'kitchen', 'living', 'street']);
  });

  it('uses every device type at some seat', () => {
    const devices = new Set(WORLD.seats.map((s) => s.device));
    for (const d of ['laptop', 'desktop', 'tablet', 'phone', 'speaker']) expect(devices).toContain(d);
  });

  it('gives every seat a unique id and approach tile', () => {
    expect(new Set(WORLD.seats.map((s) => s.id)).size).toBe(WORLD.seats.length);
    const approaches = WORLD.seats.map((s) => `${s.approach[0]},${s.approach[1]}`);
    expect(new Set(approaches).size).toBe(approaches.length);
  });

  it('has room for 24 people on desktop', () => {
    expect(WORLD.seats.length + WORLD.wanderSpots.length).toBeGreaterThanOrEqual(24);
  });

  it('reaches every seat and wander spot from every spawn, on walkable tiles', () => {
    for (const spawn of WORLD.spawns) {
      expect(isWalkable(...spawn.tile)).toBe(true);
      for (const target of [...WORLD.seats.map((s) => s.approach), ...WORLD.wanderSpots]) {
        const path = findPath(spawn.tile, target);
        expect(path, `${spawn.id} -> ${target}`).not.toBeNull();
        for (const [c, r] of path!) expect(isWalkable(c, r)).toBe(true);
      }
    }
  });

  it('moves along the grid only (one axis per step), so four iso directions suffice', () => {
    const path = findPath(WORLD.spawns[0].tile, WORLD.seats[0].approach)!;
    for (let i = 1; i < path.length; i++) {
      const dc = Math.abs(path[i][0] - path[i - 1][0]);
      const dr = Math.abs(path[i][1] - path[i - 1][1]);
      expect(dc + dr).toBe(1);
    }
  });

  it('never blocks a tile under a seat approach', () => {
    for (const s of WORLD.seats) expect(isWalkable(...s.approach)).toBe(true);
  });
});
