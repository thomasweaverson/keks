import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REVIEWS_FILTER,
  DEFAULT_REVIEWS_SORT_ORDER,
  ReviewsFilter,
  SortOrder,
} from '../../../const/business';
import { LoadingStatus } from '../../../const/infrastructure';
import { makeFakeReview } from '../../../utils/testing/mocks';
import type { TReviewsState } from '../../../types/state';
import {
  getCurrentReviewsFilter,
  getCurrentReviewsSortOrder,
  getFilteredAndSortedReviews,
  getLastReview,
  getLastReviewLoadingStatus,
  getReviews,
  getReviewsLoadingStatus,
} from './reviews.selectors';

describe('Reviews selectors', () => {
  it('returns reviews', () => {
    const reviews = [makeFakeReview(), makeFakeReview()];

    const state: TReviewsState = {
      reviews,
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    expect(getReviews({ Reviews: state })).toBe(reviews);
  });

  it('returns reviews loading status', () => {
    const state: TReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loading,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    expect(getReviewsLoadingStatus({ Reviews: state })).toBe(
      LoadingStatus.Loading,
    );
  });

  it('returns last review', () => {
    const lastReview = makeFakeReview();

    const state: TReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview,
      lastReviewLoadingStatus: LoadingStatus.Loaded,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    expect(getLastReview({ Reviews: state })).toBe(lastReview);
  });

  it('returns last review loading status', () => {
    const state: TReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Loading,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    expect(getLastReviewLoadingStatus({ Reviews: state })).toBe(
      LoadingStatus.Loading,
    );
  });

  it('returns current reviews filter', () => {
    const state: TReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Idle,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: ReviewsFilter.High,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    expect(getCurrentReviewsFilter({ Reviews: state })).toBe(ReviewsFilter.High);
  });

  it('returns current reviews sort order', () => {
    const state: TReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Idle,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: 'oldest',
    };

    expect(getCurrentReviewsSortOrder({ Reviews: state })).toBe('oldest');
  });

  it('returns filtered and sorted reviews', () => {
    const highReview = makeFakeReview({
      id: 'high-review',
      rating: 5,
      isoDate: '2026-09-10T10:00:00.000Z',
    });

    const lowReview = makeFakeReview({
      id: 'low-review',
      rating: 2,
      isoDate: '2026-09-12T10:00:00.000Z',
    });

    const anotherHighReview = makeFakeReview({
      id: 'another-high-review',
      rating: 4,
      isoDate: '2026-09-11T10:00:00.000Z',
    });

    const state: TReviewsState = {
      reviews: [highReview, lowReview, anotherHighReview],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: ReviewsFilter.High,
      currentReviewsSortOrder: SortOrder.NEWEST,
    };

    expect(getFilteredAndSortedReviews({ Reviews: state })).toEqual([
      anotherHighReview,
      highReview,
    ]);
  });
});
