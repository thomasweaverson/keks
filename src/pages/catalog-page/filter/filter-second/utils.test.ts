import { describe, expect, it } from 'vitest';
import type { TProductLabel, TProductType } from '../../../../types/product';
import { getProductTypeLabel } from './utils';

const testCases: [TProductType, TProductLabel][] = [
  ['lemon', 'Лимонный'],
  ['chocolate', 'Шоколадный'],
  ['vanilla', 'Ванильный'],
  ['vegetarian', 'Вегетарианский'],
  ['honey-cake', 'Медовый'],
  ['new-york', 'Нью-Йорк'],
  ['tart', 'Тарт'],
  ['funnel-cake', 'Пончики'],
  ['basket-cake', 'Корзиночка'],
  ['chocolate-muffin', 'Шоколадный маффин'],
  ['brand-muffin', 'Фирменный маффин'],
];

describe('Function: getProductTypeLabel', () => {
  it.each(testCases)(
    'should return correct label for "%s" product type',
    (type, expectedLabel) => {
      expect(getProductTypeLabel(type)).toBe(expectedLabel);
    },
  );
});
