import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from '.';

describe('Hero', () => {
  it('reads as the paper title page: headline, actions, authors', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Know what your users will do before your agent builds it.');
    expect(screen.getByRole('link', { name: 'Apply to be a design partner' })).toHaveAttribute('href', '#apply');
    expect(screen.getByRole('link', { name: 'Read the light paper' })).toHaveAttribute('href', '#abstract');
    expect(screen.getByText('P. Riquelme and D. Orrego')).toBeInTheDocument();
  });

  it('centres the title page and puts the scene below the copy, with no tag above the title', () => {
    const { container } = render(<Hero />);
    const column = container.querySelector('header > div')!;
    expect(column.className).toContain('text-center');
    expect(column.firstElementChild?.tagName).toBe('H1');
    const h1 = container.querySelector('h1')!;
    const scene = container.querySelector('[data-scene="life"]')!;
    expect(h1.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
