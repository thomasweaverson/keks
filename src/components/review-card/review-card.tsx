import clsx from 'clsx';
import type { TReview } from '../../types/product';
import StarRating from '../star-rating/star-rating';
import { formatReviewDate, getReviewDateTime } from './utils';

type TReviewCardProps = {
  review: TReview;
  withBorder?: boolean;
};

const ReviewCard = ({ review, withBorder }: TReviewCardProps) => {
  const { isoDate, negative, positive, rating, user } = review;

  return (
    <div className="review">
      <div
        className={clsx('review__inner-wrapper', {
          'review__inner-wrapper--border': withBorder,
        })}
      >
        <time className="review__date" dateTime={getReviewDateTime(isoDate)}>
          {formatReviewDate(isoDate)}
        </time>
        <span className="review__author">Уважаемый(-ая) {user.name}</span>
        <StarRating rating={rating} />
        <div className="review__text-wrapper">
          {positive && <p className="review__text">{positive}</p>}
          {negative && <p className="review__text">{negative}</p>}
        </div>
        <div className="review__image-wrapper">
          <picture>
            <img
              src={user.avatarUrl ?? 'img/content/review-1.jpg'}
              width="162"
              height="162"
              alt=""
            />
          </picture>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
