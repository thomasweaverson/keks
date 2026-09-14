import {
  getFilteredProducts,
  getProducts,
  getProductsLoadingStatus,
  getRandomPack,
} from './products.selectors';
import type { TFilterState, TProductsState } from '../../../types/state';
import { LoadingStatus } from '../../../const/infrastructure';
import { makeFakeProduct } from '../../../utils/testing/mocks';
import { describe, expect, it } from 'vitest';

describe('Products selectors', () => {
  const productsState: TProductsState = {
    products: [],
    productsLoadingStatus: LoadingStatus.Idle,
    randomPack: null,
  };

  it('returns products', () => {
    const products = [makeFakeProduct(), makeFakeProduct()];
    const state: TProductsState = {
      ...productsState,
      products,
    };

    expect(getProducts({ Products: state })).toBe(products);
  });

  it('returns products loading status', () => {
    const state: TProductsState = {
      ...productsState,
      productsLoadingStatus: LoadingStatus.Loading,
    };

    expect(getProductsLoadingStatus({ Products: state })).toBe(
      LoadingStatus.Loading,
    );
  });

  it('returns random pack', () => {
    const randomPack: TProductsState['randomPack'] = [
      makeFakeProduct(),
      makeFakeProduct(),
      makeFakeProduct(),
    ];

    const state: TProductsState = {
      ...productsState,
      randomPack,
    };

    expect(getRandomPack({ Products: state })).toBe(randomPack);
  });

  describe('getFilteredProducts', () => {
    const cheesecakeChocolate = makeFakeProduct({
      category: 'cheesecake',
      type: 'chocolate',
    });
    const cheesecakeVanilla = makeFakeProduct({
      category: 'cheesecake',
      type: 'vanilla',
    });
    const dessertChocolate = makeFakeProduct({
      category: 'dessert',
      type: 'chocolate',
    });

    const products = [
      cheesecakeChocolate,
      cheesecakeVanilla,
      dessertChocolate,
    ];

    const makeState = (
      currentCategory: TFilterState['currentCategory'],
      currentTypes: TFilterState['currentTypes'],
    ) => ({
      Products: {
        ...productsState,
        products,
      },
      Filter: {
        filters: [],
        currentCategory,
        currentTypes,
        filtersLoadingStatus: LoadingStatus.Idle,
      },
    });

    it('returns all products when category is not selected', () => {
      const state = makeState(null, []);

      expect(getFilteredProducts(state)).toBe(products);
    });

    it('returns products of selected category when no types are selected', () => {
      const state = makeState('cheesecake', []);

      expect(getFilteredProducts(state)).toEqual([
        cheesecakeChocolate,
        cheesecakeVanilla,
      ]);
    });

    it('returns products matching selected category and types', () => {
      const state = makeState('cheesecake', ['chocolate']);

      expect(getFilteredProducts(state)).toEqual([cheesecakeChocolate]);
    });

    it('excludes products of another category', () => {
      const state = makeState('cheesecake', ['chocolate']);

      expect(getFilteredProducts(state)).not.toContain(dessertChocolate);
    });
  });
});
