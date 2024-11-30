import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { CitiesResponse } from "@/pocketbase-types";
import { MatchScore } from "@/features/preferences/types";

interface MobileSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  filteredCities: (CitiesResponse & MatchScore)[];
  onCitySelect: (city: CitiesResponse & MatchScore) => void;
}

export const MobileSearch = ({
  searchQuery,
  onSearchChange,
  onClose,
  searchInputRef,
  filteredCities,
  onCitySelect,
}: MobileSearchProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            className="pl-9 pr-4"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={onSearchChange}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onSearchChange({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              <X className="h-2 w-2" />
            </button>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-2">
          {filteredCities.slice(0, 10).map((city) => (
            <button
              key={city.name}
              className="flex items-center gap-3 p-3 hover:bg-accent rounded-md w-full text-left transition-colors"
              onClick={() => {
                onCitySelect(city);
                onClose();
              }}
            >
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="font-medium">{city.name}</div>
                <div className="text-sm text-muted-foreground">
                  {city.country}
                </div>
              </div>
            </button>
          ))}
          {searchQuery && filteredCities.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No cities found matching "{searchQuery}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
