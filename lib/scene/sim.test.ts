import { describe, expect, it } from 'vitest';
import { exp04Arms } from '@/content/experiments';
import { Simulation, hazard, riskLabel, mulberry32 } from './sim';
import { WORLD } from './world';

const run = (sim: Simulation, seconds: number, dt = 1 / 15) => {
  for (let t = 0; t < seconds; t += dt) sim.step(dt);
};

describe('hazard', () => {
  it('is the abandonment rule printed in section 3', () => {
    const s = { R: 0.5, F: 0.2, B: 0.1, M: 0.6, P: 0.3 };
    const x = -1 + 3 * 0.5 + 1.5 * 0.2 + 1.5 * 0.1 - 3 * 0.6 - 2 * 0.3;
    expect(hazard(s, -1)).toBeCloseTo(1 / (1 + Math.exp(-x)), 10);
  });

  it('rises with frustration and falls with motivation', () => {
    const base = { R: 0.1, F: 0.1, B: 0.1, M: 0.5, P: 0.2 };
    expect(hazard({ ...base, R: 0.9 })).toBeGreaterThan(hazard(base));
    expect(hazard({ ...base, M: 0.9 })).toBeLessThan(hazard(base));
  });

  it('labels risk of leaving', () => {
    expect(riskLabel(0.001)).toBe('low');
    expect(riskLabel(0.03)).toBe('medium');
    expect(riskLabel(0.2)).toBe('high');
  });
});

describe('Simulation (life)', () => {
  it('is deterministic for a seed', () => {
    const a = new Simulation({ population: 12, seed: 7 });
    const b = new Simulation({ population: 12, seed: 7 });
    run(a, 20);
    run(b, 20);
    expect(a.agents.map((x) => [x.c, x.r, x.state])).toEqual(b.agents.map((x) => [x.c, x.r, x.state]));
  });

  it('keeps the population at its target as people leave and arrive', () => {
    for (const population of [12, 24]) {
      const sim = new Simulation({ population, seed: 3 });
      run(sim, 120);
      expect(sim.agents.filter((a) => a.state !== 'gone').length).toBe(population);
    }
  });

  it('has people finish, quit and get frustrated over a few minutes', () => {
    const sim = new Simulation({ population: 24, seed: 11 });
    run(sim, 240);
    expect(sim.stats.done).toBeGreaterThan(0);
    expect(sim.stats.quit).toBeGreaterThan(0);
    expect(sim.stats.frustrations).toBeGreaterThan(0);
  });

  it('never seats two people in the same place', () => {
    const sim = new Simulation({ population: 24, seed: 5 });
    for (let i = 0; i < 600; i++) {
      sim.step(1 / 10);
      const taken = sim.agents.filter((a) => a.state !== 'gone' && a.spot).map((a) => a.spot!.id);
      expect(new Set(taken).size).toBe(taken.length);
    }
  });

  it('keeps every state value inside [0, 1]', () => {
    const sim = new Simulation({ population: 24, seed: 9 });
    run(sim, 90);
    for (const a of sim.agents) for (const v of [a.R, a.F, a.B, a.P, a.M]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('never leaves anyone half faded once they have arrived', () => {
    for (const seed of [1, 2, 3, 42]) {
      const sim = new Simulation({ population: 24, seed });
      for (let i = 0; i < 1800; i++) {
        sim.step(1 / 15);
        for (const a of sim.agents) {
          if (a.state === 'settling' || a.state === 'using') expect(a.alpha, `${a.label} ${a.state}`).toBe(1);
        }
      }
    }
  });

  it('uses phones and tablets in the A/B replay, never laptops', () => {
    const sim = new Simulation({ population: 12, seed: 3, mode: 'ab', arm: 'test' });
    run(sim, 30);
    for (const a of sim.agents.filter((x) => x.state === 'using')) {
      expect(a.poses.every((p) => p === 'phone' || p === 'tablet')).toBe(true);
    }
  });

  it('counts the floor for the status bar', () => {
    const sim = new Simulation({ population: 24, seed: 11 });
    run(sim, 240);
    const snap = sim.snapshot();
    expect(snap.onFloor).toBe(24);
    expect(snap.done).toBe(sim.stats.done);
    expect(snap.left).toBe(sim.stats.quit);
    expect(snap.frustrated).toBeGreaterThanOrEqual(0);
  });

  it('describes a person for the state card', () => {
    const sim = new Simulation({ population: 12, seed: 2 });
    run(sim, 5);
    const card = sim.inspect(sim.agents[0].id)!;
    expect(card.label).toMatch(/^Simulated user \d{2}$/);
    expect(['laptop', 'desktop', 'tablet', 'phone', 'speaker']).toContain(card.device);
    expect(card.task.length).toBeGreaterThan(3);
    expect(['low', 'medium', 'high']).toContain(card.risk);
  });

  it('finds the person under a point and nobody on empty floor', () => {
    const sim = new Simulation({ population: 12, seed: 4 });
    run(sim, 3);
    const a = sim.agents.find((x) => x.state === 'using')!;
    const [x, y] = sim.screenPosition(a);
    expect(sim.agentAt(x, y - 8)?.id).toBe(a.id);
    expect(sim.agentAt(2, 2)).toBeNull();
  });

  it('emits drawables for people, shadows and bubbles', () => {
    const sim = new Simulation({ population: 12, seed: 8 });
    run(sim, 30);
    const list = sim.drawables(0);
    expect(list.some((d) => d.kind === 'sprite' && d.key.startsWith('char:'))).toBe(true);
    expect(list.some((d) => d.kind === 'shadow')).toBe(true);
  });
});

describe('Simulation (A/B replay, Fig. 3)', () => {
  it('replays the registered first-action rates per arm', () => {
    for (const arm of ['control', 'test'] as const) {
      const sim = new Simulation({ population: 10, seed: 21, mode: 'ab', arm });
      run(sim, 1500, 1 / 5);
      const { started, writingFirst } = sim.tally;
      expect(started).toBeGreaterThan(300);
      expect(writingFirst / started).toBeCloseTo(exp04Arms[arm].firstActionWriting, 1);
    }
  });

  it('resets the tally when the arm changes', () => {
    const sim = new Simulation({ population: 10, seed: 1, mode: 'ab', arm: 'control' });
    run(sim, 60, 1 / 5);
    sim.setArm('test');
    expect(sim.tally).toEqual({ started: 0, writingFirst: 0, submitted: 0 });
  });
});

describe('mulberry32', () => {
  it('produces numbers in [0, 1)', () => {
    const rand = mulberry32(1);
    for (let i = 0; i < 100; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

it('world exposes spawns the sim uses', () => {
  expect(WORLD.spawns.length).toBeGreaterThanOrEqual(2);
});
