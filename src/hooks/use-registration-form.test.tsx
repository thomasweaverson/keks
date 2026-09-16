import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRegistrationForm } from './use-registration-form';
import {
  validateAvatar,
  validateEmail,
  validateForm,
  validateName,
  validatePassword,
} from '../pages/registration-page/registration-form/utils';
import { withStore } from '../utils/testing/mock-components';
import { toast } from 'react-toastify';

const { mockRegisterUserAction } = vi.hoisted(() => ({
  mockRegisterUserAction: vi.fn(),
}));

vi.mock('../store/api-actions', () => ({
  registerUserAction: mockRegisterUserAction,
}));

vi.mock(
  '../pages/registration-page/registration-form/utils',
  () => ({
    validateAvatar: vi.fn(),
    validateEmail: vi.fn(),
    validateForm: vi.fn(),
    validateName: vi.fn(),
    validatePassword: vi.fn(),
  }),
);

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
  },
}));

const RegistrationFormTest = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useRegistrationForm();

  return (
    <form
      data-testid="registration-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="name">Имя</label>
      <input
        id="name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <span data-testid="name-error">
        {errors.name ?? ''}
      </span>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <span data-testid="email-error">
        {errors.email ?? ''}
      </span>

      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <span data-testid="password-error">
        {errors.password ?? ''}
      </span>

      <label htmlFor="avatar">Аватар</label>
      <input
        id="avatar"
        name="avatar"
        type="file"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <span data-testid="avatar-value">
        {values.avatar?.name ?? ''}
      </span>

      <span data-testid="avatar-error">
        {errors.avatar ?? ''}
      </span>

      <span data-testid="touched">
        {JSON.stringify(touched)}
      </span>

      <span data-testid="is-submitting">
        {String(isSubmitting)}
      </span>

      <span data-testid="name-value">{values.name}</span>
      <span data-testid="email-value">{values.email}</span>
      <span data-testid="password-value">{values.password}</span>
    </form>
  );
};

const renderRegistrationForm = () => {
  const { mockStore } = withStore(<></>);

  render(
    <Provider store={mockStore}>
      <RegistrationFormTest />
    </Provider>,
  );

  return mockStore;
};

