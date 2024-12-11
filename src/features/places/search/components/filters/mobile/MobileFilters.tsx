import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { FiltersContent } from "../content/FiltersContent";
import { UserPreferences } from "@/features/preferences/types";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

interface MobileFiltersProps {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
  selectedDestinationType: CitiesTypeOptions | null;
  onDestinationTypeSelect: (type: CitiesTypeOptions) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  filterOptions: Array<{ id: string; label: string }>;
  onFiltersChange?: (filters: Set<string>) => void;
}

export function MobileFilters({
  isFilterSheetOpen,
  setIsFilterSheetOpen,
  preferences,
  setPreferences,
  selectedFilter,
  onFilterSelect,
  selectedDestinationType,
  onDestinationTypeSelect,
  sortOrder,
  setSortOrder,
  filterOptions,
  onFiltersChange,
}: MobileFiltersProps) {
  const activeFilterCount = Object.values(preferences).filter(
    (value) => value !== 50
  ).length;

  return (
    <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur pt-2 pb-4">
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[75vh] max-h-[800px] p-0 z-[400]">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 py-3 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">Filters</SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsFilterSheetOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {activeFilterCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {activeFilterCount} active filter
                  {activeFilterCount !== 1 ? "s" : ""}
                </p>
              )}
            </SheetHeader>
            <div className="flex-1 overflow-auto">
              <FiltersContent 
                preferences={preferences}
                setPreferences={setPreferences}
                onFiltersChange={(filters) => {
                  onFiltersChange?.(filters);
                  // Also call onFilterSelect for backward compatibility
                  if (filters.size > 0) {
                    const lastFilter = Array.from(filters).pop()!;
                    onFilterSelect(lastFilter);
                  } else {
                    onFilterSelect("");
                  }
                }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
