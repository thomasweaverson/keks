import { useLoginForm } from '../../hooks/use-login-form';
import styles from './login-form.module.css';


const LoginForm = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLoginForm();

  const getFieldClassName = (
    field: keyof typeof values
  ): string => {
    const classes = [
      'custom-input',
      'login-page__field',
      styles.field,
    ];

    if (touched[field]) {
      classes.push(
        errors[field]
          ? 'is-invalid'
          : 'is-valid'
      );
    }

    return classes.join(' ');
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
          <div className={getFieldClassName('email')}>
            <label>
              <span className="custom-input__label">
                Введите вашу почту
              </span>

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
                  errors.email
                    ? 'login-email-error'
                    : undefined
                }
                required
              />
            </label>

            {errors.email && (
              <span
                id="login-email-error"
                className={styles.error}
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className={getFieldClassName('password')}>
            <label>
              <span className="custom-input__label">
                Введите ваш пароль
              </span>

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
                  errors.password
                    ? 'login-password-error'
                    : undefined
                }
                required
              />
            </label>

            {errors.password && (
              <span
                id="login-password-error"
                className={styles.error}
              >
                {errors.password}
              </span>
            )}
          </div>
        </div>

        <button
          className="btn login-page__btn btn--large"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
