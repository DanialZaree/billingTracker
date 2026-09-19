import { sanitizeAmount } from "./helpers";
import { getCategoryName } from "./icons";

/**
 * Utility to safely download a Blob as a file in the browser.
 */
const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * Safely export bills as structured JSON with schema metadata.
 */
export const exportToJSON = (bills, options = {}) => {
  const { filename = `billing-data-${new Date().toISOString().split("T")[0]}.json`, scope = "all" } = options;

  const totalSpend = bills.reduce((sum, bill) => sanitizeAmount(sum + parseFloat(bill.amount || 0)), 0);

  const payload = {
    appName: "Billing Tracker",
    version: 1,
    exportedAt: new Date().toISOString(),
    scope,
    totalBills: bills.length,
    totalAmount: totalSpend,
    bills: bills.map((b) => ({
      id: b.id,
      name: b.name,
      amount: b.amount,
      date: b.date,
      icon: b.icon,
      category: b.category || getCategoryName(b.icon),
    })),
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
  triggerDownload(blob, filename);
};

/**
 * Export bills to CSV format for spreadsheets (Excel, Google Sheets).
 */
export const exportToCSV = (bills, options = {}) => {
  const { filename = `billing-data-${new Date().toISOString().split("T")[0]}.csv` } = options;

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headers = ["ID", "Name", "Amount ($)", "Date", "Category", "Icon"];
  const rows = bills.map((bill) => [
    escapeCSV(bill.id),
    escapeCSV(bill.name),
    escapeCSV(bill.amount),
    escapeCSV(bill.date),
    escapeCSV(bill.category || getCategoryName(bill.icon)),
    escapeCSV(bill.icon),
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
};

/**
 * Generates realistic sample bills spanning multiple months and years.
 */
export const generateSampleData = () => {
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;

  const samples = [
    // Current Year Bills
    { id: "sample-1", name: "High-Speed Fiber Internet", amount: "69.99", date: `${currentYear}-01-05`, icon: "Wifi", category: "Housing & Utilities" },
    { id: "sample-2", name: "Electric & Power Grid", amount: "115.40", date: `${currentYear}-01-12`, icon: "Zap", category: "Housing & Utilities" },
    { id: "sample-3", name: "Organic Market Groceries", amount: "245.80", date: `${currentYear}-01-18`, icon: "ShoppingCart", category: "Food & Dining" },
    { id: "sample-4", name: "4K Streaming Bundle", amount: "29.99", date: `${currentYear}-01-20`, icon: "Tv", category: "Entertainment & Leisure" },
    { id: "sample-5", name: "Fitness Club Membership", amount: "55.00", date: `${currentYear}-02-01`, icon: "Dumbbell", category: "Health & Wellness" },
    { id: "sample-6", name: "Vehicle Auto Insurance", amount: "135.00", date: `${currentYear}-02-10`, icon: "Car", category: "Transportation" },
    { id: "sample-7", name: "City Water Utility", amount: "42.50", date: `${currentYear}-02-14`, icon: "Droplet", category: "Housing & Utilities" },
    { id: "sample-8", name: "Unlimited 5G Mobile Plan", amount: "60.00", date: `${currentYear}-02-22`, icon: "Smartphone", category: "Technology & Subscriptions" },
    { id: "sample-9", name: "Monthly Apartment Rent", amount: "1250.00", date: `${currentYear}-03-01`, icon: "Home", category: "Housing & Utilities" },
    { id: "sample-10", name: "Italian Bistro Dinner", amount: "84.25", date: `${currentYear}-03-08`, icon: "Utensils", category: "Food & Dining" },
    { id: "sample-11", name: "Artisan Coffee Roasters", amount: "28.50", date: `${currentYear}-03-15`, icon: "Coffee", category: "Food & Dining" },
    { id: "sample-12", name: "Prescription & Pharmacy", amount: "38.20", date: `${currentYear}-03-24`, icon: "Pill", category: "Health & Wellness" },
    { id: "sample-13", name: "Monthly Apartment Rent", amount: "1250.00", date: `${currentYear}-04-01`, icon: "Home", category: "Housing & Utilities" },
    { id: "sample-14", name: "Electric & Heating", amount: "98.20", date: `${currentYear}-04-12`, icon: "Flame", category: "Housing & Utilities" },
    { id: "sample-15", name: "Supermarket Restock", amount: "310.45", date: `${currentYear}-04-19`, icon: "ShoppingCart", category: "Food & Dining" },
    { id: "sample-16", name: "Cloud Storage & SaaS", amount: "19.99", date: `${currentYear}-04-25`, icon: "Cloud", category: "Technology & Subscriptions" },
    { id: "sample-17", name: "Roundtrip Airline Tickets", amount: "420.00", date: `${currentYear}-05-08`, icon: "Plane", category: "Transportation" },
    { id: "sample-18", name: "Online Learning Course", amount: "79.00", date: `${currentYear}-05-14`, icon: "BookOpen", category: "Education & Learning" },
    { id: "sample-19", name: "Monthly Apartment Rent", amount: "1250.00", date: `${currentYear}-06-01`, icon: "Home", category: "Housing & Utilities" },
    { id: "sample-20", name: "Summer Electric AC Bill", amount: "142.10", date: `${currentYear}-06-15`, icon: "Zap", category: "Housing & Utilities" },
    { id: "sample-21", name: "Concert Festival Tickets", amount: "125.00", date: `${currentYear}-06-22`, icon: "Ticket", category: "Entertainment & Leisure" },
    { id: "sample-22", name: "Pet Nutrition & Vet Check", amount: "88.50", date: `${currentYear}-07-04`, icon: "PawPrint", category: "Family & Pets" },
    { id: "sample-23", name: "Gasoline & Fuel", amount: "65.40", date: `${currentYear}-07-18`, icon: "Fuel", category: "Transportation" },
    { id: "sample-24", name: "Monthly Apartment Rent", amount: "1250.00", date: `${currentYear}-08-01`, icon: "Home", category: "Housing & Utilities" },
    { id: "sample-25", name: "Online Order Delivery", amount: "74.95", date: `${currentYear}-08-16`, icon: "Package", category: "Shopping & Personal" },
    { id: "sample-26", name: "Annual Home Insurance", amount: "450.00", date: `${currentYear}-09-02`, icon: "ShieldCheck", category: "Housing & Utilities" },
    { id: "sample-27", name: "Weekly Groceries", amount: "189.30", date: `${currentYear}-09-10`, icon: "ShoppingCart", category: "Food & Dining" },

    // Previous Year Reference Bills
    { id: "sample-prev-1", name: "Apartment Rent", amount: "1200.00", date: `${prevYear}-01-01`, icon: "Home", category: "Housing & Utilities" },
    { id: "sample-prev-2", name: "Electric & Power", amount: "105.00", date: `${prevYear}-01-15`, icon: "Zap", category: "Housing & Utilities" },
    { id: "sample-prev-3", name: "Groceries", amount: "280.00", date: `${prevYear}-02-10`, icon: "ShoppingCart", category: "Food & Dining" },
    { id: "sample-prev-4", name: "Apartment Rent", amount: "1200.00", date: `${prevYear}-06-01`, icon: "Home", category: "Housing & Utilities" },
    { id: "sample-prev-5", name: "Summer Vacation Flight", amount: "650.00", date: `${prevYear}-07-20`, icon: "Plane", category: "Transportation" },
    { id: "sample-prev-6", name: "Apartment Rent", amount: "1200.00", date: `${prevYear}-12-01`, icon: "Home", category: "Housing & Utilities" },
    { id: "sample-prev-7", name: "Holiday Gifts & Shopping", amount: "320.00", date: `${prevYear}-12-22`, icon: "Gift", category: "Shopping & Personal" },
  ];

  return samples;
};
