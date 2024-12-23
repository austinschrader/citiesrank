import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import { useValidatePlaces } from "../../hooks/useValidatePlaces";
import type { SeedFile } from "../../types/places";
import { FileSelector } from "./FileSelector";
import { ImportButton } from "./ImportButton";
import { ValidationResults } from "./ValidationResults";
import type { ImportResultsMap } from "./types";

// Import all seed files
const seedFiles: Record<string, SeedFile> = import.meta.glob<SeedFile>(
  "/src/lib/data/seed/places/*.json",
  { eager: true }
);

export function ImportPlaces() {
  const { pb } = useAuth();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<ImportResultsMap>(
    new Map()
  );
  const [tagsMapping, setTagsMapping] = useState<Record<string, string>>({});
  const { validationResults, validatePlaces } = useValidatePlaces(tagsMapping);

  // Load tags mapping on component mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        const records = await pb.collection("tags").getFullList();
        const mapping: Record<string, string> = {};
        records.forEach((record) => {
          mapping[record.name] = record.id;
        });
        setTagsMapping(mapping);
      } catch (error) {
        console.error("Error loading tags:", error);
        toast({
          title: "Error",
          description:
            "Failed to load tags. Some features may not work correctly.",
        });
      }
    };
    loadTags();
  }, []);

  const handleFileSelect = (value: string) => {
    setSelectedFile(value);
    const fileData = seedFiles[value].default;
    validatePlaces(fileData);
  };

  const importPlaces = async () => {
    const validPlaces = validationResults.filter((r) => r.isValid);
    if (validPlaces.length === 0) return;

    setIsImporting(true);
    setImportResults(new Map());
    let successCount = 0;

    for (const result of validPlaces) {
      try {
        try {
          const exists = await pb
            .collection("cities")
            .getFirstListItem(`slug="${result.data.slug}"`);
          setImportResults((prev) => new Map(prev).set(result.name, false));
          toast({
            title: "Import Failed",
            description: `${result.name} already exists with slug: ${result.data.slug}`,
            variant: "destructive",
          });
          continue;
        } catch (error) {
          if (error instanceof ClientResponseError && error.status === 404) {
            await pb.collection("cities").create(result.data);
            setImportResults((prev) => new Map(prev).set(result.name, true));
            successCount++;
          } else {
            throw error;
          }
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
        title: "Import Complete",
        description: `Successfully imported ${successCount} places`,
      });
    } else {
      toast({
        title: "Import Complete",
        description: "No new places were imported",
        variant: "destructive",
      });
    }
  };

  const hasValidPlaces = validationResults.some((r) => r.isValid);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {hasValidPlaces && (
          <ImportButton
            isImporting={isImporting}
            onImport={importPlaces}
            disabled={!selectedFile}
          />
        )}
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
        <h2 className="text-xl font-semibold">Adding New Place Files</h2>
        <div className="prose prose-sm max-w-none">
          <p>To add new place files:</p>
          <ol>
            <li>
              Create a JSON file in the <code>/src/lib/data/seed/places/</code>{" "}
              directory
            </li>
            <li>Follow the data format shown below</li>
            <li>Commit the file to the repository</li>
            <li>The file will appear in the dropdown above</li>
          </ol>
        </div>
        <div className="border rounded-lg p-4 bg-muted/50">
          <pre className="text-sm">
            {`[
  {
    "name": "City Name",
    "country": "Country Name",
    "type": "city",
    "latitude": 0,
    "longitude": 0,
    "population": 0,
    "description": "Description",
    "accessibility": "good|limited|poor",
    "bestSeason": "spring|summer|fall|winter",
    "cost": "budget|moderate|luxury",
    "costIndex": 0-100,
    "crowdLevel": "low|medium|high",
    "highlights": "Key attractions",
    "imageUrl": "https://...",
    "interesting": "Interesting facts",
    "recommendedStay": "3-4 days",
    "safetyScore": 0-100,
    "transitScore": 0-100,
    "walkScore": 0-100,
    "transit": "poor|limited|good|excellent"
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
}
