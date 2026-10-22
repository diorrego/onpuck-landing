import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SceneLegend from '.';

describe('SceneLegend', () => {
  it('explains each bubble icon', () => {
    render(<SceneLegend />);
    const list = screen.getByRole('list', { name: 'Bubble legend' });
    expect(list.querySelectorAll('li')).toHaveLength(5);
    expect(screen.getByText('Friction')).toBeInTheDocument();
  });
});
