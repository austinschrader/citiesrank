import { ValidationResult } from "../../types/places";

export interface ImportResultsMap extends Map<string, boolean> {}

export interface ValidationDisplayProps {
  validationResults: ValidationResult[];
  importResults: ImportResultsMap;
}
