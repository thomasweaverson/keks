
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ReviewForm from './review-form';
import { useReviewForm } from '../../../hooks/use-review-form';
import type { TReviewFormValues } from '../../../types/product';

vi.mock('../../../hooks/use-review-form', () => ({
  useReviewForm: vi.fn(),
}));

const mockUseReviewForm = vi.mocked(useReviewForm);

const makeFakeFormValues = (
  override?: Partial<TReviewFormValues>,
): TReviewFormValues => ({
  positive: '',
  negative: '',
  rating: 0,
  ...override,
});

const makeFakeFormHook = (
  override?: Partial<ReturnType<typeof useReviewForm>>,
): ReturnType<typeof useReviewForm> => ({
  values: makeFakeFormValues(),
  errors: {},
  isSubmitting: false,
  handleTextChange: vi.fn(),
  handleRatingChange: vi.fn(),
  handleSubmit: vi.fn(),
  ...override,
});

describe('Component: ReviewForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseReviewForm.mockReturnValue(makeFakeFormHook());
  });

  it('should render review form fields and submit button', () => {
    render(<ReviewForm productId="product-1" />);

    expect(
      screen.getByRole('heading', { name: 'оставить отзыв' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: 'Достоинства' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: 'Недостатки' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Отправить отзыв' }),
    ).toBeInTheDocument();
  });

  it('should pass product id to useReviewForm', () => {
    render(<ReviewForm productId="product-123" />);

    expect(mockUseReviewForm).toHaveBeenCalledTimes(1);
    expect(mockUseReviewForm).toHaveBeenCalledWith('product-123');
  });

  it('should pass form values to text inputs', () => {
    const values = makeFakeFormValues({
      positive: 'Вкусный десерт',
      negative: 'Слишком сладкий',
    });

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({ values }),
    );

    render(<ReviewForm productId="product-1" />);

    expect(screen.getByRole('textbox', { name: 'Достоинства' }))
      .toHaveValue(values.positive);

    expect(screen.getByRole('textbox', { name: 'Недостатки' }))
      .toHaveValue(values.negative);
  });

  it('should pass rating value to rating input', () => {
    const values = makeFakeFormValues({
      rating: 4,
    });

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({ values }),
    );

    render(<ReviewForm productId="product-1" />);

    expect(
      screen.getByRole('radio', { name: '4 звезды' }),
    ).toBeChecked();
  });

  it('should pass text field errors to corresponding inputs', () => {
    const errors = {
      positive: 'Укажите достоинства товара',
      negative: 'Укажите недостатки товара',
    };

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({ errors }),
    );

    render(<ReviewForm productId="product-1" />);

    expect(
      screen.getByText(errors.positive),
    ).toBeInTheDocument();

    expect(
      screen.getByText(errors.negative),
    ).toBeInTheDocument();
  });

  it('should display rating error', () => {
    const ratingError = 'Выберите оценку';

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({
        errors: {
          rating: ratingError,
        },
      }),
    );

    render(<ReviewForm productId="product-1" />);

    expect(screen.getByText(ratingError)).toBeInTheDocument();
  });

  it('should call handleTextChange for positive field', async () => {
    const user = userEvent.setup();
    const handleTextChange = vi.fn();

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({ handleTextChange }),
    );

    render(<ReviewForm productId="product-1" />);

    await user.type(
      screen.getByRole('textbox', { name: 'Достоинства' }),
      'Вкусно',
    );

    expect(handleTextChange).toHaveBeenLastCalledWith(
      'positive',
      'о',
    );
  });

  it('should call handleTextChange for negative field', async () => {
    const user = userEvent.setup();
    const handleTextChange = vi.fn();

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({ handleTextChange }),
    );

    render(<ReviewForm productId="product-1" />);

    await user.type(
      screen.getByRole('textbox', { name: 'Недостатки' }),
      'Слишком сладко',
    );

    expect(handleTextChange).toHaveBeenLastCalledWith(
      'negative',
      'о',
    );
  });

  it('should call handleRatingChange when rating is selected', async () => {
    const user = userEvent.setup();
    const handleRatingChange = vi.fn();

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({ handleRatingChange }),
    );

    render(<ReviewForm productId="product-1" />);

    await user.click(
      screen.getByRole('radio', { name: '4 звезды' }),
    );

    expect(handleRatingChange).toHaveBeenCalledTimes(1);
    expect(handleRatingChange).toHaveBeenCalledWith(4);
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({ handleSubmit }),
    );

    render(<ReviewForm productId="product-1" />);

    await user.click(
      screen.getByRole('button', { name: 'Отправить отзыв' }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'submit',
      }),
    );
  });

  it('should disable submit button while submitting', () => {
    mockUseReviewForm.mockReturnValue(
      makeFakeFormHook({
        isSubmitting: true,
      }),
    );

    render(<ReviewForm productId="product-1" />);

    const submitButton = screen.getByRole('button', {
      name: 'Отправить отзыв',
    });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('is-disabled');
  });

  it('should enable submit button when not submitting', () => {
    render(<ReviewForm productId="product-1" />);

    const submitButton = screen.getByRole('button', {
      name: 'Отправить отзыв',
    });

    expect(submitButton).toBeEnabled();
    expect(submitButton).not.toHaveClass('is-disabled');
  });
});
