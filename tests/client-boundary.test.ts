import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe('client bundle boundary', () => {
  it('keeps the paper content out of client components (it ships as HTML only)', () => {
    const offenders = [...files(join(ROOT, 'components')), ...files(join(ROOT, 'lib'))].filter((f) => {
      const text = readFileSync(f, 'utf8');
      if (!text.startsWith("'use client'")) return false;
      return /from '@\/content\/(paper|references)'|from '@\/components\/(ui\/(Inline|Cite)|figures\/Figure)'/.test(text);
    });
    expect(offenders.map((f) => f.replace(ROOT, ''))).toEqual([]);
  });
});
