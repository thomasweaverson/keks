import { useNavigate, type Location } from "react-router-dom";
import { useAppDispatch, useAppSelector } from ".";
import type { TProduct } from "../types/product";
import { getAuthorizationStatus } from "../store/slices/user/user.selectors";
import { useState } from "react";
import { AppRoute, AuthorizationStatus } from "../const/infrastructure";
import { removeFromFavoritesAction, setIsFavoriteAction } from "../store/api-actions";

const useFavorite = (
  productId: TProduct["id"],
  isFavorite: boolean,
  location: Location
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const [isPending, setIsPending] = useState(false);

  const toggleFavorite = async () => {
    if (isPending) {
      return;
    }

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login, {
        state: {from: location}
      });
      return;
    }

    setIsPending(true);

    try {
      await dispatch(
        isFavorite
          ? removeFromFavoritesAction(productId)
          : setIsFavoriteAction(productId),
      ).unwrap();
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    toggleFavorite,
  };
};

export default useFavorite;
