import { NameSpace } from '../../../const/infrastructure';
import type { TState } from '../../../types/state';

export const getProduct = (state: Pick<TState, typeof NameSpace.Product>) =>
  state[NameSpace.Product].product;

export const getProductLoadingStatus = (
  state: Pick<TState, typeof NameSpace.Product>,
) => state[NameSpace.Product].productLoadingStatus;

export const getIsProductNotFound = (
  state: Pick<TState, typeof NameSpace.Product>,
) => state[NameSpace.Product].isProductNotFound;
