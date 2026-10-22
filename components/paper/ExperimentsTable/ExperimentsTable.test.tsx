import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ExperimentsTable from '.';

describe('ExperimentsTable', () => {
  it('has a row per experiment, anchored by id, misses included', () => {
    const { container } = render(<ExperimentsTable />);
    expect([...container.querySelectorAll('tbody tr')].map((r) => r.id)).toEqual(['exp-01', 'exp-02', 'exp-03', 'exp-04']);
    expect(screen.getByText('Miss on Δ, bug found')).toBeInTheDocument();
    expect(screen.getByText('Result pending')).toBeInTheDocument();
  });
});
