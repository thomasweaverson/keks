import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from './login-form';
import { useLoginForm } from '../../../hooks/use-login-form';

vi.mock('../../../hooks/use-login-form', () => ({
  useLoginForm: vi.fn(),
}));

const mockUseLoginForm = vi.mocked(useLoginForm);

describe('Component: LoginForm', () => {
  const createHookResult = (
    overrides: Partial<ReturnType<typeof useLoginForm>> = {},
  ): ReturnType<typeof useLoginForm> => ({
    values: {
      email: '',
      password: '',
    },
    errors: {},
    touched: {},
    isSubmitting: false,
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
    handleSubmit: vi.fn(() => Promise.resolve()),
    ...overrides,
  });

  it('should render email and password fields', () => {
    mockUseLoginForm.mockReturnValue(createHookResult());

    render(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: 'Введите вашу почту' }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Введите ваш пароль'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Войти' }),
    ).toBeInTheDocument();
  });

  it('should render form values from hook', () => {
    mockUseLoginForm.mockReturnValue(
      createHookResult({
        values: {
          email: 'test@example.com',
          password: 'password123',
        },
      }),
    );

    render(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: 'Введите вашу почту' }),
    ).toHaveValue('test@example.com');

    expect(screen.getByLabelText('Введите ваш пароль')).toHaveValue(
      'password123',
    );
  });

  it('should display validation errors when fields are touched', () => {
    mockUseLoginForm.mockReturnValue(
      createHookResult({
        errors: {
          email: 'Введите корректный e-mail',
          password: 'Введите пароль',
        },
        touched: {
          email: true,
          password: true,
        },
      }),
    );

    render(<LoginForm />);

    expect(
      screen.getByText('Введите корректный e-mail'),
    ).toBeInTheDocument();

    expect(screen.getByText('Введите пароль')).toBeInTheDocument();
  });

  it('should not display validation errors for untouched fields', () => {
    mockUseLoginForm.mockReturnValue(
      createHookResult({
        errors: {
          email: 'Введите корректный e-mail',
          password: 'Введите пароль',
        },
        touched: {
          email: false,
          password: false,
        },
      }),
    );

    render(<LoginForm />);

    expect(
      screen.queryByText('Введите корректный e-mail'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText('Введите пароль'),
    ).not.toBeInTheDocument();
  });

  it('should disable fields and submit button while submitting', () => {
    mockUseLoginForm.mockReturnValue(
      createHookResult({
        isSubmitting: true,
      }),
    );

    render(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: 'Введите вашу почту' }),
    ).toBeDisabled();

    expect(screen.getByLabelText('Введите ваш пароль')).toBeDisabled();

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Вход...');
  });

  it('should show "Войти" when form is not submitting', () => {
    mockUseLoginForm.mockReturnValue(createHookResult());

    render(<LoginForm />);

    expect(
      screen.getByRole('button', { name: 'Войти' }),
    ).toBeEnabled();

    expect(screen.getByRole('button')).toHaveTextContent('Войти');
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const hookResult = createHookResult();

    mockUseLoginForm.mockReturnValue(hookResult);

    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(hookResult.handleSubmit).toHaveBeenCalledOnce();
  });

  it('should call handleChange when field value changes', async () => {
    const user = userEvent.setup();
    const hookResult = createHookResult();

    mockUseLoginForm.mockReturnValue(hookResult);

    render(<LoginForm />);

    const emailField = screen.getByRole('textbox', {
      name: 'Введите вашу почту',
    });

    await user.type(emailField, 'test@example.com');

    expect(hookResult.handleChange).toHaveBeenCalled();
  });

  it('should call handleBlur when field loses focus', async () => {
    const user = userEvent.setup();
    const hookResult = createHookResult();

    mockUseLoginForm.mockReturnValue(hookResult);

    render(<LoginForm />);

    const emailField = screen.getByRole('textbox', {
      name: 'Введите вашу почту',
    });

    await user.click(emailField);
    await user.tab();

    expect(hookResult.handleBlur).toHaveBeenCalled();
  });
});
