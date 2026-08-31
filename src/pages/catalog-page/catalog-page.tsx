import BackLink from "../../components/back-link/back-link";
import { useAppSelector } from "../../hooks";
import { getFilteredProducts } from "../../store/slices/products/products.selectors";
import Catalog from "./catalog/catalog";
import Filter from "./filter/filter";
import NotFoundProducts from "./not-found-products/not-found-products";

const CatalogPage = () => {
  const filteredProducts = useAppSelector(getFilteredProducts);

  return (
    <>
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
