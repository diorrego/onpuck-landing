import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BlockRenderer from '.';

describe('BlockRenderer', () => {
  it('renders a paragraph with citations', () => {
    render(<BlockRenderer block={{ type: 'p', text: 'Rarely accurate [32].' }} />);
    expect(screen.getByRole('link', { name: /Reference 32/ })).toBeInTheDocument();
  });

  it('renders a formula in a titled window', () => {
    render(<BlockRenderer block={{ type: 'formula', label: 'Rule', code: 'x = 1', note: 'fitted' }} />);
    expect(screen.getByText('Rule')).toBeInTheDocument();
    expect(screen.getByText('x = 1').tagName).toBe('CODE');
  });

  it('renders the thesis as a list', () => {
    render(<BlockRenderer block={{ type: 'thesis', lines: ['A.', 'B.'] }} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
