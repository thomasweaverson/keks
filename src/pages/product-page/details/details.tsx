import clsx from "clsx";
import type { TProductExtended } from "../../../types/product";
import { formatValue } from "../../../utils/common";
import StarRating from "../../../components/star-rating/star-rating";
import { useAppSelector } from "../../../hooks";
import { getAuthorizationStatus } from "../../../store/slices/user/user.selectors";
import { AppRoute, AuthorizationStatus } from "../../../const/infrastructure";
import { useLocation, useNavigate } from "react-router-dom";
import useExpandableDescription from "../../../hooks/useExpandableDescription";
import useFavorite from "../../../hooks/useFavorite";

type TDetailsProps = {
  product: TProductExtended;
  onShowReviewFormClick: (formState: boolean) => void;
  isReviewFormOpen: boolean;
};

const Details = ({
  product,
  onShowReviewFormClick,
  isReviewFormOpen,
}: TDetailsProps) => {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthorized = authorizationStatus !== AuthorizationStatus.Auth;
  const navigate = useNavigate();
  const location = useLocation();

  const {
    id,
    description,
    images,
    isFavorite,
    isNew,
    price,
    weight,
    rating,
    reviewCount,
    title,
    previewImage,
    previewImageWebp,
  } = product;

  const { isPending: isFavoritePending, toggleFavorite } = useFavorite(
    id,
    isFavorite,
    location,
  );

  const { visibleDescription, isLongDescription, expand, isExpanded } =
    useExpandableDescription(description);

  const handleShowFormClick = () => {
    if (isAuthorized) {
      navigate(AppRoute.Login);
      return;
    }

    onShowReviewFormClick(!isReviewFormOpen);
  };

  return (
    <section
      className={clsx("item-details", {
        "item-details--form-open": isReviewFormOpen,
      })}
    >
      <div className="container">
        <div className="item-details__wrapper">
          <div className="item-details__top-wrapper">
            <h2 className="item-details__name">{title}</h2>
            <span className="item-details__price">
              {formatValue(price, "price")}
            </span>
          </div>
          <div className="item-details__weight-wrapper">
            <span className="item-details__weight">
              {formatValue(weight, "weight")}
            </span>
          </div>
          <div className="item-details__bottom-wrapper">
            <div className="item-details__image-wrapper">
              <picture>
                <source type="image/webp" srcSet={previewImageWebp} />
                <img
                  src={previewImage}
                  srcSet={images[0]}
                  width="241"
                  height="245"
                  alt={title}
                />
              </picture>
              {isNew && <span className="item-details__label">Новинка</span>}
            </div>
            <div className="item-details__review-wrapper">
              <StarRating rating={rating} isBig reviewCount={reviewCount} />

              <div className="item-details__text-wrapper">
                <span className="item-details__text">{visibleDescription}</span>
                {isLongDescription && !isExpanded && (
                  <button
                    className="item-details__more"
                    type="button"
                    onClick={expand}
                  >
                    <span className="visually-hidden">Читать полностью</span>

                    <svg width="27" height="17" aria-hidden="true">
                      <use href="#icon-more" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="item-details__button-wrapper">
                <button
                  className={clsx("item-details__like-button", {
                    "item-details__like-button--active": isFavorite,
                  })}
                  onClick={toggleFavorite}
                  aria-disabled={isFavoritePending}
                >
                  <svg width="45" height="37" aria-hidden="true">
                    <use href="#icon-like"></use>
                  </svg>
                  <span className="visually-hidden">Понравилось</span>
                </button>

                <button
                  className="btn btn--second"
                  type="button"
                  onClick={handleShowFormClick}
                >
                  {isReviewFormOpen ? "Отменить" : "Оставить"} отзыв
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
