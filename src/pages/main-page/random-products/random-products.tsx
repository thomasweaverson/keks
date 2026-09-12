import { Link, useLocation } from 'react-router-dom';
import type { TProduct } from '../../../types/product';
import Card from '../../../components/card/card';
import { AppRoute } from '../../../const/infrastructure';
import { getLocationState } from '../../../utils/common';

type TRandomProductsProps = {
  products: [TProduct, TProduct, TProduct] | null;
};
const RandomProducts = ({ products }: TRandomProductsProps) => {
  const location = useLocation();

  if (!products) {
    return null;
  }

  return (
    <section className="random-main">
      <div className="container">
        <h2 className="random-main__title">кексы</h2>
        <ul className="random-main__list">
          {products.map((product) => (
            <li key={product.id} className="random-main__item">
              <Card product={product} />
            </li>
          ))}

          <li className="random-main__item">
            <Link
              className="random-main__link"
              to={AppRoute.Catalog}
              state={{ from: getLocationState(location) }}
            >
              <div className="random-main__icon-wrapper">
                <div className="random-main__icon">
                  <svg width="120" height="130" aria-hidden="true">
                    <use href="#icon-keks" />
                  </svg>
                </div>
              </div>
              <h3 className="random-main__subtitle">Все кексы</h3>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default RandomProducts;
