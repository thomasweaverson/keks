import { useState } from 'react';
import { REVIEWS_PER_STEP } from '../../../../const/business';
import { useAppSelector } from '../../../../hooks';
import { getFilteredAndSortedReviews } from '../../../../store/slices/reviews/reviews.selectors';
import ShowMoreCommentsButton from './show-more-comments-button/show-more-comments-button';
import ReviewCard from '../../../../components/review-card/review-card';

const ReviewsList = () => {
  const reviews = useAppSelector(getFilteredAndSortedReviews);
  const [visibleReviewsCount, setVisibleReviewsCount] =
    useState(REVIEWS_PER_STEP);

  const visibleReviews = reviews.slice(0, visibleReviewsCount);

  const shouldRenderShowMoreButton = visibleReviewsCount < reviews.length;

  const handleShowMore = () => {
    setVisibleReviewsCount((count) => count + REVIEWS_PER_STEP);
  };

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="comments">
      <h2 className="visually-hidden">Список комментариев</h2>
      <div className="container">
        <div className="comments__wrapper">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
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
