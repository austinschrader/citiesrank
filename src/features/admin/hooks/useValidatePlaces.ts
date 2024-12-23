import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { validatePlace, createSlug } from '../utils/placeValidation';
import type { ValidationResult, Place } from '../types/places';

export function useValidatePlaces(tagsMapping: Record<string, string>) {
  const { toast } = useToast();
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const validatePlaces = (fileData: Place[]) => {
    const results = fileData.map((place) => {
      const result = validatePlace(place);
      if (result.isValid) {
        const slug = createSlug(place.name, place.country);
        const tagIds = (place.tags || [])
          .map((tag) => tagsMapping[tag])
          .filter((id) => id);

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

    return results;
  };

  return { validationResults, validatePlaces };
}
