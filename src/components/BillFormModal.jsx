import React, { useState } from "react";
import { X } from "lucide-react";
import { ICONS } from "../utils/icons";
import IconComponent from "./IconComponent";

const BillFormModal = ({ onAdd, onClose }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [selectedIcon, setSelectedIcon] = useState("DollarSign");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) {
      setError("Please fill in all fields.");
      return;
    }
    if (parseFloat(amount) <= 0) {
      setError("Amount must be positive.");
      return;
    }
    onAdd({ name, amount, date, icon: selectedIcon });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div className="relative w-full max-w-md p-8 text-gray-800 bg-white shadow-2xl rounded-xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute text-gray-500 top-4 right-4 hover:text-gray-800"
        >
          <X />
        </button>
        <h2 className="mb-6 text-2xl font-bold text-gray-900 font-poppins">
          Add New Bill
        </h2>
        {error && (
          <p className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Bill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min="2025-01-01"
            max="2025-12-31"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="pt-2 mb-3 text-gray-600">Select an Icon</p>
          <div className="grid grid-cols-5 gap-3 pr-2 overflow-y-auto sm:grid-cols-8 max-h-48">
            {Object.keys(ICONS).map((iconName) => (
              <button
                type="button"
                key={iconName}
                onClick={() => setSelectedIcon(iconName)}
                className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                  selectedIcon === iconName
                    ? "bg-green-500 text-white scale-110"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                }`}
              >
                <IconComponent name={iconName} />
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white transition-transform transform bg-green-600 rounded-md cursor-pointer hover:bg-green-700 hover:scale-105 font-poppins"
          >
            Add Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillFormModal;
