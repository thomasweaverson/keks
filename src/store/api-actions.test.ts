import {
  configureStore,
  type Middleware,
  type UnknownAction,
} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { APIRoute, LoadingStatus } from '../const/infrastructure';
import {
  clearAllFavoritesAction,
  fetchFavoritesAction,
  fetchFiltersAction,
  fetchLastReviewAction,
  fetchProductAction,
  fetchProductsAction,
  fetchReviewsAction,
  postReviewAction,
  registerUserAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
  checkAuthAction,
  authorizeUserAction,
  logoutAction,
} from './api-actions';
import { createAPI } from '../services/api';
import * as token from '../services/token';
import { resetFavorites } from './slices/favorites/favorites.slice';

import type { TState } from '../types/state';
import {
  makeFakeCategoryWithTypes,
  makeFakeProduct,
  makeFakeProductExtended,
  makeFakeReview,
  makeFakeReviewPosting,
  makeFakeState,
  makeFakeUserInfo,
} from '../utils/testing/mocks';

const api = createAPI();
const mockAxiosAdapter = new MockAdapter(api);

const isUnknownAction = (value: unknown): value is UnknownAction =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  typeof value.type === 'string';

const createRecorder =
  (actions: UnknownAction[]): Middleware =>
    () =>
      (next) =>
        (action) => {
          if (isUnknownAction(action)) {
            actions.push(action);
          }

          return next(action);
        };

const createTestStore = (initialState: Partial<TState> = {}) => {
  const actions: UnknownAction[] = [];
  const state = makeFakeState(initialState);

  const testStore = configureStore({
    reducer: () => state,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            api,
          },
        },
      }).concat(createRecorder(actions)),
  });

  return {
    testStore,
    actions,
  };
};

