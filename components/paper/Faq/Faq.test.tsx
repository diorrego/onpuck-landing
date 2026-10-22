import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Faq from '.';

describe('Faq', () => {
  it('opens an answer from its question', async () => {
    const { container } = render(<Faq />);
    const first = container.querySelector('details')!;
    expect(first.open).toBe(false);
    await userEvent.click(screen.getByText('What access do you need, and can you write to our systems?'));
    expect(first.open).toBe(true);
    expect(first).toHaveAttribute('data-event', 'faq_open');
  });
});
