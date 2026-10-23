import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/app/actions', () => ({ applyDesignPartner: vi.fn() }));
vi.mock('@/components/apply/CalEmbed', () => ({
  default: (p: { email: string }) => <div data-testid="calendar">{`calendar for "${p.email}"`}</div>,
}));

import { apply, CONTACT_EMAIL } from '@/content/paper';
import ApplyOrBook from '.';

describe('ApplyOrBook', () => {
  beforeEach(() => {
    delete (window as { dataLayer?: unknown }).dataLayer;
  });

  it('shows the application form by default', () => {
    render(<ApplyOrBook copy={apply} contactEmail={CONTACT_EMAIL} />);
    expect(screen.getByRole('form', { name: 'Design partner application' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByTestId('calendar')).toBeNull();
  });

  it('lets people just book a call, without the form, and tracks it', async () => {
    render(<ApplyOrBook copy={apply} contactEmail={CONTACT_EMAIL} />);
    await userEvent.click(screen.getByRole('button', { name: 'Book a call' }));
    expect(screen.getByTestId('calendar')).toHaveTextContent('calendar for ""');
    expect(screen.getByText(apply.bookLede)).toBeInTheDocument();
    expect(screen.queryByRole('form')).toBeNull();
    const events = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;
    expect(events).toContainEqual({ event: 'cta_click', label: 'Book a call' });
  });
});
