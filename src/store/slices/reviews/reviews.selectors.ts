import { createSelector } from "@reduxjs/toolkit";
import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";
import { filterReviews, sortReviews } from "./utils";

export const getReviews = (state: Pick<TState, typeof NameSpace.Reviews>) =>
  state[NameSpace.Reviews].reviews;

export const getIsReviewsLoading = (
  state: Pick<TState, typeof NameSpace.Reviews>,
) => state[NameSpace.Reviews].isReviewsLoading;

export const getIsReviewsLoadingError = (
  state: Pick<TState, typeof NameSpace.Reviews>,
) => state[NameSpace.Reviews].isReviewsLoadingError;

export const getLastReview = (state: Pick<TState, typeof NameSpace.Reviews>) =>
  state[NameSpace.Reviews].lastReview;

export const getCurrentReviewsFilter = (
  state: Pick<TState, typeof NameSpace.Reviews>,
) => state[NameSpace.Reviews].currentReviewsFilter;

export const getCurrentReviewsSortOrder = (
  state: Pick<TState, typeof NameSpace.Reviews>,
) => state[NameSpace.Reviews].currentReviewsSortOrder;

export const getFilteredAndSortedReviews = createSelector(
  [getReviews, getCurrentReviewsFilter, getCurrentReviewsSortOrder],
  (reviews, currentFilter, currentSortOrder) => {
    const filteredReviews = filterReviews(reviews, currentFilter);

    return sortReviews(filteredReviews, currentSortOrder);
  },
);
