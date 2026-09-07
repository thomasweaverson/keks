import { useAppSelector } from "../../../hooks";
import {
  getFilteredAndSortedReviews,
  getIsReviewsLoadingError,
  getReviews,
} from "../../../store/slices/reviews/reviews.selectors";
import FilterSortBar from "./filter-sort-bar/filter-sort-bar";
import NoReviews from "./no-reviews/no-reviews";
import NotFoundReviews from "./not-found-reviews/not-found-reviews";
import ReviewsList from "./reviews-list/reviews-list";
import ReviewsLoadingError from "./reviews-loading-error/reviews-loading-error";

const ProductReviews = () => {
  const reviews = useAppSelector(getReviews);
  const preparedReviews = useAppSelector(getFilteredAndSortedReviews);
  const isReviewsLoadingError = useAppSelector(getIsReviewsLoadingError);

  if (isReviewsLoadingError) {
    return <ReviewsLoadingError />;
  }

  if (reviews.length === 0) {
    return <NoReviews />;
  }

  return (
    <>
      <FilterSortBar />
      <ReviewsList />

      {preparedReviews.length === 0 && <NotFoundReviews />}
    </>
  );
};

export default ProductReviews;
