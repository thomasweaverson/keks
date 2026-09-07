import { useEffect } from "react";
import { useAppDispatch } from ".";
import { resetProduct } from "../store/slices/product/product.slice";
import { fetchProductAction, fetchReviewsAction } from "../store/api-actions";
import { resetReviews } from "../store/slices/reviews/reviews.slice";
import type { TProduct } from "../types/product";

const useProductData = (id: TProduct["id"] | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchProductAction(id));
    dispatch(fetchReviewsAction(id));
  }, [id, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetProduct());
      dispatch(resetReviews());
    };
  }, [dispatch]);
};

export default useProductData;
