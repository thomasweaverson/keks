import { createSlice } from "@reduxjs/toolkit";
import type { TProductsState } from "../../../types/state";
import { NameSpace } from "../../../const/infrastructure";
import {
  clearAllFavoritesAction,
  fetchProductsAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from "../../api-actions";
import { resetFavorites } from "../favorites/favorites.slice";
import { getRandomThree } from "../../../pages/main-page/utils";

const initialState: TProductsState = {
  products: [],
  isProductsLoading: true,
  isProductsLoadingError: false,
  isProductsLoaded: false,
  randomPack: null,
};

export const productsSlice = createSlice({
  name: NameSpace.Products,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProductsAction.pending, (state) => {
        state.isProductsLoading = true;
        state.isProductsLoadingError = false;
      })
      .addCase(fetchProductsAction.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isProductsLoading = false;
        state.isProductsLoadingError = false;
        state.isProductsLoaded = true;

        state.randomPack = getRandomThree(action.payload);
      })
      .addCase(fetchProductsAction.rejected, (state) => {
        state.products = [];
        state.isProductsLoading = false;
        state.isProductsLoadingError = true;
        state.isProductsLoaded = false;
      })
      .addCase(setIsFavoriteAction.fulfilled, (state, action) => {
        const newFavoriteProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product.id === newFavoriteProduct.id,
        );
        if (index !== -1) {
          state.products[index].isFavorite = true;
        }

        if (state.randomPack !== null) {
          const index = state.randomPack.findIndex(
            (product) => product.id === newFavoriteProduct.id,
          );
          if (index !== -1) {
            state.randomPack[index].isFavorite = true;
          }
        }
      })
      .addCase(removeFromFavoritesAction.fulfilled, (state, action) => {
        const notFavoriteProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product.id === notFavoriteProduct.id,
        );
        if (index !== -1) {
          state.products[index].isFavorite = false;
        }

        if (state.randomPack !== null) {
          const index = state.randomPack.findIndex(
            (product) => product.id === notFavoriteProduct.id,
          );
          if (index !== -1) {
            state.randomPack[index].isFavorite = false;
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
