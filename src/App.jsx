import React, { useState, useEffect, useMemo, useRef } from "react";
import { PlusCircle } from "lucide-react";

// Util Imports
import { registerChartComponents } from "./utils/chartConfig.jsx";
import { validateBillsData } from "./utils/validation.jsx";

// Component Imports
import Header from "./components/Header";
import MonthSelector from "./components/MonthSelector";
import BillChart from "./components/BillChart";
import KeyStatistics from "./components/KeyStatistics";
import BillList from "./components/BillList";
import BillFormModal from "./components/BillFormModal";

// Register Chart.js components once when the app module is loaded.
registerChartComponents();

// --- Main App Component ---
export default function App() {
  // --- State Management ---
  const [bills, setBills] = useState(() => {
    try {
      const localData = localStorage.getItem("billingAppBills");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error parsing bills from localStorage", error);
      return [];
    }
  });

  const [selectedView, setSelectedView] = useState(new Date().getMonth());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const importFileRef = useRef(null);

  // --- Data Persistence ---
  useEffect(() => {
    try {
      localStorage.setItem("billingAppBills", JSON.stringify(bills));
    } catch (error) {
      console.error("Error saving bills to localStorage", error);
    }
  }, [bills]);

  // --- Event Handlers ---
  const addBill = (bill) => {
    setBills((prevBills) => [...prevBills, { ...bill, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const deleteBill = (id) => {
    setBills(bills.filter((b) => b.id !== id));
  };

  const handleExport = () => {
    if (bills.length === 0) {
      alert("No data to export.");
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(bills, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "billing-data.json";
    link.click();
  };

  const handleImportClick = () => {
    importFileRef.current.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        const { isValid, error } = validateBillsData(importedData);

        if (isValid) {
          setBills(importedData);
        } else {
          alert(`Import failed: ${error}`);
        }
      } catch (error) {
        alert("Failed to parse JSON file. Ensure it's a valid JSON.");
        console.error("Failed to parse JSON file:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = null; // Reset file input
  };

  // --- Data Filtering & Memoization ---
  const filteredBills = useMemo(() => {
    const year = 2025;
    if (selectedView === 12) {
      // Full Year view
      return bills
        .filter((bill) => new Date(bill.date).getUTCFullYear() === year)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return bills
      .filter((bill) => {
        const billDate = new Date(bill.date);
        return (
          !isNaN(billDate.getTime()) &&
          billDate.getUTCFullYear() === year &&
          billDate.getUTCMonth() === selectedView
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [bills, selectedView]);

  const totalAmount = useMemo(() => {
    return filteredBills.reduce(
      (sum, bill) => sum + parseFloat(bill.amount || 0),
      0
    );
  }, [filteredBills]);

  const chartData = useMemo(() => {
    const year = 2025;
    if (selectedView === 12) {
      // Full Year Chart
      const labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const data = Array(12).fill(0);
      bills.forEach((bill) => {
        const billDate = new Date(bill.date);
        if (billDate.getUTCFullYear() === year) {
          const monthIndex = billDate.getUTCMonth();
          data[monthIndex] += parseFloat(bill.amount || 0);
        }
      });
      return { labels, data };
    } else {
      // Monthly Chart
      const daysInMonth = new Date(year, selectedView + 1, 0).getDate();
      const dailyTotals = new Map();
      filteredBills.forEach((bill) => {
        const day = new Date(bill.date).getUTCDate();
        const amount = parseFloat(bill.amount || 0);
        dailyTotals.set(day, (dailyTotals.get(day) || 0) + amount);
      });

      const labels = [];
      const data = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, selectedView, day));
        labels.push(
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })
        );
        data.push(dailyTotals.get(day) || 0);
      }
      return { labels, data };
    }
  }, [bills, selectedView, filteredBills]);

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-100 ">
      <div className="max-w-5xl p-4 mx-auto sm:p-8 ">
        <Header onExport={handleExport} onImportClick={handleImportClick} />
        <input
          type="file"
          ref={importFileRef}
          onChange={handleFileImport}
          className="hidden"
          accept="application/json"
        />
        <main>
          <MonthSelector
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
          <BillChart chartData={chartData} selectedView={selectedView} />
          <KeyStatistics total={totalAmount} count={filteredBills.length} />
          <BillList
            bills={filteredBills}
            selectedView={selectedView}
            onDelete={deleteBill}
          />
        </main>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed flex items-center justify-center w-16 h-16 text-white transition-transform transform bg-green-600 rounded-full shadow-lg cursor-pointer bottom-8 right-8 hover:bg-green-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Add new bill"
      >
        <PlusCircle size={32} />
      </button>
      {isModalOpen && (
        <BillFormModal onAdd={addBill} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
