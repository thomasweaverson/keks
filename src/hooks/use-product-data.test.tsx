import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useProductData from './use-product-data';
import { withStore } from '../utils/testing/mock-components';

const {
  mockFetchProductAction,
  mockFetchReviewsAction,
  mockResetProduct,
  mockResetReviews,
} = vi.hoisted(() => ({
  mockFetchProductAction: vi.fn((id: string) => ({
    type: 'product/fetchProduct',
    payload: id,
  })),
  mockFetchReviewsAction: vi.fn((id: string) => ({
    type: 'reviews/fetchReviews',
    payload: id,
  })),
  mockResetProduct: vi.fn(() => ({ type: 'product/resetProduct' })),
  mockResetReviews: vi.fn(() => ({ type: 'reviews/resetReviews' })),
}));

vi.mock('../store/api-actions', () => ({
  fetchProductAction: mockFetchProductAction,
  fetchReviewsAction: mockFetchReviewsAction,
}));

vi.mock('../store/slices/product/product.slice', () => ({
  resetProduct: mockResetProduct,
}));

vi.mock('../store/slices/reviews/reviews.slice', () => ({
  resetReviews: mockResetReviews,
}));

describe('Hook: useProductData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches fetchProductAction and fetchReviewsAction when id is provided', () => {
    const productId = 'test-product-id';
    const { mockStore } = withStore(<></>);

    renderHook(() => useProductData(productId), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(mockFetchProductAction).toHaveBeenCalledWith(productId);
    expect(mockFetchReviewsAction).toHaveBeenCalledWith(productId);
  });

  it('does not dispatch fetch actions when id is undefined', () => {
    const { mockStore } = withStore(<></>);

    renderHook(() => useProductData(undefined), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(mockFetchProductAction).not.toHaveBeenCalled();
    expect(mockFetchReviewsAction).not.toHaveBeenCalled();
  });

  it('dispatches resetProduct and resetReviews on unmount', () => {
    const productId = 'test-product-id';
    const { mockStore } = withStore(<></>);

    const { unmount } = renderHook(() => useProductData(productId), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(mockResetProduct).not.toHaveBeenCalled();
    expect(mockResetReviews).not.toHaveBeenCalled();

    unmount();

    expect(mockResetProduct).toHaveBeenCalled();
    expect(mockResetReviews).toHaveBeenCalled();
  });
});
