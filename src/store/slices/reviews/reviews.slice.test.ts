import { describe, expect, it } from 'vitest';
import { LoadingStatus } from '../../../const/infrastructure';
import {
  DEFAULT_REVIEWS_FILTER,
  DEFAULT_REVIEWS_SORT_ORDER,
  ReviewsFilter,
  SortOrder,
} from '../../../const/business';
import {
  fetchLastReviewAction,
  fetchReviewsAction,
  postReviewAction,
} from '../../api-actions';
import {
  makeFakeReview,
  makeFakeReviewPosting,
} from '../../../utils/testing/mocks';
import {
  resetFiltersAndSorting,
  resetReviews,
  reviewsSlice,
  setReviewsFilter,
  setReviewsSortOrder,
} from './reviews.slice';

type ReviewsState = ReturnType<typeof reviewsSlice.reducer>;

describe('Reviews slice', () => {
  it('returns initial state without previous state', () => {
    expect(reviewsSlice.reducer(undefined, { type: '@@INIT' })).toEqual({
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Idle,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    });
  });

  it('handles setReviewsFilter with a new filter', () => {
    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const newFilter = ReviewsFilter.High;

    expect(reviewsSlice.reducer(state, setReviewsFilter(newFilter))).toEqual({
      ...state,
      currentReviewsFilter: newFilter,
    });
  });

  it('does not change filter when setReviewsFilter receives current filter', () => {
    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    expect(
      reviewsSlice.reducer(state, setReviewsFilter(DEFAULT_REVIEWS_FILTER)),
    ).toEqual(state);
  });

  it('handles setReviewsSortOrder with a new sort order', () => {
    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: SortOrder.NEWEST,
    };

    const newSortOrder = SortOrder.OLDEST;

    expect(
      reviewsSlice.reducer(state, setReviewsSortOrder(newSortOrder)),
    ).toEqual({
      ...state,
      currentReviewsSortOrder: newSortOrder,
    });
  });

  it('does not change sort order when setReviewsSortOrder receives current sort order', () => {
    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    expect(
      reviewsSlice.reducer(
        state,
        setReviewsSortOrder(DEFAULT_REVIEWS_SORT_ORDER),
      ),
    ).toEqual(state);
  });

  it('handles resetFiltersAndSorting', () => {
    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Loaded,
      currentReviewsFilter: ReviewsFilter.High,
      currentReviewsSortOrder: SortOrder.OLDEST,
    };

    expect(reviewsSlice.reducer(state, resetFiltersAndSorting())).toEqual({
      ...state,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    });
  });

  it('handles resetReviews', () => {
    const state: ReviewsState = {
      reviews: [makeFakeReview()],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: makeFakeReview(),
      lastReviewLoadingStatus: LoadingStatus.Loaded,
      currentReviewsFilter: ReviewsFilter.High,
      currentReviewsSortOrder: SortOrder.OLDEST,
    };

    expect(reviewsSlice.reducer(state, resetReviews())).toEqual({
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Idle,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    });
  });

  it('handles fetchReviewsAction.pending', () => {
    const state: ReviewsState = {
      reviews: [makeFakeReview()],
      reviewsLoadingStatus: LoadingStatus.Idle,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const action = fetchReviewsAction.pending('request-id', 'product-id');

    expect(reviewsSlice.reducer(state, action)).toEqual({
      ...state,
      reviewsLoadingStatus: LoadingStatus.Loading,
    });
  });

  it('handles fetchReviewsAction.fulfilled', () => {
    const reviews = [makeFakeReview(), makeFakeReview()];

    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loading,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const action = fetchReviewsAction.fulfilled(
      reviews,
      'request-id',
      'product-id',
    );

    expect(reviewsSlice.reducer(state, action)).toEqual({
      ...state,
      reviews,
      reviewsLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('handles fetchReviewsAction.rejected', () => {
    const state: ReviewsState = {
      reviews: [makeFakeReview()],
      reviewsLoadingStatus: LoadingStatus.Loading,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const action = fetchReviewsAction.rejected(
      new Error('Request failed'),
      'request-id',
      'product-id',
    );

    expect(reviewsSlice.reducer(state, action)).toEqual({
      ...state,
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Failed,
    });
  });

  it('handles fetchLastReviewAction.pending', () => {
    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: makeFakeReview(),
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const action = fetchLastReviewAction.pending('request-id');

    expect(reviewsSlice.reducer(state, action)).toEqual({
      ...state,
      lastReviewLoadingStatus: LoadingStatus.Loading,
    });
  });

  it('handles fetchLastReviewAction.fulfilled', () => {
    const lastReview = makeFakeReview();

    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Loading,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const action = fetchLastReviewAction.fulfilled(
      lastReview,
      'request-id',
    );

    expect(reviewsSlice.reducer(state, action)).toEqual({
      ...state,
      lastReview,
      lastReviewLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('handles fetchLastReviewAction.rejected', () => {
    const state: ReviewsState = {
      reviews: [],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: makeFakeReview(),
      lastReviewLoadingStatus: LoadingStatus.Loading,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const action = fetchLastReviewAction.rejected(
      new Error('Request failed'),
      'request-id',
    );

    expect(reviewsSlice.reducer(state, action)).toEqual({
      ...state,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Failed,
    });
  });

  it('handles postReviewAction.fulfilled', () => {
    const existingReview = makeFakeReview();
    const newReview = makeFakeReview();

    const state: ReviewsState = {
      reviews: [existingReview],
      reviewsLoadingStatus: LoadingStatus.Loaded,
      lastReview: null,
      lastReviewLoadingStatus: LoadingStatus.Idle,
      currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
      currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
    };

    const posting = makeFakeReviewPosting();
    const action = postReviewAction.fulfilled(newReview, 'request-id', posting);

    expect(reviewsSlice.reducer(state, action)).toEqual({
      ...state,
      reviews: [newReview, existingReview],
    });
  });
});
