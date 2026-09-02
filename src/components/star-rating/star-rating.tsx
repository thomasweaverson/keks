import clsx from "clsx";
import { RATING_STARS_COUNT } from "../../const/business";

type TStarRatingProps = {
  rating: number;
  isBig?: boolean;
  reviewCount?: number;
};

const StarRating = ({
  rating,
  isBig = false,
  reviewCount,
}: TStarRatingProps) => (
  <div
    className={clsx("star-rating", {
      "star-rating--big": isBig,
    })}
  >
    {Array.from({ length: RATING_STARS_COUNT }, (_, index) => (
      <svg
        key={index}
        className={clsx("star-rating__star", {
          "star-rating__star--active": index < rating,
        })}
        width="30"
        height="30"
        aria-hidden="true"
      >
        <use href="#icon-star" />
      </svg>
    ))}

    {reviewCount && <span className="star-rating__count">{reviewCount}</span>}
  </div>
);

export default StarRating;
