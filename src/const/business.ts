import type { TProductCategory } from "../types/product";

export const MAX_AVATAR_WIDTH = 100;
export const MAX_AVATAR_SIZE = 1024 * 1024;
export const MAX_AVATAR_HEIGHT = 100;

export const AVATAR_TYPES = ["image/jpeg", "image/png"];

export const RATING_STARS_COUNT = 5;

export const HIGH_LEVEL_RATING_THRESHOLD = 4;

export const CATALOG_CARDS_PER_STEP = 6;

export const REVIEWS_PER_STEP = 2;

export const DESCRIPTION_LENGTH = 140;

export const ProductCategoryLabel = {
  cheesecake: "Чизкейк",
  bisque: "Бисквит",
  shortbread: "Песочное",
  dessert: "Десерт",
} as const satisfies Record<TProductCategory, string>;

export const ProductTypeLabel = {
  lemon: "Лимонный",
  chocolate: "Шоколадный",
  vanilla: "Ванильный",
  vegetarian: "Вегетарианский",
  "honey-cake": "Медовый",
  "new-york": "Нью-Йорк",
  tart: "Тарт",
  "funnel-cake": "Пончики",
  "basket-cake": "Корзиночка",
  "chocolate-muffin": "Шоколадный маффин",
  "brand-muffin": "Фирменный маффин",
} as const;

export const ReviewsFilter = {
  Any: "Любой",
  High: "Высокий",
  Low: "Низкий",
} as const;

export const DEFAULT_REVIEWS_FILTER = ReviewsFilter.Any;

export const SortOrder = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

export const DEFAULT_REVIEWS_SORT_ORDER = SortOrder.NEWEST;
