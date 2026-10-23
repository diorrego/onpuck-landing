import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ErrorPage from '.';

describe('ErrorPage', () => {
  it('shows only the nav, the running floor, a short message, the way back and the footer', () => {
    const { container } = render(<ErrorPage title="Not here" line="Try the paper." />);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    const main = screen.getByRole('main');
    const scene = main.querySelector('[data-scene="life"]')!;
    expect(scene).toBeInTheDocument();
    const h1 = screen.getByRole('heading', { level: 1, name: 'Not here' });
    expect(scene.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to the light paper' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });

  it('renders an extra action next to the way back', () => {
    render(<ErrorPage title="Broke" line="Sorry." action={<button type="button">Try again</button>} />);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
