import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SimulatedRunFigure from '.';

describe('SimulatedRunFigure', () => {
  it('is Fig. 3, labelled as an illustration, with the replay scene inside', () => {
    const { container } = render(<SimulatedRunFigure />);
    expect(container.querySelector('figure')).toHaveAttribute('id', 'fig-3');
    expect(container.querySelector('figcaption')).toHaveTextContent(/Illustration of a simulated run/);
    expect(container.querySelector('[data-scene="ab"]')).not.toBeNull();
  });
});
