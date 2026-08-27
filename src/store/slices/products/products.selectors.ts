import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";

export const getIsProductsLoaded = (
  state: Pick<TState, typeof NameSpace.Products>,
) => state[NameSpace.Products].isProductsLoaded;
