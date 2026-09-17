import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ReviewsList from './reviews-list';
import {
  REVIEWS_PER_STEP,
  ReviewsFilter,
  SortOrder,
} from '../../../../const/business';
import { withStore } from '../../../../utils/testing/mock-components';
import { makeFakeReview } from '../../../../utils/testing/mocks';
import { LoadingStatus } from '../../../../const/infrastructure';

describe('Component: ReviewsList', () => {
  it('should render nothing when there are no reviews', () => {
    const { withStoreComponent } = withStore(<ReviewsList />, {
      Reviews: {
        reviews: [],
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Idle,
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });

    const { container } = render(withStoreComponent);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render reviews', () => {
    const reviews = [
      makeFakeReview({ positive: 'Первый отзыв', negative: '' }),
      makeFakeReview({ positive: 'Второй отзыв', negative: '' }),
    ];

    const { withStoreComponent } = withStore(<ReviewsList />, {
      Reviews: {
        reviews,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Idle,
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(screen.getByText('Первый отзыв')).toBeInTheDocument();
    expect(screen.getByText('Второй отзыв')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Список комментариев' }),
    ).toBeInTheDocument();
  });

  it('should show reviews initially and show more button', () => {
    const reviews = Array.from({ length: REVIEWS_PER_STEP + 1 }, () =>
      makeFakeReview({
        negative: '',
      }),
    );

    const { withStoreComponent } = withStore(<ReviewsList />, {
      Reviews: {
        reviews,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Idle,
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(screen.getAllByTestId('review-text')).toHaveLength(REVIEWS_PER_STEP);
    expect(
      screen.getByRole('button', { name: 'Показать еще' }),
    ).toBeInTheDocument();
  });

  it('should not render show more button when all reviews are visible', () => {
    const reviews = Array.from({ length: REVIEWS_PER_STEP }, (_, index) =>
      makeFakeReview({
        positive: `Отзыв ${index + 1}`,
        negative: '',
      }),
    );

    const { withStoreComponent } = withStore(<ReviewsList />, {
      Reviews: {
        reviews,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Idle,
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(
      screen.queryByRole('button', { name: 'Показать еще' }),
    ).not.toBeInTheDocument();
  });

  it('should render show more button when there are hidden reviews', () => {
    const reviews = Array.from({ length: REVIEWS_PER_STEP + 1 }, (_, index) =>
      makeFakeReview({
        positive: `Отзыв ${index + 1}`,
        negative: '',
      }),
    );

    const { withStoreComponent } = withStore(<ReviewsList />, {
      Reviews: {
        reviews,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Idle,
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(
      screen.getByRole('button', { name: 'Показать еще' }),
    ).toBeInTheDocument();
  });

  it('should show more reviews after clicking the button', async () => {
    const user = userEvent.setup();
    const reviews = Array.from({ length: REVIEWS_PER_STEP + 1 }, (_, index) =>
      makeFakeReview({
        positive: `Отзыв ${index + 1}`,
        negative: '',
      }),
    );

    const { withStoreComponent } = withStore(<ReviewsList />, {
      Reviews: {
        reviews,
        currentReviewsFilter: ReviewsFilter.Any,
        currentReviewsSortOrder: SortOrder.NEWEST,
        lastReview: null,
        lastReviewLoadingStatus: LoadingStatus.Idle,
        reviewsLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    await user.click(screen.getByRole('button', { name: 'Показать еще' }));

    expect(screen.getAllByTestId('review-text')).toHaveLength(
      REVIEWS_PER_STEP + 1,
    );

    expect(
      screen.getByText(`Отзыв ${REVIEWS_PER_STEP + 1}`),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Показать еще' }),
    ).not.toBeInTheDocument();
  });
});
