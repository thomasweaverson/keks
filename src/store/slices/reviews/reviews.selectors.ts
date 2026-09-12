import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const/infrastructure';
import type { TState } from '../../../types/state';
import { filterReviews, sortReviews } from './utils';

export const getReviews = (state: Pick<TState, typeof NameSpace.Reviews>) =>
  state[NameSpace.Reviews].reviews;

export const getReviewsLoadingStatus = (
  state: Pick<TState, typeof NameSpace.Reviews>,
) => state[NameSpace.Reviews].reviewsLoadingStatus;

export const getLastReview = (state: Pick<TState, typeof NameSpace.Reviews>) =>
  state[NameSpace.Reviews].lastReview;

export const getLastReviewLoadingStatus = (
  state: Pick<TState, typeof NameSpace.Reviews>,
) => state[NameSpace.Reviews].lastReviewLoadingStatus;

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
