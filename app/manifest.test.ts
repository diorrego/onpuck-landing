import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from './manifest';

describe('manifest', () => {
  it('names the product and points at icons that exist', () => {
    const m = manifest();
    expect(m.name).toBe('onpuck');
    for (const icon of m.icons!) expect(existsSync(join(__dirname, '..', 'public', icon.src))).toBe(true);
  });

  it('ships the v3 icon set as app icons', () => {
    for (const f of ['icon.svg', 'favicon.ico', 'apple-icon.png']) expect(existsSync(join(__dirname, f))).toBe(true);
  });
});
