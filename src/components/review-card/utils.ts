import type { TReview } from '../../types/product';

export const formatReviewDate = (isoDate: TReview['isoDate']): string => {
  const date = new Date(isoDate);

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  });
};

export const getReviewDateTime = (
  isoDate: TReview['isoDate'],
): string => isoDate.slice(0, 10);
