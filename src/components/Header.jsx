import { Wallet, Upload, Download, Sun, Moon } from "lucide-react";

const Header = ({ onImportClick, onExport, isDarkMode, toggleDarkMode }) => (
  <header className="flex flex-col items-center justify-between gap-4 pt-4 pb-4 mb-8 border-b border-gray-200 dark:border-gray-700 sm:flex-row sm:gap-0">
    <div className="flex items-center gap-3">
      <Wallet className="w-8 h-8 text-green-600 dark:text-green-500" />
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100 font-poppins">
        Billing Tracker
      </h1>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={onImportClick}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 transition-colors rounded-lg cursor-pointer bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        title="Import billing data"
      >
        <Upload size={16} />
        Import
      </button>
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 transition-colors rounded-lg cursor-pointer bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        title="Export billing data"
      >
        <Download size={16} />
        Export
      </button>
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors rounded-lg cursor-pointer bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </header>
);

export default Header;
