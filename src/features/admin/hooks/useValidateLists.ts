import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";

const listSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().min(1),
  places: z.array(z.string()).optional(),
  created: z.string(),
  updated: z.string(),
  averageRating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().min(0).optional(),
  visibility: z.enum(['public', 'private']).optional().default('public'),
});

type List = z.infer<typeof listSchema>;

type ValidationResult = 
  | { isValid: true; data: List; name: string; error?: never }
  | { isValid: false; data?: never; name: string; error: string };

interface SeedFileData {
  default: List[];
}

export function useValidateLists() {
  const { toast } = useToast();
  const [validationResults, setValidationResults] = useState<ValidationResult[]>(
    []
  );

  const validateLists = (fileData: unknown) => {
    console.log("Validating lists with raw data:", fileData);

    // Handle both direct array and default property formats
    const listsToValidate = Array.isArray(fileData)
      ? fileData
      : (fileData as SeedFileData)?.default;

    if (!listsToValidate || !Array.isArray(listsToValidate)) {
      const error = "Invalid file format: expected an array of lists";
      console.error(error);
      const result: ValidationResult = {
        isValid: false,
        error,
        name: "Invalid File",
      };
      setValidationResults([result]);
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return [result];
    }

    console.log("Lists to validate:", listsToValidate);

    const results: ValidationResult[] = listsToValidate.map((list) => {
      try {
        console.log("Validating list:", list);
        const listWithFormattedDates = {
          ...list,
          created: new Date(list.created).toISOString(),
          updated: new Date(list.updated).toISOString(),
        };
        console.log("List with formatted dates:", listWithFormattedDates);

        const result = listSchema.parse(listWithFormattedDates);
        console.log("Validation successful:", result);
        return {
          isValid: true,
          data: result,
          name: result.title,
        };
      } catch (error) {
        console.error("Validation failed:", error);
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            error: error.errors.map((e) => e.message).join(", "),
            name: (list as Partial<List>)?.title || "Unknown List",
          };
        }
        return {
          isValid: false,
          error: "Invalid data format",
          name: "Unknown List",
        };
      }
    });

    console.log("Validation results:", results);
    setValidationResults(results);

    const validCount = results.filter((r) => r.isValid).length;
    toast({
      title: "File Validated",
      description: `Found ${results.length} lists (${validCount} valid, ${
        results.length - validCount
      } invalid)`,
    });

    return results;
  };

  return { validationResults, validateLists };
}
