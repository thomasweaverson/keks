import { useEffect } from 'react';
import { useAppDispatch } from '.';
import { resetProduct } from '../store/slices/product/product.slice';
import { fetchProductAction, fetchReviewsAction } from '../store/api-actions';
import { resetReviews } from '../store/slices/reviews/reviews.slice';
import type { TProduct } from '../types/product';

const useProductData = (id: TProduct['id'] | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) {
      return;
    }

    void dispatch(fetchProductAction(id));
    void dispatch(fetchReviewsAction(id));
  }, [id, dispatch]);

  useEffect(
    () => () => {
      dispatch(resetProduct());
      dispatch(resetReviews());
    },
    [dispatch],
  );
};

export default useProductData;
