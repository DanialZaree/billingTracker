import React, { useState, useLayoutEffect } from "react";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "../utils/helpers";

const BillChart = ({ chartData, selectedView }) => {
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

  const chartConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Spend ($)",
        data: chartData.data,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(52, 211, 153, 0.2)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.5)");
          gradient.addColorStop(1, "rgba(240, 253, 244, 0)");
          return gradient;
        },
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2.5,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  };

  const chartTitle =
    selectedView === 12
      ? "Full Year Spend (2025)"
      : `Daily Spend for ${new Date(2025, selectedView).toLocaleString(
          "default",
          { month: "long" }
        )}`;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: chartTitle,
        color: "#1f2937",
        font: { size: 18, weight: "600", family: "'Poppins', sans-serif" },
      },
      tooltip: {
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
        ticks: { color: "#4b5563" },
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
      },
      x: {
        ticks: {
          color: "#4b5563",
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
  };

  return (
    <div className="p-4 mb-8 bg-white shadow-lg sm:p-6 rounded-xl">
      <div className="h-64 sm:h-80">
        <Line options={chartOptions} data={chartConfig} />
      </div>
    </div>
  );
};

export default BillChart;
