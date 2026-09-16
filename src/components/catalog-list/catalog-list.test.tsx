import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { TProduct } from '../../types/product';
import CatalogList from './catalog-list';

vi.mock('../card/card', () => ({
  default: ({ product, isLarge }: { product: TProduct; isLarge?: boolean }) => (
    <article data-testid="product-card">
      <span>{product.title}</span>
      {isLarge && <span>{product.price}</span>}
    </article>
  ),
}));

const products: TProduct[] = [
  {
    id: '1',
    title: 'Чизкейк Нью-Йорк',
    category: 'cheesecake',
    type: 'new-york',
    price: 450,
    previewImage: '/images/cheesecake.jpg',
    previewImageWebp: '/images/cheesecake.webp',
    isFavorite: false,
    isNew: true,
  },
  {
    id: '2',
    title: 'Шоколадный десерт',
    category: 'dessert',
    type: 'chocolate',
    price: 350,
    previewImage: '/images/dessert.jpg',
    previewImageWebp: '/images/dessert.webp',
    isFavorite: true,
    isNew: false,
  },
];

describe('CatalogList', () => {
  it('renders a card for each product', () => {
    render(<CatalogList products={products} />);

    expect(screen.getAllByTestId('product-card')).toHaveLength(products.length);
    expect(screen.getByText('Чизкейк Нью-Йорк')).toBeInTheDocument();
    expect(screen.getByText('Шоколадный десерт')).toBeInTheDocument();
  });

  it('renders all cards as large', () => {
    render(<CatalogList products={products} />);

    // потому что в цена есть только у большой карточки
    expect(screen.getByText('450')).toBeInTheDocument();
    expect(screen.getByText('350')).toBeInTheDocument();
  });
});
