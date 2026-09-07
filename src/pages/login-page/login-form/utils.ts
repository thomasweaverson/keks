import { EMAIL_REGEXP, PASSWORD_REGEXP } from '../../../const/regexp';
import type {
  LoginFormErrors,
  LoginFormValues,
} from './types';

export const validateEmail = (
  email: string
): string | undefined => {
  if (!email.trim()) {
    return 'Введите e-mail';
  }

  if (!EMAIL_REGEXP.test(email)) {
    return 'Введите корректный e-mail (например, user@example.com)';
  }

  return undefined;
};

export const validatePassword = (
  password: string
): string | undefined => {
  if (!password) {
    return 'Введите пароль';
  }

  if (!PASSWORD_REGEXP.test(password)) {
    return 'Пароль должен содержать минимум 1 букву, 1 цифру и не иметь пробелов';
  }

  return undefined;
};

export const validateForm = (
  values: LoginFormValues
): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(values.email);

  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(values.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
