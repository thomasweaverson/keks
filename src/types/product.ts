import type { ProductTypeLabel } from '../const/business';
import type { TUser } from './user';

export type TProductCategory =
  | 'cheesecake'
  | 'bisque'
  | 'shortbread'
  | 'dessert';

export type TProductType = keyof typeof ProductTypeLabel;

export type TProductLabel = typeof ProductTypeLabel[keyof typeof ProductTypeLabel];

export type TCategoryWithTypes = {
  category: TProductCategory;
  types: TProductType[];
};

export type TProduct = {
  id: string;
  title: string;
  category: TProductCategory;
  type: TProductType;
  price: number;
  previewImage: string;
  previewImageWebp: string;
  isFavorite: boolean;
  isNew: boolean;
};

export type TProductExtended = TProduct & {
  description: string;
  images: string[];
  weight: number;
  rating: number;
  reviewCount: number;
};

export type TReview = {
  id: TProduct['id'];
  isoDate: string;
  user: TUser;
  positive: string;
  negative: string;
  rating: number;
};

export type TReviewPosting = {
  id: TProduct['id'];
  positive: TReview['positive'];
  negative: TReview['negative'];
  rating: number;
};

export type TReviewFormValues = Omit<TReviewPosting, 'id'>;
