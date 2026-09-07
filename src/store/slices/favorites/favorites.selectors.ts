import { createSelector } from "@reduxjs/toolkit";
import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";

export const getFavorites = (state: Pick<TState, typeof NameSpace.Favorites>) =>
  state[NameSpace.Favorites].favorites;

export const getFavoritesCount = (
  state: Pick<TState, typeof NameSpace.Favorites>,
) => state[NameSpace.Favorites].favorites.length;

export const getFavoritesTotalPrice = createSelector(
  [getFavorites],
  (favorites) => favorites.reduce((total, product) => total + product.price, 0),
);

export const getIsFavoritesLoadingError = (state: Pick<TState, typeof NameSpace.Favorites>) =>
  state[NameSpace.Favorites].isFavoritesLoadingError;
