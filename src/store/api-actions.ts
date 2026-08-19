import { APIRoute } from "../const/infrastructure";
import { dropToken, saveToken } from "../services/token";
import {
  type ProductExtended,
  type Product,
  type CategoryWithTypes,
  type Review,
  type ReviewPosting,
} from "../types/product";
import type {
  AuthData,
  RegistrationData,
  RegistrationPayload,
  RegistrationResult,
  UploadAvatarData,
  UserData,
} from "../types/user";
import { createAppAsyncThunk } from "./create-app-async-thunk";

export const fetchProductsAction = createAppAsyncThunk<Product[]>(
  "products/fetchAll",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Product[]>(APIRoute.Products);
    return data;
  },
);

export const fetchProductAction = createAppAsyncThunk<ProductExtended>(
  "products/fetchSpecific",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ProductExtended>(
      `${APIRoute.Products}/${id}`,
    );
    return data;
  },
);

export const fetchCategoriesWithTypesAction = createAppAsyncThunk<
  CategoryWithTypes[]
>("data/fetchCategoriesWithTypes", async (_arg, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<CategoryWithTypes[]>(APIRoute.Categories);
  return data;
});

export const fetchFavoritesAction = createAppAsyncThunk<ProductExtended[]>(
  "favorites/fetchAll",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ProductExtended[]>(APIRoute.Favorites);
    return data;
  },
);

export const setIsFavoriteAction = createAppAsyncThunk<ProductExtended>(
  "favorites/addToFavorites",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.put<ProductExtended>(
      `${APIRoute.Favorites}/${id}`,
    );
    return data;
  },
);

export const removeFromFavoritesAction = createAppAsyncThunk<ProductExtended>(
  "favorites/removeFromFavorites",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.delete<ProductExtended>(
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

    const favorites = state.FAVORITES.favorites;

    await Promise.all(
      favorites.map((product) =>
        api.delete(`${APIRoute.Favorites}/${product.id}`),
      ),
    );
  },
);

export const fetchReviewsAction = createAppAsyncThunk<Review[]>(
  "reviews/fetchAll",
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Review[]>(`${APIRoute.Reviews}/${id}`);
    return data;
  },
);

export const postReviewAction = createAppAsyncThunk<Review, ReviewPosting>(
  "reviews/postReview",
  async ({ id, positive, negative, rating }, { extra }) => {
    const { api } = extra;

    const { data } = await api.post<Review>(`${APIRoute.Reviews}/${id}`, {
      positive,
      negative,
      rating,
    });
    return data;
  },
);

export const fetchLastReviewAction = createAppAsyncThunk<Review>(
  "reviews/fetchLast",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Review>(APIRoute.LastReview);
    return data;
  },
);

export const registerUserAction = createAppAsyncThunk<
  RegistrationResult,
  RegistrationPayload
>("user/register", async ({ name, email, password, avatar }, { extra }) => {
  const { api } = extra;

  const { data: userData } = await api.post<UserData>(APIRoute.Registration, {
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

    const { data: updatedUserData } = await api.post<UserData>(
      APIRoute.UploadAvatar,
      formData,
      {
        headers: {
          "X-Token": userData.token,
        },
      },
    );

    return { user: updatedUserData, isAvatarLoadingError: false };
  } catch {
    return { user: userData, isAvatarLoadingError: true };
  }
});

export const uploadAvatarAction = createAppAsyncThunk<
  UserData,
  UploadAvatarData
>("user/uploadAvatar", async ({ avatar, token }, { extra }) => {
  const { api } = extra;

  const formData = new FormData();
  formData.append("avatar", avatar);

  const { data } = await api.post<UserData>(APIRoute.UploadAvatar, formData, {
    headers: {
      "X-Token": token,
    },
  });

  return data;
});

export const checkAuthAction = createAppAsyncThunk<UserData>(
  "user/checkAuth",
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<UserData>(APIRoute.Login);
    return data;
  },
);

export const authorizeUserAction = createAppAsyncThunk<UserData, AuthData>(
  "user/authorize",
  async ({ email, password }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<UserData>(APIRoute.Login, {
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
    dispatch(clearFavorites());
    dropToken();
  },
);
