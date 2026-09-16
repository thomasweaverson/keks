import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLoginForm } from './use-login-form';
import {
  validateEmail,
  validateForm,
  validatePassword,
} from '../pages/login-page/login-form/utils';
import { withStore } from '../utils/testing/mock-components';

const { mockAuthorizeUserAction } = vi.hoisted(() => ({
  mockAuthorizeUserAction: vi.fn(() => ({
    type: 'user/authorize',
    unwrap: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('../store/api-actions', () => ({
  authorizeUserAction: mockAuthorizeUserAction,
}));

vi.mock('../pages/login-page/login-form/utils', () => ({
  validateEmail: vi.fn(),
  validatePassword: vi.fn(),
  validateForm: vi.fn(),
}));

const LoginFormTest = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit}>
      <input
        aria-label="Email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <input
        aria-label="Password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button type="submit" disabled={isSubmitting}>
        Войти
      </button>

      <output data-testid="email-error">{errors.email}</output>
      <output data-testid="password-error">{errors.password}</output>
      <output data-testid="email-touched">
        {String(touched.email ?? false)}
      </output>
      <output data-testid="password-touched">
        {String(touched.password ?? false)}
      </output>
    </form>
  );
};

const renderLoginForm = () => {
  const { mockStore } = withStore(<LoginFormTest />);

  return render(
    <Provider store={mockStore}>
      <LoginFormTest />
    </Provider>,
  );
};

describe('Hook: useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateEmail).mockReturnValue(undefined);
    vi.mocked(validatePassword).mockReturnValue(undefined);
    vi.mocked(validateForm).mockReturnValue({});
  });

  it('initializes with default values', () => {
    renderLoginForm();

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Password' })).toHaveValue('');
    expect(screen.getByTestId('email-error')).toHaveTextContent('');
    expect(screen.getByTestId('password-error')).toHaveTextContent('');
    expect(screen.getByTestId('email-touched')).toHaveTextContent('false');
    expect(screen.getByTestId('password-touched')).toHaveTextContent('false');
  });

  it('updates email value and validates it on change', () => {
    vi.mocked(validateEmail).mockReturnValue('Неверный email');

    renderLoginForm();

    const emailInput = screen.getByRole('textbox', { name: 'Email' });

    fireEvent.change(emailInput, {
      target: {
        name: 'email',
        value: 'invalid-email',
      },
    });

    expect(emailInput).toHaveValue('invalid-email');
    expect(screen.getByTestId('email-error')).toHaveTextContent(
      'Неверный email',
    );
    expect(validateEmail).toHaveBeenCalledWith('invalid-email');
  });

  it('updates password value and validates it on change', () => {
    vi.mocked(validatePassword).mockReturnValue('Пароль слишком короткий');

    renderLoginForm();

    const passwordInput = screen.getByRole('textbox', { name: 'Password' });

    fireEvent.change(passwordInput, {
      target: {
        name: 'password',
        value: '123',
      },
    });

    expect(passwordInput).toHaveValue('123');
    expect(screen.getByTestId('password-error')).toHaveTextContent(
      'Пароль слишком короткий',
    );
    expect(validatePassword).toHaveBeenCalledWith('123');
  });

  it('marks field as touched on blur', () => {
    renderLoginForm();

    const emailInput = screen.getByRole('textbox', { name: 'Email' });

    fireEvent.blur(emailInput);

    expect(screen.getByTestId('email-touched')).toHaveTextContent('true');
    expect(screen.getByTestId('password-touched')).toHaveTextContent('false');
  });

  it('prevents dispatching action when form validation fails', async () => {
    vi.mocked(validateForm).mockReturnValue({
      email: 'Обязательное поле',
    });

    renderLoginForm();

    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent(
        'Обязательное поле',
      );
    });

    expect(screen.getByTestId('email-touched')).toHaveTextContent('true');
    expect(screen.getByTestId('password-touched')).toHaveTextContent('true');
    expect(mockAuthorizeUserAction).not.toHaveBeenCalled();
  });

  it('dispatches authorizeUserAction when validation passes', async () => {
    renderLoginForm();


    const emailInput = screen.getByRole('textbox', { name: 'Email' });
    const passwordInput = screen.getByRole('textbox', { name: 'Password' });

    fireEvent.change(emailInput, {
      target: {
        name: 'email',
        value: '  user@test.com  ',
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        name: 'password',
        value: 'secret123',
      },
    });

    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockAuthorizeUserAction).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'secret123',
      });
    });

    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});
