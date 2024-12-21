import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClientResponseError } from "pocketbase";
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import slugify from "slugify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Place {
  name: string;
  normalizedName: string;
  country: string;
  cost: number;
  interesting: number;
  transit: number;
  description: string;
  population: string;
  highlights: any;
  crowdLevel: number;
  recommendedStay: number;
  bestSeason: number;
  accessibility: number;
  slug: string;
  imageUrl: string;
  averageRating?: number;
  totalReviews?: number;
  costIndex: number;
  safetyScore: number;
  walkScore: number;
  transitScore: number;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  type?: "country" | "region" | "city" | "neighborhood" | "sight";
  parentId?: string;
  climate?: string;
}

interface SeedFile {
  default: Place[];
}

interface ValidationResult {
  name: string;
  isValid: boolean;
  errors: string[];
  data: Partial<Place>;
}

// Import all seed files
const seedFiles: Record<string, SeedFile> = import.meta.glob<SeedFile>("/src/lib/data/seed/*.json", { eager: true });

const normalizeString = (str: string): string => {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[-']/g, " ") // Replace hyphens and apostrophes with spaces
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove any remaining special characters
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " "); // Normalize multiple spaces to single space
};

const createSlug = (name: string, country: string): string => {
  const processedName = name.replace(/[']/g, "");
  return slugify(`${processedName}-${country}`, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

const normalizeScore = (score: number | null | undefined): number => {
  if (score === null || score === undefined) return 0;
  // If score is greater than 10, assume it's on a 100 scale and convert
  return score > 10 ? score / 10 : score;
};

const validatePlace = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Helper function to validate text fields
  const validateText = (value: any, field: string, min?: number, max?: number) => {
    if (!value || typeof value !== "string") {
      errors.push(`${field} is required and must be a string`);
      return;
    }
    if (min && value.length < min) {
      errors.push(`${field} must be at least ${min} characters`);
    }
    if (max && value.length > max) {
      errors.push(`${field} must be at most ${max} characters`);
    }
  };

  // Helper function to validate number fields
  const validateNumber = (value: any, field: string) => {
    if (value === undefined || value === null) {
      return; // We'll use defaults for missing numbers
    }
    if (typeof value !== "number") {
      errors.push(`${field} must be a number`);
    }
  };

  // Required text fields
  validateText(data.name, "name", 1, 100);
  validateText(data.country, "country", 1, 100);
  validateText(data.description, "description", 10, 500);

  // Population can be "Unknown"
  if (data.population && typeof data.population !== "string") {
    errors.push("population must be a string");
  }

  // Validate all number fields - they're optional but must be numbers if present
  const numberFields = [
    "cost",
    "interesting",
    "transit",
    "crowdLevel",
    "recommendedStay",
    "bestSeason",
    "accessibility",
    "costIndex",
    "safetyScore",
    "walkScore",
    "transitScore",
    "latitude",
    "longitude",
    "averageRating",
    "totalReviews",
  ];
  numberFields.forEach((field) => validateNumber(data[field], field));

  // Highlights validation
  if (data.highlights) {
    try {
      if (typeof data.highlights === "string") {
        JSON.parse(data.highlights);
      } else {
        // If it's already an object/array, we'll stringify it later
        JSON.stringify(data.highlights);
      }
    } catch (e) {
      errors.push("highlights must be valid JSON");
    }
  }

  // Transform the data
  const normalizedName = normalizeString(data.name || "");
  const slug = createSlug(data.name || "", data.country || "");

  const transformedData = {
    ...data,
    normalizedName,
    slug,
    type: Array.isArray(data.type) ? data.type : [data.type || "city"],
    population: data.population || "Unknown",
    highlights: JSON.stringify(
      data.highlights || [
        `Explore ${data.name || ""}`,
        "Experience local culture",
        "Visit historic sites",
        "Enjoy local cuisine",
        "Discover natural beauty",
      ]
    ),
    // Normalize all scores to 0-10 scale
    interesting: normalizeScore(data.interesting),
    transit: normalizeScore(data.transit),
    crowdLevel: normalizeScore(data.crowdLevel),
    recommendedStay: normalizeScore(data.recommendedStay),
    bestSeason: normalizeScore(data.bestSeason),
    accessibility: normalizeScore(data.accessibility),
    costIndex: normalizeScore(data.costIndex),
    transitScore: normalizeScore(data.transitScore),
    walkScore: normalizeScore(data.walkScore),
    safetyScore: normalizeScore(data.safetyScore),
    // Set defaults for optional fields
    averageRating: data.averageRating || 0,
    totalReviews: data.totalReviews || 0,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
  };

  return {
    name: data.name || "Unknown Place",
    isValid: errors.length === 0,
    errors,
    data: transformedData,
  };
};

export function ImportPlacesPage() {
  const { pb, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [importResults, setImportResults] = useState<Map<string, boolean>>(new Map());
  const [tagsMapping, setTagsMapping] = useState<Record<string, string>>({});

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

    // Validate each place
    const results = fileData.map((place) => {
      const result = validatePlace(place);
      if (result.isValid) {
        // Generate the slug
        const slug = createSlug(place.name, place.country);
        // Convert tag names to IDs
        const tagIds = (place.tags || []).map((tag) => tagsMapping[tag]).filter((id) => id); // Remove any undefined tags

        // Update the transformed data
        result.data = {
          ...result.data,
          imageUrl: `${slug}-1`,
          tags: tagIds,
        };
      }
      return result;
    });

    setValidationResults(results);

    const validCount = results.filter((r) => r.isValid).length;
    toast({
      title: "File Validated",
      description: `Found ${results.length} places (${validCount} valid, ${results.length - validCount} invalid)`,
    });
  };

  const importPlaces = async () => {
    const validPlaces = validationResults.filter((r) => r.isValid);
    if (validPlaces.length === 0) return;

    setIsImporting(true);
    setImportResults(new Map());
    let successCount = 0; // Add counter for successful imports

    for (const result of validPlaces) {
      try {
        // Check if a place with this slug exists
        try {
          const exists = await pb.collection("cities").getFirstListItem(`slug="${result.data.slug}"`);
          // If we get here, the record exists
          setImportResults((prev) => new Map(prev).set(result.name, false));
          toast({
            title: "Import Failed",
            description: `${result.name} already exists with slug: ${result.data.slug}`,
            variant: "destructive",
          });
          continue;
        } catch (error) {
          // If it's a 404 error, that means the slug doesn't exist and we can create the record
          if (error instanceof ClientResponseError && error.status === 404) {
            await pb.collection("cities").create(result.data);
            setImportResults((prev) => new Map(prev).set(result.name, true));
            successCount++; // Increment counter on successful import
          } else {
            // If it's any other error, we should handle it as a real error
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

    // Use the successCount instead of counting from importResults
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
