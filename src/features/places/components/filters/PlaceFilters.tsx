/**
 * PlaceFilters: Main filter component orchestrating all filter functionality
 * Dependencies:
 * - Uses FiltersContext and CitiesContext for state management
 * - Uses AuthContext for user authentication state
 * - Composes PlaceTypeFilter, CategoryFilter, and FilterSearch components
 * - Uses filterCategories data from lib/data/places/filters
 */

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { filterCategories } from "@/lib/data/places/filters/categories";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { FilterSearch } from "./FilterSearch";
import { PlaceSearch } from "./PlaceSearch";
import { PlaceTypeFilter } from "./PlaceTypeFilter";
import { PopulationFilter } from "./PopulationFilter";
import { RatingFilter } from "./RatingFilter";

interface FilterContentProps {
  cities: any[];
  placeTypeCounts: Record<string, number>;
  searchQuery: string;
  collapsedSections: Set<string>;
  setCollapsedSections: (sections: Set<string>) => void;
  handleClearFilters: () => void;
  isMobile?: boolean;
}

const FilterContent = ({
  cities,
  placeTypeCounts,
  searchQuery,
  collapsedSections,
  setCollapsedSections,
  handleClearFilters,
  isMobile = false,
}: FilterContentProps) => {
  return (
    <>
      {/* Header Section */}
      <div className="p-4 border-b space-y-4">
        <div>
          <h2 className="font-semibold">Filters</h2>
          <p className="text-sm text-muted-foreground">
            Refine your destination search
          </p>
        </div>

        <div className="space-y-4">
          {/* Stats and Collapse All */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {cities.length} places found
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCollapsedSections(
                  new Set(
                    collapsedSections.size === 0
                      ? ["placeType", ...filterCategories.map((cat) => cat.id)]
                      : []
                  )
                )
              }
              className="text-xs"
            >
              {collapsedSections.size === 0 ? "Collapse all" : "Expand all"}
            </Button>
          </div>

          {/* Search Bar */}
          <PlaceSearch />

          {/* Filter Categories Search */}
          <FilterSearch searchQuery={searchQuery} onSearchChange={() => {}} />
        </div>
      </div>

      {/* Filter Sections */}
      <ScrollArea className={isMobile ? "flex-1 h-full" : "flex-1"}>
        <div className="p-4 space-y-4">
          {/* Place Type Filter */}
          <PlaceTypeFilter
            searchQuery={searchQuery}
            isCollapsed={collapsedSections.has("placeType")}
            placeTypeCounts={placeTypeCounts}
            onToggleCollapse={() => {
              const newCollapsed = new Set(collapsedSections);
              if (newCollapsed.has("placeType")) {
                newCollapsed.delete("placeType");
              } else {
                newCollapsed.add("placeType");
              }
              setCollapsedSections(newCollapsed);
            }}
          />

          {/* Population Filter */}
          <PopulationFilter />

          {/* Rating Filter */}
          <RatingFilter />

          {/* Category Filters */}
          {filterCategories.map((category) => (
            <CategoryFilter
              key={category.id}
              {...category}
              searchQuery={searchQuery}
              isCollapsed={collapsedSections.has(category.id)}
              onToggleCollapse={() => {
                const newCollapsed = new Set(collapsedSections);
                if (newCollapsed.has(category.id)) {
                  newCollapsed.delete(category.id);
                } else {
                  newCollapsed.add(category.id);
                }
                setCollapsedSections(newCollapsed);
              }}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </>
  );
};

interface PlaceFiltersProps {
  variant?: "mobile" | "desktop";
}

export const PlaceFilters = ({ variant }: PlaceFiltersProps) => {
  const { filters, setFilter } = useFilters();
  const { cities } = useCities();
  const { user } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Calculate place type counts
  const placeTypeCounts = cities.reduce((acc, place) => {
    acc[place.type] = (acc[place.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    if (user) return;

    let timeout: NodeJS.Timeout;
    const handleMouseLeave = (e: MouseEvent) => {
      if (timeout) clearTimeout(timeout);

      if (
        e.clientY <= 0 &&
        e.clientX > 0 &&
        e.clientX < window.innerWidth &&
        !showSignUpDialog
      ) {
        timeout = setTimeout(() => setShowSignUpDialog(true), 100);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timeout) clearTimeout(timeout);
    };
  }, [user, showSignUpDialog]);

  const handleClearFilters = () => {
    setFilter("placeType", null);
  };

  if (!variant) return null;

  if (variant === "mobile") {
    return (
      <div className="block md:hidden">
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="w-full bg-background/50 backdrop-blur-sm"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0 z-[400]">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto">
                <FilterContent
                  cities={cities}
                  placeTypeCounts={placeTypeCounts}
                  searchQuery={searchQuery}
                  collapsedSections={collapsedSections}
                  setCollapsedSections={setCollapsedSections}
                  handleClearFilters={handleClearFilters}
                  isMobile={true}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col border rounded-lg bg-card">
      <FilterContent
        cities={cities}
        placeTypeCounts={placeTypeCounts}
        searchQuery={searchQuery}
        collapsedSections={collapsedSections}
        setCollapsedSections={setCollapsedSections}
        handleClearFilters={handleClearFilters}
      />
    </div>
  );
};
