import { createBrowserRouter } from "react-router-dom";
import { AppRoute } from "../../const/infrastructure";
import Layout from "../layout/layout";
import ProtectedRoute from "../protected-route/protected-route";
import type { TRouteHandle } from "../../types/infrastructure";
import ErrorPage from "../../pages/error-page/error-page";
import LoginPage from "../../pages/login-page/login-page";
import RegistrationPage from "../../pages/registration-page/registration-page";
import NotFoundPage from "../../pages/not-found-page/not-found-page";
import MainPage from "../../pages/main-page/main-page";
import FavoritesPage from "../../pages/favorites-page/favorites-page";
import CatalogPage from "../../pages/catalog-page/catalog-page";
import ProductPage from "../../pages/product-page/product-page";

export const router = createBrowserRouter([
  {
    element: <Layout />,

    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: AppRoute.Catalog,
            element: <CatalogPage />,
          },
          {
            path: `${AppRoute.Product}/:id`,
            element: <ProductPage />,
          },
          {
            path: AppRoute.Favorites,
            element: (
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: AppRoute.Login,
            element: (
              <ProtectedRoute guestOnly>
                <LoginPage />
              </ProtectedRoute>
            ),
            handle: {
              hideHeader: true,
              hideFooter: true,
            } satisfies TRouteHandle,
          },
          {
            path: AppRoute.Registration,
            element: (
              <ProtectedRoute guestOnly>
                <RegistrationPage />
              </ProtectedRoute>
            ),
            handle: {
              hideHeader: true,
              hideFooter: true,
            } satisfies TRouteHandle,
          },
          {
            path: AppRoute.NotFound,
            element: <NotFoundPage />,
            handle: { hideFooter: true } satisfies TRouteHandle,
          },
          {
            path: "*",
            element: <NotFoundPage />,
            handle: { hideFooter: true } satisfies TRouteHandle,
          },
        ],
      },
    ],
  },
]);
