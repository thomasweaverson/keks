import {
  useCallback,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import type {
  RegistrationErrors,
  RegistrationFormValues,
} from "../components/registration-form/types";
import { useAppDispatch } from ".";
import {
  validateAvatar,
  validateEmail,
  validateForm,
  validateName,
  validatePassword,
} from "../components/registration-form/utils";
import { registerUserAction } from "../store/api-actions";
import { toast } from "react-toastify";

const REGISTRATION_SUCCESS_MESSAGE = "Регистрация выполнена успешно";

const AVATAR_ERROR_MESSAGE =
  "Регистрация выполнена успешно, но аватар не удалось загрузить";

const INITIAL_VALUES: RegistrationFormValues = {
  name: "",
  email: "",
  password: "",
  avatar: null,
};

export const useRegistrationForm = () => {
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<RegistrationFormValues>(INITIAL_VALUES);

  const [errors, setErrors] = useState<RegistrationErrors>({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof RegistrationFormValues, boolean>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    const fieldName = name as keyof RegistrationFormValues;

    const nextValue = fieldName === "avatar" ? (files?.[0] ?? null) : value;

    setValues((current) => ({
      ...current,
      [fieldName]: nextValue,
    }));

    setTouched((current) => ({
      ...current,
      [fieldName]: true,
    }));

    if (fieldName === "name") {
      const error = validateName(value);

      setErrors((current) => ({
        ...current,
        name: error,
      }));
    }

    if (fieldName === "email") {
      const error = validateEmail(value);

      setErrors((current) => ({
        ...current,
        email: error,
      }));
    }

    if (fieldName === "password") {
      const error = validatePassword(value);

      setErrors((current) => ({
        ...current,
        password: error,
      }));
    }

    if (fieldName === "avatar") {
      void validateAvatar(files?.[0] ?? null).then((error) => {
        setErrors((current) => ({
          ...current,
          avatar: error,
        }));
      });
    }
  }, []);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const fieldName = event.target.name as keyof RegistrationFormValues;

      setTouched((current) => ({
        ...current,
        [fieldName]: true,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationErrors = await validateForm(values);

      setErrors(validationErrors);

      setTouched({
        name: true,
        email: true,
        password: true,
        avatar: true,
      });

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await dispatch(
          registerUserAction({
            name: values.name,
            email: values.email,
            password: values.password,
            avatar: values.avatar,
          }),
        ).unwrap();

        setValues(INITIAL_VALUES);
        setErrors({});
        setTouched({});

        if (result.isAvatarLoadingError) {
          toast.warn(AVATAR_ERROR_MESSAGE);
        } else {
          toast.success(REGISTRATION_SUCCESS_MESSAGE);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, values],
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
