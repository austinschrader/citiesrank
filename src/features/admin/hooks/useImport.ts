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
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [importResults, setImportResults] = useState<ImportResultsMap>(
    new Map()
  );
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [validationError, setValidationError] = useState<Error | null>(null);

  const handleFileSelect = async (
    values: string[],
    files: Record<string, SeedFile>
  ) => {
    setSelectedFiles(values);
    try {
      let allResults = [];
      for (const value of values) {
        const fileData = files[value].default;
        const results = await config.validateData(fileData);
        allResults.push(...results);
      }
      setValidationResults(allResults);
      setValidationError(null);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error : new Error("Unknown validation error")
      );
      setValidationResults([]);
    }
  };

  const importData = async () => {
    if (validationError) return;

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

        console.log("Attempting to create record:", {
          collection: config.collection,
          data: JSON.stringify(result.data, null, 2),
        });

        try {
          const response = await pb
            .collection(config.collection)
            .create(result.data);
          console.log("Create response:", response);
          setImportResults((prev) => new Map(prev).set(result.name, true));
          successCount++;
        } catch (error) {
          if (error instanceof ClientResponseError) {
            console.error("PocketBase error details:", {
              status: error.status,
              response: error.response,
              data: error.data,
              message: error.message,
              url: error.url,
              isAbort: error.isAbort,
              originalError: error,
            });
          }
          throw error;
        }
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
        title: "Import Successful",
        description: `Successfully imported ${successCount} items`,
      });
      config.onSuccess?.(successCount);
    }
  };

  return {
    isImporting,
    selectedFiles,
    importResults,
    validationResults,
    validationError,
    handleFileSelect,
    importData,
  };
}
