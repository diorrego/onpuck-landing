import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/actions', () => ({ applyDesignPartner: vi.fn() }));
import Page from './page';

describe('page', () => {
  it('embeds one JSON-LD graph with the paper and its citations', () => {
    const { container } = render(<Page />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    const data = JSON.parse(scripts[0].innerHTML);
    expect(data['@graph'].find((n: { '@type': string }) => n['@type'] === 'TechArticle').citation.length).toBe(36);
  });
});
