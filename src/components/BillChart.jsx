import React, { useState, useLayoutEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "../utils/helpers";

const BillChart = ({ chartData, selectedView, isDarkMode }) => {
  const [tickStep, setTickStep] = useState(1);

  useLayoutEffect(() => {
    const updateTicks = () => {
      const width = window.innerWidth;
      if (width < 480) setTickStep(3);
      else if (width < 768) setTickStep(2);
      else setTickStep(1);
    };
    window.addEventListener("resize", updateTicks);
    updateTicks();
    return () => window.removeEventListener("resize", updateTicks);
  }, []);

  const chartThemeColors = useMemo(() => {
    return isDarkMode
      ? {
          backgroundColorGradientFrom: "rgba(34, 197, 94, 0.4)", // darker green
          backgroundColorGradientTo: "rgba(17, 24, 39, 0.1)", // darker background
          borderColor: "rgba(34, 197, 94, 1)", // darker green
          pointBackgroundColor: "rgba(34, 197, 94, 1)",
          pointBorderColor: "#1f2937", // dark gray
          titleColor: "#e5e7eb", // light gray
          tickColor: "#9ca3af", // medium gray
          gridColor: "rgba(255, 255, 255, 0.1)",
        }
      : {
          backgroundColorGradientFrom: "rgba(16, 185, 129, 0.5)", // original green
          backgroundColorGradientTo: "rgba(240, 253, 244, 0)", // light green-ish
          borderColor: "rgba(16, 185, 129, 1)",
          pointBackgroundColor: "rgba(16, 185, 129, 1)",
          pointBorderColor: "#fff",
          titleColor: "#1f2937", // dark gray
          tickColor: "#4b5563", // medium gray
          gridColor: "rgba(0, 0, 0, 0.05)",
        };
  }, [isDarkMode]);

  const chartConfig = useMemo(() => ({
    labels: chartData.labels,
    datasets: [
      {
        label: "Spend ($)",
        data: chartData.data,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(52, 211, 153, 0.2)"; // Fallback
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, chartThemeColors.backgroundColorGradientFrom);
          gradient.addColorStop(1, chartThemeColors.backgroundColorGradientTo);
          return gradient;
        },
        borderColor: chartThemeColors.borderColor,
        borderWidth: 2.5,
        pointBackgroundColor: chartThemeColors.pointBackgroundColor,
        pointBorderColor: chartThemeColors.pointBorderColor,
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  }), [chartData, chartThemeColors]);

  const chartTitle = useMemo(() =>
    selectedView === 12
      ? "Full Year Spend (2025)"
      : `Daily Spend for ${new Date(2025, selectedView).toLocaleString(
          "default",
          { month: "long" }
        )}`, [selectedView]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: chartTitle,
        color: chartThemeColors.titleColor,
        font: { size: 18, weight: "600", family: "'Poppins', sans-serif" },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#374151" : "#fff", // gray-700 or white
        titleColor: isDarkMode ? "#e5e7eb" : "#1f2937",
        bodyColor: isDarkMode ? "#e5e7eb" : "#1f2937",
        borderColor: isDarkMode ? "#4b5563" : "#ccc",
        borderWidth: 1,
        callbacks: {
          label: (context) =>
            `${context.dataset.label || ""}: ${formatCurrency(
              context.parsed.y || 0
            )}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: chartThemeColors.tickColor, precision: 0 },
        grid: { color: chartThemeColors.gridColor, drawBorder: false },
      },
      x: {
        ticks: {
          color: chartThemeColors.tickColor,
          callback: function (value, index) {
            return this.getLabelForValue(value).length > 0 &&
              index % tickStep === 0
              ? this.getLabelForValue(value)
              : null;
          },
        },
        grid: { display: false },
      },
    },
  }), [chartThemeColors, chartTitle, tickStep, isDarkMode, formatCurrency]); // Added formatCurrency to dependency array

  return (
    <div className="p-4 mb-8 bg-white shadow-lg sm:p-6 rounded-xl dark:bg-gray-800 dark:border dark:border-gray-700">
      <div className="h-64 sm:h-80">
        {/* Key prop forces re-render when isDarkMode changes, ensuring Chart.js picks up new options */}
        <Line options={chartOptions} data={chartConfig} key={isDarkMode ? 'dark' : 'light'} />
      </div>
    </div>
  );
};

export default BillChart;
