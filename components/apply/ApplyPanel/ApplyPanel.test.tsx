import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/actions', () => ({ applyDesignPartner: vi.fn() }));
import ApplyPanel from '.';

describe('ApplyPanel', () => {
  it('names the form by its window title and answers access next to it', () => {
    render(<ApplyPanel />);
    expect(screen.getByRole('form', { name: 'Design partner application' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Access and data' })).toHaveTextContent('Nothing we run writes to your systems');
  });
});
