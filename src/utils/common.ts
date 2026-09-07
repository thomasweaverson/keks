type TFormatUnit = "price" | "weight";

export const formatValue = (value: number, unit: TFormatUnit): string => {
  const formattedValue = new Intl.NumberFormat("ru-RU").format(value);

  return unit === "price" ? `${formattedValue} р` : `${formattedValue} грамм`;
};

export const handleScrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
