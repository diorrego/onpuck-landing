import { describe, expect, it } from 'vitest';
import { paper } from '@/content/paper';
import { references } from '@/content/references';
import { paperMarkdown } from './markdown';

const md = paperMarkdown();

describe('paperMarkdown (the page as Markdown, same source)', () => {
  it('opens with the title and the abstract as a quote', () => {
    expect(md.startsWith(`# ${paper.hero.h1}`)).toBe(true);
    expect(md).toContain(paper.hero.headline);
    expect(md).toContain(`> ${paper.abstract}`);
  });

  it('has every section as an h2', () => {
    const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const s of paper.sections) expect(md).toMatch(new RegExp(`^## (§${s.number} )?${esc(s.title)}$`, 'm'));
  });

  it('keeps [n] citations and lists every reference with its link', () => {
    expect(md).toContain('rarely matched the logs [32]');
    for (const r of references) {
      expect(md).toContain(`[${r.id}] ${r.authors}`);
      expect(md).toContain(r.url);
    }
  });

  it('turns in-page links into absolute URLs', () => {
    expect(md).toContain('(https://www.onpuck.com/#exp-02)');
    expect(md).not.toMatch(/\]\(#/);
  });

  it('carries the figure data, the experiments and the program as text', () => {
    expect(md).toContain('| exp-04 |');
    expect(md).toContain('it never downloaded');
    expect(md).toContain('5 teams in San Francisco');
    expect(md).toContain('hazard = σ(h0 + 3R + 1.5F + 1.5B − 3M − 2P)');
  });

  it('tells an agent how to apply, and that a person submits', () => {
    expect(md).toContain('https://www.onpuck.com/#apply');
    expect(md).toMatch(/Work email[\s\S]*Company URL[\s\S]*Your role/);
    expect(md).toMatch(/person/i);
  });

  it('contains no HTML and no em dashes', () => {
    expect(md).not.toMatch(/<[a-z]/i);
    expect(md).not.toContain('—');
  });
});
