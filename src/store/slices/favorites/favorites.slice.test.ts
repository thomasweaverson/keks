import { describe, expect, it } from 'vitest';
import { LoadingStatus } from '../../../const/infrastructure';
import {
  clearAllFavoritesAction,
  fetchFavoritesAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from '../../api-actions';
import { makeFakeProductExtended } from '../../../utils/testing/mocks';
import { favoritesSlice, resetFavorites } from './favorites.slice';

describe('Favorites slice', () => {
  it('returns initial state without previous state', () => {
    expect(favoritesSlice.reducer(undefined, { type: '@@INIT' })).toEqual({
      favorites: [],
      favoritesLoadingStatus: LoadingStatus.Idle,
    });
  });

  it('handles resetFavorites', () => {
    const favorite = makeFakeProductExtended();

    const state = {
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    };

    expect(favoritesSlice.reducer(state, resetFavorites())).toEqual({
      favorites: [],
      favoritesLoadingStatus: LoadingStatus.Idle,
    });
  });

  it('handles fetchFavoritesAction.pending', () => {
    const favorite = makeFakeProductExtended();

    const state = {
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Idle,
    };

    const action = fetchFavoritesAction.pending('request-id', undefined);

    expect(favoritesSlice.reducer(state, action)).toEqual({
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Loading,
    });
  });

  it('handles fetchFavoritesAction.fulfilled', () => {
    const favorites = [
      makeFakeProductExtended(),
      makeFakeProductExtended(),
    ];

    const state = {
      favorites: [],
      favoritesLoadingStatus: LoadingStatus.Loading,
    };

    const action = fetchFavoritesAction.fulfilled(
      favorites,
      'request-id',
      undefined,
    );

    expect(favoritesSlice.reducer(state, action)).toEqual({
      favorites,
      favoritesLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('handles fetchFavoritesAction.rejected', () => {
    const favorite = makeFakeProductExtended();

    const state = {
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Loading,
    };

    const action = fetchFavoritesAction.rejected(
      new Error('Request failed'),
      'request-id',
      undefined,
    );

    expect(favoritesSlice.reducer(state, action)).toEqual({
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Failed,
    });
  });

  it('adds a product on setIsFavoriteAction.fulfilled', () => {
    const favorite = makeFakeProductExtended();
    const product = makeFakeProductExtended();

    const state = {
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    };

    const action = setIsFavoriteAction.fulfilled(
      product,
      'request-id',
      product.id,
    );

    expect(favoritesSlice.reducer(state, action)).toEqual({
      favorites: [favorite, product],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('does not add an already existing product on setIsFavoriteAction.fulfilled', () => {
    const favorite = makeFakeProductExtended();

    const state = {
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    };

    const action = setIsFavoriteAction.fulfilled(
      favorite,
      'request-id',
      favorite.id,
    );

    expect(favoritesSlice.reducer(state, action)).toEqual(state);
  });

  it('removes a product on removeFromFavoritesAction.fulfilled', () => {
    const favorite = makeFakeProductExtended();
    const productToRemove = makeFakeProductExtended();

    const state = {
      favorites: [favorite, productToRemove],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    };

    const action = removeFromFavoritesAction.fulfilled(
      productToRemove,
      'request-id',
      productToRemove.id,
    );

    expect(favoritesSlice.reducer(state, action)).toEqual({
      favorites: [favorite],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    });
  });

  it('clears all favorites on clearAllFavoritesAction.fulfilled', () => {
    const favorites = [
      makeFakeProductExtended(),
      makeFakeProductExtended(),
    ];

    const state = {
      favorites,
      favoritesLoadingStatus: LoadingStatus.Loaded,
    };

    const action = clearAllFavoritesAction.fulfilled(
      undefined,
      'request-id',
      undefined,
    );

    expect(favoritesSlice.reducer(state, action)).toEqual({
      favorites: [],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    });
  });
});
