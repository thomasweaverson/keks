import { createSlice } from "@reduxjs/toolkit";
import type { TProductState } from "../../../types/state";
import { NameSpace } from "../../../const/infrastructure";
import {
  clearAllFavoritesAction,
  fetchProductAction,
  postReviewAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from "../../api-actions";
import { resetFavorites } from "../favorites/favorites.slice";

const initialState: TProductState = {
  product: null,
  isProductLoading: false,
  isProductLoadingError: false,
};

export const productSlice = createSlice({
  name: NameSpace.Product,
  initialState,
  reducers: {
    resetProduct: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProductAction.pending, (state) => {
        state.isProductLoadingError = false;
        state.isProductLoading = true;
      })
      .addCase(fetchProductAction.fulfilled, (state, action) => {
        state.isProductLoadingError = false;
        state.isProductLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductAction.rejected, (state) => {
        console.log('fetchProductAction.rejected')
        state.isProductLoadingError = true;
        state.isProductLoading = false;
        state.product = null;
      })
      .addCase(setIsFavoriteAction.fulfilled, (state, action) => {
        if (state.product && state.product.id === action.payload.id) {
          state.product.isFavorite = true;
        }
      })
      .addCase(removeFromFavoritesAction.fulfilled, (state, action) => {
        if (state.product && state.product.id === action.payload.id) {
          state.product.isFavorite = false;
        }
      })
      .addCase(clearAllFavoritesAction.fulfilled, (state) => {
        if (state.product && state.product.isFavorite) {
          state.product.isFavorite = false;
        }
      })
      .addCase(resetFavorites, (state) => {
        if (state.product?.isFavorite) {
          state.product.isFavorite = false;
        }
      })
      .addCase(postReviewAction.fulfilled, (state) => {
        const prevCountOfReviews = Number(state.product?.reviewCount);
        if (state.product) {
          state.product.reviewCount = prevCountOfReviews + 1;
        }
      });
  },
});

export const { resetProduct } = productSlice.actions;
