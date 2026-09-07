import { useEffect, useState } from "react";
import { useRegistrationForm } from "../../../hooks/use-registration-form";
import styles from "./registration-form.module.css";
import clsx from "clsx";
import FormField from "../../../components/form-field/form-field";

const RegistrationForm = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useRegistrationForm();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!values.avatar || errors.avatar) {
      setAvatarPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(values.avatar);

    setAvatarPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [values.avatar, errors.avatar]);

  return (
    <div className="register-page__form">
      <form autoComplete="off" onSubmit={handleSubmit} noValidate>
        <div className="register-page__fields">
          <FormField
            name="name"
            label="Введите ваше имя"
            placeholder="Имя"
            type="text"
            value={values.name}
            error={errors.name}
            touched={Boolean(touched.name)}
            disabled={isSubmitting}
            className="register-page__field custom-input"
            autoComplete="name"
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormField
            name="email"
            label="Введите вашу почту"
            placeholder="Почта"
            type="email"
            value={values.email}
            error={errors.email}
            touched={Boolean(touched.email)}
            disabled={isSubmitting}
            className="register-page__field custom-input"
            autoComplete="email"
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormField
            name="password"
            label="Введите ваш пароль"
            placeholder="Пароль"
            type="password"
            value={values.password}
            error={errors.password}
            touched={Boolean(touched.password)}
            disabled={isSubmitting}
            className="register-page__field custom-input"
            autoComplete="new-password"
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div
            className={clsx(
              "custom-input",
              "register-page__field",
              styles.field,
              {
                "is-invalid": touched.avatar && errors.avatar,
                "is-valid": touched.avatar && !errors.avatar,
              },
            )}
          >
            <label>
              <span className="custom-input__label">Выберите изображение</span>

              <input
                type="file"
                name="avatar"
                data-text="Аватар"
                accept="image/jpeg,image/png"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.avatar)}
                aria-describedby={
                  errors.avatar ? "registration-avatar-error" : undefined
                }
              />
            </label>

            {avatarPreview && (
              <img
                className={styles.avatarPreview}
                src={avatarPreview}
                alt="Предпросмотр выбранного аватара"
              />
            )}

            {errors.avatar && (
              <span id="registration-avatar-error" className={styles.error}>
                {errors.avatar}
              </span>
            )}
          </div>
        </div>

        <button
          className="btn register-page__btn btn--large"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
