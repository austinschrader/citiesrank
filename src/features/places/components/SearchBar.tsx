import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import { Loader2, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalResults: number;
  isFiltering: boolean;
}

export const SearchBar = ({
  value,
  onChange,
  totalResults,
  isFiltering,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search with visual feedback
  const debouncedSearch = debounce((searchValue: string) => {
    onChange(searchValue);
    setIsSearching(false);
  }, 3000);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setIsSearching(true);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="relative group">
      <div
        className={cn(
          "relative flex items-center transition-all duration-200",
          isFocused && "scale-[1.02]"
        )}
      >
        <Search
          className={cn(
            "absolute left-3 h-4 w-4 transition-colors duration-200",
            isFocused || value ? "text-primary" : "text-muted-foreground"
          )}
        />

        <Input
          ref={inputRef}
          className={cn(
            "pl-9 pr-12 h-10 bg-muted/40 hover:bg-muted/60 transition-all duration-200",
            "placeholder:text-muted-foreground/70",
            isFocused && "bg-background ring-2 ring-primary/20 shadow-sm",
            value && "pr-20"
          )}
          placeholder="Search cities, regions, or experiences..."
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Clear and Loading States */}
        {value && (
          <div className="absolute right-3 flex items-center gap-2">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted-foreground/20"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results Indicator */}
      {isFiltering && (
        <div
          className={cn(
            "absolute -bottom-8 left-0 right-0 text-sm transition-all duration-200",
            value ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          )}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">{totalResults}</span>
            {totalResults === 1 ? "result" : "results"} found
            {value && (
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-normal"
                onClick={handleClear}
              >
                Clear search
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
