import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Contents from '.';

describe('Contents', () => {
  it('links every section and the references, numbering the paper sections', () => {
    render(<Contents />);
    const nav = screen.getAllByRole('navigation', { name: 'Contents' })[0];
    const links = within(nav).getAllByRole('link');
    expect(links.at(-1)).toHaveAttribute('href', '#references');
    expect(within(nav).getByText('3')).toBeInTheDocument();
  });
});
