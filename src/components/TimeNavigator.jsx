import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import CustomSelect from "./CustomSelect";

const MONTHS = [
  { label: "Jan", full: "January" },
  { label: "Feb", full: "February" },
  { label: "Mar", full: "March" },
  { label: "Apr", full: "April" },
  { label: "May", full: "May" },
  { label: "Jun", full: "June" },
  { label: "Jul", full: "July" },
  { label: "Aug", full: "August" },
  { label: "Sep", full: "September" },
  { label: "Oct", full: "October" },
  { label: "Nov", full: "November" },
  { label: "Dec", full: "December" },
  { label: "Full Year", full: "All 12 Months" },
];

const TimeNavigator = ({
  selectedYear,
  onYearChange,
  availableYears = [],
  selectedView,
  setSelectedView,
}) => {
  const currentRealYear = new Date().getFullYear();
  const currentRealMonth = new Date().getMonth();
  const activePillRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const isCurrentPeriod = selectedYear === currentRealYear && selectedView === currentRealMonth;

  const handlePrevYear = () => onYearChange(selectedYear - 1);
  const handleNextYear = () => onYearChange(selectedYear + 1);

  const handleJumpCurrent = () => {
    onYearChange(currentRealYear);
    setSelectedView(currentRealMonth);
  };

  // Auto scroll active month pill into view on mobile
  useEffect(() => {
    if (activePillRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const pill = activePillRef.current;
      const pillLeft = pill.offsetLeft;
      const pillWidth = pill.offsetWidth;
      const containerWidth = container.offsetWidth;

      container.scrollTo({
        left: pillLeft - containerWidth / 2 + pillWidth / 2,
        behavior: "smooth",
      });
    }
  }, [selectedView]);

  const yearOptions = Array.from(new Set([selectedYear, ...availableYears]))
    .sort((a, b) => b - a)
    .map((yr) => ({
      value: yr,
      label: String(yr),
    }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2 sm:p-2.5 mb-5 sm:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
      {/* Year Control Segment */}
      <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-2 sm:px-2.5 py-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Year:</span>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={handlePrevYear}
            className="p-1 sm:p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <CustomSelect
            value={selectedYear}
            onChange={(val) => onYearChange(parseInt(val, 10))}
            options={yearOptions}
            className="bg-transparent border-0 shadow-none px-1 py-0.5 text-xs sm:text-sm font-bold text-slate-900"
            align="left"
          />

          <button
            type="button"
            onClick={handleNextYear}
            className="p-1 sm:p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Next year"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {!isCurrentPeriod && (
          <button
            type="button"
            onClick={handleJumpCurrent}
            className="ml-auto sm:ml-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-2 py-0.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            This Month
          </button>
        )}
      </div>

      {/* Month Pills Segment with smooth touch scrolling */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-w-0 overflow-x-auto touch-scroll no-scrollbar"
      >
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl w-max sm:w-full justify-between">
          {MONTHS.map((item, index) => {
            const isActive = selectedView === index;
            return (
              <button
                key={item.label}
                ref={isActive ? activePillRef : null}
                type="button"
                onClick={() => setSelectedView(index)}
                title={item.full}
                className={`flex-1 min-w-[46px] sm:min-w-[50px] px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer text-center select-none ${
                  isActive
                    ? "bg-white text-emerald-700 shadow-xs scale-[1.02] font-bold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeNavigator;
