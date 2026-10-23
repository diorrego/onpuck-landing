import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { errorCopy } from '@/content/site';
import ErrorBoundary from './error';

describe('error boundary', () => {
  it('shows the error page, offers a retry and never prints the error', () => {
    const retry = vi.fn();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary error={Object.assign(new Error('secret detail'), { digest: 'abc' })} retry={retry} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(errorCopy.error.title);
    expect(screen.queryByText(/secret detail/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: errorCopy.error.retry }));
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: errorCopy.back })).toHaveAttribute('href', '/');
    spy.mockRestore();
  });
});
