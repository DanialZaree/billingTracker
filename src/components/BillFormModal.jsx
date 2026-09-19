import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { ICON_CATEGORIES, getCategoryForIcon } from "../utils/icons";
import IconComponent from "./IconComponent";

const BillFormModal = ({ isOpen, onClose, onSave, billToEdit = null, selectedYear = new Date().getFullYear() }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Receipt");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(0);
  const [error, setError] = useState("");

  const isEditing = Boolean(billToEdit);

  useEffect(() => {
    if (billToEdit) {
      setName(billToEdit.name || "");
      setAmount(String(billToEdit.amount || ""));
      setDate(billToEdit.date || "");
      const icon = billToEdit.icon || "Receipt";
      setSelectedIcon(icon);
      const catIndex = ICON_CATEGORIES.findIndex((cat) => cat.icons.includes(icon));
      if (catIndex !== -1) {
        setSelectedCategoryTab(catIndex);
      }
    } else {
      setName("");
      setAmount("");
      const today = new Date();
      const currentYear = today.getFullYear();
      if (selectedYear === currentYear) {
        setDate(today.toISOString().split("T")[0]);
      } else {
        setDate(`${selectedYear}-01-01`);
      }
      setSelectedIcon("Receipt");
      const defaultCatIndex = ICON_CATEGORIES.findIndex((cat) => cat.icons.includes("Receipt"));
      setSelectedCategoryTab(defaultCatIndex !== -1 ? defaultCatIndex : 0);
    }
    setError("");
  }, [billToEdit, selectedYear, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const numAmount = parseFloat(amount);

    if (!cleanName) {
      setError("Please enter a bill name.");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (numAmount > 1000000) {
      setError("Amount cannot exceed $1,000,000.");
      return;
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Please select a valid date.");
      return;
    }

    const categoryObj = getCategoryForIcon(selectedIcon);
    onSave({
      ...(billToEdit ? { id: billToEdit.id } : {}),
      name: cleanName,
      amount: String(numAmount.toFixed(2)),
      date,
      icon: selectedIcon,
      category: categoryObj.name,
    });
    onClose();
  };

  const currentCategory = ICON_CATEGORIES[selectedCategoryTab] || ICON_CATEGORIES[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-4 sm:p-7 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto touch-scroll animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-poppins">
          {isEditing ? "Edit Bill" : "Add New Bill"}
        </h2>
        <p className="text-xs text-slate-500 mb-4 sm:mb-5">
          {isEditing ? "Update bill details and category" : "Record an expense with date and category icon"}
        </p>

        {error && (
          <div className="p-3 mb-4 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Bill / Expense Name
            </label>
            <input
              type="text"
              placeholder="e.g. Electric Bill, Grocery Store, Rent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000000"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Bill Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 text-sm transition-all"
              />
            </div>
          </div>

          {/* Icon Selector with Category Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Select Category Icon
            </label>

            <div className="flex gap-1.5 overflow-x-auto touch-scroll pb-2 border-b border-slate-100 mb-2.5 text-xs no-scrollbar">
              {ICON_CATEGORIES.map((cat, idx) => (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setSelectedCategoryTab(idx)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-[11px] sm:text-xs select-none ${
                    selectedCategoryTab === idx
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 gap-1.5 sm:gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 max-h-32 sm:max-h-36 overflow-y-auto touch-scroll">
              {currentCategory.icons.map((iconName) => {
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    title={iconName}
                    className={`relative p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-md scale-105"
                        : "bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/60"
                    }`}
                  >
                    <IconComponent name={iconName} className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 bg-white text-emerald-600 rounded-full p-0.5 shadow-xs">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 sm:pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer font-poppins"
            >
              {isEditing ? "Save Changes" : "Add Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillFormModal;
