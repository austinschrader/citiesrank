import { useAuth } from "@/features/auth/hooks/useAuth";
import { updateListLocation } from "@/features/lists/utils/listLocation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useImport } from "../../hooks/useImport";
import { useValidateLists } from "../../hooks/useValidateLists";
import { SeedFile } from "../../types/places";
import { FileSelector } from "./FileSelector";
import { ImportButton } from "./ImportButton";
import { ValidationResults } from "./ValidationResults";

// Import all seed files for lists
const seedFiles: Record<string, SeedFile> = Object.fromEntries(
  Object.entries(
    import.meta.glob<SeedFile>("/src/lib/data/seed/lists/*.json", {
      eager: true,
    })
  ).map(([key, value]) => [
    key,
    {
      ...value,
      content: value.default,
    },
  ])
);

type CityMapping = {
  [key: string]: string; // slug -> id mapping
};

interface ListData {
  title: string;
  description?: string;
  slug: string;
  user: string;
  created: string;
  updated: string;
  place_count: number;
  saves: number;
  averageRating: number;
  totalReviews: number;
  visibility: "public" | "private";
}

interface RawListData {
  title: string;
  description?: string;
  slug: string;
  places?: string[];
  created: string;
  updated: string;
  averageRating?: number;
  totalReviews?: number;
  visibility?: "public" | "private";
}

type ValidationResult =
  | { isValid: true; data: RawListData; name: string; error?: never }
  | { isValid: false; data?: never; name: string; error: string };

interface ProcessedValidationResult {
  isValid: boolean;
  data?: ListData;
  places?: string[];
  name: string;
  error?: string;
}

export function ImportLists() {
  const { pb, user } = useAuth();
  const { toast } = useToast();
  const { validateLists } = useValidateLists();
  const [cityMapping, setCityMapping] = useState<CityMapping>({});

  // Fetch all cities and create a mapping
  useEffect(() => {
    const fetchCities = async () => {
      try {
        console.log("Fetching cities...");
        const records = await pb.collection("cities").getFullList({
          fields: "id,slug",
        });
        console.log("Fetched cities:", records);

        const mapping = records.reduce((acc, city) => {
          acc[city.slug] = city.id;
          return acc;
        }, {} as CityMapping);
        console.log("Created city mapping:", mapping);

        setCityMapping(mapping);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        toast({
          title: "Error",
          description:
            "Failed to fetch cities. Lists may not have proper city references.",
          variant: "destructive",
        });
      }
    };

    fetchCities();
  }, [pb, toast]);

  // Custom validation function that also maps city slugs to IDs
  const validateListsWithCityMapping = (fileData: unknown) => {
    console.log("Validating lists with data:", fileData);
    const results = validateLists(fileData);
    console.log("Initial validation results:", results);

    // Map through the validation results and update valid items with city IDs
    return results.map((result): ProcessedValidationResult => {
      if (result.isValid && result.data && user) {
        console.log("Processing list places:", result.data.places);
        console.log("City mapping:", cityMapping);

        const mappedPlaces = (result.data.places || [])
          .map((slug) => {
            const id = cityMapping[slug];
            console.log(`Mapping ${slug} -> ${id}`);
            return id;
          })
          .filter((id): id is string => {
            const valid = id != null;
            if (!valid) console.warn("Invalid city ID found");
            return valid;
          });

        console.log("Final mapped places:", mappedPlaces);

        return {
          isValid: true,
          name: result.data.title,
          data: {
            title: result.data.title,
            description: result.data.description,
            slug: result.data.slug,
            user: user.id,
            created: result.data.created,
            updated: result.data.updated,
            place_count: mappedPlaces.length,
            saves: 0,
            averageRating: result.data.averageRating || 0,
            totalReviews: result.data.totalReviews || 0,
            visibility: result.data.visibility || "public",
          },
          places: mappedPlaces,
        };
      }
      return {
        isValid: false,
        name: result.name,
        error: result.error,
      };
    });
  };

  const {
    isImporting,
    selectedFiles,
    importResults,
    validationResults,
    handleFileSelect: baseHandleFileSelect,
    importData: baseImportData,
  } = useImport({
    collection: "lists",
    validateData: validateListsWithCityMapping,
    checkExists: async (data) => {
      try {
        await pb.collection("lists").getFirstListItem(`slug="${data.slug}"`);
        return true;
      } catch (error) {
        return false;
      }
    },
  });

  // Custom import function to handle list_places creation
  const importData = async () => {
    if (!validationResults) return;

    try {
      for (const result of validationResults as ProcessedValidationResult[]) {
        if (!result.isValid || !result.data || !result.places?.length) {
          console.warn("Skipping invalid result:", result);
          continue;
        }

        // Create the list first
        console.log("Creating list:", result.data);
        const list = await pb.collection("lists").create(result.data);
        console.log("Created list:", list);

        // Create list_places records one at a time
        console.log("Creating places:", result.places);
        for (let i = 0; i < result.places.length; i++) {
          const placeId = result.places[i];
          console.log(`Creating place ${i + 1}:`, placeId);
          await pb.collection("list_places").create({
            list: list.id,
            place: placeId,
            rank: i + 1,
          });
          console.log(`Created place ${i + 1}`);
        }
        console.log("Created all places");

        await updateListLocation(list.id);
      }

      toast({
        title: "Success",
        description: "Lists imported successfully with their places",
      });
    } catch (error) {
      console.error("Failed to import lists:", error);
      toast({
        title: "Error",
        description: "Failed to import lists",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (values: string[]) => {
    console.log("Selected files:", values);
    console.log("Available seed files:", seedFiles);
    baseHandleFileSelect(values, seedFiles);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ImportButton
          isImporting={isImporting}
          onImport={importData}
          disabled={
            selectedFiles.length === 0 ||
            !validationResults?.some((r) => r.isValid) ||
            Object.keys(cityMapping).length === 0
          }
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
    </div>
  );
}
