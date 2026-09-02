import { Fragment } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { MAX_RATING, MIN_RATING } from "../const";

type TRatingInputProps = {
  registration: UseFormRegisterReturn;
};

const RatingInput = ({ registration }: TRatingInputProps) => (
  <div className="input-star-rating">
    {Array.from({ length: MAX_RATING }, (_, index) => MAX_RATING - index).map(
      (value) => (
        <Fragment key={value}>
          <input
            type="radio"
            id={`input-star-rating-${value}`}
            value={value}
            aria-label={`${value} ${value === MIN_RATING ? "звезда" : "звезды"}`}
            {...registration}
          />

          <label htmlFor={`input-star-rating-${value}`}>
            <svg width="40" height="40" aria-hidden="true">
              <use xlinkHref="#icon-star" />
            </svg>
          </label>
        </Fragment>
      ),
    )}
  </div>
);

export default RatingInput;
