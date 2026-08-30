import type { TProduct } from "../../types/product";
import Card from "../card/card";

type TCatalogListProps = {
  products: TProduct[];
};

const CatalogList = ({ products }: TCatalogListProps) => (
  <ul className="catalog__list">
    {products.map((product) => (
      <li className="catalog__item">
        <Card product={product} isFull />
      </li>
    ))}
  </ul>
);

export default CatalogList;
