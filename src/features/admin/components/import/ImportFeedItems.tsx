import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { SeedFile } from "../../types/places";
import { FileSelector } from "./FileSelector";
import { ImportButton } from "./ImportButton";
import { ValidationResults } from "./ValidationResults";
import { useImport } from "../../hooks/useImport";

// Import all feed item files
const seedFiles: Record<string, SeedFile> = import.meta.glob<SeedFile>(
  "/src/lib/data/seed/feed_items/*.json",
  { eager: true }
);

export function ImportFeedItems() {
  const { 
    isImporting, 
    selectedFile, 
    importResults,
    validationResults,
    handleFileSelect: baseHandleFileSelect,
    importData 
  } = useImport({
    collection: "feed_items",
    validateData: async (data) => {
      // TODO: Implement feed item validation
      return data.map((item: any) => ({
        name: item.type,
        data: item,
        isValid: true, // For now, consider all items valid
        errors: []
      }));
    }
  });

  const handleFileSelect = (value: string) => {
    baseHandleFileSelect(value, seedFiles);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ImportButton
          isImporting={isImporting}
          onImport={importData}
          disabled={!selectedFile || validationResults.filter((r) => r.isValid).length === 0}
        />
      </div>

      <FileSelector
        files={seedFiles}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
      />

      <ValidationResults
        validationResults={validationResults}
        importResults={importResults}
      />

      {/* Instructions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Adding New Feed Item Files</h2>
        <div className="prose prose-sm max-w-none">
          <p>To add new feed item files:</p>
          <ol>
            <li>
              Create a JSON file in the <code>/src/lib/data/seed/feed_items/</code>{" "}
              directory
            </li>
            <li>Follow one of the existing feed item formats</li>
            <li>Commit the file to the repository</li>
            <li>The file will appear in the dropdown above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}