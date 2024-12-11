import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSearch } from "@/features/places/search/context/SearchContext";
import { UserPreferences } from "@/features/preferences/types";
import { filterCategories } from "@/lib/data/filter-categories";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { LocationSearch } from "../../LocationSearch";
import { SearchLayout } from "../../layout/SearchLayout";
import { FilterSection } from "../shared/FilterSection";

interface FiltersContentProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  onFiltersChange?: (filters: Set<string>) => void;
}

export function FiltersContent({
  preferences,
  setPreferences,
  onFiltersChange,
}: FiltersContentProps) {
  const { user } = useAuth();
  const { searchQuery: locationSearchQuery } = useSearch();
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
      filterCategories.forEach((category) =>
        newCollapsedSections.add(category.id)
      );
    }
    setCollapsedSections(newCollapsedSections);
  };

  const filteredCategories = filterCategories
    .map((category) => ({
      ...category,
      filters: category.filters.filter((filter) =>
        filter.label.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h2 className="text-sm font-medium text-muted-foreground">
                  Filters
                </h2>
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
                      ? "Collapse All"
                      : "Expand All"}
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
                    filters={category.filters}
                    emoji={category.emoji}
                    color={category.color}
                    selectedFilters={selectedFilters}
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
