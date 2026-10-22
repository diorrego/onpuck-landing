import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PixelWindow from '.';

describe('PixelWindow', () => {
  it('frames content under a title bar', () => {
    render(
      <PixelWindow title="Fig. 2 One story, resolved">
        <p>body</p>
      </PixelWindow>,
    );
    expect(screen.getByText('Fig. 2 One story, resolved')).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('hides the decorative close box from assistive tech', () => {
    const { container } = render(<PixelWindow title="t">x</PixelWindow>);
    expect(container.querySelector('.pixel-close')).toHaveAttribute('aria-hidden', 'true');
  });
});
