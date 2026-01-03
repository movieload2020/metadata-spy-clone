import { Copy, Check, Edit3 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface MetadataResult {
  id: string;
  filename: string;
  thumbnail: string;
  title: string;
  description: string;
  keywords: string[];
  status: "pending" | "processing" | "completed" | "error";
}

interface MetadataResultsProps {
  results: MetadataResult[];
  onUpdateResult: (id: string, updates: Partial<MetadataResult>) => void;
}

const MetadataResults = ({ results, onUpdateResult }: MetadataResultsProps) => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (results.length === 0) {
    return (
      <div className="panel p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-6">Generated Metadata</h2>
        <p className="text-muted-foreground text-center py-6">
          Upload files and click 'Generate' to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="panel p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-6">Generated Metadata</h2>
      
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-secondary/50 rounded-lg p-4 border border-border animate-fade-in"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                {result.thumbnail ? (
                  <img
                    src={result.thumbnail}
                    alt={result.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    📄
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {result.filename}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      result.status === "completed"
                        ? "bg-success/20 text-success"
                        : result.status === "processing"
                        ? "bg-warning/20 text-warning"
                        : result.status === "error"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Title</label>
                    <button
                      onClick={() => copyToClipboard(result.title, `title-${result.id}`)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === `title-${result.id}` ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-foreground bg-background/50 rounded px-2 py-1">
                    {result.title || "—"}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Description</label>
                    <button
                      onClick={() => copyToClipboard(result.description, `desc-${result.id}`)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === `desc-${result.id}` ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-foreground bg-background/50 rounded px-2 py-1">
                    {result.description || "—"}
                  </p>
                </div>

                {/* Keywords */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">
                      Keywords ({result.keywords.length})
                    </label>
                    <button
                      onClick={() =>
                        copyToClipboard(result.keywords.join(", "), `keywords-${result.id}`)
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === `keywords-${result.id}` ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.keywords.length > 0 ? (
                      result.keywords.slice(0, 10).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                    {result.keywords.length > 10 && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        +{result.keywords.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetadataResults;
