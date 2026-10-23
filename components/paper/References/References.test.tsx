import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import References from '.';

describe('References', () => {
  it('labels links by arXiv id or DOI', () => {
    const { container } = render(<References />);
    expect(container.querySelector('#ref-32 a')).toHaveTextContent('doi:10.1038/s41562-021-01117-5');
    expect(container.querySelector('#ref-6 a')).toHaveTextContent('arXiv:2504.09723');
    expect(container.querySelector('#ref-6 a')).toHaveAttribute('href', 'https://arxiv.org/abs/2504.09723');
  });
});

describe('References (collapsed)', () => {
  it('starts closed: the visitor chooses to open the list', () => {
    const { getByRole } = render(<References />);
    expect(getByRole('button', { name: /Show all 36 references/ })).toHaveAttribute('aria-expanded', 'false');
  });
});
