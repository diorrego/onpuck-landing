import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Logo from '.';

describe('Logo', () => {
  it('is an accessible image named onpuck by default', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'onpuck' })).toBeInTheDocument();
  });

  it('can be decorative', () => {
    const { container } = render(<Logo decorative />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
