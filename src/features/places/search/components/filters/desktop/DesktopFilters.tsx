import { FiltersContent } from "../content/FiltersContent";
import { UserPreferences, MatchScore } from "@/features/preferences/types";
import { CitiesResponse } from "@/lib/types/pocketbase-types";

interface DesktopFiltersProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  onFiltersChange?: (filters: Set<string>) => void;
  cityData: Record<string, CitiesResponse>;
  calculateMatchForCity: (city: CitiesResponse) => MatchScore;
}

export function DesktopFilters({ 
  preferences, 
  setPreferences, 
  onFiltersChange,
  cityData,
  calculateMatchForCity,
}: DesktopFiltersProps) {
  return (
    <div className="hidden md:block border-r">
      <FiltersContent 
        preferences={preferences}
        setPreferences={setPreferences}
        onFiltersChange={onFiltersChange}
        cityData={cityData}
        calculateMatchForCity={calculateMatchForCity}
      />
    </div>
  );
}
