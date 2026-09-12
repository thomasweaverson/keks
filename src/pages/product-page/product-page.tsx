import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import {
  getIsProductNotFound,
  getProduct,
  getProductLoadingStatus,
} from '../../store/slices/product/product.selectors';
import { useState } from 'react';

import { AuthorizationStatus, LoadingStatus } from '../../const/infrastructure';
import LoaderScreen from '../loading-screen/loading-screen';
import { Helmet } from 'react-helmet-async';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import BackLink from '../../components/back-link/back-link';
import Details from './details/details';
import ReviewForm from './review-form/review-form';

import { getFavoritesLoadingStatus } from '../../store/slices/favorites/favorites.selectors';
import ErrorPage from '../error-page/error-page';
import ProductReviews from './product-reviews/product-reviews';
import ProductPageTitle from './product-page-title/product-page-title';
import NotFoundPage from '../not-found-page/not-found-page';
import useProductData from '../../hooks/use-product-data';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const [isReviewFormShowing, setIsReviewFormShowing] = useState(false);

  const product = useAppSelector(getProduct);
  const productLoadingStatus = useAppSelector(getProductLoadingStatus);
  const isProductLoading = productLoadingStatus === LoadingStatus.Loading;
  const isProductLoadingError = productLoadingStatus === LoadingStatus.Failed;

  const favoritesLoadingStatus = useAppSelector(getFavoritesLoadingStatus);
  const isFavoritesLoadingError =
    favoritesLoadingStatus === LoadingStatus.Failed;

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;
  const isProductNotFound = useAppSelector(getIsProductNotFound);

  const isReviewFormOpen = isReviewFormShowing && isAuthorized;

  useProductData(id);

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

      <ProductPageTitle />

      <BackLink />

      <Details
        product={product}
        onShowReviewFormClick={setIsReviewFormShowing}
        isReviewFormOpen={isReviewFormOpen}
      />

      {isReviewFormOpen && id && <ReviewForm productId={id} />}

      <ProductReviews />
    </>
  );
};

export default ProductPage;
