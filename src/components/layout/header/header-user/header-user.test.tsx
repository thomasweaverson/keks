import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HeaderUser from './header-user';
import { AppRoute } from '../../../../const/infrastructure';
import { getFavoritesCount } from '../../../../store/slices/favorites/favorites.selectors';
import { getUserInfo } from '../../../../store/slices/user/user.selectors';

import type { TUserInfo } from '../../../../types/user';
import { withHistory } from '../../../../utils/testing/mock-components';
import { makeFakeUserInfo } from '../../../../utils/testing/mocks';

const {
  mockDispatch,
  mockUseAppSelector,
  mockLogoutAction,
} = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockUseAppSelector: vi.fn(),
  mockLogoutAction: vi.fn(),
}));

vi.mock('../../../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

vi.mock('../../../../store/api-actions', () => ({
  logoutAction: mockLogoutAction,
}));

const fakeUser = makeFakeUserInfo();

const renderHeaderUser = (
  user: TUserInfo | null = fakeUser,
  favoritesCount = 3,
) => {
  mockUseAppSelector.mockImplementation((selector) => {
    if (selector === getUserInfo) {
      return user;
    }

    if (selector === getFavoritesCount) {
      return favoritesCount;
    }

    return undefined;
  });

  return render(withHistory(<HeaderUser />));
};

describe('Component: HeaderUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user email and avatar', () => {
    renderHeaderUser();

    expect(screen.getByText(fakeUser.email)).toBeInTheDocument();

    expect(screen.getByTestId('avatar-image')).toHaveAttribute(
      'src',
      fakeUser.avatarUrl,
    );
  });

  it('renders default avatar when user data is unavailable', () => {
    renderHeaderUser(null);

    expect(screen.getByTestId('avatar-image')).toHaveAttribute(
      'src',
      '/img/content/user-avatar.jpg',
    );
  });

  it('shows favorites count when there are favorites', () => {
    renderHeaderUser(fakeUser, 3);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show favorites count when there are no favorites', () => {
    renderHeaderUser(fakeUser, 0);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders favorites link', () => {
    renderHeaderUser();

    expect(
      screen.getByRole('link', { name: /избранное/i }),
    ).toHaveAttribute('href', AppRoute.Favorites);
  });

  it('dispatches logout action when user clicks "Выйти"', async () => {
    const logoutAction = {
      type: 'user/logout',
    };

    mockLogoutAction.mockReturnValue(logoutAction);

    const user = userEvent.setup();

    renderHeaderUser();

    await user.click(
      screen.getByRole('button', { name: 'Выйти' }),
    );

    expect(mockLogoutAction).toHaveBeenCalledOnce();
    expect(mockDispatch).toHaveBeenCalledWith(logoutAction);
  });
});
