import { useForm, useWatch } from "react-hook-form";
import { useAppDispatch } from "../../../hooks";
import { postReviewAction } from "../../../store/api-actions";
import type { TReviewPosting } from "../../../types/product";
import {
  MAX_RATING,
  MIN_RATING,
  NEGATIVE_RATING_MAX,
  POSITIVE_RATING_MIN,
  REVIEW_TEXT_MAX_LENGTH,
} from "./const";
import ReviewTextInput from "./review-text-input/review-text-input";
import RatingInput from "./rating-input/rating-input";
import clsx from "clsx";
import styles from './review-form.module.css';

type TReviewFormProps = {
  productId: string;
};

const ReviewForm = ({ productId }: TReviewFormProps) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TReviewPosting>({
    mode: "onChange",
    defaultValues: {
      positive: "",
      negative: "",
      rating: 0,
    },
  });

  const [rating, positive, negative] = useWatch({
    control,
    name: ["rating", "positive", "negative"],
  });

  const onSubmit = async (data: TReviewPosting) => {
    await dispatch(
      postReviewAction({
        id: productId,
        positive: data.positive,
        negative: data.negative,
        rating: Number(data.rating),
      }),
    ).unwrap();

    reset();
  };

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
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="review-form__inputs-wrapper">
                <ReviewTextInput
                  label="Достоинства"
                  placeholder="Достоинства"
                  value={positive}
                  error={errors.positive}
                  registration={register("positive", {
                    validate: (value) =>
                      rating >= POSITIVE_RATING_MIN && !value.trim()
                        ? "Укажите достоинства товара"
                        : true,
                    maxLength: {
                      value: REVIEW_TEXT_MAX_LENGTH,
                      message: "Максимум 500 символов",
                    },
                  })}
                />

                <ReviewTextInput
                  label="Недостатки"
                  placeholder="Недостатки"
                  value={negative}
                  error={errors.negative}
                  registration={register("negative", {
                    validate: (value) =>
                      rating >= MIN_RATING &&
                      rating <= NEGATIVE_RATING_MAX &&
                      !value.trim()
                        ? "Укажите недостатки товара"
                        : true,
                    maxLength: {
                      value: REVIEW_TEXT_MAX_LENGTH,
                      message: "Максимум 500 символов",
                    },
                  })}
                />
              </div>

              <div className="review-form__submit-wrapper">
                <div className={clsx("review-form__rating-wrapper", styles.field)}>
                  <RatingInput
                    registration={register("rating", {
                      required: "Выберите оценку",
                      valueAsNumber: true,
                      min: MIN_RATING,
                      max: MAX_RATING,
                    })}
                  />

                  {errors.rating && (
                    <span className={styles.error}>
                      {errors.rating.message}
                    </span>
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
