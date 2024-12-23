import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClientResponseError } from "pocketbase";
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useValidatePlaces } from "../hooks/useValidatePlaces";
import type { SeedFile } from "../types/places";

// Import all seed files
const seedFiles: Record<string, SeedFile> = import.meta.glob<SeedFile>("/src/lib/data/seed/*.json", { eager: true });

export function ImportPlacesPage() {
  const { pb, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<Map<string, boolean>>(new Map());
  const [tagsMapping, setTagsMapping] = useState<Record<string, string>>({});
  const { validationResults, validatePlaces } = useValidatePlaces(tagsMapping);

  // If not admin, redirect to home
  if (!user?.isAdmin) {
    navigate("/");
    return null;
  }

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
          description: "Failed to load tags. Some features may not work correctly.",
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
          const exists = await pb.collection("cities").getFirstListItem(`slug="${result.data.slug}"`);
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
        const message = error instanceof ClientResponseError ? error.message : "Unknown error occurred";
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

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Import Places</h1>
      </div>

      <div className="space-y-6">
        {/* File Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Data File</h2>
          <Select onValueChange={handleFileSelect} value={selectedFile || undefined}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a data file to import" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(seedFiles).map((file) => (
                <SelectItem key={file} value={file}>
                  {file.split("/").pop()?.replace(".json", "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Validation Results */}
        {validationResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Validation Results</h2>
              <div className="text-sm text-muted-foreground">
                {validationResults.filter((r) => r.isValid).length} valid, {validationResults.filter((r) => !r.isValid).length} invalid
              </div>
            </div>

            <div className="border rounded-lg divide-y">
              {validationResults.map((result, index) => (
                <div key={index} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {result.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    {importResults.has(result.name) && (
                      <span className={importResults.get(result.name) ? "text-green-500" : "text-destructive"}>
                        {importResults.get(result.name) ? "Imported ✓" : "Failed ✗"}
                      </span>
                    )}
                  </div>
                  {!result.isValid && result.errors.length > 0 && (
                    <Alert variant="destructive" className="bg-destructive/5 border-none">
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {result.errors.map((error, i) => (
                            <li key={i} className="text-sm">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>

            {validationResults.some((r) => r.isValid) && (
              <Button onClick={importPlaces} disabled={isImporting} className="w-full">
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing Valid Places...
                  </>
                ) : (
                  `Import ${validationResults.filter((r) => r.isValid).length} Valid Places`
                )}
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Adding New Data Files</h2>
          <div className="prose prose-sm max-w-none">
            <p>To add new data files:</p>
            <ol>
              <li>
                Create a JSON file in the <code>/src/lib/data/seed/</code> directory
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
    </div>
  );
}
