import React from "react";
import { Link } from "react-router-dom";
import { AppRoute } from "../../../const/infrastructure";

const HeaderAuthNav = React.memo(() => {
  return (
    <div className="header__buttons">
      <div className="header__btn">
        <Link
          className="btn btn--third header__link header__link--reg"
          to={AppRoute.Registration}
        >
          Регистрация
        </Link>
      </div>
      <div className="header__btn">
        <Link className="btn" to={AppRoute.Login}>
          Войти
        </Link>
      </div>
    </div>
  );
});

HeaderAuthNav.displayName = "HeaderAuthNav";

export default HeaderAuthNav;
