import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  date: string;
  fileCount: number;
  platform: string;
}

interface HistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: HistoryItem[];
  onLoadHistory: (id: string) => void;
  onDeleteHistory: (id: string) => void;
}

const HistoryDialog = ({
  open,
  onOpenChange,
  history,
  onLoadHistory,
  onDeleteHistory,
}: HistoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Generation History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No history yet. Generate some metadata to see it here.
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.fileCount} files • {item.platform}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoadHistory(item.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteHistory(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDialog;
