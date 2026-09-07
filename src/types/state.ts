import type { AxiosInstance } from "axios";
import type { store } from "../store";
import type {
  TCategoryWithTypes,
  TProduct,
  TProductCategory,
  TProductExtended,
  TProductType,
  TReview,
} from "./product";
import type { TUserInfo } from "./user";
import type {
  TAuthorizationStatus,
  TRegistrationStatus,
} from "./infrastructure";
import type { TReviewsFilter, TReviewsSortOrder } from "./business";

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
  isProductsLoaded: boolean;
  isProductsLoadingError: boolean;
  randomPack: [TProduct, TProduct, TProduct] | null;
};

export type TProductState = {
  product: null | TProductExtended;
  isProductLoading: boolean;
  isProductLoadingError: boolean;
  isProductNotFound: boolean;
};

export type TUserState = {
  authorizationStatus: TAuthorizationStatus;
  registrationStatus: TRegistrationStatus;
  userInfo: null | TUserInfo;
  isAvatarLoadingError: boolean;
};

export type TFavoritesState = {
  favorites: TProductExtended[];
  isFavoritesLoadingError: boolean;
};

export type TReviewsState = {
  reviews: TReview[];
  isReviewsLoading: boolean;
  isReviewsLoadingError: boolean;
  lastReview: null | TReview;
  currentReviewsFilter: TReviewsFilter;
  currentReviewsSortOrder: TReviewsSortOrder;
};

export type TFilterState = {
  filters: TCategoryWithTypes[];
  currentCategory: TProductCategory | null;
  currentTypes: TProductType[];
  isFiltersLoadingError: boolean;
  isFiltersLoading: boolean;
};
