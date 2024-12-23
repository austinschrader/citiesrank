import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import type { ImportResultsMap } from "../components/import/types";
import type { SeedFile } from "../types/places";

interface ImportConfig {
  collection: string;
  validateData: (data: any) => Promise<any[]> | any[];
  onSuccess?: (count: number) => void;
  onError?: (error: Error) => void;
  checkExists?: (item: any) => Promise<boolean>;
}

export function useImport(config: ImportConfig) {
  const { pb } = useAuth();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<ImportResultsMap>(new Map());
  const [validationResults, setValidationResults] = useState<any[]>([]);

  const handleFileSelect = async (value: string, files: Record<string, SeedFile>) => {
    setSelectedFile(value);
    const fileData = files[value].default;
    const results = await config.validateData(fileData);
    setValidationResults(results);
  };

  const importData = async () => {
    const validItems = validationResults.filter((r) => r.isValid);
    if (validItems.length === 0) return;

    setIsImporting(true);
    setImportResults(new Map());
    let successCount = 0;

    for (const result of validItems) {
      try {
        const exists = config.checkExists 
          ? await config.checkExists(result.data)
          : false;

        if (exists) {
          setImportResults((prev) => new Map(prev).set(result.name, false));
          toast({
            title: "Import Failed",
            description: `${result.name} already exists`,
            variant: "destructive",
          });
          continue;
        }

        await pb.collection(config.collection).create(result.data);
        setImportResults((prev) => new Map(prev).set(result.name, true));
        successCount++;
      } catch (error) {
        const message =
          error instanceof ClientResponseError
            ? error.message
            : "Unknown error occurred";
        setImportResults((prev) => new Map(prev).set(result.name, false));
        console.error(`Error importing ${result.name}:`, error);
        toast({
          title: "Import Failed",
          description: `Failed to import ${result.name}: ${message}`,
          variant: "destructive",
        });
      }
    }

    setIsImporting(false);

    if (successCount > 0) {
      toast({
        title: "Import Complete",
        description: `Successfully imported ${successCount} items`,
      });
      config.onSuccess?.(successCount);
    } else {
      toast({
        title: "Import Complete",
        description: "No new items were imported",
        variant: "destructive",
      });
      config.onError?.(new Error("No items imported"));
    }
  };

  return {
    isImporting,
    selectedFile,
    importResults,
    validationResults,
    handleFileSelect,
    importData
  };
}
