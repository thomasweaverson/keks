import { describe, expect, it, vi } from 'vitest';
import {
  MAX_AVATAR_HEIGHT,
  MAX_AVATAR_SIZE,
  MAX_AVATAR_WIDTH,
} from '../../../const/business';
import {
  validateAvatar,
  validateEmail,
  validateForm,
  validateName,
  validatePassword,
} from './utils';

const mockImage = (width: number, height: number) => {
  const image = {
    naturalWidth: width,
    naturalHeight: height,
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null,
    src: '',
  };

  vi.stubGlobal(
    'Image',
    vi.fn(() => image),
  );

  return {
    load: () => image.onload?.(),
    error: () => image.onerror?.(),
  };
};

const mockObjectUrl = () => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:avatar'),
    revokeObjectURL: vi.fn(),
  });
};

describe('Registration Form Utilities Test', () => {
  describe('validateName', () => {
    it('should return an error for an empty name', () => {
      expect(validateName('')).toBe('Введите имя');
    });

    it('should return an error for a name containing only spaces', () => {
      expect(validateName('   ')).toBe('Введите имя');
    });

    it('should return an error for a name without letters', () => {
      expect(validateName('12345')).toBe(
        'Имя должно содержать хотя бы одну букву',
      );
    });

    it('should return undefined for a valid name', () => {
      expect(validateName('Thomas')).toBeUndefined();
    });
  });

  describe('validateEmail', () => {
    it('should return an error for an empty email', () => {
      expect(validateEmail('')).toBe('Введите почту');
    });

    it('should return an error for an email containing only spaces', () => {
      expect(validateEmail('   ')).toBe('Введите почту');
    });

    it('should return an error for an invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(
        'Введите корректный адрес электронной почты',
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
        'Пароль должен содержать хотя бы одну букву и одну цифру и не должен содержать пробелы',
      );
    });

    it('should return an error for a password without a digit', () => {
      expect(validatePassword('password')).toBe(
        'Пароль должен содержать хотя бы одну букву и одну цифру и не должен содержать пробелы',
      );
    });

    it('should return an error for a password containing spaces', () => {
      expect(validatePassword('pass word1')).toBe(
        'Пароль должен содержать хотя бы одну букву и одну цифру и не должен содержать пробелы',
      );
    });

    it('should return undefined for a valid password', () => {
      expect(validatePassword('password1')).toBeUndefined();
    });
  });

  describe('validateAvatar', () => {
    it('should return undefined when avatar is not provided', async () => {
      await expect(validateAvatar(null)).resolves.toBeUndefined();
    });

    it('should return an error for an unsupported file type', async () => {
      const file = new File(['avatar'], 'avatar.gif', {
        type: 'image/gif',
      });

      await expect(validateAvatar(file)).resolves.toBe(
        'Аватар должен быть в формате JPG или PNG',
      );
    });

    it('should return an error when file size is too large', async () => {
      const file = new File([new Uint8Array(MAX_AVATAR_SIZE)], 'avatar.jpg', {
        type: 'image/jpeg',
      });

      await expect(validateAvatar(file)).resolves.toBe(
        'Размер изображения должен быть меньше 1 МБ',
      );
    });

    it('should return an error when image cannot be read', async () => {
      const file = new File(['avatar'], 'avatar.jpg', {
        type: 'image/jpeg',
      });

      mockObjectUrl();

      const { error } = mockImage(MAX_AVATAR_WIDTH, MAX_AVATAR_HEIGHT);

      const validationPromise = validateAvatar(file);

      error();

      await expect(validationPromise).resolves.toBe(
        'Не удалось прочитать изображение',
      );
    });
  });

  describe('validateForm', () => {
    it('should return name error for an invalid name', async () => {
      await expect(
        validateForm({
          name: '',
          email: 'user@example.com',
          password: 'password1',
          avatar: null,
        }),
      ).resolves.toEqual({
        name: 'Введите имя',
      });
    });

    it('should return email error for an invalid email', async () => {
      await expect(
        validateForm({
          name: 'Thomas',
          email: 'invalid-email',
          password: 'password1',
          avatar: null,
        }),
      ).resolves.toEqual({
        email: 'Введите корректный адрес электронной почты',
      });
    });

    it('should return password error for an invalid password', async () => {
      await expect(
        validateForm({
          name: 'Thomas',
          email: 'user@example.com',
          password: 'password',
          avatar: null,
        }),
      ).resolves.toEqual({
        password:
          'Пароль должен содержать хотя бы одну букву и одну цифру и не должен содержать пробелы',
      });
    });

    it('should return avatar error for an invalid avatar', async () => {
      const file = new File(['avatar'], 'avatar.gif', {
        type: 'image/gif',
      });

      await expect(
        validateForm({
          name: 'Thomas',
          email: 'user@example.com',
          password: 'password1',
          avatar: file,
        }),
      ).resolves.toEqual({
        avatar: 'Аватар должен быть в формате JPG или PNG',
      });
    });

    it('should return all errors for invalid values', async () => {
      const file = new File(['avatar'], 'avatar.gif', {
        type: 'image/gif',
      });

      await expect(
        validateForm({
          name: '',
          email: '',
          password: '',
          avatar: file,
        }),
      ).resolves.toEqual({
        name: 'Введите имя',
        email: 'Введите почту',
        password: 'Введите пароль',
        avatar: 'Аватар должен быть в формате JPG или PNG',
      });
    });
  });
});
