import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { SeedFile } from "../../types/places";
import { FileSelector } from "./FileSelector";
import { ImportButton } from "./ImportButton";
import type { ImportResultsMap } from "./types";

// Import all feed item files
const seedFiles: Record<string, SeedFile> = import.meta.glob<SeedFile>(
  "/src/lib/data/seed/feed_items/*.json",
  { eager: true }
);

export function ImportFeedItems() {
  const { pb } = useAuth();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<ImportResultsMap>(new Map());

  const handleFileSelect = (value: string) => {
    setSelectedFile(value);
    // TODO: Add validation logic for feed items
  };

  const importFeedItems = async () => {
    // TODO: Implement feed items import logic
    toast({
      title: "Coming Soon",
      description: "Feed items import functionality is under development",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ImportButton
          isImporting={isImporting}
          onImport={importFeedItems}
          disabled={!selectedFile}
        />
      </div>

      <FileSelector
        files={seedFiles}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
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