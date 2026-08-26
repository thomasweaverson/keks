import { type Location, Navigate, useLocation } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const/infrastructure';
import { type PropsWithChildren } from 'react';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import { useAppSelector } from '../../hooks';

type ProtectedRouteProps = {
  guestOnly?: boolean;
};

type LocationState = {
  from?: Location;
};

const ProtectedRoute = ({
  children,
  guestOnly = false,
}: PropsWithChildren<ProtectedRouteProps>) => {
  const location: Location<LocationState> = useLocation() as Location<LocationState>;
  const isAuthorized = useAppSelector(getAuthorizationStatus) === AuthorizationStatus.Auth;

  // Если страница только для гостей, а пользователь авторизован
  if (guestOnly && isAuthorized) {
    const from = location.state?.from || { pathname: AppRoute.Root };
    return <Navigate to={from} replace />;
  }

  // Если страница приватная, а пользователь не авторизован
  if (!guestOnly && !isAuthorized) {
    return <Navigate state={{ from: location }} to={AppRoute.Login} replace />;
  }

  return children;
};

export default ProtectedRoute;
