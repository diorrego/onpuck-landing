import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SiteFooter from '.';

describe('SiteFooter', () => {
  it('carries the purpose line, founders, contact and the lab', () => {
    render(<SiteFooter />);
    expect(screen.getByText('We exist to turn stories into evidence, and evidence into better decisions.')).toBeInTheDocument();
    expect(screen.getByText('Diego Orrego')).toBeInTheDocument();
    expect(screen.getByText('Paula Riquelme')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'paula@onpuck.com' })).toHaveAttribute('href', 'mailto:paula@onpuck.com');
    expect(screen.getByRole('link', { name: 'woku' })).toHaveAttribute('href', 'https://woku.app');
  });
});
