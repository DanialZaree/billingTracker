import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";

// Util Imports
import { registerChartComponents } from "./utils/chartConfig";
import { formatCurrency, sanitizeAmount, getAvailableYears, generateId } from "./utils/helpers";
import { exportToJSON, exportToCSV, generateSampleData } from "./utils/exportImport";

// Component Imports
import Header from "./components/Header";
import TimeNavigator from "./components/TimeNavigator";
import KeyStatistics from "./components/KeyStatistics";
import BillChart from "./components/BillChart";
import CategoryBreakdown from "./components/CategoryBreakdown";
import BillList from "./components/BillList";
import BillFormModal from "./components/BillFormModal";
import ImportModal from "./components/ImportModal";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

// Register Chart.js components once
registerChartComponents();

const STORAGE_KEY = "billingAppBills_v2";
const LEGACY_STORAGE_KEY = "billingAppBills";

export default function App() {
  const currentYear = new Date().getFullYear();

  // --- State Management ---
  const [bills, setBills] = useState(() => {
    try {
      const localData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          return parsed;
        } else if (parsed && Array.isArray(parsed.bills)) {
          return parsed.bills;
        }
      }
    } catch (error) {
      console.error("Error loading bills from localStorage:", error);
    }
    return generateSampleData();
  });

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedView, setSelectedView] = useState(new Date().getMonth());
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (title, message, type = "info") => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Data Persistence ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
    } catch (error) {
      console.error("Error saving bills to localStorage:", error);
      showToast("Storage Error", "Could not save bills to local storage.", "error");
    }
  }, [bills]);

  // Extract available years
  const availableYears = useMemo(() => {
    return getAvailableYears(bills, currentYear);
  }, [bills, currentYear]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // --- CRUD Operations ---
  const handleSaveBill = (billData) => {
    if (editingBill) {
      setBills((prev) =>
        prev.map((b) => (b.id === editingBill.id ? { ...b, ...billData, id: editingBill.id } : b))
      );
      showToast("Bill Updated", `"${billData.name}" has been updated.`, "success");
      setEditingBill(null);
    } else {
      const newBill = {
        ...billData,
        id: generateId(),
      };
      setBills((prev) => [newBill, ...prev]);

      const billYear = parseInt(billData.date.split("-")[0], 10);
      if (!isNaN(billYear) && billYear !== selectedYear) {
        setSelectedYear(billYear);
      }
      showToast("Bill Added", `"${billData.name}" (${formatCurrency(billData.amount)}) recorded.`, "success");
    }
    setIsFormModalOpen(false);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setIsFormModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!billToDelete) return;
    const name = billToDelete.name;
    setBills((prev) => prev.filter((b) => b.id !== billToDelete.id));
    showToast("Bill Deleted", `"${name}" removed.`, "info");
    setBillToDelete(null);
  };

  // --- Import / Export Handlers ---
  const handleExportJSON = () => {
    if (bills.length === 0) {
      showToast("Export Notice", "No billing data available to export.", "warning");
      return;
    }
    try {
      exportToJSON(bills, { scope: "all" });
      showToast("Export Complete", `Exported ${bills.length} bills as JSON.`, "success");
    } catch (err) {
      showToast("Export Failed", err.message, "error");
    }
  };

  const handleExportCSV = () => {
    if (bills.length === 0) {
      showToast("Export Notice", "No billing data available to export.", "warning");
      return;
    }
    try {
      exportToCSV(bills);
      showToast("Export Complete", `Exported ${bills.length} bills to CSV.`, "success");
    } catch (err) {
      showToast("Export Failed", err.message, "error");
    }
  };

  const handleImportData = (importedBills, mode) => {
    if (mode === "replace") {
      setBills(importedBills);
      showToast("Data Replaced", `Replaced records with ${importedBills.length} imported bills.`, "success");
    } else {
      const existingIds = new Set(bills.map((b) => String(b.id)));
      const adjustedBills = importedBills.map((bill) => {
        if (existingIds.has(String(bill.id))) {
          return { ...bill, id: generateId() };
        }
        return bill;
      });
      setBills((prev) => [...prev, ...adjustedBills]);
      showToast("Data Merged", `Merged ${adjustedBills.length} bills with your records.`, "success");
    }
  };

  const handleLoadSampleData = () => {
    const samples = generateSampleData();
    setBills(samples);
    setSelectedYear(currentYear);
    showToast("Demo Loaded", `Populated tracker with ${samples.length} sample expenses.`, "success");
  };

  // --- Data Filtering & Memoization ---
  const filteredBills = useMemo(() => {
    return bills
      .filter((bill) => {
        if (!bill || !bill.date) return false;
        const [yStr, mStr] = bill.date.split("-");
        const bYear = parseInt(yStr, 10);
        const bMonth = parseInt(mStr, 10) - 1;

        if (bYear !== selectedYear) return false;
        if (selectedView === 12) return true;
        return bMonth === selectedView;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [bills, selectedYear, selectedView]);

  const totalAmount = useMemo(() => {
    return filteredBills.reduce((sum, bill) => {
      return sanitizeAmount(sum + parseFloat(bill.amount || 0));
    }, 0);
  }, [filteredBills]);

  const maxBill = useMemo(() => {
    if (filteredBills.length === 0) return null;
    return filteredBills.reduce((max, bill) => {
      const amt = parseFloat(bill.amount || 0);
      const maxAmt = parseFloat(max.amount || 0);
      return amt > maxAmt ? bill : max;
    }, filteredBills[0]);
  }, [filteredBills]);

  // Chart Data Calculations
  const chartData = useMemo(() => {
    if (selectedView === 12) {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const data = Array(12).fill(0);

      bills.forEach((bill) => {
        if (bill && bill.date) {
          const [yStr, mStr] = bill.date.split("-");
          if (parseInt(yStr, 10) === selectedYear) {
            const mIndex = parseInt(mStr, 10) - 1;
            if (mIndex >= 0 && mIndex < 12) {
              data[mIndex] = sanitizeAmount(data[mIndex] + parseFloat(bill.amount || 0));
            }
          }
        }
      });
      return { labels, data };
    } else {
      const daysInMonth = new Date(Date.UTC(selectedYear, selectedView + 1, 0)).getUTCDate();
      const dailyTotals = new Map();

      filteredBills.forEach((bill) => {
        const parts = bill.date.split("-");
        if (parts.length === 3) {
          const day = parseInt(parts[2], 10);
          const amt = parseFloat(bill.amount || 0);
          dailyTotals.set(day, sanitizeAmount((dailyTotals.get(day) || 0) + amt));
        }
      });

      const labels = [];
      const data = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      for (let day = 1; day <= daysInMonth; day++) {
        labels.push(`${monthNames[selectedView]} ${day}`);
        data.push(dailyTotals.get(day) || 0);
      }
      return { labels, data };
    }
  }, [bills, selectedYear, selectedView, filteredBills]);

  return (
    <div className="min-h-screen bg-[#dce1e9] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans pb-24">
      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <Header
          onImportClick={() => setIsImportModalOpen(true)}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
          onAddClick={() => {
            setEditingBill(null);
            setIsFormModalOpen(true);
          }}
          onLoadSampleData={handleLoadSampleData}
        />

        <TimeNavigator
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableYears={availableYears}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />

        <main>
          {/* Key Metrics Strip */}
          <KeyStatistics total={totalAmount} count={filteredBills.length} maxBill={maxBill} />

          {/* 12-Column Responsive Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Analytics & Breakdown Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <BillChart
                chartData={chartData}
                selectedView={selectedView}
                selectedYear={selectedYear}
                totalAmount={totalAmount}
              />

              <CategoryBreakdown bills={filteredBills} totalAmount={totalAmount} />
            </div>

            {/* Transactions Ledger Column (5 cols) */}
            <div className="lg:col-span-5">
              <BillList
                bills={filteredBills}
                selectedView={selectedView}
                selectedYear={selectedYear}
                onEdit={handleEditBill}
                onDeleteClick={(bill) => setBillToDelete(bill)}
                onAddClick={() => {
                  setEditingBill(null);
                  setIsFormModalOpen(true);
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => {
          setEditingBill(null);
          setIsFormModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 lg:hidden flex items-center justify-center w-13 h-13 text-white bg-emerald-600 hover:bg-emerald-700 active:scale-90 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-200"
        aria-label="Add new bill"
        title="Add new bill"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Add / Edit Bill Modal */}
      <BillFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingBill(null);
        }}
        onSave={handleSaveBill}
        billToEdit={editingBill}
        selectedYear={selectedYear}
      />

      {/* Safe JSON Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportData={handleImportData}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(billToDelete)}
        title="Delete Bill"
        message={
          billToDelete
            ? `Are you sure you want to permanently delete "${billToDelete.name}" (${formatCurrency(
                billToDelete.amount
              )})?`
            : "Are you sure you want to delete this bill?"
        }
        confirmText="Delete Bill"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setBillToDelete(null)}
      />
    </div>
  );
}
