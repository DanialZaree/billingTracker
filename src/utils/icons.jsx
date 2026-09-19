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
      badge: "bg-blue-600/30 text-blue-700 border-blue-600/30",
      pill: "bg-blue-600/30 text-blue-700",
      bar: "bg-blue-500",
    },
    icons: ["Home", "Zap", "Droplet", "Flame", "Wifi", "Wrench", "Trash2", "ShieldCheck"],
  },
  {
    id: "food",
    name: "Food & Dining",
    color: {
      badge: "bg-amber-600/30 text-amber-700 border-amber-600/30",
      pill: "bg-amber-600/30 text-amber-700",
      bar: "bg-amber-500",
    },
    icons: ["ShoppingCart", "Utensils", "Coffee", "Pizza", "Beer"],
  },
  {
    id: "transport",
    name: "Transportation",
    color: {
      badge: "bg-indigo-600/30 text-indigo-700 border-indigo-600/30",
      pill: "bg-indigo-600/30 text-indigo-700",
      bar: "bg-indigo-500",
    },
    icons: ["Car", "Fuel", "Bus", "Train", "Plane", "Bike"],
  },
  {
    id: "health",
    name: "Health & Wellness",
    color: {
      badge: "bg-rose-600/30 text-rose-700 border-rose-600/30",
      pill: "bg-rose-600/30 text-rose-700",
      bar: "bg-rose-500",
    },
    icons: ["Heart", "HeartPulse", "Stethoscope", "Pill", "Dumbbell", "Activity"],
  },
  {
    id: "entertainment",
    name: "Entertainment & Leisure",
    color: {
      badge: "bg-purple-600/30 text-purple-700 border-purple-600/30",
      pill: "bg-purple-600/30 text-purple-700",
      bar: "bg-purple-500",
    },
    icons: ["Film", "Tv", "Gamepad2", "Music", "Ticket", "PartyPopper"],
  },
  {
    id: "shopping",
    name: "Shopping & Personal",
    color: {
      badge: "bg-pink-600/30 text-pink-700 border-pink-600/30",
      pill: "bg-pink-600/30 text-pink-700",
      bar: "bg-pink-500",
    },
    icons: ["ShoppingBag", "Shirt", "Package", "Sparkles", "Scissors", "Gift"],
  },
  {
    id: "tech",
    name: "Technology & Subscriptions",
    color: {
      badge: "bg-cyan-600/30 text-cyan-700 border-cyan-600/30",
      pill: "bg-cyan-600/30 text-cyan-700",
      bar: "bg-cyan-500",
    },
    icons: ["Smartphone", "Laptop", "Cloud", "Globe", "Lock", "Headphones"],
  },
  {
    id: "education",
    name: "Education & Learning",
    color: {
      badge: "bg-emerald-600/30 text-emerald-700 border-emerald-600/30",
      pill: "bg-emerald-600/30 text-emerald-700",
      bar: "bg-emerald-500",
    },
    icons: ["GraduationCap", "Book", "BookOpen", "Briefcase"],
  },
  {
    id: "finance",
    name: "Finance & Investments",
    color: {
      badge: "bg-teal-600/30 text-teal-800 border-teal-600/30",
      pill: "bg-teal-600/30 text-teal-800",
      bar: "bg-teal-600",
    },
    icons: ["Receipt", "DollarSign", "CreditCard", "Wallet", "Landmark", "TrendingUp", "FileText"],
  },
  {
    id: "family",
    name: "Family & Pets",
    color: {
      badge: "bg-orange-600/30 text-orange-700 border-orange-600/30",
      pill: "bg-orange-600/30 text-orange-700",
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