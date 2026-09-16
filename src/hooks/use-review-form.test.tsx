import { act, renderHook } from '@testing-library/react';
import type { SubmitEvent } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useReviewForm } from './use-review-form';
import { withStore } from '../utils/testing/mock-components';

const { mockPostReviewAction } = vi.hoisted(() => ({
  mockPostReviewAction: vi.fn(() => ({
    type: 'review/post',
    unwrap: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('../store/api-actions', () => ({
  postReviewAction: mockPostReviewAction,
}));

vi.mock('../pages/product-page/review-form/const', () => ({
  MAX_RATING: 5,
  MIN_RATING: 1,
  NEGATIVE_RATING_MAX: 3,
  POSITIVE_RATING_MIN: 4,
  REVIEW_TEXT_MAX_LENGTH: 500,
}));

const createSubmitEvent = (
  preventDefault: () => void,
): SubmitEvent<HTMLFormElement> => {
  const form = document.createElement('form');
  return {
    preventDefault,
    target: form,
    currentTarget: form,
  } as SubmitEvent<HTMLFormElement>;
};

describe('Hook: useReviewForm', () => {
  const productId = 'test-product-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useReviewForm(productId), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    expect(result.current.values).toEqual({
      positive: '',
      negative: '',
      rating: 0,
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('validates required positive text when high rating is selected', async () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useReviewForm(productId), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.handleRatingChange(5);
    });

    expect(result.current.values.rating).toBe(5);

    const preventDefault = vi.fn();

    await act(async () => {
      await result.current.handleSubmit(createSubmitEvent(preventDefault));
    });

    expect(result.current.errors.positive).toBe('Укажите достоинства товара');
  });

  it('handles text input changes and validates required fields based on rating', () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useReviewForm(productId), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.handleRatingChange(2);
      result.current.handleTextChange('negative', 'Плохой звук');
    });

    expect(result.current.values.negative).toBe('Плохой звук');
    expect(result.current.errors.negative).toBeUndefined();
  });

  it('shows error when text exceeds maximum allowed length', () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useReviewForm(productId), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    const longText = 'a'.repeat(501);

    act(() => {
      result.current.handleTextChange('positive', longText);
    });

    expect(result.current.errors.positive).toBe('Максимум 500 символов');
  });

  it('prevents submission when validation fails', async () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useReviewForm(productId), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    const preventDefault = vi.fn();

    await act(async () => {
      await result.current.handleSubmit(createSubmitEvent(preventDefault));
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.errors.rating).toBe('Выберите оценку');
    expect(mockPostReviewAction).not.toHaveBeenCalled();
  });

  it('dispatches postReviewAction and resets form on successful submit', async () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useReviewForm(productId), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.handleRatingChange(5);
    });

    act(() => {
      result.current.handleTextChange('positive', 'Отличный товар!');
    });

    const preventDefault = vi.fn();

    await act(async () => {
      await result.current.handleSubmit(createSubmitEvent(preventDefault));
    });

    expect(mockPostReviewAction).toHaveBeenCalledWith({
      id: productId,
      positive: 'Отличный товар!',
      negative: '',
      rating: 5,
    });
    expect(result.current.values).toEqual({
      positive: '',
      negative: '',
      rating: 0,
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });
});
