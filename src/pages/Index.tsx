import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GenerationControls from "@/components/GenerationControls";
import UploadSection from "@/components/UploadSection";
import MetadataResults, { MetadataResult } from "@/components/MetadataResults";
import HistoryDialog from "@/components/HistoryDialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  // API Key
  const [apiKey, setApiKey] = useState("");

  // Settings
  const [settings, setSettings] = useState({
    batchSize: 3,
    titleLength: 60,
    descriptionLength: 150,
    keywordsCount: 30,
    maxDescWords: 40,
    fileExtension: "default",
    customPrompt: "default",
    silhouette: false,
    whiteBg: false,
    transparentBg: false,
    useCustomPrompt: false,
  });

  // Files
  const [files, setFiles] = useState<File[]>([]);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready.");

  // Results
  const [results, setResults] = useState<MetadataResult[]>([]);

  // History
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<
    { id: string; date: string; fileCount: number; platform: string }[]
  >([]);

  // Handlers
  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key to generate metadata.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please upload files to generate metadata.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setStatus("Processing...");

    // Initialize results
    const initialResults: MetadataResult[] = files.map((file, index) => ({
      id: `result-${index}`,
      filename: file.name,
      thumbnail: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      title: "",
      description: "",
      keywords: [],
      status: "pending",
    }));
    setResults(initialResults);

    // Simulate processing (in real app, this would call AI API)
    for (let i = 0; i < files.length; i++) {
      if (isPaused) {
        setStatus("Paused");
        break;
      }

      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: "processing" } : r
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate AI-generated metadata
      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i
            ? {
                ...r,
                status: "completed",
                title: `Professional ${files[i].name.split(".")[0].replace(/-|_/g, " ")} image`,
                description: `High-quality stock image featuring ${files[i].name.split(".")[0].replace(/-|_/g, " ")}. Perfect for commercial and editorial use.`,
                keywords: [
                  "professional",
                  "high-quality",
                  "stock",
                  "commercial",
                  "editorial",
                  "digital",
                  "design",
                  "creative",
                  "modern",
                  "business",
                ],
              }
            : r
        )
      );

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setIsProcessing(false);
    setStatus("Complete!");
    toast({ title: "Generation Complete", description: `Processed ${files.length} files.` });

    // Add to history
    setHistory((prev) => [
      {
        id: `history-${Date.now()}`,
        date: new Date().toLocaleString(),
        fileCount: files.length,
        platform: "General",
      },
      ...prev,
    ]);
  }, [apiKey, files, isPaused, toast]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleClear = () => {
    setFiles([]);
    setResults([]);
    setProgress(0);
    setStatus("Ready.");
    setIsProcessing(false);
    setIsPaused(false);
  };

  const handleExport = () => {
    if (results.length === 0) {
      toast({
        title: "No Results",
        description: "Generate metadata first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const csv = [
      ["Filename", "Title", "Description", "Keywords"],
      ...results.map((r) => [
        r.filename,
        r.title,
        r.description,
        r.keywords.join("; "),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `metadata-${Date.now()}.csv`;
    a.click();

    toast({ title: "Export Complete", description: "CSV file downloaded." });
  };

  const handleUpdateResult = (id: string, updates: Partial<MetadataResult>) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 lg:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1">
            <GenerationControls
              settings={settings}
              onSettingsChange={setSettings}
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
            />
          </div>

          {/* Right Column - Upload & Results */}
          <div className="lg:col-span-2 space-y-6">
            <UploadSection
              files={files}
              onFilesChange={setFiles}
              progress={progress}
              status={status}
              isProcessing={isProcessing}
              isPaused={isPaused}
              onGenerate={handleGenerate}
              onPause={handlePause}
              onClear={handleClear}
              onExport={handleExport}
              onHistory={() => setHistoryOpen(true)}
            />

            <MetadataResults results={results} onUpdateResult={handleUpdateResult} />
          </div>
        </div>
      </main>

      <Footer />

      <HistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        onLoadHistory={(id) => {
          toast({ title: "History Loaded", description: `Loaded history ${id}` });
          setHistoryOpen(false);
        }}
        onDeleteHistory={(id) => {
          setHistory((prev) => prev.filter((h) => h.id !== id));
          toast({ title: "Deleted", description: "History item removed." });
        }}
      />
    </div>
  );
};

export default Index;
