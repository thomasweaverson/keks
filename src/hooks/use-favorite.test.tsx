import { act, renderHook } from '@testing-library/react';
import type { NavigateFunction } from 'react-router-dom';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useFavorite from './use-favorite';
import { AppRoute, AuthorizationStatus, RegistrationStatus } from '../const/infrastructure';
import { withHistory, withStore } from '../utils/testing/mock-components';

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<{ useNavigate: () => NavigateFunction }>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const { mockRemoveFromFavoritesAction, mockSetIsFavoriteAction } = vi.hoisted(() => ({
  mockRemoveFromFavoritesAction: vi.fn(() => ({
    type: 'favorites/remove',
    unwrap: vi.fn().mockResolvedValue(undefined),
  })),
  mockSetIsFavoriteAction: vi.fn(() => ({
    type: 'favorites/set',
    unwrap: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('../store/api-actions', () => ({
  removeFromFavoritesAction: mockRemoveFromFavoritesAction,
  setIsFavoriteAction: mockSetIsFavoriteAction,
}));

describe('Hook: useFavorite', () => {
  const productId = 'test-product-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to Login route when user is not authorized', async () => {
    const { mockStore } = withStore(<></>, {
      User: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
    });

    const { result } = renderHook(() => useFavorite(productId, false), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          {withHistory(children, ['/catalog'])}
        </Provider>
      ),
    });

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login, {
      state: {
        from: {
          pathname: '/catalog',
          search: '',
          hash: '',
        },
      },
    });
    expect(mockSetIsFavoriteAction).not.toHaveBeenCalled();
    expect(mockRemoveFromFavoritesAction).not.toHaveBeenCalled();
  });

  it('dispatches setIsFavoriteAction when user is Auth and product is not favorite', async () => {
    const { mockStore } = withStore(<></>, {
      User: {
        authorizationStatus: AuthorizationStatus.Auth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
    });

    const { result } = renderHook(() => useFavorite(productId, false), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          {withHistory(children)}
        </Provider>
      ),
    });

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(mockSetIsFavoriteAction).toHaveBeenCalledWith(productId);
    expect(mockRemoveFromFavoritesAction).not.toHaveBeenCalled();
  });

  it('dispatches removeFromFavoritesAction when user is Auth and product is favorite', async () => {
    const { mockStore } = withStore(<></>, {
      User: {
        authorizationStatus: AuthorizationStatus.Auth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
    });

    const { result } = renderHook(() => useFavorite(productId, true), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          {withHistory(children)}
        </Provider>
      ),
    });

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(mockRemoveFromFavoritesAction).toHaveBeenCalledWith(productId);
    expect(mockSetIsFavoriteAction).not.toHaveBeenCalled();
  });

  it('sets isPending state during action execution and clears it afterwards', async () => {
    let resolveAction: () => void = () => undefined;
    const pendingPromise = new Promise<void>((resolve) => {
      resolveAction = resolve;
    });

    mockSetIsFavoriteAction.mockReturnValue({
      type: 'favorites/set',
      unwrap: vi.fn(() => pendingPromise),
    });

    const { mockStore } = withStore(<></>, {
      User: {
        authorizationStatus: AuthorizationStatus.Auth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
    });

    const { result } = renderHook(() => useFavorite(productId, false), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>
          {withHistory(children)}
        </Provider>
      ),
    });

    expect(result.current.isPending).toBe(false);

    let togglePromise: Promise<void> | undefined;
    act(() => {
      togglePromise = result.current.toggleFavorite();
    });

    expect(result.current.isPending).toBe(true);

    await act(async () => {
      resolveAction();
      await togglePromise;
    });

    expect(result.current.isPending).toBe(false);
  });
});
