import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Header from './header';
import { AuthorizationStatus } from '../../../const/infrastructure';
import { getAuthorizationStatus } from '../../../store/slices/user/user.selectors';

const { mockUseAppSelector } = vi.hoisted(() => ({
  mockUseAppSelector: vi.fn(),
}));

vi.mock('../../../hooks', () => ({
  useAppSelector: mockUseAppSelector,
}));

vi.mock('./header-logo/header-logo', () => ({
  default: () => <div data-testid="header-logo" />,
}));

vi.mock('./header-user/header-user', () => ({
  default: () => <div data-testid="header-user" />,
}));

vi.mock('./header-auth-nav/header-auth-nav', () => ({
  default: () => <div data-testid="header-auth-nav" />,
}));

describe('Component: Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders HeaderLogo and HeaderUser when user is authorized', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === getAuthorizationStatus) {
        return AuthorizationStatus.Auth;
      }
      return undefined;
    });

    render(<Header />);

    expect(screen.getByTestId('header-logo')).toBeInTheDocument();
    expect(screen.getByTestId('header-user')).toBeInTheDocument();
    expect(screen.queryByTestId('header-auth-nav')).not.toBeInTheDocument();
  });

  it('renders HeaderLogo and HeaderAuthNav when user is not authorized', () => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === getAuthorizationStatus) {
        return AuthorizationStatus.NoAuth;
      }
      return undefined;
    });

    render(<Header />);
    expect(screen.getByTestId('header-logo')).toBeInTheDocument();
    expect(screen.getByTestId('header-auth-nav')).toBeInTheDocument();
    expect(screen.queryByTestId('header-user')).not.toBeInTheDocument();
  });
});
