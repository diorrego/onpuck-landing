import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots.txt', () => {
  const r = robots();
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];

  it('allows everyone and names the AI crawlers to document intent', () => {
    const agents = rules.flatMap((rule) => (Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent]));
    for (const bot of ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended']) {
      expect(agents).toContain(bot);
    }
    for (const rule of rules) {
      expect(rule.allow).toBe('/');
      expect(rule.disallow).toBeUndefined();
    }
  });

  it('points to the sitemap on the canonical host', () => {
    expect(r.sitemap).toBe('https://www.onpuck.com/sitemap.xml');
  });
});
