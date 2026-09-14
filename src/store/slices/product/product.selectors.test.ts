import { describe, expect, it } from 'vitest';
import { LoadingStatus } from '../../../const/infrastructure';
import { makeFakeProductExtended } from '../../../utils/testing/mocks';
import type { TProductState } from '../../../types/state';
import {
  getIsProductNotFound,
  getProduct,
  getProductLoadingStatus,
} from './product.selectors';

describe('Product selectors', () => {
  it('returns product', () => {
    const product = makeFakeProductExtended();

    const state: TProductState = {
      product,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    };

    expect(getProduct({ Product: state })).toBe(product);
  });

  it('returns product loading status', () => {
    const state: TProductState = {
      product: null,
      productLoadingStatus: LoadingStatus.Loading,
      isProductNotFound: false,
    };

    expect(getProductLoadingStatus({ Product: state })).toBe(
      LoadingStatus.Loading,
    );
  });

  it('returns product not found status', () => {
    const state: TProductState = {
      product: null,
      productLoadingStatus: LoadingStatus.Failed,
      isProductNotFound: true,
    };

    expect(getIsProductNotFound({ Product: state })).toBe(true);
  });
});
