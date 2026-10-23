import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
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

  it('keeps client modules out of route handlers and metadata files (their exports are only references on the server)', () => {
    const resolve = (spec: string, from: string): string[] => {
      const base = spec.startsWith('@/') ? join(ROOT, spec.slice(2)) : join(dirname(from), spec);
      const hit = [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')].find(existsSync);
      if (!hit) return [];
      // a folder's index.ts re-exports the component file: check that file too
      return hit.endsWith('index.ts') ? [hit, ...imports(hit).flatMap((s) => resolve(s, hit))] : [hit];
    };
    const imports = (f: string) => [...readFileSync(f, 'utf8').matchAll(/from '((?:@\/|\.)[^']+)'/g)].map((m) => m[1]);
    const server = files(join(ROOT, 'app')).filter((f) => /\/(route|robots|sitemap|manifest|opengraph-image)\.tsx?$/.test(f));
    const offenders = server.flatMap((f) =>
      imports(f)
        .flatMap((s) => resolve(s, f))
        .filter((m) => readFileSync(m, 'utf8').startsWith("'use client'"))
        .map((m) => `${f.replace(ROOT, '')} -> ${m.replace(ROOT, '')}`),
    );
    expect(server.length).toBeGreaterThan(3);
    expect([...new Set(offenders)]).toEqual([]);
  });

  it('keeps the paper content out of the error boundary (a client component and everything it imports)', () => {
    const resolve = (spec: string, from: string) => {
      const base = spec.startsWith('@/') ? join(ROOT, spec.slice(2)) : join(dirname(from), spec);
      return [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')].find(existsSync);
    };
    const seen = new Set<string>();
    const walk = (f: string) => {
      if (seen.has(f)) return;
      seen.add(f);
      for (const m of readFileSync(f, 'utf8').matchAll(/from '((?:@\/|\.)[^']+)'/g)) {
        const hit = resolve(m[1], f);
        if (hit) walk(hit);
      }
    };
    walk(join(ROOT, 'app/error.tsx'));
    const reached = [...seen].map((f) => f.replace(ROOT, ''));
    expect(reached).toContain('/components/paper/SiteNav/SiteNav.tsx');
    expect(reached.filter((f) => /^\/content\/(paper|references)\.ts$/.test(f))).toEqual([]);
  });
});
