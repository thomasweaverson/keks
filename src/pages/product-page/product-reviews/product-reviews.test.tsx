import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ProductReviews from './product-reviews';
import { LoadingStatus } from '../../../const/infrastructure';
import { ReviewsFilter, SortOrder } from '../../../const/business';
import { makeFakeReview } from '../../../utils/testing/mocks';
import { withStore } from '../../../utils/testing/mock-components';

vi.mock('./filter-sort-bar/filter-sort-bar', () => ({
  default: () => <div>FilterSortBar</div>,
}));

vi.mock('./no-reviews/no-reviews', () => ({
  default: () => <div>NoReviews</div>,
}));

vi.mock('./not-found-reviews/not-found-reviews', () => ({
  default: () => <div>NotFoundReviews</div>,
}));

vi.mock('./reviews-list/reviews-list', () => ({
  default: () => <div>ReviewsList</div>,
}));

vi.mock('./reviews-loading-error/reviews-loading-error', () => ({
  default: () => <div>ReviewsLoadingError</div>,
}));

describe('Component: ProductReviews', () => {
  it('should render loading error when reviews loading failed', () => {
    const { withStoreComponent } = withStore(<ProductReviews />, {
      Reviews: {
        reviews: [makeFakeReview()],
        reviewsLoadingStatus: LoadingStatus.Failed,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(screen.getByText('ReviewsLoadingError')).toBeInTheDocument();
    expect(screen.queryByText('NoReviews')).not.toBeInTheDocument();
    expect(screen.queryByText('FilterSortBar')).not.toBeInTheDocument();
    expect(screen.queryByText('ReviewsList')).not.toBeInTheDocument();
    expect(screen.queryByText('NotFoundReviews')).not.toBeInTheDocument();
  });

  it('should render no reviews when reviews list is empty', () => {
    const { withStoreComponent } = withStore(<ProductReviews />, {
      Reviews: {
        reviews: [],
        reviewsLoadingStatus: LoadingStatus.Loaded,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(screen.getByText('NoReviews')).toBeInTheDocument();
    expect(screen.queryByText('ReviewsLoadingError')).not.toBeInTheDocument();
    expect(screen.queryByText('FilterSortBar')).not.toBeInTheDocument();
    expect(screen.queryByText('ReviewsList')).not.toBeInTheDocument();
    expect(screen.queryByText('NotFoundReviews')).not.toBeInTheDocument();
  });

  it('should render reviews components when reviews are available', () => {
    const reviews = [makeFakeReview()];

    const { withStoreComponent } = withStore(<ProductReviews />, {
      Reviews: {
        reviews,
        reviewsLoadingStatus: LoadingStatus.Loaded,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(screen.getByText('FilterSortBar')).toBeInTheDocument();
    expect(screen.getByText('ReviewsList')).toBeInTheDocument();
    expect(screen.queryByText('NoReviews')).not.toBeInTheDocument();
    expect(screen.queryByText('ReviewsLoadingError')).not.toBeInTheDocument();
    expect(screen.queryByText('NotFoundReviews')).not.toBeInTheDocument();
  });

  it('should render not found reviews when filtered reviews are empty', () => {
    const reviews = [
      makeFakeReview({
        rating: 5,
      }),
    ];

    const { withStoreComponent } = withStore(<ProductReviews />, {
      Reviews: {
        reviews,
        reviewsLoadingStatus: LoadingStatus.Loaded,
        currentReviewsFilter: ReviewsFilter.Low,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(screen.getByText('FilterSortBar')).toBeInTheDocument();
    expect(screen.getByText('ReviewsList')).toBeInTheDocument();
    expect(screen.getByText('NotFoundReviews')).toBeInTheDocument();
    expect(screen.queryByText('NoReviews')).not.toBeInTheDocument();
    expect(screen.queryByText('ReviewsLoadingError')).not.toBeInTheDocument();
  });
});
