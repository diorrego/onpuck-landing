import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from '.';

describe('Card', () => {
  it('renders a header with label and title above its body', () => {
    render(
      <Card label="Fig. 2" title="One story, resolved" titleId="t">
        <p>body</p>
      </Card>,
    );
    expect(screen.getByText('Fig. 2')).toBeInTheDocument();
    expect(screen.getByText('One story, resolved')).toBeInTheDocument();
    expect(document.getElementById('t')).toHaveTextContent('Fig. 2One story, resolved');
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('can be a plain card without a header', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.querySelector('.card')).toHaveTextContent('x');
    expect(container.querySelector('.border-b')).toBeNull();
  });
});
