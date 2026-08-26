import { useEffect, type JSX } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getAuthorizationStatus } from "../../store/slices/user/user.selectors";
import { AppRoute, AuthorizationStatus } from "../../const/infrastructure";
import {
  fetchFavoritesAction,
  fetchProductsAction,
} from "../../store/api-actions";
import { Helmet } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../protected-route/protected-route";

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  useEffect(() => {
    let isMounted = true;

    if (authorizationStatus !== AuthorizationStatus.Unknown) {
      if (isMounted) {
        dispatch(fetchProductsAction());
      }
      if (authorizationStatus === AuthorizationStatus.Auth && isMounted) {
        dispatch(fetchFavoritesAction());
      }
    }

    return () => {
      isMounted = false;
    };
  }, [authorizationStatus, dispatch]);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    // return <Loading />;
    return <p>loading... mock</p>;
  }

  return (
    <>
      <Helmet>
        <title>Keks bakery</title>
      </Helmet>
      <Routes>
        <Route path={AppRoute.Root} element={<Layout />}>
          <Route index element={<Main />} />
          <Route path={AppRoute.Catalog} element={<p>catalog mock</p>} />

          {/* <Route path={`${AppRoute.Product}/:id`} element={<Product />} /> */}
          <Route
            path={`${AppRoute.Product}/:id`}
            element={<p>Product Mock</p>}
          />
          <Route
            path={AppRoute.Favorites}
            element={
              <ProtectedRoute>
                {/* <Favorites /> */}
                <p>favorites mock</p>
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path={AppRoute.Registration}
          element={
            <ProtectedRoute guestOnly>
              {/* <Registration /> */}
              <p>Registration page mock</p>
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoute.Login}
          element={
            <ProtectedRoute guestOnly>
              {/* <Login /> */}
              <p>login page mock</p>
            </ProtectedRoute>
          }
        />
        {/* <Route path={AppRoute.NotFound} element={<NotFound />} />
          <Route path="*" element={<NotFound />} /> */}
        <Route path={AppRoute.NotFound} element={<p>404mock</p>} />
        <Route path="*" element={<p>404mock</p>} />
      </Routes>
    </>
  );
};

export default App;
