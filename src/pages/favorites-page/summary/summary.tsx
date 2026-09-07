import { Link, useLocation } from "react-router-dom";
import { formatValue } from "../../../utils/common";
import { AppRoute } from "../../../const/infrastructure";
import { getRussianPlural } from "./utils";

type TSummaryProps = {
  favoritesCount: number;
  totalPrice: number;
};

const Summary = ({ favoritesCount, totalPrice }: TSummaryProps) => {
  const location = useLocation();
  return (
    <section className="number-of-favourites favorites-page__qty">
      <div className="container">
        <h2 className="visually-hidden">Количество товаров в избранном.</h2>
        <p className="number-of-favourites__cakes">
          {favoritesCount}{" "}
          {getRussianPlural(favoritesCount, ["кекс", "кекса", "кексов"])}
        </p>
        <div className="number-of-favourites__wrapper">
          <div className="number-of-favourites__wrap-price">
            <p className="number-of-favourites__text">Всего</p>
            <p className="number-of-favourites__price">
              {formatValue(totalPrice, "price")}
            </p>
          </div>
        </div>
        <div className="number-of-favourites__button">
          <Link
            className="btn"
            to={AppRoute.Catalog}
            state={{ from: location }}
          >
            В каталог
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Summary;
