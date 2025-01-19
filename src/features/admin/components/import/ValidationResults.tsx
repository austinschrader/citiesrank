import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ValidationDisplayProps } from "./types";

export function ValidationResults({
  validationResults,
  importResults,
}: ValidationDisplayProps) {
  if (!validationResults || validationResults.length === 0) return null;

  const validCount = validationResults.filter((r) => r.isValid).length;
  const invalidCount = validationResults.length - validCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Validation Results</h2>
        <div className="text-sm text-muted-foreground">
          {validCount} valid, {invalidCount} invalid
        </div>
      </div>

      <div className="border rounded-lg divide-y">
        {validationResults.map((result, index) => (
          <div key={`${result.name}-${index}`} className="p-4 space-y-2">
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
                <span
                  className={
                    importResults.get(result.name)
                      ? "text-green-500"
                      : "text-destructive"
                  }
                >
                  {importResults.get(result.name) ? "Imported ✓" : "Failed ✗"}
                </span>
              )}
            </div>
            {!result.isValid && result.errors.length > 0 && (
              <Alert
                variant="destructive"
                className="bg-destructive/5 border-none"
              >
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {result.errors.map((error, i) => (
                      <li key={`${error}-${i}`} className="text-sm">
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
    </div>
  );
}
