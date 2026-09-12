import { Link } from 'react-router-dom';
import { AppRoute } from '../../const/infrastructure';
import RegistrationForm from './registration-form/registration-form';
import { Helmet } from 'react-helmet-async';

const RegistrationPage = () => (
  <section className="register-page">
    <Helmet>
      <title>Кондитерская Кекс - Регистрация</title>
    </Helmet>
    <div className="register-page__header">
      <div className="register-page__img-wrap">
        <img
          className="register-page__img"
          src="img/svg/hero-keks.svg"
          width="727"
          height="569"
          alt="Картинка кота."
        />
      </div>
    </div>
    <div className="register-page__content">
      <div className="register-page__inner">
        <h1 className="register-page__title">Регистрация</h1>

        <RegistrationForm />

        <p className="register-page__text-wrap">
          Уже зарегистрированы?{' '}
          <Link className="register-page__link" to={AppRoute.Login}>
            Войдите
          </Link>{' '}
          в свой аккаунт.
        </p>
      </div>
    </div>
  </section>
);

export default RegistrationPage;
