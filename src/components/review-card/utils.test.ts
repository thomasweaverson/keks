import { describe, expect, it } from 'vitest';
import { formatReviewDate, getReviewDateTime } from './utils';

describe('Utils: review', () => {
  describe('formatReviewDate', () => {
    it('formats ISO date string into Russian DD.MM format', () => {
      const isoDate = '2026-02-05T14:30:00.000Z';

      const result = formatReviewDate(isoDate);

      expect(result).toBe('05.02');
    });
  });

  describe('getReviewDateTime', () => {
    it('extracts date part (YYYY-MM-DD) from ISO string', () => {
      const isoDate = '2026-02-05T14:30:00.000Z';

      const result = getReviewDateTime(isoDate);

      expect(result).toBe('2026-02-05');
    });
  });
});
