import { memo, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../const/infrastructure';
import { isLocationState } from '../../utils/guards/router';

const BackIcon = () => (
  <svg className="back-link__icon" width="30" height="16" aria-hidden="true">
    <use href="#icon-arrow-left" />
  </svg>
);

const BackLink = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hasPreviousRoute = isLocationState(location.state);

  const handleBackClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    void navigate(-1);
  };

  return (
    <div className="back-link">
      <div className="container">
        {hasPreviousRoute ? (
          <a className="back-link__link" href="#" onClick={handleBackClick}>
            Назад
            <BackIcon />
          </a>
        ) : (
          <Link className="back-link__link" to={AppRoute.Root}>
            На главную
            <BackIcon />
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(BackLink);
