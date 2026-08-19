import type { User } from "./user";

export type Category = "cheesecake" | "bisque" | "shortbread" | "dessert";

export type Type =
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

export type CategoryWithTypes = {
  category: Category;
  types: Type[];
};

export type Product = {
  id: string;
  title: string;
  category: Category;
  type: Type;
  price: number;
  previewImage: string;
  previewImageWebp: string;
  isFavorite: boolean;
  isNew: boolean;
};

export type ProductExtended = Product & {
  description: string;
  images: string[];
  weight: number;
  rating: number;
  reviewCount: number;
};

export type Review = {
  id: Product['id'];
  isoDate: string;
  user: User;
  positive: string;
  negative: string;
  rating: number;
}

export type ReviewPosting = {
  id: Product['id'];
  positive: Review['positive'];
  negative: Review['negative'];
  rating: number;
};
