import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HowItWorks from '.';
import { experiments } from '@/content/experiments';
import { CTA_LABEL, overview } from '@/content/paper';
import { references } from '@/content/references';

describe('HowItWorks', () => {
  it('is a section with a searchable H2 and the hook as a paragraph', () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector(`section#${overview.id}`)!;
    expect(section).toHaveAttribute('aria-labelledby', `${overview.id}-title`);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('How OnPuck works');
    expect(screen.getByText(overview.hook.emphasis).closest('p')).not.toBeNull();
  });

  it('shows three steps in order', () => {
    render(<HowItWorks />);
    const steps = within(screen.getAllByRole('list')[0]).getAllByRole('listitem');
    expect(steps.map((li) => within(li).getByRole('heading', { level: 3 }).textContent)).toEqual(overview.steps.map((s) => s.title));
  });

  it('compares today with OnPuck in a real table', () => {
    render(<HowItWorks />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Today', 'With OnPuck']);
    expect(within(table).getAllByRole('row')).toHaveLength(overview.compare.rows.length + 1);
  });

  it('lists every tool with its colour mark from public/logos', () => {
    const { container } = render(<HowItWorks />);
    for (const s of overview.stack) {
      expect(screen.getByText(s.name, { selector: 'li' })).toBeInTheDocument();
      expect(container.querySelector(`li img[src="/logos/${s.id}.svg"]`), s.id).not.toBeNull();
    }
  });

  it('claims only what Woku field work shows: no AI interviews, no simulated testing of your specs', () => {
    const text = JSON.stringify(overview);
    expect(text).not.toMatch(/AI interview|tested on simulated|simulated users first|before you build/i);
  });

  it('counts the proof from the paper itself and leads to it', () => {
    render(<HowItWorks />);
    const bridge = screen.getByRole('complementary');
    expect(bridge).toHaveTextContent(`${references.length}references`);
    expect(bridge).toHaveTextContent(`${experiments.length}simulator experiments`);
    const read = within(bridge).getByRole('link', { name: 'Read the light paper' });
    expect(read).toHaveAttribute('href', '#abstract');
    expect(read).toHaveAttribute('data-event', 'paper_link_click');
    expect(within(bridge).getByRole('link', { name: CTA_LABEL })).toHaveAttribute('href', '#apply');
  });
});
