import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useSearch } from "../context/SearchContext";

interface LocationSearchProps {
  className?: string;
}

export const LocationSearch = ({ className = "" }: LocationSearchProps) => {
  const { searchQuery, setSearchQuery, handleSearchChange, searchInputRef } = useSearch();

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search cities, regions, or neighborhoods..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 h-10 bg-background"
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
    </div>
  );
};
