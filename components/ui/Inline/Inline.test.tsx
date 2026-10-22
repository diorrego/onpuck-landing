import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Inline from '.';

describe('Inline', () => {
  it('renders text, citations, code, strong and links', () => {
    const { container } = render(
      <p>
        <Inline text="Logs disagree [32]. Run `get_evidence`, **always**, see [exp-02](#exp-02)." />
      </p>,
    );
    expect(container.textContent).toBe('Logs disagree [32]. Run get_evidence, always, see exp-02.');
    expect(screen.getByRole('link', { name: /Reference 32/ })).toHaveAttribute('href', '#ref-32');
    expect(screen.getByRole('link', { name: 'exp-02' })).toHaveAttribute('href', '#exp-02');
    expect(container.querySelector('code')).toHaveTextContent('get_evidence');
    expect(container.querySelector('strong')).toHaveTextContent('always');
  });
});
