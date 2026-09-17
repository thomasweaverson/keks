import { ProductTypeLabel } from '../../../../const/business';
import type { TProductLabel, TProductType } from '../../../../types/product';

export const getProductTypeLabel = (type: TProductType): TProductLabel =>
  ProductTypeLabel[type];
