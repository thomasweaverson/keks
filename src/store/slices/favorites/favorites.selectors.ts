import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";

export const getFavoritesCount = (
  state: Pick<TState, typeof NameSpace.Favorites>,
) => state[NameSpace.Favorites].favorites.length;
