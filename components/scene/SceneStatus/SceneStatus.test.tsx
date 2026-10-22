import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SceneStatus from '.';

describe('SceneStatus', () => {
  it('shows the live counts with their labels, hidden from screen readers (the caption says it)', () => {
    const { container } = render(
      <SceneStatus labels={{ onFloor: 'on the floor', frustrated: 'frustrated now', done: 'tasks done', left: 'gave up and left' }} stats={{ onFloor: 24, frustrated: 3, done: 12, left: 5 }} />,
    );
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.textContent).toBe('24 on the floor3 frustrated now12 tasks done5 gave up and left');
  });
});
