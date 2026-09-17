import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RegistrationForm from './registration-form';
import { useRegistrationForm } from '../../../hooks/use-registration-form';

vi.mock('../../../hooks/use-registration-form', () => ({
  useRegistrationForm: vi.fn(),
}));

const mockUseRegistrationForm = vi.mocked(useRegistrationForm);

const createMockForm = (overrides = {}) => ({
  values: {
    name: '',
    email: '',
    password: '',
    avatar: null,
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  handleChange: vi.fn(),
  handleBlur: vi.fn(),
  handleSubmit: vi.fn(),
  ...overrides,
});

describe('Component: RegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRegistrationForm.mockReturnValue(createMockForm());
  });

  it('should render all registration fields and submit button', () => {
    render(<RegistrationForm />);

    expect(
      screen.getByRole('textbox', { name: 'Введите ваше имя' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: 'Введите вашу почту' }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Введите ваш пароль'),
    ).toBeInTheDocument();

    expect(screen.getByText('Выберите изображение')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Зарегистрироваться' }),
    ).toBeInTheDocument();
  });

  it('should render initial form values', () => {
    mockUseRegistrationForm.mockReturnValue(
      createMockForm({
        values: {
          name: 'Thomas',
          email: 'thomas@example.com',
          password: 'password123',
          avatar: null,
        },
      }),
    );

    render(<RegistrationForm />);

    expect(screen.getByRole('textbox', { name: 'Введите ваше имя' }))
      .toHaveValue('Thomas');

    expect(screen.getByRole('textbox', { name: 'Введите вашу почту' }))
      .toHaveValue('thomas@example.com');

    expect(screen.getByLabelText('Введите ваш пароль'))
      .toHaveValue('password123');
  });

  it('should pass field changes to handleChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    mockUseRegistrationForm.mockReturnValue(
      createMockForm({ handleChange }),
    );

    render(<RegistrationForm />);

    const nameInput = screen.getByRole('textbox', {
      name: 'Введите ваше имя',
    });

    await user.type(nameInput, 'Thomas');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should pass field blur to handleBlur', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();

    mockUseRegistrationForm.mockReturnValue(
      createMockForm({ handleBlur }),
    );

    render(<RegistrationForm />);

    const nameInput = screen.getByRole('textbox', {
      name: 'Введите ваше имя',
    });

    await user.click(nameInput);
    await user.tab();

    expect(handleBlur).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    mockUseRegistrationForm.mockReturnValue(
      createMockForm({ handleSubmit }),
    );

    render(<RegistrationForm />);

    await user.click(
      screen.getByRole('button', { name: 'Зарегистрироваться' }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display validation errors', () => {
    mockUseRegistrationForm.mockReturnValue(
      createMockForm({
        errors: {
          name: 'Введите имя',
          email: 'Введите корректный e-mail',
          password: 'Введите пароль',
        },
        touched: {
          name: true,
          email: true,
          password: true,
        },
      }),
    );

    render(<RegistrationForm />);

    expect(screen.getByText('Введите имя')).toBeInTheDocument();
    expect(
      screen.getByText('Введите корректный e-mail'),
    ).toBeInTheDocument();
    expect(screen.getByText('Введите пароль')).toBeInTheDocument();
  });

  it('should disable all inputs and submit button while submitting', () => {
    mockUseRegistrationForm.mockReturnValue(
      createMockForm({
        isSubmitting: true,
      }),
    );

    render(<RegistrationForm />);

    expect(
      screen.getByRole('textbox', { name: 'Введите ваше имя' }),
    ).toBeDisabled();

    expect(
      screen.getByRole('textbox', { name: 'Введите вашу почту' }),
    ).toBeDisabled();

    expect(screen.getByLabelText('Введите ваш пароль')).toBeDisabled();

    expect(screen.getByLabelText('Выберите изображение')).toBeDisabled();

    expect(
      screen.getByRole('button', { name: 'Регистрация...' }),
    ).toBeDisabled();
  });

  it('should display regular submit button when form is not submitting', () => {
    render(<RegistrationForm />);

    expect(
      screen.getByRole('button', { name: 'Зарегистрироваться' }),
    ).toBeEnabled();

    expect(
      screen.queryByRole('button', { name: 'Регистрация...' }),
    ).not.toBeInTheDocument();
  });

  it('should revoke avatar object URL when avatar changes', () => {
    const createObjectURL = vi.fn(() => 'blob:avatar-preview');
    const revokeObjectURL = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL,
      revokeObjectURL,
    });

    const avatar = new File(['avatar'], 'avatar.png', {
      type: 'image/png',
    });

    mockUseRegistrationForm.mockReturnValue(
      createMockForm({
        values: {
          name: '',
          email: '',
          password: '',
          avatar,
        },
      }),
    );

    const { rerender } = render(<RegistrationForm />);

    mockUseRegistrationForm.mockReturnValue(
      createMockForm({
        values: {
          name: '',
          email: '',
          password: '',
          avatar: null,
        },
      }),
    );

    rerender(<RegistrationForm />);

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:avatar-preview');
    expect(
      screen.queryByRole('img', {
        name: 'Предпросмотр выбранного аватара',
      }),
    ).not.toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('should not display avatar preview when avatar has an error', () => {
    const avatar = new File(['avatar'], 'avatar.png', {
      type: 'image/png',
    });

    mockUseRegistrationForm.mockReturnValue(
      createMockForm({
        values: {
          name: '',
          email: '',
          password: '',
          avatar,
        },
        errors: {
          avatar: 'Допустимы только изображения JPG и PNG',
        },
        touched: {
          avatar: true,
        },
      }),
    );

    render(<RegistrationForm />);

    expect(
      screen.queryByRole('img', {
        name: 'Предпросмотр выбранного аватара',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText('Допустимы только изображения JPG и PNG'),
    ).toBeInTheDocument();
  });

  it('should set correct accessibility attributes for avatar error', () => {
    mockUseRegistrationForm.mockReturnValue(
      createMockForm({
        errors: {
          avatar: 'Выберите изображение',
        },
        touched: {
          avatar: true,
        },
      }),
    );

    render(<RegistrationForm />);

    const avatarInput = screen.getByLabelText('Выберите изображение');

    expect(avatarInput).toHaveAttribute('aria-invalid', 'true');
    expect(avatarInput).toHaveAttribute(
      'aria-describedby',
      'registration-avatar-error',
    );
  });

  it('should not set aria-describedby when avatar has no error', () => {
    render(<RegistrationForm />);

    const avatarInput = screen.getByLabelText('Выберите изображение');

    expect(avatarInput).toHaveAttribute('aria-invalid', 'false');
    expect(avatarInput).not.toHaveAttribute('aria-describedby');
  });
});
