import { AuthorizationStatus } from "../../../const/infrastructure";
import { useAppSelector } from "../../../hooks";
import {
  getFilteredAndSortedReviews,
  getIsReviewsLoadingError,
  getReviews,
} from "../../../store/slices/reviews/reviews.selectors";
import { getAuthorizationStatus } from "../../../store/slices/user/user.selectors";

const ProductPageTitle = () => {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const reviews = useAppSelector(getReviews);
  const preparedReviews = useAppSelector(getFilteredAndSortedReviews);
  const isReviewsLoadingError = useAppSelector(getIsReviewsLoadingError);

  if (isReviewsLoadingError) {
    return (
      <h1 className="visually-hidden">
        Карточка: ошибка загрузки комментариев
      </h1>
    );
  }

  if (reviews.length === 0) {
    return <h1 className="visually-hidden">Карточка: отзывов еще нет</h1>;
  }

  if (preparedReviews.length === 0) {
    return (
      <h1 className="visually-hidden">
        Карточка: по фильтрам ничего не найдено
      </h1>
    );
  }

  return (
    <h1 className="visually-hidden">
      Карточка: пользователь{" "}
      {authorizationStatus === AuthorizationStatus.Auth
        ? "авторизован"
        : "не авторизован"}
    </h1>
  );
};

export default ProductPageTitle;
