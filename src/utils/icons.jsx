import {
  // Housing & Utilities
  Home,
  Zap,
  Droplet,
  Flame,
  Wifi,
  Wrench,
  Trash2,
  ShieldCheck,

  // Food & Dining
  ShoppingCart,
  Utensils,
  Coffee,
  Pizza,
  Beer,

  // Transportation
  Car,
  Fuel,
  Bus,
  Train,
  Plane,
  Bike,

  // Health & Wellness
  Heart,
  HeartPulse,
  Stethoscope,
  Pill,
  Dumbbell,
  Activity,

  // Entertainment & Leisure
  Film,
  Tv,
  Gamepad2,
  Music,
  Ticket,
  PartyPopper,

  // Shopping & Personal
  ShoppingBag,
  Shirt,
  Package,
  Sparkles,
  Scissors,
  Gift,

  // Technology & Subscriptions
  Smartphone,
  Laptop,
  Cloud,
  Globe,
  Lock,
  Headphones,

  // Education & Learning
  GraduationCap,
  Book,
  BookOpen,
  Briefcase,

  // Finance & Investments
  Receipt,
  DollarSign,
  CreditCard,
  Wallet,
  Landmark,
  TrendingUp,
  FileText,

  // Family & Pets
  PawPrint,
  Baby,
} from "lucide-react";

/**
 * Mapping of all supported icon identifiers to Lucide icon components.
 */
export const ICON_COMPONENTS = {
  // Housing & Utilities
  Home,
  Zap,
  Droplet,
  Flame,
  Wifi,
  Wrench,
  Trash2,
  ShieldCheck,

  // Food & Dining
  ShoppingCart,
  Utensils,
  Coffee,
  Pizza,
  Beer,

  // Transportation
  Car,
  Fuel,
  Bus,
  Train,
  Plane,
  Bike,

  // Health & Wellness
  Heart,
  HeartPulse,
  Stethoscope,
  Pill,
  Dumbbell,
  Activity,

  // Entertainment & Leisure
  Film,
  Tv,
  Gamepad2,
  Music,
  Ticket,
  PartyPopper,

  // Shopping & Personal
  ShoppingBag,
  Shirt,
  Package,
  Sparkles,
  Scissors,
  Gift,

  // Technology & Subscriptions
  Smartphone,
  Laptop,
  Cloud,
  Globe,
  Lock,
  Headphones,

  // Education & Learning
  GraduationCap,
  Book,
  BookOpen,
  Briefcase,

  // Finance & Investments
  Receipt,
  DollarSign,
  CreditCard,
  Wallet,
  Landmark,
  TrendingUp,
  FileText,

  // Family & Pets
  PawPrint,
  Baby,
};

export const ICON_KEYS = Object.keys(ICON_COMPONENTS);

/**
 * Categorized icon list for structured display in picker and filtering.
 */
