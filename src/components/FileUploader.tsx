
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Check, AlertCircle, FileType } from "lucide-react";
import { loadCollegeCsvFile } from "@/utils/csvLoader";
import { useToast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  title: string;
  description: string;
  acceptedFileTypes: string;
  onFileUploaded?: (data: any[]) => void;
  uploadType: "colleges" | "recommendations" | "exams";
}

const FileUploader = ({
  title,
  description,
  acceptedFileTypes,
  onFileUploaded,
  uploadType,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file extension
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension !== 'csv') {
      setError('Only CSV files are supported.');
      return;
    }
    
    // Reset states
    setFile(selectedFile);
    setError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      let processedData;
      
      if (uploadType === "colleges") {
        // Process college CSV file
        processedData = await loadCollegeCsvFile(file);
        
        toast({
          title: "Colleges data loaded successfully",
          description: `${processedData.length} colleges imported from CSV.`,
        });
      } else if (uploadType === "recommendations") {
        // Process recommendation data - this would need to be implemented in another utility
        toast({
          title: "Not fully implemented",
          description: "Student data CSV upload is not fully implemented yet.",
          variant: "destructive",
        });
        setError("Student data import not fully implemented yet.");
        setIsUploading(false);
        return;
      } else if (uploadType === "exams") {
        // Process exams data
        toast({
          title: "Not fully implemented",
          description: "Exams data CSV upload is not fully implemented yet.",
          variant: "destructive",
        });
        setError("Exams data import not fully implemented yet.");
        setIsUploading(false);
        return;
      }
      
      // Call the callback with the processed data
      if (onFileUploaded && processedData) {
        onFileUploaded(processedData);
      }
      
      setUploadSuccess(true);
    } catch (err) {
      console.error("File upload error:", err);
      setError("Error processing the file. Please check the format and try again.");
      
      toast({
        title: "Upload failed",
        description: "There was a problem processing your file. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
            <div className="mb-4">
              {file ? (
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                  <FileType className="h-8 w-8 text-green-500" />
                </div>
              ) : (
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
              )}
            </div>
            
            {file ? (
              <div className="space-y-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag & drop your CSV file, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  File must be in CSV format
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <input
                id="file-upload"
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>{file ? "Select a different file" : "Select file"}</span>
                </Button>
              </label>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {uploadSuccess && (
            <Alert variant="success" className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>File processed successfully!</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full sm:w-auto"
        >
          {isUploading ? "Processing..." : "Upload & Process"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploader;
