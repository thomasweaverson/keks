import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './protected-route';
import type { TUserInfo } from '../../types/user';
import { describe, expect, it } from 'vitest';
import { withStore } from '../../utils/testing/mock-components';
import { makeFakeState, makeFakeUserInfo } from '../../utils/testing/mocks';

import {
  AppRoute,
  AuthorizationStatus,
  RegistrationStatus,
} from '../../const/infrastructure';

const fakeUser: TUserInfo = makeFakeUserInfo();

const PrivatePage = () => <div>Private page</div>;
const LoginPage = () => <div>Login page</div>;
const PublicPage = () => <div>Public page</div>;

describe('Component: ProtectedRoute', () => {
  it('should render children for authorized user', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute>
        <PrivatePage />
      </ProtectedRoute>,
      makeFakeState({
        User: {
          userInfo: fakeUser,
          authorizationStatus: AuthorizationStatus.Auth,
          isAvatarLoadingError: false,
          registrationStatus: RegistrationStatus.Success,
        },
      }),
    );

    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);

    expect(screen.getByText('Private page')).toBeInTheDocument();
  });

  it('should redirect unauthorized user to login page', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute>
        <PrivatePage />
      </ProtectedRoute>,
      makeFakeState({
        User: {
          userInfo: fakeUser,
          authorizationStatus: AuthorizationStatus.NoAuth,
          isAvatarLoadingError: false,
          registrationStatus: RegistrationStatus.Idle,
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={[AppRoute.Root]}>
        <Routes>
          <Route path={AppRoute.Root} element={withStoreComponent} />
          <Route path={AppRoute.Login} element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('should redirect authorized user from guest-only route', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute guestOnly>
        <PublicPage />
      </ProtectedRoute>,
      makeFakeState({
        User: {
          userInfo: fakeUser,
          authorizationStatus: AuthorizationStatus.Auth,
          isAvatarLoadingError: false,
          registrationStatus: RegistrationStatus.Success,
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={[AppRoute.Login]}>
        <Routes>
          <Route path={AppRoute.Login} element={withStoreComponent} />
          <Route path={AppRoute.Root} element={<PrivatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Private page')).toBeInTheDocument();
  });

  it('should render children for unauthorized user on no-auth route', () => {
    const { withStoreComponent } = withStore(
      <ProtectedRoute guestOnly>
        <PublicPage />
      </ProtectedRoute>,
      makeFakeState({
        User: {
          userInfo: fakeUser,
          authorizationStatus: AuthorizationStatus.NoAuth,
          isAvatarLoadingError: false,
          registrationStatus: RegistrationStatus.Idle,
        },
      }),
    );

    render(
      <MemoryRouter initialEntries={[AppRoute.Login]}>
        <Routes>
          <Route path={AppRoute.Login} element={withStoreComponent} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Public page')).toBeInTheDocument();
  });

  it('should redirect authorized user to previous page from location.state', () => {
    const previousLocation = {
      pathname: '/favorites',
      search: '',
      hash: '',
    };

    const { withStoreComponent } = withStore(
      <ProtectedRoute guestOnly>
        <PublicPage />
      </ProtectedRoute>,
      makeFakeState({
        User: {
          userInfo: fakeUser,
          authorizationStatus: AuthorizationStatus.Auth,
          isAvatarLoadingError: false,
          registrationStatus: RegistrationStatus.Success,
        },
      }),
    );

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: AppRoute.Login,
            state: { from: previousLocation },
          },
        ]}
      >
        <Routes>
          <Route path={AppRoute.Login} element={withStoreComponent} />
          <Route path="/favorites" element={<div>Favorites page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Favorites page')).toBeInTheDocument();
  });
});
