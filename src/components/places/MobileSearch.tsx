import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { RankedCity } from "@/types";

interface MobileSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  filteredCities: RankedCity[];
}

export const MobileSearch = ({ searchQuery, onSearchChange, onClose, searchInputRef, filteredCities }: MobileSearchProps) => (
  <div className="fixed inset-0 z-50 bg-background pt-16">
    <div className="flex items-center gap-2 p-4 border-b">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          className="pl-9 pr-4"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <Button variant="ghost" size="sm" onClick={onClose}>
        Cancel
      </Button>
    </div>

    {searchQuery && (
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-2">
          {filteredCities.slice(0, 5).map((city) => (
            <div key={city.name} className="flex items-center gap-3 p-2 hover:bg-accent rounded-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{city.name}</div>
                <div className="text-sm text-muted-foreground">{city.country}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    )}
  </div>
);
