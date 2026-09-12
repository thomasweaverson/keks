import {
  HIGH_LEVEL_RATING_THRESHOLD,
  ReviewsFilter,
  SortOrder,
} from '../../../const/business';
import type {
  TReviewsFilter,
  TReviewsSortOrder,
} from '../../../types/business';
import type { TReview } from '../../../types/product';

export const filterReviews = (
  reviews: TReview[],
  filter: TReviewsFilter,
): TReview[] => {
  switch (filter) {
    case ReviewsFilter.Any:
      return reviews;

    case ReviewsFilter.High:
      return reviews.filter(
        (review) => review.rating >= HIGH_LEVEL_RATING_THRESHOLD,
      );

    case ReviewsFilter.Low:
      return reviews.filter(
        (review) => review.rating < HIGH_LEVEL_RATING_THRESHOLD,
      );
    default:
      return reviews;
  }
};

export const sortReviews = (
  reviews: TReview[],
  sortOrder: TReviewsSortOrder,
): TReview[] =>
  [...reviews].sort((a, b) => {
    const dateA = new Date(a.isoDate).getTime();
    const dateB = new Date(b.isoDate).getTime();

    return sortOrder === SortOrder.NEWEST ? dateB - dateA : dateA - dateB;
  });