describe('API actions', () => {
  beforeEach(() => {
    mockAxiosAdapter.reset();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('fetchProductsAction', () => {
    it('dispatches fulfilled with products', async () => {
      const products = [makeFakeProduct(), makeFakeProduct()];
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onGet(APIRoute.Products).reply(200, products);

      await testStore.dispatch(fetchProductsAction());

      const fulfilledAction = actions.find(fetchProductsAction.fulfilled.match);

      expect(fulfilledAction).toEqual(
        expect.objectContaining({
          type: fetchProductsAction.fulfilled.type,
          payload: products,
        }),
      );
    });

    it('dispatches rejected with server error', async () => {
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter
        .onGet(APIRoute.Products)
        .reply(500, { message: 'Server error' });

      await testStore.dispatch(fetchProductsAction());

      const rejectedAction = actions.find(fetchProductsAction.rejected.match);

      expect(rejectedAction?.payload).toEqual({
        status: 500,
        message: 'Server error',
      });
    });
  });

  describe('fetchProductAction', () => {
    it('requests product by id with skipToast and returns it', async () => {
      const product = makeFakeProductExtended();
      const productId = product.id;
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter
        .onGet(`${APIRoute.Products}/${productId}`)
        .reply(200, product);

      await testStore.dispatch(fetchProductAction(productId));

      const fulfilledAction = actions.find(fetchProductAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual(product);
      expect(mockAxiosAdapter.history.get).toHaveLength(1);
      expect(mockAxiosAdapter.history.get[0].skipToast).toBe(true);
    });

    it('dispatches rejected with server error', async () => {
      const productId = 'product-id';
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter
        .onGet(`${APIRoute.Products}/${productId}`)
        .reply(404, { message: 'Product not found' });

      await testStore.dispatch(fetchProductAction(productId));

      const rejectedAction = actions.find(fetchProductAction.rejected.match);

      expect(rejectedAction?.payload).toEqual({
        status: 404,
        message: 'Product not found',
      });
    });
  });

  describe('fetchFiltersAction', () => {
    it('dispatches fulfilled with filters', async () => {
      const filters = [
        makeFakeCategoryWithTypes(),
        makeFakeCategoryWithTypes('bisque'),
      ];
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onGet(APIRoute.Categories).reply(200, filters);

      await testStore.dispatch(fetchFiltersAction());

      const fulfilledAction = actions.find(fetchFiltersAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual(filters);
    });
  });

  describe('fetchFavoritesAction', () => {
    it('dispatches fulfilled with favorites', async () => {
      const favorites = [makeFakeProductExtended()];
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onGet(APIRoute.Favorites).reply(200, favorites);

      await testStore.dispatch(fetchFavoritesAction());

      const fulfilledAction = actions.find(
        fetchFavoritesAction.fulfilled.match,
      );

      expect(fulfilledAction?.payload).toEqual(favorites);
    });
  });

  describe('setIsFavoriteAction', () => {
    it('adds product to favorites', async () => {
      const product = makeFakeProductExtended();
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter
        .onPut(`${APIRoute.Favorites}/${product.id}`)
        .reply(200, product);

      await testStore.dispatch(setIsFavoriteAction(product.id));

      const fulfilledAction = actions.find(setIsFavoriteAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual(product);
      expect(mockAxiosAdapter.history.put).toHaveLength(1);
    });
  });

  describe('removeFromFavoritesAction', () => {
    it('removes product from favorites', async () => {
      const product = makeFakeProductExtended();
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter
        .onDelete(`${APIRoute.Favorites}/${product.id}`)
        .reply(200, product);

      await testStore.dispatch(removeFromFavoritesAction(product.id));

      const fulfilledAction = actions.find(
        removeFromFavoritesAction.fulfilled.match,
      );

      expect(fulfilledAction?.payload).toEqual(product);
      expect(mockAxiosAdapter.history.delete).toHaveLength(1);
    });
  });

  describe('clearAllFavoritesAction', () => {
    it('removes every favorite product', async () => {
      const firstProduct = makeFakeProductExtended();
      const secondProduct = makeFakeProductExtended();

      const { testStore, actions } = createTestStore({
        Favorites: {
          favorites: [firstProduct, secondProduct],
          favoritesLoadingStatus: LoadingStatus.Idle,
        },
      });

      mockAxiosAdapter
        .onDelete(`${APIRoute.Favorites}/${firstProduct.id}`)
        .reply(200);

      mockAxiosAdapter
        .onDelete(`${APIRoute.Favorites}/${secondProduct.id}`)
        .reply(200);

      await testStore.dispatch(clearAllFavoritesAction());

      expect(mockAxiosAdapter.history.delete).toHaveLength(2);

      expect(mockAxiosAdapter.history.delete[0].url).toBe(
        `${APIRoute.Favorites}/${firstProduct.id}`,
      );
      expect(mockAxiosAdapter.history.delete[1].url).toBe(
        `${APIRoute.Favorites}/${secondProduct.id}`,
      );

      expect(actions.some(clearAllFavoritesAction.fulfilled.match)).toBe(true);
    });
  });

  it('does not send requests when favorites are empty', async () => {
    const { testStore, actions } = createTestStore();

    await testStore.dispatch(clearAllFavoritesAction());

    expect(mockAxiosAdapter.history.delete).toHaveLength(0);
    expect(actions.some(clearAllFavoritesAction.fulfilled.match)).toBe(true);
  });

  describe('fetchReviewsAction', () => {
    it('requests reviews with skipToast and returns them', async () => {
      const reviews = [makeFakeReview()];
      const productId = 'product-id';
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter
        .onGet(`${APIRoute.Reviews}/${productId}`)
        .reply(200, reviews);

      await testStore.dispatch(fetchReviewsAction(productId));

      const fulfilledAction = actions.find(fetchReviewsAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual(reviews);
      expect(mockAxiosAdapter.history.get[0].skipToast).toBe(true);
    });
  });

  describe('postReviewAction', () => {
    it('posts review data without product id', async () => {
      const review = makeFakeReview();
      const reviewPosting = makeFakeReviewPosting({
        id: 'product-id',
        positive: 'Good',
        negative: 'Bad',
        rating: 5,
      });
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter
        .onPost(`${APIRoute.Reviews}/${reviewPosting.id}`)
        .reply(200, review);

      await testStore.dispatch(postReviewAction(reviewPosting));

      const fulfilledAction = actions.find(postReviewAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual(review);
      expect(mockAxiosAdapter.history.post[0].data).toBe(
        JSON.stringify({
          positive: reviewPosting.positive,
          negative: reviewPosting.negative,
          rating: reviewPosting.rating,
        }),
      );
    });
  });

  describe('fetchLastReviewAction', () => {
    it('dispatches fulfilled with the last review', async () => {
      const review = makeFakeReview();
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onGet(APIRoute.LastReview).reply(200, review);

      await testStore.dispatch(fetchLastReviewAction());

      const fulfilledAction = actions.find(
        fetchLastReviewAction.fulfilled.match,
      );

      expect(fulfilledAction?.payload).toEqual(review);
    });
  });

  describe('registerUserAction', () => {
    it('registers user without uploading avatar', async () => {
      const user = makeFakeUserInfo();
      const payload = {
        name: user.name,
        email: user.email,
        password: 'password',
        avatar: undefined,
      };
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onPost(APIRoute.Registration).reply(200, user);

      await testStore.dispatch(registerUserAction(payload));

      const fulfilledAction = actions.find(registerUserAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual({
        user,
        isAvatarLoadingError: false,
      });

      expect(mockAxiosAdapter.history.post).toHaveLength(1);
      expect(mockAxiosAdapter.history.post[0].data).toBe(
        JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
        }),
      );
    });

    it('registers user and uploads avatar successfully', async () => {
      const user = makeFakeUserInfo();
      const updatedUser = makeFakeUserInfo();
      const avatar = new File(['avatar'], 'avatar.jpg', {
        type: 'image/jpeg',
      });

      const payload = {
        name: user.name,
        email: user.email,
        password: 'password',
        avatar,
      };

      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onPost(APIRoute.Registration).reply(200, user);

      mockAxiosAdapter.onPost(APIRoute.UploadAvatar).reply(200, updatedUser);

      await testStore.dispatch(registerUserAction(payload));

      const fulfilledAction = actions.find(registerUserAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual({
        user: updatedUser,
        isAvatarLoadingError: false,
      });

      expect(mockAxiosAdapter.history.post).toHaveLength(2);

      const avatarRequest = mockAxiosAdapter.history.post[1];

      expect(avatarRequest.data).toBeInstanceOf(FormData);
      expect(avatarRequest.headers?.['X-Token']).toBe(user.token);
      expect(avatarRequest.skipToast).toBe(true);
    });

    it('returns registration result with avatar loading error when avatar upload fails', async () => {
      const user = makeFakeUserInfo();
      const avatar = new File(['avatar'], 'avatar.jpg', {
        type: 'image/jpeg',
      });

      const payload = {
        name: user.name,
        email: user.email,
        password: 'password',
        avatar,
      };

      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onPost(APIRoute.Registration).reply(200, user);

      mockAxiosAdapter
        .onPost(APIRoute.UploadAvatar)
        .reply(500, { message: 'Upload failed' });

      await testStore.dispatch(registerUserAction(payload));

      const fulfilledAction = actions.find(registerUserAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual({
        user,
        isAvatarLoadingError: true,
      });
    });
  });

  describe('checkAuthAction', () => {
    it('checks authorization with skipToast', async () => {
      const user = makeFakeUserInfo();
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, user);

      await testStore.dispatch(checkAuthAction());

      const fulfilledAction = actions.find(checkAuthAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual(user);
      expect(mockAxiosAdapter.history.get[0].skipToast).toBe(true);
    });
  });

  describe('authorizeUserAction', () => {
    it('authorizes user and saves token', async () => {
      const user = makeFakeUserInfo();
      const credentials = {
        email: user.email,
        password: 'password',
      };
      const saveTokenSpy = vi.spyOn(token, 'saveToken');
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, user);

      await testStore.dispatch(authorizeUserAction(credentials));

      const fulfilledAction = actions.find(authorizeUserAction.fulfilled.match);

      expect(fulfilledAction?.payload).toEqual(user);
      expect(mockAxiosAdapter.history.post[0].data).toBe(
        JSON.stringify(credentials),
      );
      expect(saveTokenSpy).toHaveBeenCalledOnce();
      expect(saveTokenSpy).toHaveBeenCalledWith(user.token);
    });
  });

  describe('logoutAction', () => {
    it('logs out, removes token and resets favorites', async () => {
      const dropTokenSpy = vi.spyOn(token, 'dropToken');
      const { testStore, actions } = createTestStore();

      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await testStore.dispatch(logoutAction());

      const resetFavoritesIndex = actions.findIndex(resetFavorites.match);
      const fulfilledIndex = actions.findIndex(logoutAction.fulfilled.match);

      expect(dropTokenSpy).toHaveBeenCalledOnce();
      expect(resetFavoritesIndex).toBeGreaterThan(-1);
      expect(fulfilledIndex).toBeGreaterThan(-1);
      expect(resetFavoritesIndex).toBeLessThan(fulfilledIndex);
    });
  });
});
