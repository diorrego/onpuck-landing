// Agents of the simulation floor. Each person carries the simulator's state (frustration R,
// fatigue F, boredom B, progress P, motivation M) and quits by the same hazard rule printed
// in section 3. Deterministic for a seed. No text is drawn: bubbles carry icons only.

import { exp04Arms } from '@/content/experiments';
import { atlasKey } from './atlas';
import { screenOf, type Drawable } from './render';
import { PROP_FOOTPRINT, type IconName, type Pose, type View } from './sprites';
import { WORLD, findPath, type Device, type Seat, type Spawn } from './world';

export type StateVector = { R: number; F: number; B: number; M: number; P: number };
export type AgentState = 'entering' | 'walking' | 'settling' | 'using' | 'leaving' | 'gone';
export type Arm = 'control' | 'test';
export type Spot = { id: string; seat?: Seat; tile: [number, number] };

export type Agent = StateVector & {
  id: number;
  label: string;
  skin: number;
  c: number;
  r: number;
  z: number;
  state: AgentState;
  path: [number, number][];
  spot: Spot | null;
  exit: Spawn | null;
  view: View;
  mirror: boolean;
  poses: Pose[];
  device: Device;
  task: string;
  t: number;
  alpha: number;
  bubble: { icon: IconName; until: number } | null;
  nextBubbleAt: number;
  nextEventAt: number;
  speed: number;
  progressRate: number;
  frustratedUntil: number;
  leaveAt: number;
  // A/B replay
  firstAction: 'writing' | 'rating' | null;
  abStep: number;
  abNextAt: number;
};

export type SimConfig = { population: number; seed: number; mode?: 'life' | 'ab'; arm?: Arm; h0?: number };

export const H0 = -4.5;
const WALK_SPEED = 1.7; // tiles per second
const FADE = 0.5;

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const sigma = (x: number) => 1 / (1 + Math.exp(-x));

/** hazard = σ(h0 + 3R + 1.5F + 1.5B − 3M − 2P) */
export function hazard(s: StateVector, h0 = H0): number {
  return sigma(h0 + 3 * s.R + 1.5 * s.F + 1.5 * s.B - 3 * s.M - 2 * s.P);
}

export function riskLabel(h: number): 'low' | 'medium' | 'high' {
  if (h < 0.003) return 'low';
  if (h < 0.05) return 'medium';
  return 'high';
}

export type AgentCard = {
  id: number;
  label: string;
  device: Device;
  task: string;
  state: AgentState;
  R: number;
  F: number;
  M: number;
  risk: 'low' | 'medium' | 'high';
  firstAction: 'writing' | 'rating' | null;
};

const SPOTS: Spot[] = [
  ...WORLD.seats.map((seat) => ({ id: seat.id, seat, tile: seat.approach })),
  ...WORLD.wanderSpots.map((tile) => ({ id: `spot-${tile[0]}-${tile[1]}`, tile })),
];

export class Simulation {
  readonly agents: Agent[] = [];
  readonly stats = { done: 0, quit: 0, frustrations: 0 };
  tally = { started: 0, writingFirst: 0, submitted: 0 };
  time = 0;
  private rand: () => number;
  private nextId = 1;
  private arm: Arm;
  private readonly mode: 'life' | 'ab';
  private readonly h0: number;

  constructor(private readonly config: SimConfig) {
    this.rand = mulberry32(config.seed);
    this.mode = config.mode ?? 'life';
    this.arm = config.arm ?? 'control';
    this.h0 = config.h0 ?? H0;
    // warm start: most people already at work, a few arriving
    for (let i = 0; i < config.population; i++) this.spawn(i < config.population * 0.75);
  }

  setArm(arm: Arm) {
    this.arm = arm;
    this.tally = { started: 0, writingFirst: 0, submitted: 0 };
    for (const a of this.agents) if (a.state === 'using') this.startAb(a);
  }

  private pick<T>(list: readonly T[]): T {
    return list[Math.floor(this.rand() * list.length)];
  }

  private freeSpots(): Spot[] {
    const taken = new Set(this.agents.filter((a) => a.state !== 'gone' && a.spot).map((a) => a.spot!.id));
    return SPOTS.filter((s) => !taken.has(s.id));
  }

