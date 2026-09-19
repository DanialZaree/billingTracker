import React from "react";
import { DollarSign, Calculator, ReceiptText, TrendingUp } from "lucide-react";
import { formatCurrency } from "../utils/helpers";

const KeyStatistics = ({ total = 0, count = 0, maxBill = null }) => {
  const average = count > 0 ? total / count : 0;

  return (
    <div className="mb-5 sm:mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Spend (Hero Metric) */}
        <div className="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-emerald-200/90 shadow-xs relative overflow-hidden group min-w-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800 truncate">
              Total Outflow
            </span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-poppins tabular-nums truncate">
            {formatCurrency(total)}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
            {count > 0 ? `${count} active bill${count === 1 ? "" : "s"}` : "No bills"}
          </p>
        </div>

        {/* Average Bill */}
        <div className="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs min-w-0">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              Average Expense
            </span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-slate-100 text-slate-600 flex-shrink-0">
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-poppins tabular-nums truncate">
            {formatCurrency(average)}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
            {count > 0 ? "Per transaction" : "No activity"}
          </p>
        </div>

        {/* Bill Count */}
        <div className="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs min-w-0">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              Bill Count
            </span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-slate-100 text-slate-600 flex-shrink-0">
              <ReceiptText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-poppins tabular-nums truncate">
            {count}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
            {count === 1 ? "Single bill logged" : "Total items logged"}
          </p>
        </div>

        {/* Highest Expense */}
        <div className="p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs min-w-0">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              Largest Bill
            </span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-slate-100 text-slate-600 flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight font-poppins tabular-nums truncate">
            {maxBill ? formatCurrency(parseFloat(maxBill.amount || 0)) : "$0.00"}
          </p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
            {maxBill ? maxBill.name : "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyStatistics;
