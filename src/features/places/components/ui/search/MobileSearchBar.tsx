import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React from "react";

interface MobileSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
  onClearSearch: () => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchClick,
  onClearSearch,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="w-full pl-9 pr-10 h-10 sm:h-12"
        placeholder="Search destinations..."
        value={searchQuery}
        onChange={onSearchChange}
        onClick={onSearchClick}
        readOnly
      />
      {searchQuery && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onClearSearch();
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
