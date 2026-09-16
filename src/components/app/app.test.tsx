import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from './app';
import {
  AuthorizationStatus,
  RegistrationStatus,
} from '../../const/infrastructure';
import { withStore } from '../../utils/testing/mock-components';

const { mockRouterProvider } = vi.hoisted(() => ({
  mockRouterProvider: vi.fn(() => (
    <div data-testid="router-provider" />
  )),
}));

vi.mock('../../hooks/use-app-initialization', () => ({
  default: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  RouterProvider: mockRouterProvider,
}));

vi.mock('./router', () => ({
  router: {},
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loader when authorization status is unknown', () => {
    const { withStoreComponent } = withStore(<App />);

    render(withStoreComponent);

    expect(document.querySelector('.loader')).toBeInTheDocument();
    expect(screen.queryByTestId('router-provider')).not.toBeInTheDocument();
  });

  it('shows router when user is authorized', () => {
    const { withStoreComponent } = withStore(<App />, {
      User: {
        authorizationStatus: AuthorizationStatus.Auth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
    });

    render(withStoreComponent);

    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
    expect(document.querySelector('.loader')).not.toBeInTheDocument();
  });

  it('shows router when user is not authorized', () => {
    const { withStoreComponent } = withStore(<App />, {
      User: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
    });

    render(withStoreComponent);

    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
    expect(document.querySelector('.loader')).not.toBeInTheDocument();
  });
});

