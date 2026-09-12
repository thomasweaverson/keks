import { Helmet } from 'react-helmet-async';
import BackLink from '../../components/back-link/back-link';
import { useAppSelector } from '../../hooks';
import {
  getCurrentCategory,
  getFiltersLoadingStatus,
  getSelectedTypes,
} from '../../store/slices/filter/filter.selectors';
import {
  getFilteredProducts,
  getProductsLoadingStatus,
} from '../../store/slices/products/products.selectors';
import ErrorPage from '../error-page/error-page';
import Catalog from './catalog/catalog';
import Filter from './filter/filter';
import NotFoundProducts from './not-found-products/not-found-products';
import LoaderScreen from '../loading-screen/loading-screen';
import { LoadingStatus } from '../../const/infrastructure';
import { getFavoritesLoadingStatus } from '../../store/slices/favorites/favorites.selectors';

const CatalogPage = () => {
  const filteredProducts = useAppSelector(getFilteredProducts);

  const productsLoadingStatus = useAppSelector(getProductsLoadingStatus);
  const isProductsLoading = productsLoadingStatus === LoadingStatus.Loading;
  const isProductsLoadingError = productsLoadingStatus === LoadingStatus.Failed;

  const favoritesLoadingStatus = useAppSelector(getFavoritesLoadingStatus);
  const isFavoritesLoadingError =
    favoritesLoadingStatus === LoadingStatus.Failed;


  const filtersLoadingStatus = useAppSelector(getFiltersLoadingStatus);
  const isFiltersLoading = filtersLoadingStatus === LoadingStatus.Loading;
  const isFiltersLoadingError = filtersLoadingStatus === LoadingStatus.Failed;


  const currentCategory = useAppSelector(getCurrentCategory);
  const selectedTypes = useAppSelector(getSelectedTypes);

  if (isProductsLoading || isFiltersLoading) {
    return <LoaderScreen />;
  }

  if (
    isFiltersLoadingError ||
    isProductsLoadingError ||
    isFavoritesLoadingError
  ) {
    return <ErrorPage />;
  }

  return (
    <>
      <Helmet>
        <title>Кондитерская Кекс - Каталог</title>
      </Helmet>

      <h1 className="visually-hidden">Каталог товаров</h1>

      <BackLink />
      <Filter />

      {filteredProducts.length > 0 ? (
        <Catalog
          filteredProducts={filteredProducts}
          key={`${currentCategory}-with-types:${selectedTypes.join('-')}`}
        />
      ) : (
        <NotFoundProducts />
      )}
    </>
  );
};

export default CatalogPage;
