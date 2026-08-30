import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppRoute } from "../../const/infrastructure";

const BackLink = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hasPreviousRoute = Boolean(location.state?.from);

  if (!hasPreviousRoute) {
    return (
      <div className="back-link">
        <div className="container">
          <Link className="back-link__link" to={AppRoute.Root}>
            На главную{" "}
            <svg
              className="back-link__icon"
              width="30"
              height="16"
              aria-hidden="true"
            >
              <use href="#icon-arrow-left"></use>
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const handleClick = (evt: MouseEvent) => {
    evt.preventDefault();
    navigate(-1);
  };

  return (
    <div className="back-link">
      <div className="container">
        <a className="back-link__link" href="#" onClick={handleClick}>
          Назад
          <svg
            className="back-link__icon"
            width="30"
            height="16"
            aria-hidden="true"
          >
            <use href="#icon-arrow-left"></use>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default BackLink;
