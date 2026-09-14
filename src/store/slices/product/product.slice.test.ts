import { describe, expect, it } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { LoadingStatus } from '../../../const/infrastructure';
import {
  clearAllFavoritesAction,
  fetchProductAction,
  postReviewAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from '../../api-actions';
import {
  makeFakeProductExtended,
  makeFakeReview,
  makeFakeReviewPosting,
} from '../../../utils/testing/mocks';
import type { TProductState } from '../../../types/state';
import { productSlice, resetProduct } from './product.slice';
import { resetFavorites } from '../favorites/favorites.slice';

describe('Product slice', () => {
  it('returns initial state without previous state', () => {
    expect(productSlice.reducer(undefined, { type: '@@INIT' })).toEqual({
      product: null,
      productLoadingStatus: LoadingStatus.Idle,
      isProductNotFound: false,
    });
  });

  it('handles resetProduct', () => {
    const product = makeFakeProductExtended({
      isFavorite: true,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: true,
    };

    expect(productSlice.reducer(state, resetProduct())).toEqual({
      product: null,
      productLoadingStatus: LoadingStatus.Idle,
      isProductNotFound: false,
    });
  });

  it('handles fetchProductAction.pending', () => {
    const product = makeFakeProductExtended();

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: true,
    };

    const action = fetchProductAction.pending('request-id', product.id);

    expect(productSlice.reducer(state, action)).toEqual({
      product: null,
      productLoadingStatus: LoadingStatus.Loading,
      isProductNotFound: false,
    });
  });

  it('handles fetchProductAction.fulfilled', () => {
    const product = makeFakeProductExtended();

    const state: TProductState = {
      product: null,
      productLoadingStatus: LoadingStatus.Loading,
      isProductNotFound: false,
    };

    const action = fetchProductAction.fulfilled(
      product,
      'request-id',
      product.id,
    );

    expect(productSlice.reducer(state, action)).toEqual({
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    });
  });

  it('handles fetchProductAction.rejected with not found status', () => {
    const productId = 'product-id';

    const state: TProductState = {
      product: makeFakeProductExtended(),
      productLoadingStatus: LoadingStatus.Loading,
      isProductNotFound: false,
    };

    const action = fetchProductAction.rejected(
      new Error('Product not found'),
      'request-id',
      productId,
      {
        status: StatusCodes.NOT_FOUND,
        message: 'Product not found',
      },
    );

    expect(productSlice.reducer(state, action)).toEqual({
      product: null,
      productLoadingStatus: LoadingStatus.Failed,
      isProductNotFound: true,
    });
  });

  it('handles fetchProductAction.rejected with regular error', () => {
    const product = makeFakeProductExtended();

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loading,
      isProductNotFound: true,
    };

    const action = fetchProductAction.rejected(
      new Error('Request failed'),
      'request-id',
      product.id,
    );

    expect(productSlice.reducer(state, action)).toEqual({
      product: null,
      productLoadingStatus: LoadingStatus.Failed,
      isProductNotFound: false,
    });
  });

  it('sets product as favorite when ids match', () => {
    const product = makeFakeProductExtended({
      isFavorite: false,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    const action = setIsFavoriteAction.fulfilled(
      makeFakeProductExtended({
        id: product.id,
      }),
      'request-id',
      product.id,
    );

    expect(productSlice.reducer(state, action)).toEqual({
      product: {
        ...product,
        isFavorite: true,
      },
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    });
  });

  it('does not change product favorite status when ids do not match', () => {
    const product = makeFakeProductExtended({
      isFavorite: false,
    });

    const otherProduct = makeFakeProductExtended();

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    const action = setIsFavoriteAction.fulfilled(
      otherProduct,
      'request-id',
      otherProduct.id,
    );

    expect(productSlice.reducer(state, action)).toEqual(state);
  });

  it('removes product from favorites when ids match', () => {
    const product = makeFakeProductExtended({
      isFavorite: true,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    const action = removeFromFavoritesAction.fulfilled(
      makeFakeProductExtended({
        id: product.id,
      }),
      'request-id',
      product.id,
    );

    expect(productSlice.reducer(state, action)).toEqual({
      product: {
        ...product,
        isFavorite: false,
      },
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    });
  });

  it('does not change product favorite status when removing a different product', () => {
    const product = makeFakeProductExtended({
      isFavorite: true,
    });

    const otherProduct = makeFakeProductExtended();

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    const action = removeFromFavoritesAction.fulfilled(
      otherProduct,
      'request-id',
      otherProduct.id,
    );

    expect(productSlice.reducer(state, action)).toEqual(state);
  });

  it('removes favorite status when clearAllFavoritesAction is fulfilled', () => {
    const product = makeFakeProductExtended({
      isFavorite: true,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    const action = clearAllFavoritesAction.fulfilled(
      undefined,
      'request-id',
      undefined,
    );

    expect(productSlice.reducer(state, action)).toEqual({
      product: {
        ...product,
        isFavorite: false,
      },
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    });
  });

  it('does not change product when clearAllFavoritesAction is fulfilled and product is not favorite', () => {
    const product = makeFakeProductExtended({
      isFavorite: false,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    const action = clearAllFavoritesAction.fulfilled(
      undefined,
      'request-id',
      undefined,
    );

    expect(productSlice.reducer(state, action)).toEqual(state);
  });

  it('removes favorite status when resetFavorites is dispatched', () => {
    const product = makeFakeProductExtended({
      isFavorite: true,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    expect(productSlice.reducer(state, resetFavorites())).toEqual({
      product: {
        ...product,
        isFavorite: false,
      },
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    });
  });

  it('does not change product when resetFavorites is dispatched and product is not favorite', () => {
    const product = makeFakeProductExtended({
      isFavorite: false,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    expect(productSlice.reducer(state, resetFavorites())).toEqual(state);
  });

  it('increments review count when postReviewAction is fulfilled', () => {
    const product = makeFakeProductExtended({
      reviewCount: 5,
    });

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    const fakeReview = makeFakeReview();
    const fakeReviewPosting = makeFakeReviewPosting({
      positive: fakeReview.positive,
      negative: fakeReview.negative,
      rating: fakeReview.rating,
    });

    const action = postReviewAction.fulfilled(
      fakeReview,
      'request-id',
      fakeReviewPosting,
    );

    expect(productSlice.reducer(state, action)).toEqual({
      product: {
        ...product,
        reviewCount: 6,
      },
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    });
  });
});
