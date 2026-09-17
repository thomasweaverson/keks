import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { TProduct } from '../../../types/product';
import { CATALOG_CARDS_PER_STEP } from '../../../const/business';
import Catalog from './catalog';

vi.mock('../../../components/catalog-list/catalog-list', () => ({
  default: ({ products }: { products: TProduct[] }) => (
    <div data-testid="catalog-list">
      {products.map(({ id }) => (
        <div key={id}>{id}</div>
      ))}
    </div>
  ),
}));

const { mockHandleScrollToTop } = vi.hoisted(() => ({
  mockHandleScrollToTop: vi.fn(),
}));

vi.mock('../../../utils/common', () => ({
  handleScrollToTop: mockHandleScrollToTop,
}));

const makeProducts = (count: number): TProduct[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `product-${index + 1}`,
    title: `Product ${index + 1}`,
    category: 'cheesecake',
    type: 'lemon',
    price: 100 + index,
    previewImage: '',
    previewImageWebp: '',
    isFavorite: false,
    isNew: false,
  }));

describe('Component: Catalog', () => {
  it('should render all products when their count does not exceed the visible limit', () => {
    const products = makeProducts(CATALOG_CARDS_PER_STEP);

    render(<Catalog filteredProducts={products} />);

    expect(screen.getByTestId('catalog-list').children).toHaveLength(
      CATALOG_CARDS_PER_STEP,
    );
    expect(
      screen.queryByRole('button', { name: 'Показать еще' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'в начало' }),
    ).not.toBeInTheDocument();
  });

  it('should show only the first batch of products and "Показать еще" button', () => {
    const products = makeProducts(CATALOG_CARDS_PER_STEP + 1);

    render(<Catalog filteredProducts={products} />);

    expect(screen.getByTestId('catalog-list').children).toHaveLength(
      CATALOG_CARDS_PER_STEP,
    );
    expect(
      screen.getByRole('button', { name: 'Показать еще' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'в начало' }),
    ).not.toBeInTheDocument();
  });

  it('should show the next batch of products after clicking "Показать еще"', async () => {
    const user = userEvent.setup();
    const products = makeProducts(CATALOG_CARDS_PER_STEP * 2);

    render(<Catalog filteredProducts={products} />);

    await user.click(screen.getByRole('button', { name: 'Показать еще' }));

    expect(screen.getByTestId('catalog-list').children).toHaveLength(
      CATALOG_CARDS_PER_STEP * 2,
    );
    expect(
      screen.queryByRole('button', { name: 'Показать еще' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'в начало' }),
    ).toBeInTheDocument();
  });

  it('should not render more products than available', async () => {
    const user = userEvent.setup();
    const products = makeProducts(CATALOG_CARDS_PER_STEP + 2);

    render(<Catalog filteredProducts={products} />);

    await user.click(screen.getByRole('button', { name: 'Показать еще' }));

    expect(screen.getByTestId('catalog-list').children).toHaveLength(
      products.length,
    );
    expect(
      screen.queryByRole('button', { name: 'Показать еще' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'в начало' }),
    ).toBeInTheDocument();
  });

  it('should show "в начало" button only after all products become visible', async () => {
    const user = userEvent.setup();
    const products = makeProducts(CATALOG_CARDS_PER_STEP * 2 + 1);

    render(<Catalog filteredProducts={products} />);

    expect(
      screen.queryByRole('button', { name: 'в начало' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показать еще' }));

    expect(
      screen.queryByRole('button', { name: 'в начало' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показать еще' }));

    expect(
      screen.getByRole('button', { name: 'в начало' }),
    ).toBeInTheDocument();
  });

  it('should scroll to the beginning after clicking "в начало"', async () => {
    const user = userEvent.setup();
    const products = makeProducts(CATALOG_CARDS_PER_STEP + 1);

    render(<Catalog filteredProducts={products} />);

    await user.click(screen.getByRole('button', { name: 'Показать еще' }));
    await user.click(screen.getByRole('button', { name: 'в начало' }));

    expect(mockHandleScrollToTop).toHaveBeenCalledTimes(1);
  });
});
