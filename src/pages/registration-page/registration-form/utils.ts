import {
  MAX_AVATAR_HEIGHT,
  MAX_AVATAR_SIZE,
  MAX_AVATAR_WIDTH,
} from '../../../const/business';
import {
  EMAIL_REGEXP,
  NAME_REGEXP,
  PASSWORD_REGEXP,
} from '../../../const/regexp';
import type { RegistrationErrors, RegistrationFormValues } from './types';

const AVATAR_TYPES = ['image/jpeg', 'image/png'];

export const validateName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Введите имя';
  }

  if (!NAME_REGEXP.test(name)) {
    return 'Имя должно содержать хотя бы одну букву';
  }

  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Введите почту';
  }

  if (!EMAIL_REGEXP.test(email)) {
    return 'Введите корректный адрес электронной почты';
  }

  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Введите пароль';
  }

  if (!PASSWORD_REGEXP.test(password)) {
    return 'Пароль должен содержать хотя бы одну букву и одну цифру и не должен содержать пробелы';
  }

  return undefined;
};

const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Не удалось прочитать изображение'));
    };

    image.src = objectUrl;
  });

export const validateAvatar = async (
  file: File | null,
): Promise<string | undefined> => {
  if (!file) {
    return undefined;
  }

  if (!AVATAR_TYPES.includes(file.type)) {
    return 'Аватар должен быть в формате JPG или PNG';
  }

  if (file.size >= MAX_AVATAR_SIZE) {
    return 'Размер изображения должен быть меньше 1 МБ';
  }

  try {
    const { width, height } = await getImageDimensions(file);

    if (width > MAX_AVATAR_WIDTH || height > MAX_AVATAR_HEIGHT) {
      return 'Размер изображения не должен превышать 100x100 пикселей';
    }
  } catch {
    return 'Не удалось прочитать изображение';
  }

  return undefined;
};

export const validateForm = async (
  values: RegistrationFormValues,
): Promise<RegistrationErrors> => {
  const errors: RegistrationErrors = {};

  const nameError = validateName(values.name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const avatarError = await validateAvatar(values.avatar);
  if (avatarError) {
    errors.avatar = avatarError;
  }

  return errors;
};
