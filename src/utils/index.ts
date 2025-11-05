export const formatToDollar = (value: number | string): string => {
  const num = Number(value);

  if (isNaN(num)) return "$0.00";

  return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
