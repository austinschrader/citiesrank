import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterSection } from "../shared/FilterSection";
import { useState, useEffect } from "react";
import { UserPreferences } from "@/features/preferences/types";
import { filterCategories } from "@/lib/data/filter-categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";

interface FiltersContentProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  onFiltersChange?: (filters: Set<string>) => void;
}

export function FiltersContent({ preferences, setPreferences, onFiltersChange }: FiltersContentProps) {
  const { user } = useAuth();
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
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
      filterCategories.forEach((category) => newCollapsedSections.add(category.id));
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
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search filters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAllSections(collapsedSections.size === 0)}
            >
              {collapsedSections.size === 0 ? "Collapse All" : "Expand All"}
            </Button>
          </div>
          {selectedFilters.size > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedFilters.size} filter
              {selectedFilters.size !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

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

        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            No filters match your search
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
    </ScrollArea>
  );
}
