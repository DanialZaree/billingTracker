import React from "react";

const MonthSelector = ({ selectedView, setSelectedView }) => {
  const selections = [
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
    { label: "Full Year", full: "Entire Year Overview" },
  ];

  return (
    <div className="mb-6">
      <div className="p-1.5 bg-slate-200/70 backdrop-blur-sm rounded-2xl flex items-center overflow-x-auto no-scrollbar shadow-inner">
        {selections.map((item, index) => {
          const isActive = selectedView === index;
          return (
            <button
              key={item.label}
              onClick={() => setSelectedView(index)}
              title={item.full}
              className={`flex-1 min-w-[56px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer text-center ${
                isActive
                  ? "bg-white text-emerald-700 shadow-md scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthSelector;
