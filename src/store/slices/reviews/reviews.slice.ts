import { createSlice } from "@reduxjs/toolkit";
import type { TReviewsState } from "../../../types/state";
import { NameSpace } from "../../../const/infrastructure";
import { fetchLastReviewAction, fetchReviewsAction } from "../../api-actions";

const initialState: TReviewsState = {
  reviews: [],
  isReviewsLoading: false,
  isReviewsLoadingError: false,
  lastReview: null,
};

export const reviewsSlice = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {
    resetReviews: (state) => {
      state = initialState;
    }
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
      });
  },
});
