import { useRegistrationForm } from "../../hooks/use-registration-form";
import styles from "./registration-form.module.css";

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

  const getFieldClassName = (field: keyof typeof values): string => {
    if (!touched[field]) {
      return "custom-input register-page__field";
    }

    return [
      "custom-input",
      "register-page__field",
      errors[field] ? "is-invalid" : "is-valid",
    ].join(" ");
  };

  return (
    <div className="register-page__form">
      <form
        action="#"
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="register-page__fields">
          <div className={`${getFieldClassName("name")} ${styles.field}`}>
            <label>
              <span className="custom-input__label">Введите ваше имя</span>

              <input
                type="text"
                name="name"
                placeholder="Имя"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "registration-name-error" : undefined
                }
              />
            </label>

            {errors.name && (
              <span id="registration-name-error" className={styles.error}>
                {errors.name}
              </span>
            )}
          </div>

          <div className={`${getFieldClassName("email")} ${styles.field}`}>
            <label>
              <span className="custom-input__label">Введите вашу почту</span>

              <input
                type="email"
                name="email"
                placeholder="Почта"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "registration-email-error" : undefined
                }
              />
            </label>

            {errors.email && (
              <span
                id="registration-email-error"
                className={styles.error}
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className={`${getFieldClassName("password")} ${styles.field}`}>
            <label>
              <span className="custom-input__label">Введите ваш пароль</span>

              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "registration-password-error" : undefined
                }
              />
            </label>

            {errors.password && (
              <span
                id="registration-password-error"
                className={styles.error}
              >
                {errors.password}
              </span>
            )}
          </div>

          <div className={`${getFieldClassName("avatar")} ${styles.field}`}>
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

            {errors.avatar && (
              <span
                id="registration-avatar-error"
                className={styles.error}
              >
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
