import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { validatePlace, createSlug } from '../utils/placeValidation';
import type { ValidationResult, Place } from '../types/places';

export function useValidatePlaces() {
  const { toast } = useToast();
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const validatePlaces = (fileData: Place[]) => {
    const results = fileData.map((place) => {
      const result = validatePlace(place);
      if (result.isValid) {
        const slug = createSlug(place.name, place.country);
        result.data = {
          ...result.data,
          imageUrl: `${slug}-1`,
          tags: place.tags || [], // Keep tags as is, just ensure it's an array
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
