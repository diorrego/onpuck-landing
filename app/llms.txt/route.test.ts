import { describe, expect, it } from 'vitest';
import { paper } from '@/content/paper';
import { GET } from './route';

const text = async () => (await GET()).text();

describe('GET /llms.txt (llmstxt.org format)', () => {
  it('is plain text', async () => {
    const res = await GET();
    expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8');
  });

  it('starts with the H1 name and a blockquote summary that says what, for whom and where', async () => {
    const t = await text();
    expect(t.startsWith(`# OnPuck\n\n> ${paper.description}\n`)).toBe(true);
  });

  it('uses only H2 sections with markdown link lists after the summary', async () => {
    const t = await text();
    const sections = [...t.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(sections).toEqual(['Light paper', 'Design partner program', 'About', 'Optional']);
    expect(t).not.toMatch(/^#{3,} /m);
    for (const line of t.split('\n').filter((l) => l.startsWith('- '))) {
      expect(line).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)]+\)(: .+)?$/);
    }
  });

  it('points to the full text, the apply form, the founders and the sitemap', async () => {
    const t = await text();
    expect(t).toContain('- [Light paper as Markdown](https://www.onpuck.com/index.md)');
    expect(t).toContain('(https://www.onpuck.com/#apply)');
    expect(t).toContain('(https://www.linkedin.com/in/pauriquelme/)');
    expect(t).toContain('(https://www.onpuck.com/sitemap.xml)');
    expect(t).toContain('paula@onpuck.com');
  });

  it('keeps proper nouns cased and links sections by their page titles', async () => {
    const t = await text();
    expect(t).toContain('5 teams in San Francisco');
    expect(t).not.toMatch(/san francisco|onpuck(?!\.com)/);
    for (const id of ['model', 'evidence', 'limits']) {
      const s = paper.sections.find((x) => x.id === id)!;
      expect(t).toContain(`- [${s.title}](https://www.onpuck.com/#${id})`);
    }
  });
});
