import { RouterProvider } from 'react-router-dom';
import { AuthorizationStatus } from '../../const/infrastructure';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import { useEffect } from 'react';
import { fetchFavoritesAction, fetchProductsAction } from '../../store/api-actions';
import { getIsProductsLoaded } from '../../store/slices/products/products.selectors';
import { router } from './router';



const App = () => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isProductsLoaded = useAppSelector(getIsProductsLoaded);
  useEffect(() => {
    if (authorizationStatus !== AuthorizationStatus.Unknown && !isProductsLoaded) {
      dispatch(fetchProductsAction());
    }
  }, [authorizationStatus, dispatch, isProductsLoaded]);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoritesAction());
    }
  }, [authorizationStatus, dispatch]);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <p>Loading...</p>;
  }

  return <RouterProvider router={router} />;
};

export default App;
