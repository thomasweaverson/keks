import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import ProductPageTitle from './product-page-title';
import { AuthorizationStatus, LoadingStatus } from '../../../const/infrastructure';
import {
  getFilteredAndSortedReviews,
  getReviews,
  getReviewsLoadingStatus,
} from '../../../store/slices/reviews/reviews.selectors';
import { getAuthorizationStatus } from '../../../store/slices/user/user.selectors';
import { withStore } from '../../../utils/testing/mock-components';

vi.mock('../../../store/slices/reviews/reviews.selectors', () => ({
  getFilteredAndSortedReviews: vi.fn(),
  getReviews: vi.fn(),
  getReviewsLoadingStatus: vi.fn(),
}));

vi.mock('../../../store/slices/user/user.selectors', () => ({
  getAuthorizationStatus: vi.fn(),
}));

const mockGetFilteredAndSortedReviews = vi.mocked(
  getFilteredAndSortedReviews,
);
const mockGetReviews = vi.mocked(getReviews);
const mockGetReviewsLoadingStatus = vi.mocked(getReviewsLoadingStatus);
const mockGetAuthorizationStatus = vi.mocked(getAuthorizationStatus);

describe('Component: ProductPageTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAuthorizationStatus.mockReturnValue(
      AuthorizationStatus.Auth,
    );
    mockGetReviews.mockReturnValue([]);
    mockGetFilteredAndSortedReviews.mockReturnValue([]);
    mockGetReviewsLoadingStatus.mockReturnValue(LoadingStatus.Loaded);
  });

  it('should render error title when reviews loading failed', () => {
    mockGetReviewsLoadingStatus.mockReturnValue(LoadingStatus.Failed);

    const { withStoreComponent } = withStore(<ProductPageTitle />);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Карточка: ошибка загрузки комментариев',
      }),
    ).toBeInTheDocument();
  });

  it('should render empty reviews title when there are no reviews', () => {
    mockGetReviews.mockReturnValue([]);

    const { withStoreComponent } = withStore(<ProductPageTitle />);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Карточка: отзывов еще нет',
      }),
    ).toBeInTheDocument();
  });

  it('should render no filtered reviews title when filters match no reviews', () => {
    mockGetReviews.mockReturnValue([{
      id: 'review-1',
      isoDate: '2026-01-01T00:00:00.000Z',
      user: {
        name: 'User',
        avatarUrl: 'avatar.jpg',
      },
      positive: 'Positive',
      negative: 'Negative',
      rating: 5,
    }]);
    mockGetFilteredAndSortedReviews.mockReturnValue([]);

    const { withStoreComponent } = withStore(<ProductPageTitle />);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Карточка: по фильтрам ничего не найдено',
      }),
    ).toBeInTheDocument();
  });

  it('should render authorized user title when reviews are available', () => {
    mockGetReviews.mockReturnValue([{
      id: 'review-1',
      isoDate: '2026-01-01T00:00:00.000Z',
      user: {
        name: 'User',
        avatarUrl: 'avatar.jpg',
      },
      positive: 'Positive',
      negative: 'Negative',
      rating: 5,
    }]);
    mockGetFilteredAndSortedReviews.mockReturnValue([{
      id: 'review-1',
      isoDate: '2026-01-01T00:00:00.000Z',
      user: {
        name: 'User',
        avatarUrl: 'avatar.jpg',
      },
      positive: 'Positive',
      negative: 'Negative',
      rating: 5,
    }]);
    mockGetAuthorizationStatus.mockReturnValue(
      AuthorizationStatus.Auth,
    );

    const { withStoreComponent } = withStore(<ProductPageTitle />);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Карточка: пользователь авторизован',
      }),
    ).toBeInTheDocument();
  });

  it('should render unauthorized user title when reviews are available', () => {
    mockGetReviews.mockReturnValue([{
      id: 'review-1',
      isoDate: '2026-01-01T00:00:00.000Z',
      user: {
        name: 'User',
        avatarUrl: 'avatar.jpg',
      },
      positive: 'Positive',
      negative: 'Negative',
      rating: 5,
    }]);
    mockGetFilteredAndSortedReviews.mockReturnValue([{
      id: 'review-1',
      isoDate: '2026-01-01T00:00:00.000Z',
      user: {
        name: 'User',
        avatarUrl: 'avatar.jpg',
      },
      positive: 'Positive',
      negative: 'Negative',
      rating: 5,
    }]);
    mockGetAuthorizationStatus.mockReturnValue(
      AuthorizationStatus.NoAuth,
    );

    const { withStoreComponent } = withStore(<ProductPageTitle />);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Карточка: пользователь не авторизован',
      }),
    ).toBeInTheDocument();
  });
});
