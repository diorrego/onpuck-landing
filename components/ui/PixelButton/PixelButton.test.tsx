import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PixelButton from '.';

describe('PixelButton', () => {
  it('renders a link when given href', () => {
    render(<PixelButton href="#apply">Apply to be a design partner</PixelButton>);
    expect(screen.getByRole('link', { name: 'Apply to be a design partner' })).toHaveAttribute('href', '#apply');
  });

  it('renders a submit button otherwise, with the primary style by default', () => {
    render(<PixelButton type="submit">Send</PixelButton>);
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button.className).toContain('pixel-btn-primary');
  });

  it('passes an analytics event name through a data attribute', () => {
    render(<PixelButton href="#apply" event="cta_click" variant="secondary">Apply</PixelButton>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-event', 'cta_click');
    expect(link.className).toContain('pixel-btn-secondary');
  });
});
