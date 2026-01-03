import { useCallback, useState } from "react";
import { Image, Film, FileCode, Upload } from "lucide-react";

interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const FileDropzone = ({ files, onFilesChange }: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesChange([...files, ...droppedFiles]);
    },
    [files, onFilesChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        onFilesChange([...files, ...selectedFiles]);
      }
    },
    [files, onFilesChange]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div
      className={`dropzone ${isDragging ? "dropzone-active" : "dropzone-default"}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/svg+xml,video/mp4,video/quicktime,application/postscript,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
          <div className="flex gap-8 mb-4">
            <div className="file-type-icon text-primary">
              <Image className="w-10 h-10" />
              <span className="text-sm font-medium mt-1">Image</span>
            </div>
            <div className="file-type-icon text-indigo-400">
              <Film className="w-10 h-10" />
              <span className="text-sm font-medium mt-1">Videos</span>
            </div>
            <div className="file-type-icon text-pink-500">
              <FileCode className="w-10 h-10" />
              <span className="text-sm font-medium mt-1">EPS</span>
            </div>
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Drag & drop files here</span>, or{" "}
            <span className="font-semibold text-teal-400">click to select</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Supported: JPG, PNG, GIF, MP4, MOV, EPS, AI, PDF
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-secondary rounded-lg overflow-hidden aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {file.type.startsWith("video/") ? (
                    <Film className="w-8 h-8 text-indigo-400" />
                  ) : (
                    <FileCode className="w-8 h-8 text-pink-500" />
                  )}
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-1 py-0.5">
                <p className="text-xs truncate">{file.name}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center aspect-square border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
