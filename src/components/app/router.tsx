import { createBrowserRouter } from "react-router-dom";
import { AppRoute } from "../../const/infrastructure";
import Layout from "../layout/layout";
import ProtectedRoute from "../protected-route/protected-route";
import type { TRouteHandle } from "../../types/infrastructure";
import ErrorPage from "../../pages/error-page/error-page";
import LoginPage from "../../pages/login-page/login-page";
import RegistrationPage from "../../pages/registration-page/registration-page";

export const router = createBrowserRouter([
  {
    element: <Layout />,

    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <p>Main Page</p>,
          },
          {
            path: AppRoute.Catalog,
            element: <p>Catalog Page</p>,
          },
          {
            path: AppRoute.Product, // 'product/:id'
            element: <p>Product Page</p>,
          },
          {
            path: AppRoute.Favorites,
            element: (
              <ProtectedRoute>
                <p>Favorites Page</p>
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
            path: "*",
            element: <p>404 Page</p>,
            handle: { hideFooter: true } satisfies TRouteHandle,
          },
        ],
      },
    ],
  },
]);
