import { useEffect } from 'react';
import {
  fetchFavoritesAction,
  fetchFiltersAction,
  fetchLastReviewAction,
  fetchProductsAction,
} from '../store/api-actions';
import { AuthorizationStatus, LoadingStatus } from '../const/infrastructure';
import { useAppDispatch, useAppSelector } from '.';
import { getAuthorizationStatus } from '../store/slices/user/user.selectors';
import { getProductLoadingStatus } from '../store/slices/product/product.selectors';
import { getLastReviewLoadingStatus } from '../store/slices/reviews/reviews.selectors';
import { getFiltersLoadingStatus } from '../store/slices/filter/filter.selectors';

const useAppInitialization = () => {
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const productsLoadingStatus = useAppSelector(getProductLoadingStatus);
  const lastReviewLoadingStatus = useAppSelector(getLastReviewLoadingStatus);
  const filtersLoadingStatus = useAppSelector(getFiltersLoadingStatus);

  useEffect(() => {
    if (
      authorizationStatus !== AuthorizationStatus.Unknown &&
      productsLoadingStatus === LoadingStatus.Idle
    ) {
      void dispatch(fetchProductsAction());
    }
  }, [authorizationStatus, dispatch, productsLoadingStatus]);

  useEffect(() => {
    if (lastReviewLoadingStatus === LoadingStatus.Idle) {
      void dispatch(fetchLastReviewAction());
    }
  }, [dispatch, lastReviewLoadingStatus]);

  useEffect(() => {
    if (filtersLoadingStatus === LoadingStatus.Idle) {
      void dispatch(fetchFiltersAction());
    }
  }, [dispatch, filtersLoadingStatus]);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      void dispatch(fetchFavoritesAction());
    }
  }, [authorizationStatus, dispatch]);
};

export default useAppInitialization;
