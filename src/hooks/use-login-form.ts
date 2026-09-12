import {
  useCallback,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { useAppDispatch } from '.';
import { authorizeUserAction } from '../store/api-actions';
import type {
  LoginFormErrors,
  LoginFormValues,
} from '../pages/login-page/login-form/types';
import {
  validateEmail,
  validateForm,
  validatePassword,
} from '../pages/login-page/login-form/utils';

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
};

export const useLoginForm = () => {
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginFormValues, boolean>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as keyof LoginFormValues;

    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === 'email') {
      const emailError = validateEmail(value);

      setErrors((current) => ({
        ...current,
        email: emailError,
      }));

      return;
    }

    const error = validatePassword(value);

    setErrors((current) => ({
      ...current,
      password: error,
    }));
  }, []);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const field = event.target.name as keyof LoginFormValues;
      setTouched((current) => ({
        ...current,
        [field]: true,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      const validationErrors = validateForm(values);

      setErrors(validationErrors);

      setTouched({
        email: true,
        password: true,
      });

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);

      try {
        await dispatch(
          authorizeUserAction({
            email: values.email.trim(),
            password: values.password,
          }),
        ).unwrap();
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, isSubmitting, values],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
