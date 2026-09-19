import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { LineChart as LineIcon, BarChart3, TrendingDown } from "lucide-react";
import { formatCurrency } from "../utils/helpers";

const BillChart = ({ chartData, selectedView, selectedYear, totalAmount = 0 }) => {
  const [chartType, setChartType] = useState("line");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const chartTitle =
    selectedView === 12
      ? `Annual Expenditure (${selectedYear})`
      : `${months[selectedView]} ${selectedYear} Trajectory`;

  const hasData = chartData && chartData.data && chartData.data.some((val) => val > 0);

  const lineConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Spend",
        data: chartData.data,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(16, 185, 129, 0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.35)");
          gradient.addColorStop(1, "rgba(240, 253, 244, 0.0)");
          return gradient;
        },
        borderColor: "#059669",
        borderWidth: 2,
        pointBackgroundColor: "#059669",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 2.5,
        pointHoverRadius: 5,
        tension: 0.3,
      },
    ],
  };

  const barConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Spend",
        data: chartData.data,
        backgroundColor: "#10b981",
        hoverBackgroundColor: "#059669",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { size: 11, weight: "600" },
        bodyFont: { size: 11 },
        padding: 8,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Spend: ${formatCurrency(context.parsed.y || 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          font: { size: 10 },
          callback: (value) => `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`,
        },
        grid: {
          color: "rgba(226, 232, 240, 0.8)",
        },
        border: {
          dash: [3, 3],
        },
      },
      x: {
        ticks: {
          color: "#64748b",
          font: { size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="p-3.5 sm:p-6 mb-5 sm:mb-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 font-poppins">
              {chartTitle}
            </h2>
            {hasData && (
              <span className="px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 tabular-nums">
                {formatCurrency(totalAmount)}
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Expenditure trajectory over time</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-100 rounded-xl self-start sm:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              chartType === "line"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Line</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              chartType === "bar"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
        </div>
      </div>

      <div className="relative h-56 sm:h-72 w-full">
        {hasData ? (
          chartType === "line" ? (
            <Line options={chartOptions} data={lineConfig} />
          ) : (
            <Bar options={chartOptions} data={barConfig} />
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4 text-center">
            <TrendingDown className="w-8 h-8 mb-2 stroke-[1.5] text-slate-300" />
            <p className="text-xs font-bold text-slate-700">No recorded spending for this timeframe</p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Expenses added will plot automatically here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillChart;
