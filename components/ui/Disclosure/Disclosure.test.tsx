import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Disclosure from '.';

describe('Disclosure', () => {
  it('toggles its panel and keeps the content in the DOM', async () => {
    render(
      <Disclosure title="Contents">
        <a href="#gap">The gap</a>
      </Disclosure>,
    );
    const trigger = screen.getByRole('button', { name: 'Contents' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('The gap')).toBeInTheDocument();
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
