import type { AxiosInstance } from "axios";
import type { store } from "../store";
import type { TCategory, TCategoryWithTypes, TProduct, TProductExtended, TReview, TType } from "./product";
import type { TUserData } from "./user";
import type { TAuthStatus, TRegistrationStatus } from "./infrastructure";

export type TState = ReturnType<typeof store.getState>;

export type TAppDispatch = typeof store.dispatch;

export type TCustomServerError = {
  status: number;
  message: string;
};

export type TAppExtra = {
  api: AxiosInstance;
};

export type TAppThunkConfig = {
  dispatch: TAppDispatch;
  state: TState;
  extra: TAppExtra;
  rejectValue: TCustomServerError;
};

export type TProductsState = {
  products: TProduct[];
  isProductsLoading: boolean;
  isProductsLoadingError: boolean;
};

export type TProductState = {
  product: null | TProductExtended;
  isProductLoading: boolean;
  isProductLoadingError: boolean;
}

export type TUserState = {
  authorizationStatus: TAuthStatus;
  registrationStatus: TRegistrationStatus;
  userInfo: null | TUserData;
  isAvatarLoadingError: boolean;
};

export type TFavoritesState = {
  favorites: TProductExtended[];
  isFavoritesLoading: boolean;
};

export type TReviewsState = {
  reviews: TReview[];
  isReviewsLoading: boolean;
  isReviewsLoadingError: boolean;
  lastReview: null | TReview;
};

export type TFilterState = {
  filters: TCategoryWithTypes[];
  currentCategory: TCategory | null;
  currentTypes: TType[];
  isFiltersLoadingError: boolean;
}
