import type { SeedFile } from "../../types/places";
import { FileSelector } from "./FileSelector";
import { ImportButton } from "./ImportButton";
import { ValidationResults } from "./ValidationResults";
import { useImport } from "../../hooks/useImport";
import { useValidateFeedItems } from "../../hooks/useValidateFeedItems";

// Import all feed item files
const seedFiles: Record<string, SeedFile> = import.meta.glob<SeedFile>(
  "/src/lib/data/seed/feed_items/*.json",
  { eager: true }
);

export function ImportFeedItems() {
  const { validateFeedItems } = useValidateFeedItems();
  
  const { 
    isImporting, 
    selectedFiles, 
    importResults,
    validationResults,
    handleFileSelect: baseHandleFileSelect,
    importData 
  } = useImport({
    collection: "feed_items",
    validateData: validateFeedItems
  });

  const handleFileSelect = (values: string[]) => {
    baseHandleFileSelect(values, seedFiles);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ImportButton
          isImporting={isImporting}
          onImport={importData}
          disabled={selectedFiles.length === 0 || validationResults.filter((r) => r.isValid).length === 0}
        />
      </div>

      <FileSelector
        files={seedFiles}
        selectedFiles={selectedFiles}
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
            <li>Follow one of these feed item formats:</li>
          </ol>
          <ul>
            <li><strong>Trending Place</strong>: Views and saves statistics for popular places</li>
            <li><strong>Place Collection</strong>: Curated groups of related places</li>
            <li><strong>Tag Spotlight</strong>: Featured tags with place statistics</li>
            <li><strong>Place Update</strong>: Changes in place attributes</li>
            <li><strong>Similar Places</strong>: Places with similar characteristics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}