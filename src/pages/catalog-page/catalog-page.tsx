import { Helmet } from "react-helmet-async";
import BackLink from "../../components/back-link/back-link";
import { useAppSelector } from "../../hooks";
import { getIsFiltersLoadingError } from "../../store/slices/filter/filter.selectors";
import {
  getFilteredProducts,
  getIsProductsLoadingError,
} from "../../store/slices/products/products.selectors";
import ErrorPage from "../error-page/error-page";
import Catalog from "./catalog/catalog";
import Filter from "./filter/filter";
import NotFoundProducts from "./not-found-products/not-found-products";

const CatalogPage = () => {
  const filteredProducts = useAppSelector(getFilteredProducts);
  const isFiltersLoadingError = useAppSelector(getIsFiltersLoadingError);
  const isProductsLoadingError = useAppSelector(getIsProductsLoadingError);

  if (isFiltersLoadingError || isProductsLoadingError) {
    return <ErrorPage />;
  }

  return (
    <>
      <Helmet>
        <title>Кондитерская Кекс - Избранное</title>{" "}
      </Helmet>
      <h1 className="visually-hidden">Каталог товаров</h1>
      <BackLink />
      <Filter />
      {filteredProducts.length === 0 ? (
        <NotFoundProducts />
      ) : (
        <Catalog filteredProducts={filteredProducts} />
      )}
    </>
  );
};

export default CatalogPage;
