import { FiltersContent } from "../content/FiltersContent";
import { UserPreferences } from "@/features/preferences/types";

interface DesktopFiltersProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  onFiltersChange?: (filters: Set<string>) => void;
}

export function DesktopFilters({ preferences, setPreferences, onFiltersChange }: DesktopFiltersProps) {
  return (
    <div className="hidden md:block w-80 border-r">
      <FiltersContent 
        preferences={preferences}
        setPreferences={setPreferences}
        onFiltersChange={onFiltersChange} 
      />
    </div>
  );
}
