import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useAppInitialization from './use-app-initialization';
import { ReviewsFilter, SortOrder } from '../const/business';
import {
  AuthorizationStatus,
  LoadingStatus,
  RegistrationStatus,
} from '../const/infrastructure';
import { withStore } from '../utils/testing/mock-components';

const {
  mockFetchProductsAction,
  mockFetchLastReviewAction,
  mockFetchFiltersAction,
  mockFetchFavoritesAction,
} = vi.hoisted(() => ({
  mockFetchProductsAction: vi.fn(() => ({ type: 'products/fetchProducts' })),
  mockFetchLastReviewAction: vi.fn(() => ({ type: 'reviews/fetchLastReview' })),
  mockFetchFiltersAction: vi.fn(() => ({ type: 'filters/fetchFilters' })),
  mockFetchFavoritesAction: vi.fn(() => ({ type: 'favorites/fetchFavorites' })),
}));

vi.mock('../store/api-actions', () => ({
  fetchProductsAction: mockFetchProductsAction,
  fetchLastReviewAction: mockFetchLastReviewAction,
  fetchFiltersAction: mockFetchFiltersAction,
  fetchFavoritesAction: mockFetchFavoritesAction,
}));

describe('Hook: useAppInitialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches initial actions when statuses are Idle and user is Auth', () => {
    const { mockStore } = withStore(<></>, {
      User: {
        authorizationStatus: AuthorizationStatus.Auth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
      Product: {
        product: null,
        productLoadingStatus: LoadingStatus.Idle,
        isProductNotFound: false,
      },
      Reviews: {
        reviews: [],
        reviewsLoadingStatus: LoadingStatus.Idle,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Idle,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
      },
      Filter: {
        filters: [],
        currentCategory: null,
        currentTypes: [],
        filtersLoadingStatus: LoadingStatus.Idle,
      },
    });

    renderHook(() => useAppInitialization(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(mockFetchProductsAction).toHaveBeenCalledOnce();
    expect(mockFetchLastReviewAction).toHaveBeenCalledOnce();
    expect(mockFetchFiltersAction).toHaveBeenCalledOnce();
    expect(mockFetchFavoritesAction).toHaveBeenCalledOnce();
  });

  it('does not dispatch fetchProductsAction when authorizationStatus is Unknown', () => {
    const { mockStore } = withStore(<></>, {
      User: {
        authorizationStatus: AuthorizationStatus.Unknown,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
      Product: {
        product: null,
        productLoadingStatus: LoadingStatus.Idle,
        isProductNotFound: false,
      },
    });

    renderHook(() => useAppInitialization(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(mockFetchProductsAction).not.toHaveBeenCalled();
    expect(mockFetchFavoritesAction).not.toHaveBeenCalled();
  });

  it('does not dispatch actions when loading statuses are not Idle', () => {
    const { mockStore } = withStore(<></>, {
      User: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
      Product: {
        product: null,
        productLoadingStatus: LoadingStatus.Loading,
        isProductNotFound: false,
      },
      Reviews: {
        reviews: [],
        reviewsLoadingStatus: LoadingStatus.Idle,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Loaded,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
      },
      Filter: {
        filters: [],
        currentCategory: null,
        currentTypes: [],
        filtersLoadingStatus: LoadingStatus.Loading,
      },
    });

    renderHook(() => useAppInitialization(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(mockFetchProductsAction).not.toHaveBeenCalled();
    expect(mockFetchLastReviewAction).not.toHaveBeenCalled();
    expect(mockFetchFiltersAction).not.toHaveBeenCalled();
    expect(mockFetchFavoritesAction).not.toHaveBeenCalled();
  });
});
