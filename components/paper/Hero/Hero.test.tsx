import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from '.';

describe('Hero', () => {
  it('states the headline as the only h1 with both actions and the scene', () => {
    const { container } = render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Know what your users will do before your agent builds it.');
    expect(screen.getByRole('link', { name: 'Apply to be a design partner' })).toHaveAttribute('href', '#apply');
    expect(screen.getByRole('link', { name: 'Read the light paper' })).toHaveAttribute('href', '#abstract');
    expect(container.querySelector('[data-scene="life"]')).not.toBeNull();
  });

  it('puts the byline after the headline, never a kicker above it', () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector('h1')!;
    expect(h1.previousElementSibling).toBeNull();
  });
});
