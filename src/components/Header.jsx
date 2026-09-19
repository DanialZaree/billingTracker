import React, { useState, useRef, useEffect } from "react";
import {
  Wallet,
  Plus,
  MoreHorizontal,
  Upload,
  FileJson,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";

const Header = ({
  onImportClick,
  onExportJSON,
  onExportCSV,
  onAddClick,
  onLoadSampleData,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between gap-2 sm:gap-4 pb-4 sm:pb-6 mb-4 border-b border-slate-300/80">
      {/* Brand */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-emerald-600 text-white rounded-xl sm:rounded-2xl shadow-sm shadow-emerald-600/20 flex-shrink-0">
          <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 font-poppins truncate">
              Billing Tracker
            </h1>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md">
              Personal
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
            Smart Personal Expense Manager
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Secondary Actions Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-colors shadow-xs cursor-pointer select-none"
            title="Import, export and demo options"
            aria-label="More data options"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Data Options</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-fade-in divide-y divide-slate-100">
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onImportClick();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  Import JSON File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onExportJSON();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <FileJson className="w-4 h-4 text-emerald-600" />
                  Export as JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onExportCSV();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                  Export as CSV (Excel)
                </button>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLoadSampleData();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Load Demo Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: Add Bill */}
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-emerald-600/30 cursor-pointer font-poppins select-none"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Bill</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
