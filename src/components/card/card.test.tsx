import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Card from './card';
import useFavorite from '../../hooks/use-favorite';

import type { TProduct } from '../../types/product';
import { withHistory } from '../../utils/testing/mock-components';

const { mockToggleFavorite } = vi.hoisted(() => ({
  mockToggleFavorite: vi.fn(),
}));

vi.mock('../../hooks/use-favorite', () => ({
  default: vi.fn(),
}));

const mockUseFavorite = vi.mocked(useFavorite);

const product: TProduct = {
  id: '1',
  title: 'Чизкейк Нью-Йорк',
  category: 'cheesecake',
  type: 'new-york',
  price: 450,
  previewImage: '/images/product.jpg',
  previewImageWebp: '/images/product.webp',
  isFavorite: false,
  isNew: false,
};

const renderCard = (cardProduct: TProduct = product, isLarge = false) => {
  mockUseFavorite.mockReturnValue({
    isPending: false,
    toggleFavorite: mockToggleFavorite,
  });

  return render(withHistory(<Card product={cardProduct} isLarge={isLarge} />));
};

describe('Component: Card', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information', () => {
    renderCard();

    expect(
      screen.getByRole('img', { name: product.title }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: product.title }),
    ).toBeInTheDocument();
  });

  it('renders "Новинка" label for a new product', () => {
    renderCard({
      ...product,
      isNew: true,
    });

    expect(screen.getByText('Новинка')).toBeInTheDocument();
  });

  it('renders price for a large card', () => {
    renderCard(product, true);

    expect(screen.getByText('450 р')).toBeInTheDocument();
  });

  it('does not render price for a regular card', () => {
    renderCard();

    expect(screen.queryByText('450 р')).not.toBeInTheDocument();
  });

  it.each([
    [false, 'Добавить в избранное'],
    [true, 'Удалить из избранного'],
  ])(
    'renders correct favorite action when isFavorite is %s',
    (isFavorite, accessibleName) => {
      renderCard({
        ...product,
        isFavorite,
      });

      expect(
        screen.getByRole('button', {
          name: accessibleName,
        }),
      ).toBeInTheDocument();
    },
  );

  it('calls toggleFavorite when favorite button is clicked', async () => {
    const user = userEvent.setup();

    renderCard();

    await user.click(
      screen.getByRole('button', {
        name: 'Добавить в избранное',
      }),
    );

    expect(mockToggleFavorite).toHaveBeenCalledOnce();
  });

  it('sets aria-disabled when favorite action is pending', () => {
    mockUseFavorite.mockReturnValue({
      isPending: true,
      toggleFavorite: mockToggleFavorite,
    });

    render(withHistory(<Card product={product} />));

    expect(
      screen.getByRole('button', {
        name: 'Добавить в избранное',
      }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('links to product page', () => {
    renderCard();

    expect(
      screen.getAllByRole('link', { name: product.title })[0],
    ).toHaveAttribute('href', '/product/1');
  });
});
