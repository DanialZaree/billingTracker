/**
 * Helper utilities for formatting and data manipulation.
 */

export const formatCurrency = (num) => {
  const value = typeof num === "number" ? num : parseFloat(num);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(isNaN(value) ? 0 : value);
};

/**
 * Format a YYYY-MM-DD date string safely without timezone shifts.
 */
export const formatDate = (dateStr, options = { month: "short", day: "numeric", year: "numeric" }) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(Date.UTC(year, month, day));
    return date.toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("en-US", options);
};

/**
 * Parses and sanitizes a numerical amount to 2 decimal places.
 */
export const sanitizeAmount = (amount) => {
  const num = typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100) / 100;
};

/**
 * Extract sorted unique years from bill items, guaranteeing inclusion of the current year.
 */
export const getAvailableYears = (bills = [], baseYear = new Date().getFullYear()) => {
  const years = new Set([baseYear]);
  bills.forEach((bill) => {
    if (bill && bill.date) {
      const year = parseInt(bill.date.split("-")[0], 10);
      if (!isNaN(year) && year >= 1900 && year <= 2100) {
        years.add(year);
      }
    }
  });
  return Array.from(years).sort((a, b) => b - a); // Descending order
};

/**
 * Generate a unique ID (UUID or fallback timestamp-random).
 */
export const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
