/**
 * CategoryFilter: Renders display-only category filters
 * Dependencies:
 * - Consumed by PlaceFilters for non-place-type filter sections
 * - Uses shared UI components from @/components/ui
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  id: string;
  title: string;
  emoji: string;
  color: string;
  filters: Array<{ label: string; emoji: string }>;
  searchQuery: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const CategoryFilter = ({
  id,
  title,
  emoji,
  color,
  filters,
  searchQuery,
  isCollapsed,
  onToggleCollapse,
}: CategoryFilterProps) => {
  const filteredItems = filters.filter(
    (filter) =>
      !searchQuery ||
      filter.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (searchQuery && filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Section Header */}
      <Button
        variant="ghost"
        className={cn("w-full justify-between px-4 py-2 rounded-t-lg", color)}
        onClick={onToggleCollapse}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-medium">{title}</span>
        </span>
        <span
          className={`transform transition-transform ${
            isCollapsed ? "" : "rotate-180"
          }`}
        >
          ▼
        </span>
      </Button>

      {/* Filter Items */}
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          {filteredItems.map((filter) => (
            <Button
              key={filter.label}
              variant="outline"
              className="w-full justify-start gap-2"
              disabled
            >
              <span className="text-lg">{filter.emoji}</span>
              <span>{filter.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Soon
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
