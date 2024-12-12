/**
 * FilterSearch: Reusable search input with clear button
 * Dependencies:
 * - Used by PlaceFilters for filter search functionality
 * - Uses Input from shared UI components
 */

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface FilterSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const FilterSearch = ({ searchQuery, onSearchChange }: FilterSearchProps) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search filters..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pr-8"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
