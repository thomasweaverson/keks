import { Helmet } from "react-helmet-async";
import BackLink from "../../components/back-link/back-link";
import { useAppSelector } from "../../hooks";
import {
  getIsFiltersLoading,
  getIsFiltersLoadingError,
} from "../../store/slices/filter/filter.selectors";
import {
  getFilteredProducts,
  getIsProductsLoading,
  getIsProductsLoadingError,
} from "../../store/slices/products/products.selectors";
import ErrorPage from "../error-page/error-page";
import Catalog from "./catalog/catalog";
import Filter from "./filter/filter";
import NotFoundProducts from "./not-found-products/not-found-products";
import LoaderScreen from "../loading-screen/loading-screen";
import { getIsFavoritesLoadingError } from "../../store/slices/favorites/favorites.selectors";

const CatalogPage = () => {
  const filteredProducts = useAppSelector(getFilteredProducts);
  const isProductsLoading = useAppSelector(getIsProductsLoading);
  const isFiltersLoading = useAppSelector(getIsFiltersLoading);
  const isFiltersLoadingError = useAppSelector(getIsFiltersLoadingError);
  const isProductsLoadingError = useAppSelector(getIsProductsLoadingError);
  const isFavoritesLoadingError = useAppSelector(getIsFavoritesLoadingError);

  if (isProductsLoading || isFiltersLoading) {
    return <LoaderScreen />;
  }

  if (isFiltersLoadingError || isProductsLoadingError || isFavoritesLoadingError) {
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
        <Catalog filteredProducts={filteredProducts} />
      ) : (
        <NotFoundProducts />
      )}
    </>
  );
};

export default CatalogPage;
