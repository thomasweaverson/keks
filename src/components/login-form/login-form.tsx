import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAppDispatch } from "../../hooks";
import { authorizeUserAction } from "../../store/api-actions";
import { EMAIL_REGEXP, PASSWORD_REGEXP } from "../../const/regexp";
import { toast } from "react-toastify";

export const LoginForm = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Введите e-mail";
      isValid = false;
    } else if (!EMAIL_REGEXP.test(formData.email)) {
      newErrors.email =
        "Введите корректный e-mail (например, user@example.com)";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль";
      isValid = false;
    } else if (!PASSWORD_REGEXP.test(formData.password)) {
      newErrors.password =
        "Пароль должен содержать минимум 1 букву, 1 цифру и не иметь пробелов";
      isValid = false;
    }
    console.log(newErrors);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const isValid = validateForm();

    if (isSubmitting) {
      return;
    }

    if (!isValid) {
      if (errors.email) {
        toast.warn(errors.email);
      }
      if (errors.password) {
        toast.warn(errors.password);
      }
      return;
    }

    try {
      setIsSubmitting(true);

      await dispatch(
        authorizeUserAction({
          email: formData.email.trim(),
          password: formData.password,
        }),
      ).unwrap();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page__form">
      <form
        action="#"
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="login-page__fields">
          <div className="custom-input login-page__field">
            <label>
              <span className="custom-input__label">Введите вашу почту</span>
              <input
                type="email"
                name="email"
                placeholder="Почта"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            </label>
          </div>

          <div className="custom-input login-page__field">
            <label>
              <span className="custom-input__label">Введите ваш пароль</span>
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            </label>
          </div>
        </div>

        <button
          className="btn login-page__btn btn--large"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
