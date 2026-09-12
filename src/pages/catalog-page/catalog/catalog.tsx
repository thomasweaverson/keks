import { useState } from 'react';
import type { TProduct } from '../../../types/product';
import { CATALOG_CARDS_PER_STEP } from '../../../const/business';
import CatalogList from '../../../components/catalog-list/catalog-list';

import { handleScrollToTop } from '../../../utils/common';

type TCatalogProps = {
  filteredProducts: TProduct[];
};

const Catalog = ({ filteredProducts }: TCatalogProps) => {
  const [visibleCount, setVisibleCount] = useState(CATALOG_CARDS_PER_STEP);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const hasMoreProducts = visibleCount < filteredProducts.length;
  const shouldRenderToBeginButton =
    !hasMoreProducts && filteredProducts.length > CATALOG_CARDS_PER_STEP;

  const handleShowMore = () => {
    setVisibleCount((count) =>
      Math.min(count + CATALOG_CARDS_PER_STEP, filteredProducts.length),
    );
  };

  return (
    <div className="container">
      <h2 className="visually-hidden">Каталог</h2>
      <div className="catalog__wrapper">
        <CatalogList products={visibleProducts} />
        <div className="catalog__button-wrapper">
          {hasMoreProducts && (
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
