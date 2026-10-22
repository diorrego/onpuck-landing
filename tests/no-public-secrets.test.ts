import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const SKIP = new Set(['node_modules', '.next', '.git', 'tests']);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|js|mjs)$/.test(name) ? [path] : [];
  });
}

describe('client bundle secrets', () => {
  it('never exposes a webhook URL through a NEXT_PUBLIC_ variable', () => {
    const offenders = sourceFiles(ROOT).filter((file) =>
      /NEXT_PUBLIC_[A-Z_]*WEBHOOK/.test(readFileSync(file, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });

  it('never calls discord.com from a client component', () => {
    const offenders = sourceFiles(ROOT).filter((file) => {
      const text = readFileSync(file, 'utf8');
      return text.includes("'use client'") && /discord\.com|WEBHOOK/.test(text);
    });
    expect(offenders).toEqual([]);
  });
});
