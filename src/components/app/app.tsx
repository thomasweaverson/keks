import { RouterProvider } from "react-router-dom";
import { AuthorizationStatus } from "../../const/infrastructure";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getAuthorizationStatus } from "../../store/slices/user/user.selectors";
import { useEffect } from "react";
import {
  fetchFavoritesAction,
  fetchFiltersAction,
  fetchLastReviewAction,
  fetchProductsAction,
} from "../../store/api-actions";
import { getIsProductsLoaded } from "../../store/slices/products/products.selectors";
import { router } from "./router";
import { getLastReview } from "../../store/slices/reviews/reviews.selectors";
import { getFilters } from "../../store/slices/filter/filter.selectors";

const App = () => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isProductsLoaded = useAppSelector(getIsProductsLoaded);
  const lastReview = useAppSelector(getLastReview);
  const filters = useAppSelector(getFilters);

  useEffect(() => {
    if (
      authorizationStatus !== AuthorizationStatus.Unknown &&
      !isProductsLoaded
    ) {
      dispatch(fetchProductsAction());
    }
  }, [authorizationStatus, dispatch, isProductsLoaded]);

  useEffect(() => {
    if (!lastReview) {
      dispatch(fetchLastReviewAction());
    }
  }, []);

  useEffect(() => {
    if (filters.length === 0) {
      dispatch(fetchFiltersAction());
    }
  }, []);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoritesAction());
    }
  }, [authorizationStatus, dispatch]);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    //! НЕ ЗАБЫТЬ
    return <p>Loading...</p>;
  }

  return <RouterProvider router={router} />;
};

export default App;
