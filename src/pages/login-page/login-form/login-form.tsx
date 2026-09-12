import FormField from '../../../components/form-field/form-field';
import { useLoginForm } from '../../../hooks/use-login-form';

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
          <FormField
            name="email"
            label="Введите вашу почту"
            placeholder="Почта"
            type="email"
            value={values.email}
            error={errors.email}
            touched={Boolean(touched.email)}
            disabled={isSubmitting}
            className="login-page__field custom-input"
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
            className="login-page__field custom-input"
            autoComplete="current-password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
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
