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
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { filterCategories } from "@/lib/data/places/filters/categories";
import { useEffect, useState } from "react";
import { PlaceTypeFilter } from "./PlaceTypeFilter";
import { CategoryFilter } from "./CategoryFilter";
import { FilterSearch } from "./FilterSearch";

export const PlaceFilters = () => {
  const { filters, setFilter } = useFilters();
  const { cities } = useCities();
  const { user } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

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

  const toggleAllSections = (collapse: boolean) => {
    const newCollapsedSections = new Set<string>();
    if (collapse) {
      ["placeType", ...filterCategories.map((cat) => cat.id)].forEach((id) =>
        newCollapsedSections.add(id)
      );
    }
    setCollapsedSections(newCollapsedSections);
  };

  return (
    <div className="flex flex-col border rounded-lg bg-card">
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
              {filters.placeType && (
                <span className="block text-xs">
                  {placeTypeCounts[filters.placeType] || 0} {filters.placeType}
                  {placeTypeCounts[filters.placeType] !== 1 ? "s" : ""}
                </span>
              )}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAllSections(collapsedSections.size === 0)}
              className="text-xs"
            >
              {collapsedSections.size === 0 ? "Collapse all" : "Expand all"}
            </Button>
          </div>

          {/* Search Bar */}
          <FilterSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Filter Sections */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Place Type Filter - Implemented */}
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

          {/* Display-Only Filters */}
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

      {/* Sign Up Dialog */}
      {showSignUpDialog && (
        <SignUpDialog
          open={showSignUpDialog}
          onOpenChange={setShowSignUpDialog}
          title="Unlock All Filters"
          description="Join our community to access all filters and discover your perfect city"
        />
      )}
    </div>
  );
};
