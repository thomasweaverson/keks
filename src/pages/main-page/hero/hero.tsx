import { Link, useLocation } from 'react-router-dom';
import { AppRoute } from '../../../const/infrastructure';
import { getLocationState } from '../../../utils/common';

const Hero = () => {
  const location = useLocation();
  return (
    <div className="hero">
      <div className="container">
        <div className="hero__img-wrapper">
          <img
            className="hero__img"
            src="img/svg/hero-keks.svg"
            width="727"
            height="569"
            alt="Картинка кота."
          />
        </div>
        <div className="hero__wrapper">
          <p className="hero__subtitle">Твоя пушистая кондитерская</p>
          <p className="hero__title">КЕКС</p>
          <div className="hero__button-wrapper">
            <Link
              className="btn"
              to={AppRoute.Catalog}
              state={{ from: getLocationState(location) }}
            >
              Скорее смотреть
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
