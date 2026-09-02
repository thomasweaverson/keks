import { useEffect, useState } from "react";
import { REVIEWS_PER_STEP } from "../../../const/business";
import { useAppSelector } from "../../../hooks";
import {
  getCurrentReviewsFilter,
  getCurrentReviewsSortOrder,
} from "../../../store/slices/reviews/reviews.selectors";
import ReviewCard from "../../../components/review-card/review-card";
import ShowMoreCommentsButton from "./show-more-comments-button/show-more-comments-button";
import type { TReview } from "../../../types/product";

type TReviewsListProps = {
  reviews: TReview[];
};

const ReviewsList = ({ reviews }: TReviewsListProps) => {
  const currentFilter = useAppSelector(getCurrentReviewsFilter);
  const currentSortOrder = useAppSelector(getCurrentReviewsSortOrder);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_STEP);

  useEffect(() => {
    setVisibleCount(REVIEWS_PER_STEP);
  }, [currentFilter, currentSortOrder]);

  const visibleReviews = reviews.slice(0, visibleCount);

  const shouldRenderShowMoreButton = visibleCount < reviews.length;

  const handleShowMore = () => {
    setVisibleCount((count) => count + REVIEWS_PER_STEP);
  };

  return (
    <section className="comments">
      <h2 className="visually-hidden">Список комментариев</h2>
      <div className="container">
        <div className="comments__wrapper">
          {visibleReviews.map((review) => (
            <ReviewCard review={review} />
          ))}
        </div>
        {shouldRenderShowMoreButton && (
          <ShowMoreCommentsButton onClick={handleShowMore} />
        )}
      </div>
    </section>
  );
};

export default ReviewsList;
