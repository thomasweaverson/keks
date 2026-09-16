import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormField from './form-field';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Component: FormField', () => {
  const defaultProps = {
    name: 'email',
    label: 'Email',
    placeholder: 'Введите email',
    type: 'email' as const,
    value: '',
    touched: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders label, input and placeholder', () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute(
      'placeholder',
      defaultProps.placeholder,
    );
    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute(
      'name',
      defaultProps.name,
    );
    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute(
      'type',
      defaultProps.type,
    );
  });

  it('renders input with the current value', () => {
    render(<FormField {...defaultProps} value="test@example.com" />);

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('shows error when field is touched and has an error', () => {
    render(
      <FormField {...defaultProps} touched error="Введите корректный email" />,
    );

    const input = screen.getByLabelText(defaultProps.label);
    const error = screen.getByText('Введите корректный email');

    expect(error).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('does not show error when field is not touched', () => {
    render(<FormField {...defaultProps} error="Введите корректный email" />);

    expect(
      screen.queryByText('Введите корректный email'),
    ).not.toBeInTheDocument();
  });

  it('marks field as valid when touched, has value and no error', () => {
    render(<FormField {...defaultProps} value="test@example.com" touched />);

    const field = screen.getByLabelText(defaultProps.label).closest('div');

    expect(field).toHaveClass('is-valid');
    expect(field).not.toHaveClass('is-invalid');
  });

  it('marks field as invalid when touched and has an error', () => {
    render(<FormField {...defaultProps} touched error="Ошибка" />);

    const field = screen.getByLabelText(defaultProps.label).closest('div');

    expect(field).toHaveClass('is-invalid');
    expect(field).not.toHaveClass('is-valid');
  });

  it('disables input when disabled is true', () => {
    render(<FormField {...defaultProps} disabled />);

    expect(screen.getByLabelText(defaultProps.label)).toBeDisabled();
  });

  it('calls onChange and onBlur when user interacts with input', async () => {
    const user = userEvent.setup();

    render(<FormField {...defaultProps} />);

    const input = screen.getByLabelText(defaultProps.label);

    await user.type(input, 'test');
    await user.tab();

    expect(defaultProps.onChange).toHaveBeenCalled();
    expect(defaultProps.onBlur).toHaveBeenCalledTimes(1);
  });
});
