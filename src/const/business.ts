export const MAX_AVATAR_WIDTH = 100;
export const MAX_AVATAR_SIZE = 1024 * 1024;
export const MAX_AVATAR_HEIGHT = 100;

export const AVATAR_TYPES = ["image/jpeg", "image/png"];

export const RATING_STARS_COUNT = 5;

export const CATALOG_CARDS_PER_STEP = 6;

export const ProductCategoryLabel = {
  cheesecake: "Чизкейк",
  bisque: "Бисквит",
  shortbread: "Песочное",
  dessert: "Десерт",
} as const;

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
