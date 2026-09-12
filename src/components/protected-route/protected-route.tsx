import { Navigate, useLocation } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const/infrastructure';
import { type PropsWithChildren } from 'react';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import { useAppSelector } from '../../hooks';
import type { TLocationState } from '../../types/infrastructure';
import { getLocationState } from '../../utils/common';

type TProtectedRouteProps = {
  guestOnly?: boolean;
};

const ProtectedRoute = ({
  children,
  guestOnly = false,
}: PropsWithChildren<TProtectedRouteProps>) => {
  const location = useLocation();
  const state = location.state as TLocationState | null;

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  // Если страница только для гостей, а пользователь авторизован
  if (guestOnly && isAuthorized) {
    const from = state?.from ?? { pathname: AppRoute.Root };
    return <Navigate to={from} replace />;
  }

  // Если страница приватная, а пользователь не авторизован
  if (!guestOnly && !isAuthorized) {
    return (
      <Navigate
        state={{ from: getLocationState(location) }}
        to={AppRoute.Login}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
