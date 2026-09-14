import { describe, expect, it } from 'vitest';
import {
  HIGH_LEVEL_RATING_THRESHOLD,
  ReviewsFilter,
  SortOrder,
} from '../../../const/business';
import { makeFakeReview } from '../../../utils/testing/mocks';
import { filterReviews, sortReviews } from './utils';

describe('filterReviews', () => {
  const highRatingReview = makeFakeReview({
    rating: HIGH_LEVEL_RATING_THRESHOLD + 1,
  });
  const thresholdRatingReview = makeFakeReview({
    rating: HIGH_LEVEL_RATING_THRESHOLD,
  });
  const lowRatingReview = makeFakeReview({
    rating: HIGH_LEVEL_RATING_THRESHOLD - 1,
  });

  const reviews = [
    highRatingReview,
    thresholdRatingReview,
    lowRatingReview,
  ];

  it('returns all reviews for Any filter', () => {
    expect(filterReviews(reviews, ReviewsFilter.Any)).toBe(reviews);
  });

  it('returns reviews with rating equal to or higher than threshold for High filter', () => {
    expect(filterReviews(reviews, ReviewsFilter.High)).toEqual([
      highRatingReview,
      thresholdRatingReview,
    ]);
  });

  it('returns reviews with rating lower than threshold for Low filter', () => {
    expect(filterReviews(reviews, ReviewsFilter.Low)).toEqual([
      lowRatingReview,
    ]);
  });
});

describe('sortReviews', () => {
  const oldestReview = makeFakeReview({
    isoDate: '2026-09-10T10:00:00.000Z',
  });
  const middleReview = makeFakeReview({
    isoDate: '2026-09-11T10:00:00.000Z',
  });
  const newestReview = makeFakeReview({
    isoDate: '2026-09-12T10:00:00.000Z',
  });

  it('sorts reviews from newest to oldest', () => {
    const reviews = [oldestReview, newestReview, middleReview];

    expect(sortReviews(reviews, SortOrder.NEWEST)).toEqual([
      newestReview,
      middleReview,
      oldestReview,
    ]);
  });

  it('sorts reviews from oldest to newest', () => {
    const reviews = [newestReview, oldestReview, middleReview];

    expect(sortReviews(reviews, SortOrder.OLDEST)).toEqual([
      oldestReview,
      middleReview,
      newestReview,
    ]);
  });

  it('does not mutate the original array', () => {
    const reviews = [oldestReview, newestReview, middleReview];

    sortReviews(reviews, SortOrder.NEWEST);

    expect(reviews).toEqual([
      oldestReview,
      newestReview,
      middleReview,
    ]);
  });
});
