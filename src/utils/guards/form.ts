import type { LoginFormValues } from '../../pages/login-page/login-form/types';
import type { RegistrationFormValues } from '../../pages/registration-page/registration-form/types';
import type { TReviewFormValues } from '../../types/product';

export const isRegistrationField = (
  name: string,
): name is keyof RegistrationFormValues =>
  name === 'name' ||
  name === 'email' ||
  name === 'password' ||
  name === 'avatar';

export const isLoginField = (name: string): name is keyof LoginFormValues =>
  name === 'email' || name === 'password';

export const isReviewFormField = (
  field: string,
): field is keyof TReviewFormValues =>
  field === 'positive' ||
  field === 'negative' ||
  field === 'rating';
