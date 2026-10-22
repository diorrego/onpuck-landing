import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SiteNav from '.';

describe('SiteNav', () => {
  it('has a skip link, the primary sections and the CTA named in full', () => {
    render(<SiteNav />);
    expect(screen.getByRole('link', { name: 'Skip to the paper' })).toHaveAttribute('href', '#main');
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getAllByRole('link').map((a) => a.textContent)).toEqual(['Model', 'Evidence', 'Research', 'Limits', 'Program']);
    expect(screen.getByRole('link', { name: 'Apply to be a design partner' })).toHaveAttribute('href', '#apply');
  });
});
