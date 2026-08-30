export const formatPrice = (price: number): string =>
  `${new Intl.NumberFormat("ru-RU").format(price)} р`;
