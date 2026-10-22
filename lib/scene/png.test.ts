import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { encodePng } from './png';

describe('encodePng', () => {
  it('writes a valid RGBA PNG that round-trips the pixels', () => {
    const pixels = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 0, 1, 2, 3, 4]);
    const png = encodePng(2, 2, pixels);
    expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    const view = new DataView(png.buffer, png.byteOffset);
    expect(view.getUint32(16)).toBe(2);
    expect(view.getUint32(20)).toBe(2);
    const idatAt = png.indexOf(Buffer.from('IDAT')) - 4;
    const len = view.getUint32(idatAt);
    const raw = inflateSync(png.subarray(idatAt + 8, idatAt + 8 + len));
    expect([...raw]).toEqual([0, ...pixels.subarray(0, 8), 0, ...pixels.subarray(8)]);
  });
});
