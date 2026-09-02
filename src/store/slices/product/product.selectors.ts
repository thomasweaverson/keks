import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";

export const getProduct = (state: Pick<TState, typeof NameSpace.Product>) =>
  state[NameSpace.Product].product;

export const getIsProductLoading = (
  state: Pick<TState, typeof NameSpace.Product>,
) => state[NameSpace.Product].isProductLoading;

export const getIsProductLoadingError = (
  state: Pick<TState, typeof NameSpace.Product>,
) => state[NameSpace.Product].isProductLoadingError;
