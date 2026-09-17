import { describe, expect, it } from 'vitest';
import { validateEmail, validateForm, validatePassword } from './utils';

describe('Login Form Utilities Test', () => {
  describe('validateEmail', () => {
    it('should return an error for an empty email', () => {
      expect(validateEmail('')).toBe('Введите e-mail');
    });

    it('should return an error for an email containing only spaces', () => {
      expect(validateEmail('   ')).toBe('Введите e-mail');
    });

    it('should return an error for an invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(
        'Введите корректный e-mail (например, user@example.com)',
      );
    });

    it('should return undefined for a valid email', () => {
      expect(validateEmail('user@example.com')).toBeUndefined();
    });
  });

  describe('validatePassword', () => {
    it('should return an error for an empty password', () => {
      expect(validatePassword('')).toBe('Введите пароль');
    });

    it('should return an error for a password without a letter', () => {
      expect(validatePassword('12345678')).toBe(
        'Пароль должен содержать минимум 1 букву, 1 цифру и не иметь пробелов',
      );
    });

    it('should return an error for a password without a digit', () => {
      expect(validatePassword('password')).toBe(
        'Пароль должен содержать минимум 1 букву, 1 цифру и не иметь пробелов',
      );
    });

    it('should return an error for a password containing spaces', () => {
      expect(validatePassword('pass word1')).toBe(
        'Пароль должен содержать минимум 1 букву, 1 цифру и не иметь пробелов',
      );
    });

    it('should return undefined for a valid password', () => {
      expect(validatePassword('password1')).toBeUndefined();
    });
  });

  describe('validateForm', () => {
    it('should return an empty object for valid values', () => {
      expect(
        validateForm({
          email: 'user@example.com',
          password: 'password1',
        }),
      ).toEqual({});
    });

    it('should return email error for an invalid email', () => {
      expect(
        validateForm({
          email: 'invalid-email',
          password: 'password1',
        }),
      ).toEqual({
        email: 'Введите корректный e-mail (например, user@example.com)',
      });
    });

    it('should return password error for an invalid password', () => {
      expect(
        validateForm({
          email: 'user@example.com',
          password: 'password',
        }),
      ).toEqual({
        password:
          'Пароль должен содержать минимум 1 букву, 1 цифру и не иметь пробелов',
      });
    });

    it('should return both errors for invalid values', () => {
      expect(
        validateForm({
          email: '',
          password: '',
        }),
      ).toEqual({
        email: 'Введите e-mail',
        password: 'Введите пароль',
      });
    });
  });
});
