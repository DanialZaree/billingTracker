import React, { useMemo } from "react";
import { PieChart } from "lucide-react";
import IconComponent from "./IconComponent";
import { formatCurrency, sanitizeAmount } from "../utils/helpers";
import { getCategoryForIcon } from "../utils/icons";

const CategoryBreakdown = ({ bills = [], totalAmount = 0 }) => {
  const categoryStats = useMemo(() => {
    if (!bills.length || totalAmount <= 0) return [];

    const map = new Map();
    bills.forEach((bill) => {
      const category = getCategoryForIcon(bill.icon);
      const catId = category.id;
      const amt = parseFloat(bill.amount || 0);

      const current = map.get(catId) || {
        name: category.name,
        icon: category.icons[0] || bill.icon || "Receipt",
        color: category.color,
        total: 0,
        count: 0,
      };

      map.set(catId, {
        ...current,
        total: sanitizeAmount(current.total + amt),
        count: current.count + 1,
      });
    });

    const list = Array.from(map.values()).map((item) => ({
      name: item.name,
      icon: item.icon,
      color: item.color,
      total: item.total,
      count: item.count,
      percentage: Math.round((item.total / totalAmount) * 100),
    }));

    list.sort((a, b) => b.total - a.total);
    return list.slice(0, 6);
  }, [bills, totalAmount]);

  if (!categoryStats.length) return null;

  return (
    <div className="p-3.5 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs mb-5 sm:mb-8">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-poppins truncate">
            Top Spending Categories
          </h3>
        </div>
        <span className="text-[10px] sm:text-xs text-slate-400 font-medium flex-shrink-0">By Share</span>
      </div>

      <div className="space-y-3">
        {categoryStats.map((item) => (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1 rounded-lg ${item.color.pill} flex-shrink-0`}>
                  <IconComponent name={item.icon} className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-800 truncate text-[11px] sm:text-xs">
                  {item.name}
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs font-normal truncate">
                  ({item.count} {item.count === 1 ? "bill" : "bills"})
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 font-medium tabular-nums ml-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {formatCurrency(item.total)}
                </span>
                <span className="text-slate-400 text-[10px] sm:text-[11px] w-7 text-right font-semibold">
                  {item.percentage}%
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color.bar} transition-all duration-500 ease-out`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
