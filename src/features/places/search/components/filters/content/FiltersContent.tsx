import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSearch } from "@/features/places/search/context/SearchContext";
import { useSearchFilters } from "@/features/places/search/hooks/useSearchFilter";
import { UserPreferences } from "@/features/preferences/types";
import { MatchScore } from "@/features/preferences/types";
import { CitiesResponse, CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { filterCategories } from "@/lib/data/filter-categories";
import { implementedFilters } from "@/lib/data/implemented-filters";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { LocationSearch } from "../../LocationSearch";
import { PlacesCount } from "../../PlacesCount";
import { SearchLayout } from "../../layout/SearchLayout";
import { FilterSection } from "../shared/FilterSection";

interface FiltersContentProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  onFiltersChange?: (filters: Set<string>) => void;
  cityData: Record<string, CitiesResponse>;
  calculateMatchForCity: (city: CitiesResponse) => MatchScore;
  selectedDestinationType?: CitiesTypeOptions | null;
  onDestinationTypeSelect?: (type: CitiesTypeOptions) => void;
}

export function FiltersContent({
  preferences,
  setPreferences,
  onFiltersChange,
  cityData,
  calculateMatchForCity,
  selectedDestinationType,
  onDestinationTypeSelect,
}: FiltersContentProps) {
  const { user } = useAuth();
  const { searchQuery: locationSearchQuery } = useSearch();
  const { getFilteredCities } = useSearchFilters(preferences);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set()
  );
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  useEffect(() => {
    if (user) return; // Don't show for logged in users

    let timeout: NodeJS.Timeout;
    const handleMouseLeave = (e: MouseEvent) => {
      // Clear any existing timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      // Check if the mouse is moving towards the top of the viewport
      if (
        e.clientY <= 0 &&
        e.clientX > 0 &&
        e.clientX < window.innerWidth &&
        !showSignUpDialog // Only set if not already showing
      ) {
        timeout = setTimeout(() => {
          setShowSignUpDialog(true);
        }, 100); // Small delay to prevent double triggers
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [user, showSignUpDialog]);

  const handleFilterToggle = (filter: string) => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }

    // Handle CityTypeOptions differently
    const placeTypeCategory = implementedFilters.find(cat => cat.id === 'placeTypes');
    if (placeTypeCategory && placeTypeCategory.filters.some(f => f.label === filter)) {
      onDestinationTypeSelect?.(filter as CitiesTypeOptions);
      return;
    }

    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setSelectedFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleToggleCollapse = (sectionId: string) => {
    const newCollapsedSections = new Set(collapsedSections);
    if (newCollapsedSections.has(sectionId)) {
      newCollapsedSections.delete(sectionId);
    } else {
      newCollapsedSections.add(sectionId);
    }
    setCollapsedSections(newCollapsedSections);
  };

  const toggleAllSections = (collapse: boolean) => {
    const newCollapsedSections = new Set<string>();
    if (collapse) {
      [...implementedFilters, ...filterCategories].forEach((category) =>
        newCollapsedSections.add(category.id)
      );
    }
    setCollapsedSections(newCollapsedSections);
  };

  const filteredCategories = [...implementedFilters, ...filterCategories]
    .map((category) => ({
      ...category,
      filters: category.filters
        .map(filter => {
          const isPlaceType = category.id === 'placeTypes';
          return {
            ...filter,
            selected: isPlaceType 
              ? filter.label === selectedDestinationType 
              : selectedFilters.has(filter.label)
          };
        })
        .filter((filter) =>
          !searchQuery || 
          (filter.label && filter.label.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
    }))
    .filter((category) => category.filters.length > 0);

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <SearchLayout
        searchBar={<LocationSearch />}
        filters={
          <div>
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Filters
                  </h2>
                  {locationSearchQuery && (
                    <PlacesCount 
                      places={getFilteredCities(cityData, locationSearchQuery, calculateMatchForCity)} 
                      selectedTypes={selectedFilters}
                    />
                  )}
                </div>
                {filteredCategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toggleAllSections(collapsedSections.size === 0)
                    }
                    className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                  >
                    {collapsedSections.size === 0
                      ? "Collapse all"
                      : "Expand all"}
                  </Button>
                )}
              </div>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search filters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {(selectedFilters.size > 0 || locationSearchQuery) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {locationSearchQuery && (
                    <div className="inline-flex items-center gap-1.5 text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-md">
                      <span>Location: {locationSearchQuery}</span>
                    </div>
                  )}
                  {selectedFilters.size > 0 && (
                    <div className="inline-flex items-center gap-1.5 text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-md">
                      <span>
                        {selectedFilters.size} filter
                        {selectedFilters.size !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {filteredCategories.length === 0 && searchQuery ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No filters match your search
              </div>
            ) : (
              <div className="px-6 space-y-4">
                {filteredCategories.map((category) => (
                  <FilterSection
                    key={category.id}
                    title={category.title}
                    emoji={category.emoji}
                    color={category.color}
                    filters={category.filters}
                    selectedFilters={category.id === 'placeTypes' ? undefined : selectedFilters}
                    onFilterToggle={handleFilterToggle}
                    isCollapsed={collapsedSections.has(category.id)}
                    onToggleCollapse={() => handleToggleCollapse(category.id)}
                  />
                ))}
              </div>
            )}
            {showSignUpDialog && (
              <SignUpDialog
                open={showSignUpDialog}
                onOpenChange={setShowSignUpDialog}
                title="Unlock All Filters"
                description="Join our community to access all filters and discover your perfect city"
                city="paris"
                country="france"
                imageNumber={4}
              />
            )}
          </div>
        }
      />
    </ScrollArea>
  );
}
