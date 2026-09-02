import type { MouseEvent } from "react";
import BackLink from "../../components/back-link/back-link";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  getFavorites,
  getFavoritesCount,
  getFavoritesTotalPrice,
} from "../../store/slices/favorites/favorites.selectors";
import EmptyFavorites from "./empty-favorites/empty-favorites";
import Summary from "./summary/summary";
import { clearAllFavoritesAction } from "../../store/api-actions";
import CatalogList from "../../components/catalog-list/catalog-list";
import { Helmet } from "react-helmet-async";

const FavoritesPage = () => {
  const dispatch = useAppDispatch();
  const handleClearButtonClick = (evt: MouseEvent) => {
    evt.preventDefault();
    dispatch(clearAllFavoritesAction());
  };
  const favorites = useAppSelector(getFavorites);
  const favoritesCount = useAppSelector(getFavoritesCount);
  const totalPrice = useAppSelector(getFavoritesTotalPrice);

  if (favoritesCount === 0) {
    return (
      <>
        <h1 className="visually-hidden">Избранное</h1>
        <BackLink />
        <EmptyFavorites />
      </>
    );
  }
  return (
    <div className="favorites-page">
      <Helmet>
        <title>Кондитерская Кекс - Избранное</title>{" "}
      </Helmet>
      <h1 className="visually-hidden">Избранное</h1>
      <BackLink />
      <Summary favoritesCount={favoritesCount} totalPrice={totalPrice} />
      <section className="favourites">
        <div className="container">
          <h2 className="visually-hidden">Избранные товары</h2>
          <div className="favourites__button">
            <button
              className="btn btn--second"
              type="button"
              onClick={handleClearButtonClick}
            >
              Очистить
            </button>
          </div>
        </div>
        <section className="catalog">
          <div className="container">
            <h2 className="visually-hidden">Каталог</h2>
            <div className="catalog__wrapper">
              <CatalogList products={favorites} />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default FavoritesPage;
