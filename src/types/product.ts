import type { TUser } from "./user";

export type TCategory = "cheesecake" | "bisque" | "shortbread" | "dessert";

export type TType =
  | "lemon"
  | "chocolate"
  | "vanilla"
  | "vegetarian"
  | "honey-cake"
  | "new-york"
  | "tart"
  | "funnel-cake"
  | "basket-cake"
  | "chocolate-muffin"
  | "brand-muffin";

export type TCategoryWithTypes = {
  category: TCategory;
  types: TType[];
};

export type TProduct = {
  id: string;
  title: string;
  category: TCategory;
  type: TType;
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
}

export type TReviewPosting = {
  id: TProduct['id'];
  positive: TReview['positive'];
  negative: TReview['negative'];
  rating: number;
};
