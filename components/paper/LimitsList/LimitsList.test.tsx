import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LimitsList from '.';

describe('LimitsList', () => {
  it('pairs each limit with its reason and mitigation', () => {
    render(<LimitsList limits={[{ title: 'Exact magnitudes', because: 'Overestimated [5].', mitigation: 'Intervals.' }]} />);
    expect(screen.getByRole('heading', { name: 'Exact magnitudes' })).toBeInTheDocument();
    expect(screen.getByText('Why not')).toBeInTheDocument();
    expect(screen.getByText('What we do')).toBeInTheDocument();
  });
});
