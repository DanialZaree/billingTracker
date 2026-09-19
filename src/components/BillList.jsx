import React, { useState, useMemo } from "react";
import { Trash2, Edit3, Search, ArrowUpDown, Filter, PlusCircle, Inbox, X } from "lucide-react";
import IconComponent from "./IconComponent";
import CustomSelect from "./CustomSelect";
import { formatCurrency, formatDate } from "../utils/helpers";
import { ICON_CATEGORIES, getCategoryForIcon } from "../utils/icons";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest" },
  { value: "date-asc", label: "Oldest" },
  { value: "amount-desc", label: "Highest $" },
  { value: "amount-asc", label: "Lowest $" },
  { value: "name-asc", label: "Name A-Z" },
];

const CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...ICON_CATEGORIES.map((cat) => ({ value: cat.id, label: cat.name })),
];

const BillList = ({
  bills = [],
  selectedView,
  selectedYear,
  onEdit,
  onDeleteClick,
  onAddClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const listTitle =
    selectedView === 12
      ? `Transactions (${selectedYear})`
      : `Transactions (${MONTH_NAMES[selectedView]})`;

  // Filter & Sort
  const processedBills = useMemo(() => {
    let list = [...bills];

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter((b) => {
        const cat = getCategoryForIcon(b.icon);
        return cat.id === selectedCategory || cat.name === selectedCategory || b.category === selectedCategory;
      });
    }

    // Text search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((b) => {
        const catName = (b.category || getCategoryForIcon(b.icon).name).toLowerCase();
        return (
          b.name.toLowerCase().includes(term) ||
          catName.includes(term) ||
          (b.icon && b.icon.toLowerCase().includes(term)) ||
          b.amount.includes(term)
        );
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "date-desc") return b.date.localeCompare(a.date);
      if (sortBy === "date-asc") return a.date.localeCompare(b.date);
      if (sortBy === "amount-desc") return parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
      if (sortBy === "amount-asc") return parseFloat(a.amount || 0) - parseFloat(b.amount || 0);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [bills, selectedCategory, searchTerm, sortBy]);

  // Pure grouping by month for Full Year view
  const groupedSections = useMemo(() => {
    if (selectedView !== 12) {
      return [{ monthLabel: null, items: processedBills }];
    }

    const groups = new Map();
    processedBills.forEach((bill) => {
      const monthIndex = parseInt(bill.date.split("-")[1], 10) - 1;
      if (!groups.has(monthIndex)) {
        groups.set(monthIndex, []);
      }
      groups.get(monthIndex).push(bill);
    });

    return Array.from(groups.entries()).map(([mIndex, items]) => ({
      monthLabel: MONTH_NAMES[mIndex],
      items,
    }));
  }, [selectedView, processedBills]);

  const hasActiveFilters = selectedCategory !== "all" || Boolean(searchTerm.trim());

  return (
    <div className="p-3.5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex flex-col gap-2.5 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 font-poppins truncate">
              {listTitle}
            </h2>
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-md bg-slate-100 text-slate-600 tabular-nums flex-shrink-0">
              {processedBills.length}
            </span>
          </div>

          {/* Selectors: Category Filter & Sort */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={CATEGORY_FILTER_OPTIONS}
              icon={<Filter className="w-3.5 h-3.5" />}
              align="right"
            />
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              icon={<ArrowUpDown className="w-3.5 h-3.5" />}
              align="right"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bills, amounts, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active Filter Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
            <span>
              Showing {processedBills.length} filtered result{processedBills.length === 1 ? "" : "s"}
            </span>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Ledger Item Rows with mobile touch scrolling */}
      <div className="flex-1 space-y-2.5 overflow-y-auto touch-scroll max-h-[480px] sm:max-h-[550px] pr-0.5 sm:pr-1">
        {processedBills.length > 0 ? (
          groupedSections.map((section, secIdx) => (
            <div key={secIdx} className="space-y-2">
              {section.monthLabel && (
                <div className="sticky top-0 z-10 py-1 px-2 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {section.monthLabel}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 tabular-nums">
                    {section.items.length} item{section.items.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}

              {section.items.map((bill) => {
                const categoryObj = getCategoryForIcon(bill.icon);
                const badgeStyle = categoryObj.color.badge;

                return (
                  <div
                    key={bill.id}
                    className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-100/90 bg-white hover:border-slate-300 hover:bg-slate-50/70 transition-all duration-150"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`flex items-center justify-center flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl border ${badgeStyle} shadow-xs`}
                      >
                        <IconComponent name={bill.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                          {bill.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-[11px] text-slate-400 truncate">
                          <span>{formatDate(bill.date)}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-500">{categoryObj.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                      <p className="text-xs sm:text-base font-bold text-slate-900 font-poppins tabular-nums">
                        {formatCurrency(bill.amount)}
                      </p>

                      <div className="flex items-center opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(bill)}
                          title="Edit transaction"
                          className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Edit ${bill.name}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(bill)}
                          title="Delete transaction"
                          className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Delete ${bill.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-center bg-slate-50/40 rounded-xl border border-dashed border-slate-200 p-4">
            <Inbox className="w-9 h-9 sm:w-10 sm:h-10 text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-700">No transactions found</p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-xs mt-0.5">
              {hasActiveFilters
                ? "Try adjusting your search query or category filter."
                : "No expenses recorded for this period yet. Click Add Bill to create one."}
            </p>
            {onAddClick && !hasActiveFilters && (
              <button
                onClick={onAddClick}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add First Bill
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillList;