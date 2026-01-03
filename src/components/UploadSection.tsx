import { useState } from "react";
import { Trash2, Pause, Play, Sparkles, Download, Clock } from "lucide-react";
import StockPlatformTabs from "./StockPlatformTabs";
import FileDropzone from "./FileDropzone";

interface UploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  progress: number;
  status: string;
  isProcessing: boolean;
  isPaused: boolean;
  onGenerate: () => void;
  onPause: () => void;
  onClear: () => void;
  onExport: () => void;
  onHistory: () => void;
}

const UploadSection = ({
  files,
  onFilesChange,
  progress,
  status,
  isProcessing,
  isPaused,
  onGenerate,
  onPause,
  onClear,
  onExport,
  onHistory,
}: UploadSectionProps) => {
  const [activeStockTab, setActiveStockTab] = useState("general");

  return (
    <div className="panel p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-6">Upload Files</h2>

      <StockPlatformTabs activeTab={activeStockTab} onTabChange={setActiveStockTab} />

      <div className="mt-4">
        <FileDropzone files={files} onFilesChange={onFilesChange} />
      </div>

      {/* Progress */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">{status}</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <button
          onClick={onClear}
          className="action-btn bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          <Trash2 className="w-4 h-4" />
          <span className="truncate">Clear All</span>
        </button>

        <button
          onClick={onPause}
          disabled={!isProcessing}
          className="action-btn bg-warning hover:bg-warning/90 text-warning-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span className="truncate">{isPaused ? "Resume" : "Pause"}</span>
        </button>

        <button
          onClick={onGenerate}
          disabled={files.length === 0 || isProcessing}
          className="action-btn bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          <span className="truncate">Generate ({files.length})</span>
        </button>

        <button
          onClick={onExport}
          disabled={files.length === 0}
          className="action-btn bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span className="truncate">Export CSV</span>
        </button>

        <button
          onClick={onHistory}
          className="action-btn bg-secondary hover:bg-secondary/80 text-foreground col-span-2 sm:col-span-1"
        >
          <Clock className="w-4 h-4" />
          <span className="truncate">History</span>
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
