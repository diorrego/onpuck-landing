import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Accordion from '.';

const items = [
  { id: 'faq-1', title: 'What access do you need?', content: <p>Read-only access.</p> },
  { id: 'faq-2', title: 'Who runs it?', content: <p>The founders.</p> },
];

describe('Accordion', () => {
  it('keeps every answer in the DOM while closed, so search engines and find-in-page see it', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Read-only access.')).toBeInTheDocument();
    expect(screen.getByText('The founders.')).toBeInTheDocument();
  });

  it('opens a panel from its trigger, with the trigger inside an h3 by default', async () => {
    const onOpen = vi.fn();
    render(<Accordion items={items} onOpen={onOpen} />);
    const trigger = screen.getByRole('button', { name: 'What access do you need?' });
    expect(trigger.closest('h3')).not.toBeNull();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onOpen).toHaveBeenCalledWith('faq-1');
  });

  it('gives each item its id for deep links', () => {
    const { container } = render(<Accordion items={items} />);
    expect(container.querySelector('#faq-2')).not.toBeNull();
  });
});