  private spawn(seated: boolean) {
    const free = this.freeSpots();
    if (!free.length) return;
    const spot = this.pick(free);
    const id = this.nextId++;
    const entry = this.pick(WORLD.spawns);
    const device = spot.seat?.device ?? 'phone';
    const agent: Agent = {
      id,
      label: `Simulated user ${String(((id - 1) % 99) + 1).padStart(2, '0')}`,
      skin: Math.floor(this.rand() * 6),
      c: entry.tile[0] + 0.5,
      r: entry.tile[1] + 0.5,
      z: 0,
      state: 'entering',
      path: [],
      spot,
      exit: null,
      view: 'front',
      mirror: false,
      poses: spot.seat?.poses ?? ['phone'],
      device: this.mode === 'ab' ? 'phone' : device,
      task: this.mode === 'ab' ? 'Writing a review' : this.pick(spot.seat?.tasks ?? ['Checking an order', 'Writing a review', 'Resetting a password']),
      t: 0,
      alpha: 0,
      R: this.rand() * 0.15,
      F: this.rand() * 0.2,
      B: this.rand() * 0.1,
      P: seated ? this.rand() * 0.6 : 0,
      M: 0.5 + this.rand() * 0.45,
      bubble: null,
      nextBubbleAt: 0,
      nextEventAt: this.time + 4 + this.rand() * 14,
      speed: WALK_SPEED * (0.8 + this.rand() * 0.4),
      progressRate: 1 / (18 + this.rand() * 30),
      frustratedUntil: 0,
      leaveAt: 0,
      firstAction: null,
      abStep: 0,
      abNextAt: 0,
    };
    if (seated) {
      const [c, r] = spot.seat?.pos ?? [spot.tile[0] + 0.5, spot.tile[1] + 0.5];
      agent.c = c;
      agent.r = r;
      agent.alpha = 1;
      this.sit(agent);
    } else {
      agent.path = findPath(entry.tile, spot.tile) ?? [];
    }
    this.agents.push(agent);
  }

  private sit(a: Agent) {
    a.state = 'using';
    a.t = 0;
    const seat = a.spot?.seat;
    a.z = seat?.z ?? 0;
    a.view = seat?.view ?? (this.rand() < 0.5 ? 'front' : 'back');
    a.mirror = seat?.mirror ?? this.rand() < 0.5;
    if (!seat) a.poses = ['phone'];
    if (this.mode === 'ab') {
      a.poses = seat && seat.z > 0 ? ['tablet'] : ['phone'];
      this.startAb(a);
    }
  }

  private startAb(a: Agent) {
    a.firstAction = null;
    a.abStep = 0;
    a.abNextAt = this.time + 1 + this.rand() * 1.5;
  }

  private bubble(a: Agent, icon: IconName, seconds = 1.6) {
    a.bubble = { icon, until: this.time + seconds };
    a.nextBubbleAt = this.time + seconds + 1.2;
  }

  private leave(a: Agent) {
    a.state = 'leaving';
    a.t = 0;
    a.z = 0;
    const from: [number, number] = a.spot?.tile ?? [Math.floor(a.c), Math.floor(a.r)];
    a.c = from[0] + 0.5;
    a.r = from[1] + 0.5;
    a.exit = this.pick(WORLD.spawns);
    a.path = findPath(from, a.exit.tile) ?? [];
    a.spot = null;
  }

  step(dt: number) {
    this.time += dt;
    for (const a of this.agents) {
      if (a.state === 'gone') continue;
      a.t += dt;
      if (a.bubble && a.bubble.until <= this.time) a.bubble = null;
      if (a.state === 'entering' || a.state === 'walking' || a.state === 'leaving') this.walk(a, dt);
      else if (a.state === 'settling') this.settle(a, dt);
      else if (a.state === 'using') {
        if (this.mode === 'ab') this.useAb(a);
        else this.use(a, dt);
      }
    }
    // keep the population
    for (let i = this.agents.length - 1; i >= 0; i--) if (this.agents[i].state === 'gone') this.agents.splice(i, 1);
    const alive = this.agents.length;
    for (let i = alive; i < this.config.population; i++) this.spawn(false);
  }

