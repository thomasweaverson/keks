import { AuthorizationStatus } from '../../../const/infrastructure';
import { useAppSelector } from '../../../hooks';
import { getAuthorizationStatus } from '../../../store/slices/user/user.selectors';

import clsx from 'clsx';
import HeaderLogo from './header-logo/header-logo';
import HeaderUser from './header-user/header-user';
import HeaderAuthNav from './header-auth-nav/header-auth-nav';

const Header = () => {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  const headerClass = clsx('header', {
    'header--authorized': isAuthorized,
  });

  return (
    <header className={headerClass}>
      <div className="container">
        <div className="header__inner">
          <HeaderLogo />
          {isAuthorized ? <HeaderUser /> : <HeaderAuthNav />}
        </div>
      </div>
    </header>
  );
};

export default Header;