export const ICON_CATEGORIES = [
  {
    id: "housing",
    name: "Housing & Utilities",
    color: {
      badge: "bg-blue-50 text-blue-700 border-blue-200/70",
      pill: "bg-blue-100 text-blue-700",
      bar: "bg-blue-500",
    },
    icons: ["Home", "Zap", "Droplet", "Flame", "Wifi", "Wrench", "Trash2", "ShieldCheck"],
  },
  {
    id: "food",
    name: "Food & Dining",
    color: {
      badge: "bg-amber-50 text-amber-700 border-amber-200/70",
      pill: "bg-amber-100 text-amber-700",
      bar: "bg-amber-500",
    },
    icons: ["ShoppingCart", "Utensils", "Coffee", "Pizza", "Beer"],
  },
  {
    id: "transport",
    name: "Transportation",
    color: {
      badge: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
      pill: "bg-indigo-100 text-indigo-700",
      bar: "bg-indigo-500",
    },
    icons: ["Car", "Fuel", "Bus", "Train", "Plane", "Bike"],
  },
  {
    id: "health",
    name: "Health & Wellness",
    color: {
      badge: "bg-rose-50 text-rose-700 border-rose-200/70",
      pill: "bg-rose-100 text-rose-700",
      bar: "bg-rose-500",
    },
    icons: ["Heart", "HeartPulse", "Stethoscope", "Pill", "Dumbbell", "Activity"],
  },
  {
    id: "entertainment",
    name: "Entertainment & Leisure",
    color: {
      badge: "bg-purple-50 text-purple-700 border-purple-200/70",
      pill: "bg-purple-100 text-purple-700",
      bar: "bg-purple-500",
    },
    icons: ["Film", "Tv", "Gamepad2", "Music", "Ticket", "PartyPopper"],
  },
  {
    id: "shopping",
    name: "Shopping & Personal",
    color: {
      badge: "bg-pink-50 text-pink-700 border-pink-200/70",
      pill: "bg-pink-100 text-pink-700",
      bar: "bg-pink-500",
    },
    icons: ["ShoppingBag", "Shirt", "Package", "Sparkles", "Scissors", "Gift"],
  },
  {
    id: "tech",
    name: "Technology & Subscriptions",
    color: {
      badge: "bg-cyan-50 text-cyan-700 border-cyan-200/70",
      pill: "bg-cyan-100 text-cyan-700",
      bar: "bg-cyan-500",
    },
    icons: ["Smartphone", "Laptop", "Cloud", "Globe", "Lock", "Headphones"],
  },
  {
    id: "education",
    name: "Education & Learning",
    color: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
      pill: "bg-emerald-100 text-emerald-700",
      bar: "bg-emerald-500",
    },
    icons: ["GraduationCap", "Book", "BookOpen", "Briefcase"],
  },
  {
    id: "finance",
    name: "Finance & Investments",
    color: {
      badge: "bg-teal-50 text-teal-800 border-teal-200/70",
      pill: "bg-teal-100 text-teal-800",
      bar: "bg-teal-600",
    },
    icons: ["Receipt", "DollarSign", "CreditCard", "Wallet", "Landmark", "TrendingUp", "FileText"],
  },
  {
    id: "family",
    name: "Family & Pets",
    color: {
      badge: "bg-orange-50 text-orange-700 border-orange-200/70",
      pill: "bg-orange-100 text-orange-700",
      bar: "bg-orange-500",
    },
    icons: ["PawPrint", "Baby"],
  },
];

// Pre-compute reverse map for O(1) lookups
const ICON_TO_CATEGORY_MAP = {};
ICON_CATEGORIES.forEach((cat) => {
  cat.icons.forEach((iconName) => {
    ICON_TO_CATEGORY_MAP[iconName] = cat;
  });
});

const DEFAULT_CATEGORY = ICON_CATEGORIES[8]; // Finance & Investments

/**
 * Returns the category object for a given icon name.
 */
export const getCategoryForIcon = (iconName) => {
  return ICON_TO_CATEGORY_MAP[iconName] || DEFAULT_CATEGORY;
};

/**
 * Returns the display name of the category for a given icon.
 */
export const getCategoryName = (iconName) => {
  return getCategoryForIcon(iconName).name;
};

/**
 * Returns the badge CSS styling for a given icon.
 */
export const getCategoryBadgeStyle = (iconName) => {
  return getCategoryForIcon(iconName).color.badge;
};

/**
 * Returns the color and progress bar CSS styling for a given icon.
 */
export const getCategoryColorStyle = (iconName) => {
  const cat = getCategoryForIcon(iconName);
  return { bg: cat.color.pill, bar: cat.color.bar };
};

/**
 * Helper to get the Lucide component or fallback to DollarSign.
 */
export const getIconComponent = (iconName) => {
  if (iconName && ICON_COMPONENTS[iconName]) {
    return ICON_COMPONENTS[iconName];
  }
  return DollarSign;
};