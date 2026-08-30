import { Link, useLocation } from "react-router-dom";
import type { TProduct } from "../../types/product";
import { AppRoute } from "../../const/infrastructure";
import clsx from "clsx";
import type { MouseEvent } from "react";
import { useAppDispatch } from "../../hooks";
import {
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from "../../store/api-actions";
import { formatPrice } from "../../utils/common";

type TCardProps = {
  product: TProduct;
  isFull?: boolean;
};

const Card = ({ product, isFull = false }: TCardProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
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

  const handleFavoriteButtonClick = (evt: MouseEvent) => {
    evt.preventDefault();
    if (isFavorite) {
      dispatch(removeFromFavoritesAction(id));
    } else {
      dispatch(setIsFavoriteAction(id));
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
      >
        <span className="visually-hidden">
          {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        </span>
        <svg width="51" height="41" aria-hidden="true">
          <use href="#icon-like"></use>
        </svg>
      </button>

      {isFull && <span className="card-item__price">{formatPrice(price)}</span>}

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
