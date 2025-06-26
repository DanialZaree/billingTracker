import { Wallet, Upload, Download } from "lucide-react";

const Header = ({ onImportClick, onExport }) => (
  <header className="flex flex-col items-center justify-between gap-4 pt-4 pb-4 mb-8 border-b border-gray-200 sm:flex-row sm:gap-0">
    <div className="flex items-center gap-3">
      <Wallet className="w-8 h-8 text-green-600" />
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 font-poppins">
        Billing Tracker
      </h1>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onImportClick}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 transition-colors rounded-lg cursor-pointer bg-gray-200/80 hover:bg-gray-300"
      >
        <Upload size={16} />
        Import
      </button>
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 transition-colors rounded-lg cursor-pointer bg-gray-200/80 hover:bg-gray-300"
      >
        <Download size={16} />
        Export
      </button>
    </div>
  </header>
);

export default Header;
