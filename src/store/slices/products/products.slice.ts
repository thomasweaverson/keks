import { createSlice } from '@reduxjs/toolkit';
import type { TProductsState } from '../../../types/state';
import { LoadingStatus, NameSpace } from '../../../const/infrastructure';
import {
  clearAllFavoritesAction,
  fetchProductsAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from '../../api-actions';
import { resetFavorites } from '../favorites/favorites.slice';
import { getRandomThree } from '../../../pages/main-page/utils';

const initialState: TProductsState = {
  products: [],
  productsLoadingStatus: LoadingStatus.Idle,
  randomPack: null,
};

export const productsSlice = createSlice({
  name: NameSpace.Products,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProductsAction.pending, (state) => {
        state.productsLoadingStatus = LoadingStatus.Loading;
      })
      .addCase(fetchProductsAction.fulfilled, (state, action) => {
        state.products = action.payload;
        state.productsLoadingStatus = LoadingStatus.Loaded;

        state.randomPack = getRandomThree(action.payload);
      })
      .addCase(fetchProductsAction.rejected, (state) => {
        state.products = [];
        state.productsLoadingStatus = LoadingStatus.Failed;
      })
      .addCase(setIsFavoriteAction.fulfilled, (state, action) => {
        const newFavoriteProduct = action.payload;

        const productIndex = state.products.findIndex(
          (product) => product.id === newFavoriteProduct.id,
        );

        if (productIndex !== -1) {
          state.products[productIndex].isFavorite = true;
        }

        if (state.randomPack !== null) {
          const randomPackIndex = state.randomPack.findIndex(
            (product) => product.id === newFavoriteProduct.id,
          );

          if (randomPackIndex !== -1) {
            state.randomPack[randomPackIndex].isFavorite = true;
          }
        }
      })
      .addCase(removeFromFavoritesAction.fulfilled, (state, action) => {
        const notFavoriteProduct = action.payload;

        const productIndex = state.products.findIndex(
          (product) => product.id === notFavoriteProduct.id,
        );

        if (productIndex !== -1) {
          state.products[productIndex].isFavorite = false;
        }

        if (state.randomPack !== null) {
          const randomPackIndex = state.randomPack.findIndex(
            (product) => product.id === notFavoriteProduct.id,
          );

          if (randomPackIndex !== -1) {
            state.randomPack[randomPackIndex].isFavorite = false;
          }
        }
      })
      .addCase(clearAllFavoritesAction.fulfilled, (state) => {
        state.products.forEach((product) => {
          product.isFavorite = false;
        });
      })
      .addCase(resetFavorites, (state) => {
        state.products.forEach((product) => {
          product.isFavorite = false;
        });
      });
  },
});
