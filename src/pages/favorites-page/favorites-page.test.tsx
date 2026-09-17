import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FavoritesPage from './favorites-page';

import { LoadingStatus } from '../../const/infrastructure';
import { withHistory, withStore } from '../../utils/testing/mock-components';
import {
  makeFakeProductExtended,
  makeFakeState,
} from '../../utils/testing/mocks';

vi.mock('../../components/back-link/back-link', () => ({
  default: () => <a href="/previous">Назад</a>,
}));

vi.mock('../../components/catalog-list/catalog-list', () => ({
  default: () => <div>Список избранных товаров</div>,
}));

vi.mock('./empty-favorites/empty-favorites', () => ({
  default: () => <div>Пустое избранное</div>,
}));

vi.mock('./summary/summary', () => ({
  default: () => <section aria-label="Сводка избранного" />,
}));

vi.mock('../error-page/error-page', () => ({
  default: () => <div>Произошла ошибка</div>,
}));

describe('Component: FavoritesPage', () => {
  it('should render empty favorites content when favorites are empty', () => {
    const { withStoreComponent } = withStore(
      <FavoritesPage />,
      makeFakeState({
        Favorites: {
          favorites: [],
          favoritesLoadingStatus: LoadingStatus.Loaded,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(screen.getByText('Пустое избранное')).toBeInTheDocument();
    expect(screen.queryByText('Итоги избранного')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Очистить' }),
    ).not.toBeInTheDocument();
  });

  it('should render favorites content when favorites are not empty', () => {
    const favorites = [makeFakeProductExtended(), makeFakeProductExtended()];

    const { withStoreComponent } = withStore(
      <FavoritesPage />,
      makeFakeState({
        Favorites: {
          favorites,
          favoritesLoadingStatus: LoadingStatus.Loaded,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(
      screen.getByRole('region', { name: 'Сводка избранного' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Список избранных товаров')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Очистить' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Пустое избранное')).not.toBeInTheDocument();
  });

  it('should render error page when products loading fails', () => {
    const { withStoreComponent } = withStore(
      <FavoritesPage />,
      makeFakeState({
        Products: {
          products: [],
          productsLoadingStatus: LoadingStatus.Failed,
          randomPack: null,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(screen.getByText('Произошла ошибка')).toBeInTheDocument();
    expect(screen.queryByText('Пустое избранное')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Очистить' }),
    ).not.toBeInTheDocument();
  });

  it('should render error page when favorites loading fails', () => {
    const { withStoreComponent } = withStore(
      <FavoritesPage />,
      makeFakeState({
        Favorites: {
          favorites: [makeFakeProductExtended()],
          favoritesLoadingStatus: LoadingStatus.Failed,
        },
      }),
    );

    render(withHistory(withStoreComponent));

    expect(screen.getByText('Произошла ошибка')).toBeInTheDocument();
    expect(screen.queryByText('Итоги избранного')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Очистить' }),
    ).not.toBeInTheDocument();
  });

  it('should clear all favorites', async () => {
    const favorites = [makeFakeProductExtended(), makeFakeProductExtended()];

    const { withStoreComponent, mockAxiosAdapter } = withStore(
      <FavoritesPage />,
      makeFakeState({
        Favorites: {
          favorites,
          favoritesLoadingStatus: LoadingStatus.Loaded,
        },
      }),
    );

    mockAxiosAdapter.onDelete(/\/favorite\//).reply(204);

    render(withHistory(withStoreComponent));

    await userEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    await waitFor(() => {
      expect(mockAxiosAdapter.history.delete).toHaveLength(favorites.length);
    });
  });

  it('should set correct page title', () => {
    const { withStoreComponent } = withStore(<FavoritesPage />);

    render(withHistory(withStoreComponent));

    expect(document.title).toBe('Кондитерская Кекс - Избранное');
  });
});
