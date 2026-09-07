import clsx from "clsx";
import styles from "./review-form.module.css";
import RatingInput from "./rating-input/rating-input";
import ReviewTextInput from "./review-text-input/review-text-input";
import { useReviewForm } from "../../../hooks/use-review-form";

type TReviewFormProps = {
  productId: string;
};

const ReviewForm = ({ productId }: TReviewFormProps) => {
  const {
    values,
    errors,
    isSubmitting,
    handleTextChange,
    handleRatingChange,
    handleSubmit,
  } = useReviewForm(productId);

  return (
    <section className="review-form">
      <div className="container">
        <div className="review-form__wrapper">
          <h2 className="review-form__title">оставить отзыв</h2>

          <div className="review-form__form">
            <form
              action="#"
              method="post"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <div className="review-form__inputs-wrapper">
                <ReviewTextInput
                  label="Достоинства"
                  placeholder="Достоинства"
                  value={values.positive}
                  error={errors.positive}
                  onChange={(value) => handleTextChange("positive", value)}
                />

                <ReviewTextInput
                  label="Недостатки"
                  placeholder="Недостатки"
                  value={values.negative}
                  error={errors.negative}
                  onChange={(value) => handleTextChange("negative", value)}
                />
              </div>

              <div className="review-form__submit-wrapper">
                <div
                  className={clsx("review-form__rating-wrapper", styles.field)}
                >
                  <RatingInput
                    value={values.rating}
                    onChange={handleRatingChange}
                  />

                  {errors.rating && (
                    <span className={styles.error}>{errors.rating}</span>
                  )}
                </div>

                <div className="review-form__button-wrapper">
                  <button
                    className={clsx("btn", "review-form__button", {
                      "is-disabled": isSubmitting,
                    })}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Отправить отзыв
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
