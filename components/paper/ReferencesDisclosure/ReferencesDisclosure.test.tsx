import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ReferencesDisclosure from '.';

describe('ReferencesDisclosure', () => {
  const setup = () =>
    render(
      <>
        <a href="#ref-2">[2]</a>
        <ReferencesDisclosure count={2}>
          <ol>
            <li id="ref-1">One</li>
            <li id="ref-2">Two</li>
          </ol>
        </ReferencesDisclosure>
      </>,
    );

  it('starts closed with the count in the trigger, references still in the DOM', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Show all 2 references' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('ref-2')).not.toBeNull();
  });

  it('opens when a citation is clicked', async () => {
    setup();
    await act(async () => {
      fireEvent.click(screen.getByText('[2]'));
    });
    expect(screen.getByRole('button', { name: 'Hide references' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens when the page loads on a reference anchor', async () => {
    window.history.replaceState(null, '', '#ref-1');
    setup();
    await act(async () => {});
    expect(screen.getByRole('button', { name: 'Hide references' })).toBeInTheDocument();
    window.history.replaceState(null, '', '#');
  });
});
