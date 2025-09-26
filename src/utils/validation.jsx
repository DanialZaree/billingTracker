import { ICONS } from "./icons";

const ICON_KEYS = Object.keys(ICONS);

/**
 * Validates the structure and content of imported bill data.
 * @param {any} data - The parsed JSON data.
 * @returns {{isValid: boolean, error: string | null}} - Validation result.
 */
export const validateBillsData = (data) => {
  // 1. Check if the data is an array
  if (!Array.isArray(data)) {
    return { isValid: false, error: "Invalid format: Data must be an array of bills." };
  }

  // 2. Check each bill object in the array
  for (let i = 0; i < data.length; i++) {
    const bill = data[i];
    const billNumber = i + 1;

    // Check for required fields and their types
    if (typeof bill !== "object" || bill === null) {
      return { isValid: false, error: `Bill #${billNumber}: Invalid entry. Must be an object.` };
    }
    if (typeof bill.id !== "number") {
      return { isValid: false, error: `Bill #${billNumber}: Missing or invalid 'id' (must be a number).` };
    }
    if (typeof bill.name !== "string" || bill.name.trim() === "") {
      return { isValid: false, error: `Bill #${billNumber}: Missing or invalid 'name' (must be a non-empty string).` };
    }
    const amountValue = parseFloat(bill.amount);
    if (typeof bill.amount !== "string" || isNaN(amountValue) || amountValue <= 0) {
      return { isValid: false, error: `Bill #${billNumber} ('${bill.name}'): 'amount' must be a string representing a positive number.` };
    }
    if (amountValue > 1000000) {
      return { isValid: false, error: `Bill #${billNumber} ('${bill.name}'): Amount cannot exceed $1,000,000.` };
    }
    if (typeof bill.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(bill.date)) {
      return { isValid: false, error: `Bill #${billNumber} ('${bill.name}'): 'date' must be in YYYY-MM-DD format.` };
    }
    const billDate = new Date(bill.date);
    if (isNaN(billDate.getTime()) || billDate.getUTCFullYear() !== 2025) {
        return { isValid: false, error: `Bill #${billNumber} ('${bill.name}'): Date must be within the year 2025.` };
    }
    if (typeof bill.icon !== "string" || !ICON_KEYS.includes(bill.icon)) {
        return { isValid: false, error: `Bill #${billNumber} ('${bill.name}'): Contains an invalid 'icon' name.` };
    }
  }

  // 3. If all checks pass
  return { isValid: true, error: null };
};