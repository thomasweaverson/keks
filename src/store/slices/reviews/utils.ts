import {
  ReviewsFilter,
  SortOrder,
} from "../../../const/business";
import type { TReviewsFilter, TReviewsSortOrder } from "../../../types/business";
import type { TReview } from "../../../types/product";


export const filterReviews = (
  reviews: TReview[],
  filter: TReviewsFilter,
): TReview[] => {
  if (filter === ReviewsFilter.Any) {
    return reviews;
  }

  if (filter === ReviewsFilter.High) {
    return reviews.filter((review) => review.rating >= 4);
  }

  return reviews.filter((review) => review.rating <= 3);
};

export const sortReviews = (
  reviews: TReview[],
  sortOrder: TReviewsSortOrder,
): TReview[] => {
  return [...reviews].sort((a, b) => {
    const dateA = new Date(a.isoDate).getTime();
    const dateB = new Date(b.isoDate).getTime();

    return sortOrder === SortOrder.NEWEST
      ? dateB - dateA
      : dateA - dateB;
  });
};
