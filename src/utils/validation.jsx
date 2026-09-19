import { ICON_KEYS, getCategoryName } from "./icons";
import { generateId, sanitizeAmount } from "./helpers";

/**
 * Validates and safely sanitizes imported bills data.
 * Supports both modern schema format ({ version: 1, bills: [...] }) and legacy raw array format ([...]).
 *
 * @param {any} rawData - Parsed JSON data to validate
 * @returns {ValidationResult}
 */
export const validateAndSanitizeBills = (rawData) => {
  const result = {
    isValid: false,
    bills: [],
    stats: {
      totalCount: 0,
      validCount: 0,
      invalidCount: 0,
      errors: [],
      warnings: [],
      totalAmount: 0,
      dateRange: null,
      years: [],
    },
    schemaVersion: 1,
    rawError: null,
  };

  if (!rawData || (typeof rawData !== "object" && !Array.isArray(rawData))) {
    result.rawError = "Invalid JSON structure: Expected an object or an array.";
    result.stats.errors.push(result.rawError);
    return result;
  }

  // Determine if wrapped schema or raw array
  let billsArray = [];
  if (Array.isArray(rawData)) {
    billsArray = rawData;
    result.schemaVersion = 1;
  } else if (rawData.bills && Array.isArray(rawData.bills)) {
    billsArray = rawData.bills;
    result.schemaVersion = typeof rawData.version === "number" ? rawData.version : 1;
  } else {
    result.rawError = "Invalid JSON structure: Could not locate a bills array in the data.";
    result.stats.errors.push(result.rawError);
    return result;
  }

  result.stats.totalCount = billsArray.length;

  if (billsArray.length === 0) {
    result.isValid = true;
    return result;
  }

  const sanitizedBills = [];
  const seenIds = new Set();
  let minDate = null;
  let maxDate = null;
  const yearsSet = new Set();

  for (let i = 0; i < billsArray.length; i++) {
    const item = billsArray[i];
    const rowNum = i + 1;

    // Check item is non-null object
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      result.stats.invalidCount++;
      result.stats.errors.push(`Bill #${rowNum}: Entry must be an object.`);
      continue;
    }

    // Name validation
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!name) {
      result.stats.invalidCount++;
      result.stats.errors.push(`Bill #${rowNum}: Missing or empty 'name'.`);
      continue;
    }

    // Amount validation & sanitization (handles both numeric and string values)
    const rawAmount = typeof item.amount === "number" ? item.amount : parseFloat(item.amount);
    if (isNaN(rawAmount) || rawAmount <= 0) {
      result.stats.invalidCount++;
      result.stats.errors.push(`Bill #${rowNum} ('${name}'): Amount must be a positive number.`);
      continue;
    }
    if (rawAmount > 1000000) {
      result.stats.invalidCount++;
      result.stats.errors.push(`Bill #${rowNum} ('${name}'): Amount exceeds maximum allowed limit ($1,000,000).`);
      continue;
    }
    const sanitizedAmount = sanitizeAmount(rawAmount);

    // Date validation & normalization
    let dateStr = "";
    if (typeof item.date === "string") {
      const match = item.date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        const y = parseInt(match[1], 10);
        const m = String(parseInt(match[2], 10)).padStart(2, "0");
        const d = String(parseInt(match[3], 10)).padStart(2, "0");
        if (y >= 1900 && y <= 2100 && parseInt(m, 10) >= 1 && parseInt(m, 10) <= 12 && parseInt(d, 10) >= 1 && parseInt(d, 10) <= 31) {
          dateStr = `${y}-${m}-${d}`;
          yearsSet.add(y);
        }
      }
    }

    if (!dateStr) {
      result.stats.invalidCount++;
      result.stats.errors.push(`Bill #${rowNum} ('${name}'): Date must be a valid date in YYYY-MM-DD format.`);
      continue;
    }

    // Update min/max date
    if (!minDate || dateStr < minDate) minDate = dateStr;
    if (!maxDate || dateStr > maxDate) maxDate = dateStr;

    // Icon validation & fallback
    let iconName = item.icon;
    if (typeof iconName !== "string" || !ICON_KEYS.includes(iconName)) {
      iconName = "Receipt";
      result.stats.warnings.push(`Bill #${rowNum} ('${name}'): Unrecognized icon '${item.icon}' defaulted to 'Receipt'.`);
    }

    // ID validation & deduplication
    let id = item.id;
    if (!id || seenIds.has(String(id))) {
      id = generateId();
    } else {
      id = String(id);
    }
    seenIds.add(String(id));

    const category =
      typeof item.category === "string" && item.category.trim()
        ? item.category.trim()
        : getCategoryName(iconName);

    sanitizedBills.push({
      id,
      name,
      amount: String(sanitizedAmount.toFixed(2)),
      date: dateStr,
      icon: iconName,
      category,
    });

    result.stats.totalAmount = sanitizeAmount(result.stats.totalAmount + sanitizedAmount);
  }

  result.stats.validCount = sanitizedBills.length;
  result.bills = sanitizedBills;
  result.stats.years = Array.from(yearsSet).sort((a, b) => b - a);

  if (minDate && maxDate) {
    result.stats.dateRange = { start: minDate, end: maxDate };
  }

  // Valid if at least one valid record was found and there were no root schema errors
  result.isValid = sanitizedBills.length > 0;

  if (sanitizedBills.length === 0 && result.stats.totalCount > 0) {
    result.rawError = "No valid bill records could be found in the provided file.";
  }

  return result;
};

/**
 * Legacy compatibility wrapper for existing calls.
 */
export const validateBillsData = (data) => {
  const result = validateAndSanitizeBills(data);
  if (!result.isValid) {
    return {
      isValid: false,
      error: result.rawError || result.stats.errors[0] || "Unknown validation error.",
    };
  }
  return { isValid: true, error: null };
};