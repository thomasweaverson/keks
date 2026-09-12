import { Helmet } from 'react-helmet-async';
import BackLink from '../../components/back-link/back-link';
import CatalogList from '../../components/catalog-list/catalog-list';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearAllFavoritesAction } from '../../store/api-actions';
import {
  getFavorites,
  getFavoritesCount,
  getFavoritesLoadingStatus,
  getFavoritesTotalPrice,
} from '../../store/slices/favorites/favorites.selectors';
import EmptyFavorites from './empty-favorites/empty-favorites';
import Summary from './summary/summary';
import ErrorPage from '../error-page/error-page';
import { getProductsLoadingStatus } from '../../store/slices/products/products.selectors';
import { LoadingStatus } from '../../const/infrastructure';

const FavoritesPage = () => {
  const dispatch = useAppDispatch();

  const favorites = useAppSelector(getFavorites);
  const favoritesCount = useAppSelector(getFavoritesCount);
  const totalPrice = useAppSelector(getFavoritesTotalPrice);

  const productsLoadingStatus = useAppSelector(getProductsLoadingStatus);
  const isProductsLoadingError = productsLoadingStatus === LoadingStatus.Failed;

  const favoritesLoadingStatus = useAppSelector(getFavoritesLoadingStatus);
  const isFavoritesLoadingError =
    favoritesLoadingStatus === LoadingStatus.Failed;

  const handleClearButtonClick = () => {
    void dispatch(clearAllFavoritesAction());
  };

  const isEmpty = favoritesCount === 0;

  if (isProductsLoadingError || isFavoritesLoadingError) {
    return <ErrorPage />;
  }

  return (
    <>
      <Helmet>
        <title>Кондитерская Кекс - Избранное</title>
      </Helmet>

      <h1 className="visually-hidden">Избранное</h1>

      <BackLink />

      {isEmpty ? (
        <EmptyFavorites />
      ) : (
        <div className="favorites-page">
          <Summary favoritesCount={favoritesCount} totalPrice={totalPrice} />

          <section className="favorites">
            <div className="container">
              <h2 className="visually-hidden">Избранные товары</h2>

              <div className="favorites__button">
                <button
                  className="btn btn--second"
                  type="button"
                  onClick={handleClearButtonClick}
                >
                  Очистить
                </button>
              </div>
            </div>
          </section>

          <section className="catalog">
            <div className="container">
              <h2 className="visually-hidden">Каталог</h2>

              <div className="catalog__wrapper">
                <CatalogList products={favorites} />
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default FavoritesPage;
