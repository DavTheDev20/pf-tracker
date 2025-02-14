export const formatAccounting = (num: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return num < 0
    ? `(${formatter.format(Math.abs(num))})`
    : formatter.format(num);
};
