import { describe, expect, it } from 'vitest';
import { getRussianPlural } from './utils';

describe('Function: getRussianPlural', () => {
  const forms: [string, string, string] = [
    'товар',
    'товара',
    'товаров',
  ];

  it.each([
    [1, 'товар'],
    [21, 'товар'],
    [101, 'товар'],
  ])('should return one form for %i', (count, expected) => {
    expect(getRussianPlural(count, forms)).toBe(expected);
  });

  it.each([
    [2, 'товара'],
    [3, 'товара'],
    [4, 'товара'],
    [22, 'товара'],
    [23, 'товара'],
    [24, 'товара'],
  ])('should return few form for %i', (count, expected) => {
    expect(getRussianPlural(count, forms)).toBe(expected);
  });

  it.each([
    [0, 'товаров'],
    [5, 'товаров'],
    [10, 'товаров'],
    [20, 'товаров'],
    [25, 'товаров'],
    [100, 'товаров'],
  ])('should return many form for %i', (count, expected) => {
    expect(getRussianPlural(count, forms)).toBe(expected);
  });

  it.each([
    [11, 'товаров'],
    [12, 'товаров'],
    [13, 'товаров'],
    [14, 'товаров'],
    [111, 'товаров'],
    [112, 'товаров'],
    [113, 'товаров'],
    [114, 'товаров'],
  ])('should return many form for numbers from 11 to 14 in every hundred', (
    count,
    expected,
  ) => {
    expect(getRussianPlural(count, forms)).toBe(expected);
  });
});
