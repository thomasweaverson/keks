import { ProductTypeLabel } from '../../../../const/business';
import type { TProductType } from '../../../../types/product';

export const getProductTypeLabel = (type: TProductType) =>
  ProductTypeLabel[type as keyof typeof ProductTypeLabel];
