import { Link, useLocation, useNavigate } from "react-router-dom";
import type { TProduct } from "../../types/product";
import { AppRoute, AuthorizationStatus } from "../../const/infrastructure";
import clsx from "clsx";
import { useState, type MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from "../../store/api-actions";
import { formatValue } from "../../utils/common";
import { getAuthorizationStatus } from "../../store/slices/user/user.selectors";

type TCardProps = {
  product: TProduct;
  isFull?: boolean;
};

const Card = ({ product, isFull = false }: TCardProps) => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const location = useLocation();
  const navigate = useNavigate();
  const [isFavoritePending, setIsFavoritePending] = useState(false);

  const {
    id,
    isFavorite,
    isNew,
    previewImage,
    previewImageWebp,
    title,
    price,
  } = product;
  const productPath = `${AppRoute.Product}/${id}`;

  const handleFavoriteButtonClick = async (evt: MouseEvent) => {
    evt.preventDefault();

    if (isFavoritePending) {
      return;
    }

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login, { state: { from: location } });
      return;
    }

    setIsFavoritePending(true);

    try {
      await dispatch(
        isFavorite ? removeFromFavoritesAction(id) : setIsFavoriteAction(id),
      ).unwrap();
    } finally {
      setIsFavoritePending(false);
    }
  };

  return (
    <div className={clsx("card-item", { "card-item--big": isFull })}>
      <Link
        className="card-item__img-link"
        to={productPath}
        state={{ from: location }}
      >
        <div className="card-item__img-wrapper">
          <picture>
            <source type="image/webp" srcSet={previewImageWebp} />
            <img
              src={previewImage}
              width="241"
              height="245"
              alt={product.title}
            />
          </picture>
        </div>
        {isNew && <span className="card-item__label">Новинка</span>}
      </Link>

      <button
        className={clsx("card-item__favorites", {
          "card-item__favorites--active": isFavorite,
        })}
        onClick={handleFavoriteButtonClick}
        aria-disabled={isFavoritePending}
      >
        <span className="visually-hidden">
          {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        </span>
        <svg width="51" height="41" aria-hidden="true">
          <use href="#icon-like"></use>
        </svg>
      </button>

      {isFull && (
        <span className="card-item__price">{formatValue(price, "price")}</span>
      )}

      <Link
        className="card-item__link"
        to={productPath}
        state={{ from: location }}
      >
        <h3 className="card-item__title">
          <span>{title}</span>
        </h3>
      </Link>
    </div>
  );
};

export default Card;
