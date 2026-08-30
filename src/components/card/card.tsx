import { Link } from "react-router-dom";
import type { TProduct } from "../../types/product";
import { AppRoute } from "../../const/infrastructure";
import clsx from "clsx";
import type { MouseEvent } from "react";
import { useAppDispatch } from "../../hooks";
import {
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from "../../store/api-actions";

type TCardProps = {
  product: TProduct;
};

const Card = ({ product }: TCardProps) => {
  const dispatch = useAppDispatch();
  const { id, isFavorite, isNew, previewImage, previewImageWebp, title } =
    product;

  const handleFavoriteButtonClick = (evt: MouseEvent) => {
    evt.preventDefault();
    if (isFavorite) {
      dispatch(removeFromFavoritesAction(id));
    } else {
      dispatch(setIsFavoriteAction(id));
    }
  };

  return (
    <div className="card-item">
      <Link className="card-item__img-link" to={`${AppRoute.Product}/${id}`}>
        <div className="card-item__img-wrapper">
          <picture>
            <source type="image/webp" srcSet={previewImageWebp} />
            <img
              src={previewImage}
              width="241"
              height="245"
              alt="Торт голубика."
            />
          </picture>
        </div>
        {isNew && <span className="card-item__label">Новинка</span>}
      </Link>
      <button
        className={clsx("card-item__favorites", {
          "card-item__favorites--active": isFavorite,
        })}
        onClick={(id) => handleFavoriteButtonClick(id)}
      >
        <span className="visually-hidden">Добавить в избранное</span>
        <svg width="51" height="41" aria-hidden="true">
          <use href="#icon-like"></use>
        </svg>
      </button>
      <Link className="card-item__link" to={`${AppRoute.Product}/${id}`}>
        <h3 className="card-item__title">
          <span>{title}</span>
        </h3>
      </Link>
    </div>
  );
};

export default Card;
