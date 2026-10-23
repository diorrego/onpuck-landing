import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Steps from '.';

describe('Steps', () => {
  it('renders each step with output, status and its evidence', () => {
    render(<Steps steps={[{ n: 1, name: 'Connect', output: 'A catalogue', status: 'Specified, run by hand', body: ['Body.'], evidence: ['Proof [23].'] }]} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Connect' })).toBeInTheDocument();
    expect(screen.getByText('Evidence.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reference 23/ })).toBeInTheDocument();
  });
});
