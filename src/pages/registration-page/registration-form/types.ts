export type RegistrationFormValues = {
  name: string;
  email: string;
  password: string;
  avatar: File | null;
};

export type RegistrationField = keyof RegistrationFormValues;

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;
