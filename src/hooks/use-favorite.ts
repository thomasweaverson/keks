import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '.';
import { AppRoute, AuthorizationStatus } from '../const/infrastructure';
import { removeFromFavoritesAction, setIsFavoriteAction } from '../store/api-actions';
import { getAuthorizationStatus } from '../store/slices/user/user.selectors';
import type { TProduct } from '../types/product';
import { getLocationState } from '../utils/common';

const useFavorite = (
  productId: TProduct['id'],
  isFavorite: boolean,
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const [isPending, setIsPending] = useState(false);

  const toggleFavorite = async () => {
    if (isPending) {
      return;
    }

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      void navigate(AppRoute.Login, {
        state: { from: getLocationState(location) },
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
