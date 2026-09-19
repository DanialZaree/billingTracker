import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertTriangle, X, ChevronDown, ChevronUp, Layers, RefreshCw } from "lucide-react";
import { validateAndSanitizeBills } from "../utils/validation";
import { formatCurrency } from "../utils/helpers";

const ImportModal = ({ isOpen, onClose, onImportData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setFileData(null);
    setFileName("");
    setValidationResult(null);
    setShowDetails(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = (file) => {
    if (!file) return;
    setFileName(file.name);

    if (!file.name.endsWith(".json")) {
      setValidationResult({
        isValid: false,
        rawError: "Invalid file type. Please upload a JSON file (.json).",
        stats: { errors: ["File must have a .json extension."], warnings: [] },
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawParsed = JSON.parse(e.target.result);
        const result = validateAndSanitizeBills(rawParsed);
        setValidationResult(result);
        setFileData(result.bills);
      } catch (err) {
        setValidationResult({
          isValid: false,
          rawError: "Failed to parse JSON file. The file does not contain valid JSON syntax.",
          stats: { errors: [err.message], warnings: [] },
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirm = (mode) => {
    if (!validationResult || !validationResult.isValid || !fileData) return;
    onImportData(fileData, mode, validationResult.stats);
    handleReset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl p-4 sm:p-8 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto touch-scroll animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-poppins">Import Billing Data</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Safely import and preview your bills before saving</p>
          </div>
        </div>

        {!validationResult ? (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
                  : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50/60"
              }`}
            >
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 mb-2.5 sm:mb-3 text-slate-400 animate-pulse" />
              <p className="text-xs sm:text-sm font-semibold text-slate-700 text-center">
                Click to browse or drag and drop your JSON file here
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-slate-400">Supports standard exports and legacy array formats</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-3 sm:mt-4 p-3 sm:p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] sm:text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Safe Import Guarantee:</span> All records are validated against
              positive amounts, date integrity, and unique identifiers. You can review all details before anything is saved.
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {/* Status Header */}
            <div
              className={`p-3 sm:p-4 rounded-xl border flex items-start gap-2.5 sm:gap-3 ${
                validationResult.isValid
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-rose-50 border-rose-200 text-rose-950"
              }`}
            >
              {validationResult.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs sm:text-sm">
                  {validationResult.isValid ? "Validation Successful" : "Validation Failed"}
                </p>
                <p className="text-[11px] sm:text-xs mt-0.5 text-slate-600 truncate">{fileName}</p>
                {validationResult.rawError && (
                  <p className="text-[11px] sm:text-xs text-rose-700 mt-1 font-medium">{validationResult.rawError}</p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-slate-800 underline flex-shrink-0 cursor-pointer"
              >
                Change File
              </button>
            </div>

            {/* Validation Metrics Grid */}
            {validationResult.isValid && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center min-w-0">
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Valid Bills</p>
                  <p className="text-base sm:text-xl font-bold text-slate-800 font-poppins mt-0.5 tabular-nums">
                    {validationResult.stats.validCount}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center min-w-0">
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Total Value</p>
                  <p className="text-base sm:text-xl font-bold text-emerald-600 font-poppins mt-0.5 tabular-nums truncate">
                    {formatCurrency(validationResult.stats.totalAmount)}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center min-w-0">
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Years</p>
                  <p className="text-sm sm:text-lg font-bold text-slate-800 font-poppins mt-0.5 truncate">
                    {validationResult.stats.years.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Warnings or Errors Collapsible */}
            {(validationResult.stats.warnings.length > 0 || validationResult.stats.errors.length > 0) && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full p-2.5 sm:p-3 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  <span>
                    Diagnostics ({validationResult.stats.warnings.length} notices, {validationResult.stats.errors.length} skipped)
                  </span>
                  {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showDetails && (
                  <div className="p-3 bg-white max-h-32 sm:max-h-36 overflow-y-auto space-y-1.5 text-[11px] sm:text-xs text-slate-600 border-t border-slate-200">
                    {validationResult.stats.errors.map((err, idx) => (
                      <p key={`err-${idx}`} className="text-rose-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                        {err}
                      </p>
                    ))}
                    {validationResult.stats.warnings.map((warn, idx) => (
                      <p key={`warn-${idx}`} className="text-amber-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        {warn}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Import Action Modes */}
            {validationResult.isValid && (
              <div className="pt-2.5 sm:pt-3 border-t border-slate-100 space-y-2.5 sm:space-y-3">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-700">Choose how to import this data:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleConfirm("merge")}
                    className="p-3 sm:p-3.5 text-left border-2 border-emerald-500/80 bg-emerald-50/40 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs sm:text-sm">
                      <Layers className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      Merge with Existing
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-snug">
                      Keep your current bills and add these new bills alongside them.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConfirm("replace")}
                    className="p-3 sm:p-3.5 text-left border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-800 group-hover:text-amber-900 text-xs sm:text-sm">
                      <RefreshCw className="w-4 h-4 text-slate-500 group-hover:text-amber-600 flex-shrink-0" />
                      Replace All Data
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-snug">
                      Wipe existing bills and replace them entirely with this imported file.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
