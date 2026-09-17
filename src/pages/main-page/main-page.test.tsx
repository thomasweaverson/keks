import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import MainPage from './main-page';
import { LoadingStatus } from '../../const/infrastructure';
import { withStore } from '../../utils/testing/mock-components';

vi.mock('../error-page/error-page', () => ({
  default: () => <div data-testid="error-page" />,
}));

vi.mock('./hero/hero', () => ({
  default: () => <div data-testid="hero" />,
}));

vi.mock('./last-review/last-review', () => ({
  default: () => <div data-testid="last-review" />,
}));

vi.mock('./map-section/map-section', () => ({
  default: () => <div data-testid="map-section" />,
}));

vi.mock('./random-products/random-products', () => ({
  default: () => <div data-testid="random-products" />,
}));

describe('Component: MainPage', () => {
  it('should render error page when products loading failed', () => {
    const { withStoreComponent } = withStore(<MainPage />, {
      Products: {
        products: [],
        productsLoadingStatus: LoadingStatus.Failed,
        randomPack: null,
      },
    });

    render(withStoreComponent);

    expect(screen.getByTestId('error-page')).toBeInTheDocument();
    expect(screen.queryByTestId('hero')).not.toBeInTheDocument();
    expect(screen.queryByTestId('random-products')).not.toBeInTheDocument();
    expect(screen.queryByTestId('last-review')).not.toBeInTheDocument();
    expect(screen.queryByTestId('map-section')).not.toBeInTheDocument();
  });

  it('should render error page when favorites loading failed', () => {
    const { withStoreComponent } = withStore(<MainPage />, {
      Favorites: {
        favorites: [],
        favoritesLoadingStatus: LoadingStatus.Failed,
      },
    });

    render(withStoreComponent);

    expect(screen.getByTestId('error-page')).toBeInTheDocument();
    expect(screen.queryByTestId('hero')).not.toBeInTheDocument();
    expect(screen.queryByTestId('random-products')).not.toBeInTheDocument();
    expect(screen.queryByTestId('last-review')).not.toBeInTheDocument();
    expect(screen.queryByTestId('map-section')).not.toBeInTheDocument();
  });

  it('should render main page content when products and favorites loaded successfully', () => {
    const { withStoreComponent } = withStore(<MainPage />, {
      Products: {
        products: [],
        productsLoadingStatus: LoadingStatus.Loaded,
        randomPack: null,
      },
      Favorites: {
        favorites: [],
        favoritesLoadingStatus: LoadingStatus.Loaded,
      },
    });

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', {
        name: 'КЕКС - Твоя пушистая кондитерская',
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('random-products')).toBeInTheDocument();
    expect(screen.getByTestId('last-review')).toBeInTheDocument();
    expect(screen.getByTestId('map-section')).toBeInTheDocument();

    expect(screen.queryByTestId('error-page')).not.toBeInTheDocument();
  });
});
