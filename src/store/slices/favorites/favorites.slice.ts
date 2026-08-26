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
  isFavoritesLoading: false,
};

export const favoritesSlice = createSlice({
  name: NameSpace.Favorites,
  initialState,
  reducers: {
    resetFavorites: (state) => {
      state.favorites = [];
      state.isFavoritesLoading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFavoritesAction.pending, (state) => {
        state.isFavoritesLoading = true;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.isFavoritesLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.isFavoritesLoading = false;
        state.favorites = [];
      })
      .addCase(setIsFavoriteAction.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
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
