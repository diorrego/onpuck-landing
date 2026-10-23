import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from '.';

describe('Hero', () => {
  it('reads as the paper title page: headline, actions, authors', () => {
    render(<Hero />);
    expect(screen.getByText('Know what your users will do before your agent builds it.').tagName).toBe('P');
    expect(screen.getByRole('link', { name: 'Apply to be a design partner' })).toHaveAttribute('href', '#apply');
    expect(screen.getByRole('link', { name: 'Read the light paper' })).toHaveAttribute('href', '#abstract');
    expect(screen.getByText('P. Riquelme and D. Orrego')).toBeInTheDocument();
  });

  it('centres the title page and puts the H1 (what, for whom, where) under the scene', () => {
    const { container } = render(<Hero />);
    const column = container.querySelector('header > div')!;
    expect(column.className).toContain('text-center');
    const scene = container.querySelector('[data-scene="life"]')!;
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/San Francisco, CA, USA/);
    expect(scene.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(h1.className).toContain('text-balance');
  });
});
