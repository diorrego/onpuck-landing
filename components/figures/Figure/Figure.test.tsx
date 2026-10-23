import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Figure from '.';

describe('Figure', () => {
  it('numbers the figure, titles its window and captions it', () => {
    const { container } = render(<Figure id="prediction"><p>chart</p></Figure>);
    expect(container.querySelector('figure')).toHaveAttribute('id', 'fig-4');
    expect(screen.getByText('Figure 4')).toBeInTheDocument();
    expect(screen.getByText('Prediction vs reality')).toBeInTheDocument();
    expect(container.querySelector('figcaption')?.textContent).toMatch(/^Figure 4: Change in review submissions/);
  });
});