  private walk(a: Agent, dt: number) {
    if (a.state === 'entering') {
      a.alpha = Math.min(1, a.alpha + dt / FADE);
      if (a.alpha >= 1) a.state = 'walking';
    }
    const next = a.path[0];
    if (!next) {
      if (a.state === 'leaving') {
        a.alpha -= dt / FADE;
        if (a.alpha <= 0) a.state = 'gone';
        return;
      }
      a.state = 'settling';
      return;
    }
    const tx = next[0] + 0.5;
    const ty = next[1] + 0.5;
    const dx = tx - a.c;
    const dy = ty - a.r;
    const dist = Math.abs(dx) + Math.abs(dy);
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        a.view = dx > 0 ? 'front' : 'back';
        a.mirror = dx < 0;
      } else {
        a.view = dy > 0 ? 'front' : 'back';
        a.mirror = dy > 0;
      }
    }
    const stepLen = a.speed * dt;
    if (dist <= stepLen) {
      a.c = tx;
      a.r = ty;
      a.path.shift();
    } else {
      a.c += (dx / dist) * stepLen;
      a.r += (dy / dist) * stepLen;
    }
  }

  private settle(a: Agent, dt: number) {
    const [c, r] = a.spot?.seat?.pos ?? [a.spot ? a.spot.tile[0] + 0.5 : a.c, a.spot ? a.spot.tile[1] + 0.5 : a.r];
    const dx = c - a.c;
    const dy = r - a.r;
    const d = Math.hypot(dx, dy);
    const s = a.speed * 0.6 * dt;
    if (d <= s) {
      a.c = c;
      a.r = r;
      this.sit(a);
    } else {
      a.c += (dx / d) * s;
      a.r += (dy / d) * s;
    }
  }

  private use(a: Agent, dt: number) {
    if (a.leaveAt) {
      if (this.time >= a.leaveAt) this.leave(a);
      return;
    }
    a.P = clamp(a.P + a.progressRate * dt * (1 - a.R * 0.6));
    a.F = clamp(a.F + 0.012 * dt);
    a.B = clamp(a.B + 0.008 * dt - a.progressRate * dt * 0.3);
    a.R = clamp(a.R - 0.035 * dt);
    if (this.time >= a.nextEventAt) {
      // friction in the product: something did not do what the person expected
      a.R = clamp(a.R + 0.25 + this.rand() * 0.25);
      a.M = clamp(a.M - 0.04 - this.rand() * 0.06);
      this.stats.frustrations++;
      this.bubble(a, a.R > 0.55 ? 'alert' : 'question');
      if (!a.spot?.seat || a.spot.seat.z === 0) a.frustratedUntil = this.time + 1.4;
      a.nextEventAt = this.time + 6 + this.rand() * 16;
    } else if (a.device === 'speaker' && this.time >= a.nextBubbleAt && this.rand() < dt * 0.25) {
      this.bubble(a, 'sound', 1.2);
    } else if (a.F > 0.7 && this.time >= a.nextBubbleAt && this.rand() < dt * 0.08) {
      this.bubble(a, 'tired');
    }
    if (a.P >= 1) {
      this.stats.done++;
      this.bubble(a, 'check');
      a.M = clamp(a.M + 0.1);
      if (this.rand() < 0.6) a.leaveAt = this.time + 1.8;
      else {
        a.P = 0;
        a.task = this.pick(a.spot?.seat?.tasks ?? [a.task]);
      }
      return;
    }
    const perSecond = hazard(a, this.h0);
    if (this.rand() < perSecond * dt) {
      this.stats.quit++;
      this.bubble(a, a.F > a.R ? 'tired' : 'leave', 1.8);
      a.leaveAt = this.time + 1.8;
    }
  }

  private useAb(a: Agent) {
    if (a.leaveAt) {
      if (this.time >= a.leaveAt) this.leave(a);
      return;
    }
    if (this.time < a.abNextAt) return;
    const arm = exp04Arms[this.arm];
    if (a.abStep === 0) {
      a.firstAction = this.rand() < arm.firstActionWriting ? 'writing' : 'rating';
      this.tally.started++;
      if (a.firstAction === 'writing') this.tally.writingFirst++;
      this.bubble(a, a.firstAction === 'writing' ? 'writing' : 'star', 1.8);
      a.abStep = 1;
      a.abNextAt = this.time + 2.4 + this.rand() * 1.6;
    } else if (a.abStep === 1) {
      this.bubble(a, a.firstAction === 'writing' ? 'star' : 'writing', 1.6);
      a.abStep = 2;
      a.abNextAt = this.time + 2.2 + this.rand() * 1.4;
    } else {
      // about a quarter of the people who start leave before submitting (exp-04, both arms)
      const submits = this.rand() < 0.75;
      if (submits) this.tally.submitted++;
      this.bubble(a, submits ? 'check' : 'leave', 1.6);
      a.leaveAt = this.time + 1.7;
    }
  }

  inspect(id: number): AgentCard | null {
    const a = this.agents.find((x) => x.id === id);
    if (!a) return null;
    return {
      id: a.id,
      label: a.label,
      device: a.device,
      task: a.task,
      state: a.state,
      R: a.R,
      F: a.F,
      M: a.M,
      risk: riskLabel(hazard(a, this.h0)),
      firstAction: a.firstAction,
    };
  }

  screenPosition(a: Agent): [number, number] {
    return screenOf(a.c, a.r, a.z);
  }

  agentAt(x: number, y: number): Agent | null {
    let best: Agent | null = null;
    for (const a of this.agents) {
      if (a.state === 'gone' || a.alpha < 0.5) continue;
      const [sx, sy] = this.screenPosition(a);
      if (x >= sx - 7 && x <= sx + 7 && y >= sy - 19 && y <= sy + 1) {
        if (!best || a.c + a.r > best.c + best.r) best = a;
      }
    }
    return best;
  }

  private pose(a: Agent, frameTime: number): Pose {
    if (a.state === 'using' || a.state === 'settling') {
      if (a.state === 'using' && this.time < a.frustratedUntil) return 'frustrated';
      if (a.state === 'settling') return 'walkB';
      const poses = a.poses;
      return poses[Math.floor(frameTime * 3 + a.id) % poses.length];
    }
    const cycle: Pose[] = ['walkA', 'stand', 'walkB', 'stand'];
    return cycle[Math.floor(frameTime * 6 + a.id) % cycle.length];
  }

  drawables(frameTime = this.time, highlight?: number | null): Drawable[] {
    const out: Drawable[] = [];
    for (const a of this.agents) {
      if (a.state === 'gone') continue;
      const [x, y] = this.screenPosition(a);
      const seated = a.state === 'using' && !!a.spot?.seat && a.spot.seat.z > 0;
      const depth = a.c + a.r + (seated ? 0.6 : 0);
      if (!seated) out.push({ kind: 'shadow', x, y, depth: depth - 0.001, w: 10, alpha: a.alpha });
      out.push({
        kind: 'sprite',
        key: atlasKey.char(a.skin, a.view, this.pose(a, frameTime)),
        x,
        y: y + (seated ? 0 : 0),
        depth,
        mirror: a.mirror,
        alpha: a.alpha,
      });
      if (highlight === a.id) out.push({ kind: 'sprite', key: 'marker', x, y: y - 22, depth: 999 });
      if (a.bubble) out.push({ kind: 'sprite', key: atlasKey.bubble(a.bubble.icon), x: x + 1, y: y - 20, depth: 1000 + depth });
    }
    return [...propDrawables(), ...out];
  }
}

let cachedProps: Drawable[] | null = null;

export function propDrawables(): Drawable[] {
  if (cachedProps) return cachedProps;
  cachedProps = WORLD.props.map((p) => {
    const [a, b] = PROP_FOOTPRINT[p.name];
    const z = p.z ?? 0;
    const [x, y] = screenOf(p.c, p.r, z);
    let depth = p.c + a / 2 + p.r + b / 2;
    if (z > 0) depth += 0.5; // on top of its support
    if (p.name === 'stool') depth -= 0.1;
    return { kind: 'sprite', key: atlasKey.prop(p.name), x, y, depth: p.depth ?? depth } as Drawable;
  });
  return cachedProps;
}
