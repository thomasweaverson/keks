import { createSlice } from "@reduxjs/toolkit";
import type { TFavoritesState } from "../../../types/state";
import { NameSpace } from "../../../const/infrastructure";
import {
  clearAllFavoritesAction,
  fetchFavoritesAction,
  removeFromFavoritesAction,
  setIsFavoriteAction,
} from "../../api-actions";

const initialState: TFavoritesState = {
  favorites: [],
  isFavoritesLoadingError: false,
};

export const favoritesSlice = createSlice({
  name: NameSpace.Favorites,
  initialState,
  reducers: {
    resetFavorites: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFavoritesAction.pending, (state) => {
        state.isFavoritesLoadingError = false;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.isFavoritesLoadingError = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.isFavoritesLoadingError = true;
      })
      .addCase(setIsFavoriteAction.fulfilled, (state, action) => {
        const isAlreadyFavorite = state.favorites.some(
          (product) => product.id === action.payload.id,
        );

        if (!isAlreadyFavorite) {
          state.favorites.push(action.payload);
        }
      })
      .addCase(removeFromFavoritesAction.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (product) => product.id !== action.payload.id,
        );
      })
      .addCase(clearAllFavoritesAction.fulfilled, (state) => {
        state.favorites = [];
      });
  },
});

export const { resetFavorites } = favoritesSlice.actions;
