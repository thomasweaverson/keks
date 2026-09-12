import { useAppSelector } from '../../../hooks';
import {
  getLastReview,
  getLastReviewLoadingStatus,
} from '../../../store/slices/reviews/reviews.selectors';
import ReviewCard from '../../../components/review-card/review-card';
import { LoadingStatus } from '../../../const/infrastructure';
import Loader from '../../../components/loader/loader';

const LastReview = () => {
  const lastReview = useAppSelector(getLastReview);
  const lastReviewLoadingStatus = useAppSelector(getLastReviewLoadingStatus);

  if (lastReviewLoadingStatus === LoadingStatus.Loading && !lastReview) {
    return <Loader />;
  }

  if (lastReviewLoadingStatus === LoadingStatus.Failed || !lastReview) {
    return null;
  }

  return (
    <section className="last-review">
      <div className="container">
        <h2 className="last-review__title">последний отзыв</h2>
        <ReviewCard review={lastReview} withBorder />
      </div>
    </section>
  );
};

export default LastReview;
