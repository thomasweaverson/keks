import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../../const/infrastructure';
import type { TState } from '../../../types/state';
import {
  getCurrentCategory,
  getSelectedTypes,
} from '../filter/filter.selectors';

export const getProductsLoadingStatus = (
  state: Pick<TState, typeof NameSpace.Products>,
) => state[NameSpace.Products].productsLoadingStatus;

export const getProducts = (state: Pick<TState, typeof NameSpace.Products>) =>
  state[NameSpace.Products].products;

export const getRandomPack = (state: Pick<TState, typeof NameSpace.Products>) =>
  state[NameSpace.Products].randomPack;

export const getFilteredProducts = createSelector(
  [getProducts, getCurrentCategory, getSelectedTypes],
  (products, currentCategory, currentTypes) => {
    if (!currentCategory) {
      return products;
    }

    return products.filter((product) => {
      if (product.category !== currentCategory) {
        return false;
      }

      if (currentTypes.length === 0) {
        return true;
      }

      return currentTypes.includes(product.type);
    });
  },
);
