import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SegmentedToggle from '.';

describe('SegmentedToggle', () => {
  it('presses exactly one option and reports the change', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedToggle
        label="Arm of the A/B test"
        value="test"
        onChange={onChange}
        options={[
          { value: 'control', label: 'Rating first' },
          { value: 'test', label: 'Rating after the comment' },
        ]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Arm of the A/B test' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rating after the comment' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Rating first' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Rating first' }));
    expect(onChange).toHaveBeenCalledWith('control');
  });

  it('never lets the selection become empty', async () => {
    const onChange = vi.fn();
    render(<SegmentedToggle label="x" value="a" onChange={onChange} options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />);
    await userEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
