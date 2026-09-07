import { Fragment } from "react";
import { MAX_RATING, MIN_RATING } from "../const";

type TRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

const RatingInput = ({ value, onChange }: TRatingInputProps) => (
  <div className="input-star-rating">
    {Array.from(
      { length: MAX_RATING },
      (_, index) => MAX_RATING - index,
    ).map((rating) => (
      <Fragment key={rating}>
        <input
          type="radio"
          id={`input-star-rating-${rating}`}
          value={rating}
          checked={value === rating}
          aria-label={`${rating} ${
            rating === MIN_RATING ? "звезда" : "звезды"
          }`}
          onChange={() => onChange(rating)}
        />

        <label htmlFor={`input-star-rating-${rating}`}>
          <svg width="40" height="40" aria-hidden="true">
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
      </Fragment>
    ))}
  </div>
);

export default RatingInput;
