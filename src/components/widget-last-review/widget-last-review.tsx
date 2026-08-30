import { useAppSelector } from "../../hooks";
import { getLastReview } from "../../store/slices/reviews/reviews.selectors";
import ReviewCard from "../review-card/review-card";

const WidgetLastReview = () => {
  const lastReview = useAppSelector(getLastReview);

  if (!lastReview) {
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

export default WidgetLastReview;
