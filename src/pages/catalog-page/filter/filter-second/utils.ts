import { ProductTypeLabel } from "../../../../const/business";

export const getProductTypeLabel = (type: string) =>
  ProductTypeLabel[type as keyof typeof ProductTypeLabel] ?? type;
