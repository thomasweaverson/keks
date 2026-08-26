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

const initialState: TProductsState = {
  products: [],
  isProductsLoading: true,
  isProductsLoadingError: false,
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
      })
      .addCase(fetchProductsAction.rejected, (state) => {
        state.products = [];
        state.isProductsLoading = false;
        state.isProductsLoadingError = true;
      })
      .addCase(setIsFavoriteAction.fulfilled, (state, action) => {
        const newFavoriteProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product.id === newFavoriteProduct.id,
        );
        if (index !== -1) {
          state.products[index].isFavorite = true;
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
