import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

const ReviewFormTest = ({ productId }: { productId: string }) => {
  const {
    values,
    errors,
    isSubmitting,
    handleTextChange,
    handleRatingChange,
    handleSubmit,
  } = useReviewForm(productId);

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        aria-label="Достоинства"
        value={values.positive}
        onChange={(event) => handleTextChange('positive', event.target.value)}
      />

      <textarea
        aria-label="Недостатки"
        value={values.negative}
        onChange={(event) => handleTextChange('negative', event.target.value)}
      />

      <button type="button" onClick={() => handleRatingChange(1)}>
        1
      </button>

      <button type="button" onClick={() => handleRatingChange(2)}>
        2
      </button>

      <button type="button" onClick={() => handleRatingChange(3)}>
        3
      </button>

      <button type="button" onClick={() => handleRatingChange(4)}>
        4
      </button>

      <button type="button" onClick={() => handleRatingChange(5)}>
        5
      </button>

      <button type="submit" disabled={isSubmitting}>
        Отправить
      </button>

      <output data-testid="positive-error">{errors.positive}</output>

      <output data-testid="negative-error">{errors.negative}</output>

      <output data-testid="rating-error">{errors.rating}</output>

      <output data-testid="rating">{values.rating}</output>
    </form>
  );
};

const renderReviewForm = (productId = 'test-product-id') => {
  const { mockStore } = withStore(<ReviewFormTest productId={productId} />);

  return render(
    <Provider store={mockStore}>
      <ReviewFormTest productId={productId} />
    </Provider>,
  );
};

describe('Hook: useReviewForm', () => {
  const productId = 'test-product-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    renderReviewForm(productId);

    expect(screen.getByLabelText('Достоинства')).toHaveValue('');
    expect(screen.getByLabelText('Недостатки')).toHaveValue('');
    expect(screen.getByTestId('rating')).toHaveTextContent('0');
    expect(screen.getByTestId('positive-error')).toHaveTextContent('');
    expect(screen.getByTestId('negative-error')).toHaveTextContent('');
    expect(screen.getByTestId('rating-error')).toHaveTextContent('');
    expect(
      screen.getByRole('button', { name: 'Отправить' }),
    ).not.toBeDisabled();
  });

  it('updates positive text and validates it', () => {
    renderReviewForm(productId);

    const positiveInput = screen.getByLabelText('Достоинства');

    fireEvent.change(positiveInput, {
      target: {
        value: 'Отличный товар!',
      },
    });

    expect(positiveInput).toHaveValue('Отличный товар!');
    expect(screen.getByTestId('positive-error')).toHaveTextContent('');
  });

  it('updates negative text and validates it for low rating', () => {
    renderReviewForm(productId);

    fireEvent.click(screen.getByRole('button', { name: '2' }));

    const negativeInput = screen.getByLabelText('Недостатки');

    fireEvent.change(negativeInput, {
      target: {
        value: 'Плохой звук',
      },
    });

    expect(screen.getByTestId('rating')).toHaveTextContent('2');
    expect(negativeInput).toHaveValue('Плохой звук');
    expect(screen.getByTestId('negative-error')).toHaveTextContent('');
  });

  it('shows positive text error for high rating', () => {
    renderReviewForm(productId);

    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.submit(screen.getByRole('button', { name: 'Отправить' }));

    expect(screen.getByTestId('positive-error')).toHaveTextContent(
      'Укажите достоинства товара',
    );
  });

  it('shows negative text error for low rating', () => {
    renderReviewForm(productId);

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.submit(screen.getByRole('button', { name: 'Отправить' }));

    expect(screen.getByTestId('negative-error')).toHaveTextContent(
      'Укажите недостатки товара',
    );
  });

  it('shows error when text exceeds maximum allowed length', () => {
    renderReviewForm(productId);

    const longText = 'a'.repeat(501);

    fireEvent.change(screen.getByLabelText('Достоинства'), {
      target: {
        value: longText,
      },
    });

    expect(screen.getByTestId('positive-error')).toHaveTextContent(
      'Максимум 500 символов',
    );
  });

  it('prevents submission when validation fails', () => {
    renderReviewForm(productId);

    fireEvent.submit(screen.getByRole('button', { name: 'Отправить' }));

    expect(screen.getByTestId('rating-error')).toHaveTextContent(
      'Выберите оценку',
    );
    expect(mockPostReviewAction).not.toHaveBeenCalled();
  });

  it('dispatches postReviewAction and resets form on successful submit', async () => {
    renderReviewForm(productId);

    fireEvent.click(screen.getByRole('button', { name: '5' }));

    fireEvent.change(screen.getByLabelText('Достоинства'), {
      target: {
        value: 'Отличный товар!',
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => {
      expect(mockPostReviewAction).toHaveBeenCalledWith({
        id: productId,
        positive: 'Отличный товар!',
        negative: '',
        rating: 5,
      });
    });

    expect(screen.getByLabelText('Достоинства')).toHaveValue('');
    expect(screen.getByLabelText('Недостатки')).toHaveValue('');
    expect(screen.getByTestId('rating')).toHaveTextContent('0');
    expect(screen.getByTestId('positive-error')).toHaveTextContent('');
    expect(screen.getByTestId('negative-error')).toHaveTextContent('');
    expect(screen.getByTestId('rating-error')).toHaveTextContent('');
    expect(
      screen.getByRole('button', { name: 'Отправить' }),
    ).not.toBeDisabled();
  });
});
