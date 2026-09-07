import { Link, useLocation } from "react-router-dom";
import type { TProduct } from "../../types/product";
import { AppRoute } from "../../const/infrastructure";
import clsx from "clsx";

import { formatValue } from "../../utils/common";
import useFavorite from "../../hooks/useFavorite";

type TCardProps = {
  product: TProduct;
  isFull?: boolean;
};

const Card = ({ product, isFull = false }: TCardProps) => {
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

  const { isPending: isFavoritePending, toggleFavorite } = useFavorite(
    id,
    isFavorite,
    location,
  );

  const productPath = `${AppRoute.Product}/${id}`;

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
        onClick={toggleFavorite}
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
