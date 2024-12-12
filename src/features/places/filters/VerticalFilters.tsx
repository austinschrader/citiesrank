import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FilterSection } from "@/features/places/filters/FilterSection";
import { filterCategories } from "@/lib/data/places/filters/categories";
import { useState } from "react";

interface VerticalFiltersProps {
  onFiltersChange?: (filters: Set<string>) => void;
}

export function VerticalFilters({ onFiltersChange }: VerticalFiltersProps) {
  const { user } = useAuth();
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set()
  );
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

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
        <Input
          placeholder="Search filters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

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
          />
        )}
      </div>
    </ScrollArea>
  );
}
