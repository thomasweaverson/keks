import { NameSpace } from "../../../const/infrastructure";
import type { TState } from "../../../types/state";

export const getLastReview = (
  state: Pick<TState, typeof NameSpace.Reviews>
) => state[NameSpace.Reviews].lastReview;