describe('Hook: useRegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(validateName).mockReturnValue(undefined);
    vi.mocked(validateEmail).mockReturnValue(undefined);
    vi.mocked(validatePassword).mockReturnValue(undefined);
    vi.mocked(validateAvatar).mockResolvedValue(undefined);
    vi.mocked(validateForm).mockResolvedValue({});

    mockRegisterUserAction.mockReturnValue({
      type: 'user/register',
      unwrap: vi.fn().mockResolvedValue({
        isAvatarLoadingError: false,
      }),
    });
  });

  it('initializes with default values', () => {
    renderRegistrationForm();

    expect(screen.getByTestId('name-value')).toHaveTextContent('');
    expect(screen.getByTestId('email-value')).toHaveTextContent('');
    expect(screen.getByTestId('password-value')).toHaveTextContent('');
    expect(screen.getByTestId('avatar-value')).toHaveTextContent('');
    expect(screen.getByTestId('name-error')).toHaveTextContent('');
    expect(screen.getByTestId('email-error')).toHaveTextContent('');
    expect(screen.getByTestId('password-error')).toHaveTextContent('');
    expect(screen.getByTestId('avatar-error')).toHaveTextContent('');
    expect(screen.getByTestId('touched')).toHaveTextContent('{}');
    expect(screen.getByTestId('is-submitting')).toHaveTextContent('false');
  });

  it('updates text values and validates synchronous fields on handleChange', () => {
    vi.mocked(validateName).mockReturnValue('Некорректное имя');
    vi.mocked(validateEmail).mockReturnValue('Некорректный email');
    vi.mocked(validatePassword).mockReturnValue('Слишком короткий пароль');

    renderRegistrationForm();

    fireEvent.change(screen.getByLabelText('Имя'), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@test.com' },
    });

    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: '123456' },
    });

    expect(screen.getByTestId('name-value')).toHaveTextContent('John');
    expect(screen.getByTestId('email-value')).toHaveTextContent(
      'john@test.com',
    );
    expect(screen.getByTestId('password-value')).toHaveTextContent('123456');

    expect(screen.getByTestId('name-error')).toHaveTextContent(
      'Некорректное имя',
    );
    expect(screen.getByTestId('email-error')).toHaveTextContent(
      'Некорректный email',
    );
    expect(screen.getByTestId('password-error')).toHaveTextContent(
      'Слишком короткий пароль',
    );
  });

  it('handles avatar field change and async avatar validation', async () => {
    vi.mocked(validateAvatar).mockResolvedValue('Файл слишком большой');

    renderRegistrationForm();

    const file = new File(['avatar-content'], 'avatar.png', {
      type: 'image/png',
    });

    fireEvent.change(screen.getByLabelText('Аватар'), {
      target: {
        files: [file],
      },
    });

    expect(screen.getByTestId('avatar-value')).toHaveTextContent(
      'avatar.png',
    );
    expect(validateAvatar).toHaveBeenCalledWith(file);

    await waitFor(() => {
      expect(screen.getByTestId('avatar-error')).toHaveTextContent(
        'Файл слишком большой',
      );
    });
  });

  it('marks field as touched on handleBlur', () => {
    renderRegistrationForm();

    fireEvent.blur(screen.getByLabelText('Имя'));

    expect(screen.getByTestId('touched')).toHaveTextContent(
      '{"name":true}',
    );
  });

  it('stops submit when form validation fails', async () => {
    vi.mocked(validateForm).mockResolvedValue({
      email: 'Обязательное поле',
    });

    renderRegistrationForm();

    fireEvent.submit(screen.getByTestId('registration-form'));

    await waitFor(() => {
      expect(validateForm).toHaveBeenCalledWith({
        name: '',
        email: '',
        password: '',
        avatar: null,
      });
    });

    expect(screen.getByTestId('touched')).toHaveTextContent(
      '{"name":true,"email":true,"password":true,"avatar":true}',
    );
    expect(screen.getByTestId('email-error')).toHaveTextContent(
      'Обязательное поле',
    );
    expect(mockRegisterUserAction).not.toHaveBeenCalled();
  });

  it('submits form, resets state and shows success toast when avatar loaded without errors', async () => {
    renderRegistrationForm();

    fireEvent.change(screen.getByLabelText('Имя'), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@test.com' },
    });

    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: '123456' },
    });

    fireEvent.submit(screen.getByTestId('registration-form'));

    await waitFor(() => {
      expect(mockRegisterUserAction).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@test.com',
        password: '123456',
        avatar: null,
      });
    });

    expect(screen.getByTestId('name-value')).toHaveTextContent('');
    expect(screen.getByTestId('email-value')).toHaveTextContent('');
    expect(screen.getByTestId('password-value')).toHaveTextContent('');
    expect(screen.getByTestId('avatar-value')).toHaveTextContent('');
    expect(screen.getByTestId('touched')).toHaveTextContent('{}');
    expect(screen.getByTestId('is-submitting')).toHaveTextContent('false');

    expect(toast.success).toHaveBeenCalledWith(
      'Регистрация выполнена успешно',
    );
  });

  it('shows warning toast when user registered but avatar failed to upload', async () => {
    mockRegisterUserAction.mockReturnValue({
      type: 'user/register',
      unwrap: vi.fn().mockResolvedValue({
        isAvatarLoadingError: true,
      }),
    });

    renderRegistrationForm();

    fireEvent.submit(screen.getByTestId('registration-form'));

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        'Регистрация выполнена успешно, но аватар не удалось загрузить',
      );
    });

    expect(toast.success).not.toHaveBeenCalled();
  });
});
