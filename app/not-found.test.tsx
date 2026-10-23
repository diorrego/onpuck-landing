import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { errorCopy } from '@/content/site';
import NotFound, { metadata } from './not-found';

describe('not-found', () => {
  it('is the error page with the 404 copy, kept out of the index', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(errorCopy.notFound.title);
    expect(screen.getByRole('link', { name: errorCopy.back })).toHaveAttribute('href', '/');
    expect(metadata.robots).toMatchObject({ index: false });
  });
});
