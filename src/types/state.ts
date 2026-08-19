import type { AxiosInstance } from "axios";
import type { store } from "../store";

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type CustomServerError = {
  status: number;
  message: string;
};

export type AppExtra = {
  api: AxiosInstance;
};

export type AppThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: AppExtra;
  rejectValue: CustomServerError;
};
