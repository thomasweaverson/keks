import { describe, expect, it } from 'vitest';
import { getRandomThreeElements } from './utils';

describe('Function: getRandomThreeElements', () => {
  it('should return null when array contains fewer than three elements', () => {
    expect(getRandomThreeElements([])).toBeNull();
    expect(getRandomThreeElements([1])).toBeNull();
    expect(getRandomThreeElements([1, 2])).toBeNull();
  });

  it('should return three elements when array contains three elements', () => {
    const elements = [1, 2, 3];

    const result = getRandomThreeElements(elements);

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(elements));
  });

  it('should return three elements from array with more than three elements without mutating it', () => {
    const elements = [1, 2, 3, 4, 5];
    const originalElements = [...elements];

    const result = getRandomThreeElements(elements);

    expect(result).toHaveLength(3);
    result?.forEach((element) => {
      expect(elements).toContain(element);
    });
    expect(elements).toEqual(originalElements);
  });
});
