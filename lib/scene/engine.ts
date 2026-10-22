// Browser-only Canvas 2D loop for the simulation floor. Loaded lazily by SceneIsland after the
// poster has painted. Reads the atlas PNG + JSON and the base PNG, composes at native low
// resolution (432x280) and lets CSS scale it with image-rendering: pixelated.

import type { AtlasFrame } from './atlas';
import { CANVAS_H, CANVAS_W, compose, type RgbaSprite } from './render';
import { Simulation, type AgentCard, type Arm } from './sim';

export type EngineOptions = {
  mode: 'life' | 'ab';
  population: number;
  seed: number;
  arm?: Arm;
  onTally?: (tally: Simulation['tally']) => void;
  onSelected?: (card: AgentCard | null, x: number, y: number) => void;
  onStats?: (stats: ReturnType<Simulation['snapshot']>) => void;
};

const STEP = 1 / 30;

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  return img;
}

function pixels(img: HTMLImageElement): { data: Uint32Array; width: number; height: number } {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const id = ctx.getImageData(0, 0, c.width, c.height);
  return { data: new Uint32Array(id.data.buffer), width: c.width, height: c.height };
}

let atlasPromise: Promise<{ sprites: Map<string, RgbaSprite>; base: Uint32Array }> | null = null;

function loadAssets() {
  atlasPromise ??= (async () => {
    const [meta, sheetImg, baseImg] = await Promise.all([
      fetch('/scene/sprites.json').then((r) => r.json() as Promise<{ frames: Record<string, AtlasFrame> }>),
      loadImage('/scene/sprites.png'),
      loadImage('/scene/base.png'),
    ]);
    const sheet = pixels(sheetImg);
    const sprites = new Map<string, RgbaSprite>();
    for (const [key, f] of Object.entries(meta.frames)) {
      const px = new Uint32Array(f.w * f.h);
      for (let y = 0; y < f.h; y++) px.set(sheet.data.subarray((f.y + y) * sheet.width + f.x, (f.y + y) * sheet.width + f.x + f.w), y * f.w);
      sprites.set(key, { width: f.w, height: f.h, px, anchorX: f.ax, anchorY: f.ay });
    }
    return { sprites, base: pixels(baseImg).data };
  })();
  return atlasPromise;
}

export class SceneEngine {
  readonly sim: Simulation;
  private ctx: CanvasRenderingContext2D;
  private image: ImageData;
  private target: Uint32Array;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private sinceRender = 0;
  private running = false;
  private selected: number | null = null;
  private tallyAt = 0;

  private constructor(
    private canvas: HTMLCanvasElement,
    private assets: { sprites: Map<string, RgbaSprite>; base: Uint32Array },
    private opts: EngineOptions,
  ) {
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.ctx.imageSmoothingEnabled = false;
    this.image = this.ctx.createImageData(CANVAS_W, CANVAS_H);
    this.target = new Uint32Array(this.image.data.buffer);
    this.sim = new Simulation({ population: opts.population, seed: opts.seed, mode: opts.mode, arm: opts.arm });
    this.render();
  }

  static async create(canvas: HTMLCanvasElement, opts: EngineOptions): Promise<SceneEngine> {
    const assets = await loadAssets();
    return new SceneEngine(canvas, assets, opts);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.25, (now - this.last) / 1000);
      this.last = now;
      this.acc += dt;
      this.sinceRender += dt;
      let steps = 0;
      while (this.acc >= STEP && steps < 8) {
        this.sim.step(STEP);
        this.acc -= STEP;
        steps++;
      }
      if (this.sinceRender >= STEP) {
        this.sinceRender = 0;
        this.render();
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  get isRunning() {
    return this.running;
  }

  destroy() {
    this.stop();
    this.opts.onSelected = undefined;
    this.opts.onTally = undefined;
    this.opts.onStats = undefined;
  }

  setArm(arm: Arm) {
    this.sim.setArm(arm);
    this.opts.onTally?.({ ...this.sim.tally });
  }

  /** Select the person under a point in canvas pixels (null clears). Returns their id. */
  select(x: number | null, y?: number): number | null {
    const agent = x === null ? null : this.sim.agentAt(x, y!);
    this.selected = agent?.id ?? null;
    this.emitSelection();
    return this.selected;
  }

  /** Keyboard path: select the next person who is using a device. */
  selectNext(): number | null {
    const candidates = this.sim.agents.filter((a) => a.state === 'using').sort((a, b) => a.id - b.id);
    if (!candidates.length) return null;
    const next = candidates.find((a) => a.id > (this.selected ?? 0)) ?? candidates[0];
    this.selected = next.id;
    this.emitSelection();
    return next.id;
  }

  private emitSelection() {
    if (!this.opts.onSelected) return;
    const agent = this.sim.agents.find((a) => a.id === this.selected);
    if (!agent || agent.state === 'gone') {
      if (this.selected !== null) this.selected = null;
      this.opts.onSelected(null, 0, 0);
      return;
    }
    const [x, y] = this.sim.screenPosition(agent);
    this.opts.onSelected(this.sim.inspect(agent.id), x, y);
  }

  render() {
    compose(this.target, this.assets.base, CANVAS_W, CANVAS_H, this.assets.sprites, this.sim.drawables(this.sim.time, this.selected));
    this.ctx.putImageData(this.image, 0, 0);
    if (this.selected !== null) this.emitSelection();
    if (this.sim.time - this.tallyAt > 0.5) {
      this.tallyAt = this.sim.time;
      this.opts.onTally?.({ ...this.sim.tally });
      this.opts.onStats?.(this.sim.snapshot());
    }
  }
}
