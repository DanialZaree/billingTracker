export const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    num
  );
