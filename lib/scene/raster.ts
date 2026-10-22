// Palette-indexed pixel buffer with the few primitives the world needs.
// Pure TypeScript: the same code renders the poster in Node and the scene in the browser.

export type IndexedSprite = { width: number; height: number; data: Uint8Array };

export class Raster implements IndexedSprite {
  readonly data: Uint8Array;

  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.data = new Uint8Array(width * height);
  }

  get(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
    return this.data[y * this.width + x];
  }

  set(x: number, y: number, color: number): void {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.data[y * this.width + x] = color;
  }

  fill(color: number): void {
    this.data.fill(color);
  }

  rect(x: number, y: number, w: number, h: number, color: number): void {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, color);
  }

  hline(x0: number, x1: number, y: number, color: number): void {
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) this.set(x, y, color);
  }

  /** A 2:1 isometric diamond whose bounding box starts at (x, y). */
  diamond(x: number, y: number, w: number, h: number, color: number): void {
    const cx = x + w / 2;
    for (let row = 0; row < h; row++) {
      const half = row < h / 2 ? row : h - 1 - row;
      const span = Math.min(w, 4 * half + 4);
      this.hline(Math.round(cx - span / 2), Math.round(cx + span / 2) - 1, y + row, color);
    }
  }

  /** Fill a polygon, sampling pixel centres (even-odd rule). Gives clean 2:1 iso steps. */
  polygon(points: [number, number][], color: number): void {
    const ys = points.map((p) => p[1]);
    const y0 = Math.max(0, Math.floor(Math.min(...ys)));
    const y1 = Math.min(this.height - 1, Math.ceil(Math.max(...ys)));
    for (let y = y0; y <= y1; y++) {
      const cy = y + 0.5;
      const xs: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const [ax, ay] = points[i];
        const [bx, by] = points[(i + 1) % points.length];
        if ((ay <= cy && by > cy) || (by <= cy && ay > cy)) {
          xs.push(ax + ((cy - ay) / (by - ay)) * (bx - ax));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) this.set(x, y, color);
      }
    }
  }

  blit(sprite: IndexedSprite, x: number, y: number, mirror = false): void {
    x = Math.round(x);
    y = Math.round(y);
    for (let j = 0; j < sprite.height; j++) {
      for (let i = 0; i < sprite.width; i++) {
        const c = sprite.data[j * sprite.width + (mirror ? sprite.width - 1 - i : i)];
        if (c) this.set(x + i, y + j, c);
      }
    }
  }

  /** Paint `color` on transparent pixels that touch an opaque one (4-neighbour). */
  outline(color: number): void {
    const marks: number[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.get(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) {
          marks.push(y * this.width + x);
        }
      }
    }
    for (const i of marks) this.data[i] = color;
  }
}
