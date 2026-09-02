import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TReviewsState } from "../../../types/state";
import { NameSpace } from "../../../const/infrastructure";
import {
  fetchLastReviewAction,
  fetchReviewsAction,
  postReviewAction,
} from "../../api-actions";
import {
  DEFAULT_REVIEWS_FILTER,
  DEFAULT_REVIEWS_SORT_ORDER,
} from "../../../const/business";
import type {
  TReviewsFilter,
  TReviewsSortOrder,
} from "../../../types/business";

const initialState: TReviewsState = {
  reviews: [],
  isReviewsLoading: false,
  isReviewsLoadingError: false,
  lastReview: null,
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
        state.isReviewsLoadingError = false;
        state.isReviewsLoading = true;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.isReviewsLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.isReviewsLoading = false;
        state.isReviewsLoadingError = true;
        state.reviews = [];
      })
      .addCase(fetchLastReviewAction.fulfilled, (state, action) => {
        state.lastReview = action.payload;
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
