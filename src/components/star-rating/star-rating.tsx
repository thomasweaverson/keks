import clsx from 'clsx';
import { RATING_STARS_COUNT } from '../../const/business';

type TStarRatingProps = {
  rating: number;
  isBig?: boolean;
  reviewCount?: number;
};

const StarRating = ({
  rating,
  isBig = false,
  reviewCount,
}: TStarRatingProps) => {
  const normalizedRating = Math.min(
    RATING_STARS_COUNT,
    Math.max(0, Math.round(rating)),
  );

  return (
    <div
      className={clsx('star-rating', {
        'star-rating--big': isBig,
      })}
      aria-label={`Рейтинг ${normalizedRating} из ${RATING_STARS_COUNT}`}
    >
      {Array.from({ length: RATING_STARS_COUNT }, (_, index) => (
        <svg
          key={index}
          className={clsx('star-rating__star', {
            'star-rating__star--active': index < normalizedRating,
          })}
          width="30"
          height="30"
          aria-hidden="true"
        >
          <use href="#icon-star" />
        </svg>
      ))}

      {reviewCount !== undefined && (
        <span className="star-rating__count">{reviewCount}</span>
      )}
    </div>
  );
};

export default StarRating;
