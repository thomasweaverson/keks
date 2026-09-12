import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { fetchReviewsAction } from '../../../../store/api-actions';
import { getReviewsLoadingStatus } from '../../../../store/slices/reviews/reviews.selectors';
import { LoadingStatus } from '../../../../const/infrastructure';

const ReviewsLoadingError = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const reviewsLoadingStatus = useAppSelector(getReviewsLoadingStatus);
  const isReviewsLoading = reviewsLoadingStatus === LoadingStatus.Loading;
  const handleReloadReviews = () => {
    if (id) {
      void dispatch(fetchReviewsAction(id));
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
            className={clsx('btn', 'error-comments__button', {
              'is-disabled': isReviewsLoading,
            })}
            type="button"
            onClick={handleReloadReviews}
            disabled={isReviewsLoading}
          >
            Попробовать ещё
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsLoadingError;
