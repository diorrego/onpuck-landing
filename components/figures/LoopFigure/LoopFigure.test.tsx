import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoopFigure from '.';

describe('LoopFigure', () => {
  it('lists the seven steps in reading order, with their status', () => {
    const { container } = render(<LoopFigure />);
    const items = [...container.querySelectorAll('ol > li:not([aria-hidden])')];
    expect(items.map((li) => li.querySelector('p')?.textContent)).toEqual([
      'Connect', 'Listen', 'Anchor', 'Spec', 'Simulate', 'Ship', 'Calibrate',
    ]);
    expect(items[4].textContent).toContain('Research prototype');
  });
});
