import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Program from '.';

describe('Program', () => {
  it('states the terms, the give and get, the fit and the CTA', () => {
    render(<Program />);
    expect(screen.getByText('5 teams in San Francisco')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What you get' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'What we ask' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Apply to be a design partner' })).toHaveAttribute('href', '#apply');
  });
});
