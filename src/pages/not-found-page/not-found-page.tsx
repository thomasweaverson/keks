import { Link } from 'react-router-dom';
import { AppRoute } from '../../const/infrastructure';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => (
  <>
    <Helmet>
      <title>Кондитерская Кекс - 404</title>{' '}
    </Helmet>
    <h1 className="visually-hidden">404</h1>
    <section className="error-page">
      <div className="container">
        <h2 className="error-page__title">404</h2>
        <p className="error-page__message">Страница не найдена</p>
        <p className="error-page__text">
          Она была удалена
          <br />
          или
          <br />
          вы&nbsp;указали неправильный адрес.
        </p>
        <div className="error-page__button">
          <Link className="btn btn--large" to={AppRoute.Root}>
            Вернуться&nbsp;на&nbsp;главную
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default NotFoundPage;
