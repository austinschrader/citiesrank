import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { useValidatePlaces } from "../../hooks/useValidatePlaces";
import type { SeedFile } from "../../types/places";
import { FileSelector } from "./FileSelector";
import { ImportButton } from "./ImportButton";
import { ValidationResults } from "./ValidationResults";
import { useImport } from "../../hooks/useImport";
import { useToast } from "@/hooks/use-toast";

// Import all seed files
const seedFiles: Record<string, SeedFile> = import.meta.glob<SeedFile>(
  "/src/lib/data/seed/places/*.json",
  { eager: true }
);

export function ImportPlaces() {
  const { pb } = useAuth();
  const { toast } = useToast();
  const { validatePlaces } = useValidatePlaces();

  const { 
    isImporting, 
    selectedFiles, 
    importResults,
    validationResults,
    handleFileSelect: baseHandleFileSelect,
    importData 
  } = useImport({
    collection: "cities",
    validateData: validatePlaces,
    checkExists: async (data) => {
      try {
        await pb.collection("cities").getFirstListItem(`slug="${data.slug}"`);
        return true;
      } catch (error) {
        return false;
      }
    }
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
