import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImportCSVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "students" | "invoices";
}

export function ImportCSVDialog({ open, onOpenChange, type }: ImportCSVDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv" || droppedFile?.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsUploading(false);
    toast({
      title: "Import Successful",
      description: `${type === "students" ? "12 students" : "15 invoices"} have been imported.`,
    });
    
    setFile(null);
    onOpenChange(false);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import {type === "students" ? "Students" : "Invoices"} from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with {type === "students" ? "student" : "invoice"} data. 
            Download our template for the correct format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template */}
          <Button variant="outline" className="w-full gap-2" onClick={() => {
            toast({
              title: "Template Downloaded",
              description: `${type}_template.csv has been downloaded.`,
            });
          }}>
            <FileText className="h-4 w-4" />
            Download CSV Template
          </Button>

          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              file && "border-success bg-success/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-success" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Drag and drop your CSV file here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  or click to browse
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </>
            )}
          </div>

          {/* Expected Columns */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs font-medium mb-2">Expected columns:</p>
            <p className="text-xs text-muted-foreground font-mono">
              {type === "students" 
                ? "name, email, phone, parent_name, parent_email, parent_phone, course"
                : "student_id, amount, description, due_date, status"
              }
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || isUploading}>
            {isUploading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
