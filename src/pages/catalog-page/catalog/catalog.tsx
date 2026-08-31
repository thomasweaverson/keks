import { useEffect, useState } from "react";
import type { TProduct } from "../../../types/product";
import { CATALOG_CARDS_PER_STEP } from "../../../const/business";
import CatalogList from "../../../components/catalog-list/catalog-list";
import { useAppSelector } from "../../../hooks";
import {
  getCurrentCategory,
  getCurrentTypes,
} from "../../../store/slices/filter/filter.selectors";

type TCatalogProps = {
  filteredProducts: TProduct[];
};

const Catalog = ({ filteredProducts }: TCatalogProps) => {
  const currentCategory = useAppSelector(getCurrentCategory);
  const currentTypes = useAppSelector(getCurrentTypes);

  const [visibleCount, setVisibleCount] = useState(CATALOG_CARDS_PER_STEP);

  useEffect(() => {
    setVisibleCount(CATALOG_CARDS_PER_STEP);
  }, [currentCategory, currentTypes]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const shouldRenderShowMoreButton = visibleCount < filteredProducts.length;
  const shouldRenderToBeginButton =
    !shouldRenderShowMoreButton &&
    filteredProducts.length > CATALOG_CARDS_PER_STEP;

  const handleShowMore = () => {
    setVisibleCount((count) => count + CATALOG_CARDS_PER_STEP);
  };

  const handleScrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container">
      <h2 className="visually-hidden">Каталог</h2>
      <div className="catalog__wrapper">
        <CatalogList products={visibleProducts} />
        <div className="catalog__button-wrapper">
          {shouldRenderShowMoreButton && (
            <button
              className="btn btn--second"
              type="button"
              onClick={handleShowMore}
            >
              Показать еще
            </button>
          )}

          {shouldRenderToBeginButton && (
            <button
              className="btn btn--second"
              type="button"
              onClick={handleScrollToTop}
            >
              в начало
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
