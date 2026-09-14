import { describe, expect, it, vi } from 'vitest';
import { LoadingStatus } from '../../../const/infrastructure';
import {
  clearAllFavoritesAction,
  fetchProductsAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from '../../api-actions';
import {
  makeFakeProduct,
  makeFakeProductExtended,
} from '../../../utils/testing/mocks';
import type { TProductsState } from '../../../types/state';
import { getRandomThreeElements } from '../../../pages/main-page/utils';
import { resetFavorites } from '../favorites/favorites.slice';
import { productsSlice } from './products.slice';

vi.mock('../../../pages/main-page/utils', () => ({
  getRandomThreeElements: vi.fn(),
}));

describe('Products slice', () => {
  it('returns initial state without previous state', () => {
    expect(productsSlice.reducer(undefined, { type: '@@INIT' })).toEqual({
      products: [],
      productsLoadingStatus: LoadingStatus.Idle,
      randomPack: null,
    });
  });

  it('handles fetchProductsAction.pending', () => {
    const state: TProductsState = {
      products: [makeFakeProduct()],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: [makeFakeProduct(), makeFakeProduct(), makeFakeProduct()],
    };

    const action = fetchProductsAction.pending('request-id', undefined);

    expect(productsSlice.reducer(state, action)).toEqual({
      products: state.products,
      productsLoadingStatus: LoadingStatus.Loading,
      randomPack: state.randomPack,
    });
  });

  it('handles fetchProductsAction.fulfilled', () => {
    const products = [
      makeFakeProduct(),
      makeFakeProduct(),
      makeFakeProduct(),
      makeFakeProduct(),
    ];

    const randomPack: TProductsState['randomPack'] = [
      products[0],
      products[1],
      products[2],
    ];

    vi.mocked(getRandomThreeElements).mockReturnValue(randomPack);

    const state: TProductsState = {
      products: [],
      productsLoadingStatus: LoadingStatus.Loading,
      randomPack: null,
    };

    const action = fetchProductsAction.fulfilled(
      products,
      'request-id',
      undefined,
    );

    expect(productsSlice.reducer(state, action)).toEqual({
      products,
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack,
    });

    expect(getRandomThreeElements).toHaveBeenCalledWith(products);
  });

  it('handles fetchProductsAction.rejected', () => {
    const state: TProductsState = {
      products: [makeFakeProduct()],
      productsLoadingStatus: LoadingStatus.Loading,
      randomPack: [makeFakeProduct(), makeFakeProduct(), makeFakeProduct()],
    };

    const action = fetchProductsAction.rejected(
      new Error('Request failed'),
      'request-id',
      undefined,
    );

    expect(productsSlice.reducer(state, action)).toEqual({
      products: [],
      productsLoadingStatus: LoadingStatus.Failed,
      randomPack: state.randomPack,
    });
  });

  it('handles setIsFavoriteAction.fulfilled for product from products', () => {
    const product = makeFakeProduct();
    const productExtended = makeFakeProductExtended(product);
    const products = [product];

    const state: TProductsState = {
      products,
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: null,
    };

    const action = setIsFavoriteAction.fulfilled(
      productExtended,
      'request-id',
      product.id,
    );

    const result = productsSlice.reducer(state, action);

    expect(result.products[0].isFavorite).toBe(true);
  });

  it('does not change products when setIsFavoriteAction.fulfilled product is absent', () => {
    const product = makeFakeProduct();
    const favoriteProduct = makeFakeProductExtended();

    const state: TProductsState = {
      products: [product],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: null,
    };

    const action = setIsFavoriteAction.fulfilled(
      favoriteProduct,
      'request-id',
      favoriteProduct.id,
    );

    expect(productsSlice.reducer(state, action)).toEqual(state);
  });

  it('handles setIsFavoriteAction.fulfilled for product from randomPack', () => {
    const products: TProductsState['randomPack'] = [makeFakeProduct(), makeFakeProduct(), makeFakeProduct()];

    const productExtended = makeFakeProductExtended(products[1]);

    const favoriteProduct = products[1];

    const state: TProductsState = {
      products: [],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: products,
    };

    const action = setIsFavoriteAction.fulfilled(
      productExtended,
      'request-id',
      favoriteProduct.id,
    );

    const result = productsSlice.reducer(state, action);

    expect(result.randomPack?.[1].isFavorite).toBe(true);
  });

  it('does not change randomPack when setIsFavoriteAction.fulfilled product is absent', () => {
    const randomPack: TProductsState['randomPack'] = [
      makeFakeProduct(),
      makeFakeProduct(),
      makeFakeProduct(),
    ];

    const favoriteProduct = makeFakeProductExtended();

    const state: TProductsState = {
      products: [],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack,
    };

    const action = setIsFavoriteAction.fulfilled(
      favoriteProduct,
      'request-id',
      favoriteProduct.id,
    );

    expect(productsSlice.reducer(state, action)).toEqual(state);
  });

  it('handles removeFromFavoritesAction.fulfilled for product from products', () => {
    const product = makeFakeProduct();
    product.isFavorite = true;

    const productExtended = makeFakeProductExtended(product);

    const state: TProductsState = {
      products: [product],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: null,
    };

    const action = removeFromFavoritesAction.fulfilled(
      productExtended,
      'request-id',
      product.id,
    );

    const result = productsSlice.reducer(state, action);

    expect(result.products[0].isFavorite).toBe(false);
  });

  it('does not change products when removeFromFavoritesAction.fulfilled product is absent', () => {
    const product = makeFakeProduct();
    const notFavoriteProduct = makeFakeProductExtended();

    const state: TProductsState = {
      products: [product],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: null,
    };

    const action = removeFromFavoritesAction.fulfilled(
      notFavoriteProduct,
      'request-id',
      notFavoriteProduct.id,
    );

    expect(productsSlice.reducer(state, action)).toEqual(state);
  });

  it('handles removeFromFavoritesAction.fulfilled for product from randomPack', () => {
    const randomPack: TProductsState['randomPack'] = [
      makeFakeProduct(),
      makeFakeProduct(),
      makeFakeProduct(),
    ];


    randomPack[1].isFavorite = true;

    const productExtended = makeFakeProductExtended(randomPack[1]);

    const state: TProductsState = {
      products: [],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack,
    };

    const product = randomPack[1];

    const action = removeFromFavoritesAction.fulfilled(
      productExtended,
      'request-id',
      product.id,
    );

    const result = productsSlice.reducer(state, action);

    expect(result.randomPack?.[1].isFavorite).toBe(false);
  });

  it('does not change randomPack when removeFromFavoritesAction.fulfilled product is absent', () => {
    const randomPack: TProductsState['randomPack'] = [
      makeFakeProduct(),
      makeFakeProduct(),
      makeFakeProduct(),
    ];

    const notFavoriteProduct = makeFakeProductExtended();

    const state: TProductsState = {
      products: [],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack,
    };

    const action = removeFromFavoritesAction.fulfilled(
      notFavoriteProduct,
      'request-id',
      notFavoriteProduct.id,
    );

    expect(productsSlice.reducer(state, action)).toEqual(state);
  });

  it('handles clearAllFavoritesAction.fulfilled', () => {
    const products = [makeFakeProduct(), makeFakeProduct()];

    products[0].isFavorite = true;
    products[1].isFavorite = true;

    const state: TProductsState = {
      products,
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: [makeFakeProduct(), makeFakeProduct(), makeFakeProduct()],
    };

    const action = clearAllFavoritesAction.fulfilled(
      undefined,
      'request-id',
      undefined,
    );

    expect(productsSlice.reducer(state, action)).toEqual({
      products: [
        { ...products[0], isFavorite: false },
        { ...products[1], isFavorite: false },
      ],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: state.randomPack,
    });
  });

  it('handles resetFavorites', () => {
    const products = [makeFakeProduct(), makeFakeProduct()];

    products[0].isFavorite = true;
    products[1].isFavorite = true;

    const state: TProductsState = {
      products,
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: [makeFakeProduct(), makeFakeProduct(), makeFakeProduct()],
    };

    expect(productsSlice.reducer(state, resetFavorites())).toEqual({
      products: [
        { ...products[0], isFavorite: false },
        { ...products[1], isFavorite: false },
      ],
      productsLoadingStatus: LoadingStatus.Loaded,
      randomPack: state.randomPack,
    });
  });
});
