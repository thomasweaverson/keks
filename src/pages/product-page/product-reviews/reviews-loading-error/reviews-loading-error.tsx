import clsx from "clsx";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { getIsReviewsLoading } from "../../../../store/slices/reviews/reviews.selectors";
import { fetchReviewsAction } from "../../../../store/api-actions";

const ReviewsLoadingError = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(getIsReviewsLoading);
  const handleReloadReviews = () => {
    if (id) {
      dispatch(fetchReviewsAction(id));
    }
  };

  return (
    <section className="error-comments">
      <div className="container">
        <div className="error-comments__wrapper">
          <h2 className="error-comments__title">
            Не удалось загрузить комментарии
          </h2>
          <button
            className={clsx("btn", "error-comments__button", {
              "is-disabled": isLoading,
            })}
            type="button"
            onClick={handleReloadReviews}
            disabled={isLoading}
          >
            Попробовать ещё
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsLoadingError;
