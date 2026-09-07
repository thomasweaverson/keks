import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import {
  getIsProductLoading,
  getIsProductLoadingError,
  getIsProductNotFound,
  getProduct,
} from "../../store/slices/product/product.selectors";
import { useEffect, useState } from "react";

import { AuthorizationStatus } from "../../const/infrastructure";
import LoaderScreen from "../loading-screen/loading-screen";
import { Helmet } from "react-helmet-async";
import { getAuthorizationStatus } from "../../store/slices/user/user.selectors";
import BackLink from "../../components/back-link/back-link";
import Details from "./details/details";
import ReviewForm from "./review-form/review-form";

import { ScrollToTop } from "../../components/scroll-to-top/scroll-to-top";
import { getIsFavoritesLoadingError } from "../../store/slices/favorites/favorites.selectors";
import ErrorPage from "../error-page/error-page";
import ProductReviews from "./product-reviews/product-reviews";
import ProductPageTitle from "./product-page-title/product-page-title";
import NotFoundPage from "../not-found-page/not-found-page";
import useProductData from "../../hooks/use-product-data";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const [isReviewFormShowing, setIsReviewFormShowing] = useState(false);

  const product = useAppSelector(getProduct);
  const isProductLoading = useAppSelector(getIsProductLoading);
  const isProductLoadingError = useAppSelector(getIsProductLoadingError);
  const isFavoritesLoadingError = useAppSelector(getIsFavoritesLoadingError);
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;
  const isProductNotFound = useAppSelector(getIsProductNotFound);

  useProductData(id);

  useEffect(() => {
    if (!isAuthorized) {
      setIsReviewFormShowing(false);
    }
  }, [isAuthorized]);

  if (isProductNotFound) {
    return <NotFoundPage />;
  }

  if (isProductLoadingError || isFavoritesLoadingError) {
    return <ErrorPage />;
  }

  if (isProductLoading || product === null) {
    return <LoaderScreen />;
  }

  return (
    <>
      <Helmet>
        <title>Кондитерская Кекс - Карточка товара</title>
      </Helmet>

      <ScrollToTop />

      <ProductPageTitle />

      <BackLink />

      <Details
        product={product}
        onShowReviewFormClick={setIsReviewFormShowing}
        isReviewFormOpen={isReviewFormShowing}
      />

      {isReviewFormShowing && isAuthorized && id && (
        <ReviewForm productId={id} />
      )}

      <ProductReviews />
    </>
  );
};

export default ProductPage;
