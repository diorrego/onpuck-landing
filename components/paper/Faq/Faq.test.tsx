import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import Faq from '.';

describe('Faq', () => {
  beforeEach(() => {
    delete (window as { dataLayer?: unknown }).dataLayer;
  });

  it('keeps every answer in the HTML and opens one from its question', async () => {
    render(<Faq />);
    expect(screen.getByText(/Nothing we run writes to your systems/)).toBeInTheDocument();
    const q = screen.getByRole('button', { name: 'What access do you need, and can you write to our systems?' });
    await userEvent.click(q);
    expect(q).toHaveAttribute('aria-expanded', 'true');
  });

  it('tracks faq_open with the question id', async () => {
    render(<Faq />);
    await userEvent.click(screen.getByRole('button', { name: 'Who runs it?' }));
    const events = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;
    expect(events).toContainEqual({ event: 'faq_open', question: 'faq-7' });
  });
});
