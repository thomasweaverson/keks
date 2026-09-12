import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TReviewsState } from '../../../types/state';
import { LoadingStatus, NameSpace } from '../../../const/infrastructure';
import {
  fetchLastReviewAction,
  fetchReviewsAction,
  postReviewAction,
} from '../../api-actions';
import {
  DEFAULT_REVIEWS_FILTER,
  DEFAULT_REVIEWS_SORT_ORDER,
} from '../../../const/business';
import type {
  TReviewsFilter,
  TReviewsSortOrder,
} from '../../../types/business';

const initialState: TReviewsState = {
  reviews: [],
  reviewsLoadingStatus: LoadingStatus.Idle,
  lastReview: null,
  lastReviewLoadingStatus: LoadingStatus.Idle,
  currentReviewsFilter: DEFAULT_REVIEWS_FILTER,
  currentReviewsSortOrder: DEFAULT_REVIEWS_SORT_ORDER,
};

export const reviewsSlice = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {
    setReviewsFilter: (state, action: PayloadAction<TReviewsFilter>) => {
      if (state.currentReviewsFilter === action.payload) {
        return;
      }
      state.currentReviewsFilter = action.payload;
    },
    setReviewsSortOrder: (state, action: PayloadAction<TReviewsSortOrder>) => {
      if (state.currentReviewsSortOrder === action.payload) {
        return;
      }
      state.currentReviewsSortOrder = action.payload;
    },
    resetFiltersAndSorting: (state) => {
      state.currentReviewsFilter = DEFAULT_REVIEWS_FILTER;
      state.currentReviewsSortOrder = DEFAULT_REVIEWS_SORT_ORDER;
    },
    resetReviews: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReviewsAction.pending, (state) => {
        state.reviewsLoadingStatus = LoadingStatus.Loading;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.reviewsLoadingStatus = LoadingStatus.Loaded;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.reviews = [];
        state.reviewsLoadingStatus = LoadingStatus.Failed;
      })
      .addCase(fetchLastReviewAction.pending, (state) => {
        state.lastReviewLoadingStatus = LoadingStatus.Loading;
      })
      .addCase(fetchLastReviewAction.fulfilled, (state, action) => {
        state.lastReview = action.payload;
        state.lastReviewLoadingStatus = LoadingStatus.Loaded;
      })
      .addCase(fetchLastReviewAction.rejected, (state) => {
        state.lastReview = null;
        state.lastReviewLoadingStatus = LoadingStatus.Failed;
      })
      .addCase(postReviewAction.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      });
  },
});

export const {
  setReviewsFilter,
  setReviewsSortOrder,
  resetFiltersAndSorting,
  resetReviews,
} = reviewsSlice.actions;
