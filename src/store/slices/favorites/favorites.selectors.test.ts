import { describe, expect, it } from 'vitest';
import { LoadingStatus } from '../../../const/infrastructure';
import { makeFakeProductExtended } from '../../../utils/testing/mocks';
import {
  getFavorites,
  getFavoritesCount,
  getFavoritesLoadingStatus,
  getFavoritesTotalPrice,
} from './favorites.selectors';

describe('Favorites selectors', () => {
  it('returns favorites', () => {
    const favorites = [
      makeFakeProductExtended(),
      makeFakeProductExtended(),
    ];

    const state = {
      Favorites: {
        favorites,
        favoritesLoadingStatus: LoadingStatus.Loaded,
      },
    };

    expect(getFavorites(state)).toBe(favorites);
  });

  it('returns favorites count', () => {
    const favorites = [
      makeFakeProductExtended(),
      makeFakeProductExtended(),
      makeFakeProductExtended(),
    ];

    const state = {
      Favorites: {
        favorites,
        favoritesLoadingStatus: LoadingStatus.Loaded,
      },
    };

    expect(getFavoritesCount(state)).toBe(3);
  });

  it('returns zero for empty favorites', () => {
    const state = {
      Favorites: {
        favorites: [],
        favoritesLoadingStatus: LoadingStatus.Idle,
      },
    };

    expect(getFavoritesCount(state)).toBe(0);
  });

  it('returns total price of favorites', () => {
    const firstProduct = makeFakeProductExtended({ price: 500 });
    const secondProduct = makeFakeProductExtended({ price: 1200 });

    const state = {
      Favorites: {
        favorites: [firstProduct, secondProduct],
        favoritesLoadingStatus: LoadingStatus.Loaded,
      },
    };

    expect(getFavoritesTotalPrice(state)).toBe(1700);
  });

  it('returns zero for empty favorites total price', () => {
    const state = {
      Favorites: {
        favorites: [],
        favoritesLoadingStatus: LoadingStatus.Idle,
      },
    };

    expect(getFavoritesTotalPrice(state)).toBe(0);
  });

  it('returns favorites loading status', () => {
    const state = {
      Favorites: {
        favorites: [],
        favoritesLoadingStatus: LoadingStatus.Loading,
      },
    };

    expect(getFavoritesLoadingStatus(state)).toBe(LoadingStatus.Loading);
  });
});

