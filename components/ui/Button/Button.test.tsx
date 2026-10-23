import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Button from '.';

describe('Button', () => {
  it('renders a link when given href', () => {
    render(<Button href="#apply">Apply to be a design partner</Button>);
    expect(screen.getByRole('link', { name: 'Apply to be a design partner' })).toHaveAttribute('href', '#apply');
  });

  it('renders a submit button otherwise, with the primary style by default', () => {
    render(<Button type="submit">Send</Button>);
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button.className).toContain('btn-primary');
  });

  it('passes an analytics event name through a data attribute', () => {
    render(<Button href="#apply" event="cta_click" variant="secondary">Apply</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-event', 'cta_click');
    expect(link.className).toContain('btn-secondary');
  });

  it('is a Base UI button that stays focusable while pending', () => {
    render(<Button type="submit" disabled>Send</Button>);
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).not.toHaveAttribute('disabled');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-disabled');
  });

  it('keeps links as real anchors, never role=button', () => {
    render(<Button href="#apply">Apply</Button>);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('link', { name: 'Apply' }).tagName).toBe('A');
  });
});
