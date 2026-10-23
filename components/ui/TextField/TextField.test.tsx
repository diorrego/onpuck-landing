import { render, screen } from '@testing-library/react';
import { Form } from '@base-ui/react/form';
import { describe, expect, it } from 'vitest';
import TextField from '.';

describe('TextField', () => {
  it('labels its control and passes input attributes through', () => {
    render(<TextField name="email" label="Work email" type="email" autoComplete="email" placeholder="you@company.com" required />);
    const input = screen.getByLabelText('Work email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toBeRequired();
  });

  it('renders a textarea when multiline', () => {
    render(<TextField name="change" label="A recent change" multiline />);
    expect(screen.getByLabelText('A recent change').tagName).toBe('TEXTAREA');
  });

  it('shows a server error from the surrounding Form and marks the control invalid', () => {
    render(
      <Form errors={{ email: 'Enter a work email, like you@company.com.' }}>
        <TextField name="email" label="Work email" />
      </Form>,
    );
    const input = screen.getByLabelText('Work email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a work email, like you@company.com.')).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(/you@company\.com/);
  });

  it('forwards extra attributes such as the WebMCP parameter description', () => {
    render(<TextField name="role" label="Your role" inputProps={{ toolparamdescription: 'Role of the applicant' }} />);
    expect(screen.getByLabelText('Your role')).toHaveAttribute('toolparamdescription', 'Role of the applicant');
  });
});
