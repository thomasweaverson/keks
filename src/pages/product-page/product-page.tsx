import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  getIsProductLoading,
  getIsProductLoadingError,
  getProduct,
} from "../../store/slices/product/product.selectors";
import { useEffect, useState } from "react";
import {
  fetchProductAction,
  fetchReviewsAction,
} from "../../store/api-actions";
import { AppRoute, AuthorizationStatus } from "../../const/infrastructure";
import { resetProduct } from "../../store/slices/product/product.slice";
import LoaderScreen from "../loading-screen/loading-screen";
import { Helmet } from "react-helmet-async";
import { getAuthorizationStatus } from "../../store/slices/user/user.selectors";
import BackLink from "../../components/back-link/back-link";
import Details from "./details/details";
import ReviewForm from "./review-form/review-form";
import {
  getFilteredAndSortedReviews,
  getIsReviewsLoadingError,
  getReviews,
} from "../../store/slices/reviews/reviews.selectors";
import NoReviews from "./no-reviews/no-reviews";
import ReviewsLoadingError from "./reviews-loading-error/reviews-loading-error";
import FilterSortBar from "./filter-sort-bar/filter-sort-bar";
import ReviewsList from "./reviews-list/reviews-list";
import NotFoundReviews from "./not-found-reviews/not-found-reviews";
import { ScrollToTop } from "../../components/scroll-to-top/scroll-to-top";
import { resetReviews } from "../../store/slices/reviews/reviews.slice";

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  if (id === undefined) {
    navigate(AppRoute.NotFound);
    return;
  }
  const [isReviewFormShowing, setIsReviewFormShowing] =
    useState<boolean>(false);

  const isProductLoading = useAppSelector(getIsProductLoading);
  const isProductLoadingError = useAppSelector(getIsProductLoadingError);
  const userAuthorizationStatus = useAppSelector(getAuthorizationStatus);
  const reviews = useAppSelector(getReviews);
  const preparedReviews = useAppSelector(getFilteredAndSortedReviews);
  const isReviewsLoadingError = useAppSelector(getIsReviewsLoadingError);
  const product = useAppSelector(getProduct);

  useEffect(() => {
    if (userAuthorizationStatus !== AuthorizationStatus.Auth) {
      setIsReviewFormShowing(false);
    }
  }, [userAuthorizationStatus]);

  useEffect(() => {
    let isMounted = true;

    if (id && isMounted) {
      dispatch(fetchProductAction(id));
      dispatch(fetchReviewsAction(id));
    }

    return () => {
      isMounted = false;
    };
  }, [id, dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (isProductLoadingError && isMounted) {
      console.log("isProductLoadingError && isMounted");
      navigate(AppRoute.NotFound);
    }

    return () => {
      isMounted = false;
    };
  }, [isProductLoadingError, navigate]);

  useEffect(
    () => () => {
      dispatch(resetProduct());
      dispatch(resetReviews());
    },
    [dispatch],
  );

  if (isProductLoading || product === null) {
    return <LoaderScreen />;
  }

  return (
    <>
      <Helmet>
        <title>Кондитерская Кекс - Карточка товара</title>
      </Helmet>
      <ScrollToTop />
      <h1 className="visually-hidden">
        Карточка: пользователь{" "}
        {userAuthorizationStatus !== AuthorizationStatus.Auth ? "не" : ""}{" "}
        авторизован
      </h1>

      <BackLink />
      <Details
        product={product}
        onShowReviewFormClick={setIsReviewFormShowing}
        isReviewFormOpen={isReviewFormShowing}
      />
      {isReviewFormShowing &&
        userAuthorizationStatus === AuthorizationStatus.Auth && (
          <ReviewForm productId={id} />
        )}
      {reviews.length === 0 && !isReviewsLoadingError && <NoReviews />}
      {isReviewsLoadingError && <ReviewsLoadingError />}
      {reviews.length > 0 && !isReviewsLoadingError && <FilterSortBar />}
      {preparedReviews.length > 0 && !isReviewsLoadingError && (
        <ReviewsList reviews={preparedReviews} />
      )}
      {reviews.length !== 0 &&
        preparedReviews.length === 0 &&
        !isReviewsLoadingError && <NotFoundReviews />}
    </>
  );
};

export default ProductPage;
