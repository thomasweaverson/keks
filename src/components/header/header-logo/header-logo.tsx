import { Link, useLocation } from "react-router-dom";
import { AppRoute } from "../../../const/infrastructure";
import { memo } from "react";

const HeaderLogo = memo(() => {
  const { pathname } = useLocation();
  const isMainPage = pathname === AppRoute.Root;

  const logoImage = (
    <img
      src="/img/svg/logo.svg"
      width="170"
      height="69"
      alt="Кондитерская кекс"
    />
  );

  if (isMainPage) {
    return <span className="header__logo">{logoImage}</span>;
  }

  return (
    <Link
      className="header__logo"
      to={AppRoute.Root}
      aria-label="Переход на главную"
    >
      {logoImage}
    </Link>
  );
});

HeaderLogo.displayName = "HeaderLogo";

export default HeaderLogo;
