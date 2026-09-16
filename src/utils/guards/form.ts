import type { RegistrationFormValues } from '../../pages/registration-page/registration-form/types';

export const isRegistrationField = (
  name: string,
): name is keyof RegistrationFormValues =>
  name === 'name' ||
  name === 'email' ||
  name === 'password' ||
  name === 'avatar';
