import { APIRoute } from "../const/infrastructure";
import { dropToken, saveToken } from "../services/token";
import {
  type TProductExtended,
  type TProduct,
  type TCategoryWithTypes,
  type TReview,
  type TReviewPosting,
} from "../types/product";
import type {
  TAuthData,
  TRegistrationPayload,
  TRegistrationResult,
  TUserInfo,
} from "../types/user";
import { createAppAsyncThunk } from "./create-app-async-thunk";
import { resetFavorites } from "./slices/favorites/favorites.slice";

export const fetchProductsAction = createAppAsyncThunk<TProduct[]>(
  "products/fetchAll",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<TProduct[]>(APIRoute.Products);
    return data;
  },
);

export const fetchProductAction = createAppAsyncThunk<TProductExtended>(
  "products/fetchSpecific",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<TProductExtended>(
      `${APIRoute.Products}/${id}`,
    );
    return data;
  },
);

export const fetchCategoriesWithTypesAction = createAppAsyncThunk<
  TCategoryWithTypes[]
>("data/fetchCategoriesWithTypes", async (_arg, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<TCategoryWithTypes[]>(APIRoute.Categories);
  return data;
});

export const fetchFavoritesAction = createAppAsyncThunk<TProductExtended[]>(
  "favorites/fetchAll",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<TProductExtended[]>(APIRoute.Favorites);
    return data;
  },
);

export const setIsFavoriteAction = createAppAsyncThunk<TProductExtended, string>(
  "favorites/addToFavorites",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.put<TProductExtended>(
      `${APIRoute.Favorites}/${id}`,
    );
    return data;
  },
);

export const removeFromFavoritesAction = createAppAsyncThunk<TProductExtended, string>(
  "favorites/removeFromFavorites",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.delete<TProductExtended>(
      `${APIRoute.Favorites}/${id}`,
    );
    return data;
  },
);

export const clearAllFavoritesAction = createAppAsyncThunk<void>(
  "favorites/clearAll",
  async (_arg, { getState, extra }) => {
    const { api } = extra;
    const state = getState();

    const favorites = state.Favorites.favorites;

    await Promise.all(
      favorites.map((product) =>
        api.delete(`${APIRoute.Favorites}/${product.id}`),
      ),
    );
  },
);

export const fetchReviewsAction = createAppAsyncThunk<TReview[]>(
  "reviews/fetchAll",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<TReview[]>(`${APIRoute.Reviews}/${id}`);
    return data;
  },
);

export const postReviewAction = createAppAsyncThunk<TReview, TReviewPosting>(
  "reviews/postReview",
  async ({ id, positive, negative, rating }, { extra }) => {
    const { api } = extra;

    const { data } = await api.post<TReview>(`${APIRoute.Reviews}/${id}`, {
      positive,
      negative,
      rating,
    });
    return data;
  },
);

export const fetchLastReviewAction = createAppAsyncThunk<TReview>(
  "reviews/fetchLast",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<TReview>(APIRoute.LastReview);
    return data;
  },
);

export const registerUserAction = createAppAsyncThunk<
  TRegistrationResult,
  TRegistrationPayload
>("user/register", async ({ name, email, password, avatar }, { extra }) => {
  const { api } = extra;

  const { data: userData } = await api.post<TUserInfo>(APIRoute.Registration, {
    name,
    email,
    password,
  });

  if (!avatar) {
    return { user: userData, isAvatarLoadingError: false };
  }
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const { data: updatedUserData } = await api.post<TUserInfo>(
      APIRoute.UploadAvatar,
      formData,
      {
        headers: {
          "X-Token": userData.token,
        },
        skipToast: true,
      },
    );

    return { user: updatedUserData, isAvatarLoadingError: false };
  } catch {
    return { user: userData, isAvatarLoadingError: true };
  }
});

export const checkAuthAction = createAppAsyncThunk<TUserInfo>(
  "user/checkAuth",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<TUserInfo>(APIRoute.Login, {
      skipToast: true,
    });
    return data;
  },
);

export const authorizeUserAction = createAppAsyncThunk<TUserInfo, TAuthData>(
  "user/authorize",
  async ({ email, password }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<TUserInfo>(APIRoute.Login, {
      email,
      password,
    });
    saveToken(data.token);
    return data;
  },
);

export const logoutAction = createAppAsyncThunk<void>(
  "user/logout",
  async (_arg, { dispatch, extra }) => {
    const { api } = extra;
    await api.delete(APIRoute.Logout);
    dispatch(resetFavorites());
    dropToken();
  },
);
