import { useState, type SubmitEvent } from 'react';
import { useAppDispatch } from '.';
import {
  MAX_RATING,
  MIN_RATING,
  NEGATIVE_RATING_MAX,
  POSITIVE_RATING_MIN,
  REVIEW_TEXT_MAX_LENGTH,
} from '../pages/product-page/review-form/const';
import type { TReviewPosting } from '../types/product';
import { postReviewAction } from '../store/api-actions';

type TFormValues = Omit<TReviewPosting, 'id'>;

type TFormErrors = Partial<Record<keyof TFormValues, string>>;

type TTouchedFields = Partial<Record<keyof TFormValues, boolean>>;

const initialValues: TFormValues = {
  positive: '',
  negative: '',
  rating: 0,
};

const validate = (values: TFormValues): TFormErrors => {
  const errors: TFormErrors = {};

  if (values.positive.length > REVIEW_TEXT_MAX_LENGTH) {
    errors.positive = 'Максимум 500 символов';
  } else if (values.rating >= POSITIVE_RATING_MIN && !values.positive.trim()) {
    errors.positive = 'Укажите достоинства товара';
  }

  if (values.negative.length > REVIEW_TEXT_MAX_LENGTH) {
    errors.negative = 'Максимум 500 символов';
  } else if (
    values.rating >= MIN_RATING &&
    values.rating <= NEGATIVE_RATING_MAX &&
    !values.negative.trim()
  ) {
    errors.negative = 'Укажите недостатки товара';
  }

  if (values.rating < MIN_RATING || values.rating > MAX_RATING) {
    errors.rating = 'Выберите оценку';
  }

  return errors;
};

export const useReviewForm = (productId: string) => {
  const dispatch = useAppDispatch();

  const [values, setValues] = useState<TFormValues>(initialValues);
  const [errors, setErrors] = useState<TFormErrors>({});
  const [touched, setTouched] = useState<TTouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateErrors = (
    nextValues: TFormValues,
    nextTouched: TTouchedFields = touched,
  ) => {
    const validationErrors = validate(nextValues);

    const visibleErrors: TFormErrors = {};

    (Object.keys(validationErrors) as (keyof TFormValues)[]).forEach(
      (field) => {
        if (nextTouched[field]) {
          visibleErrors[field] = validationErrors[field];
        }
      },
    );

    setErrors(visibleErrors);
  };

  const handleTextChange = (field: 'positive' | 'negative', value: string) => {
    const nextValues = {
      ...values,
      [field]: value,
    };

    const nextTouched = {
      ...touched,
      [field]: true,
    };

    setValues(nextValues);
    setTouched(nextTouched);
    updateErrors(nextValues, nextTouched);
  };

  const handleRatingChange = (rating: number) => {
    const nextValues = {
      ...values,
      rating,
    };

    const nextTouched = {
      ...touched,
      rating: true,
    };

    setValues(nextValues);
    setTouched(nextTouched);
    updateErrors(nextValues, nextTouched);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values);

    setTouched({
      positive: true,
      negative: true,
      rating: true,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        postReviewAction({
          id: productId,
          positive: values.positive,
          negative: values.negative,
          rating: values.rating,
        }),
      ).unwrap();

      setValues(initialValues);
      setErrors({});
      setTouched({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleTextChange,
    handleRatingChange,
    handleSubmit,
  };
};
