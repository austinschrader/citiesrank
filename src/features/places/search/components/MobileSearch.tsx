import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { ChevronLeft } from "lucide-react";
import { useSearch } from "../context/SearchContext";

interface MobileSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  filteredCities: CitiesResponse[];
  onCitySelect: (city: CitiesResponse) => void;
}

export function MobileSearch({
  searchQuery,
  onSearchChange,
  onClose,
  searchInputRef,
  filteredCities,
  onCitySelect,
}: MobileSearchProps) {
  const { handleSearchChange, handleCitySelect } = useSearch();

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex items-center gap-2 border-b px-4 h-14">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1"
          autoFocus
        />
      </div>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-4 space-y-2">
          {filteredCities.map((city) => (
            <Button
              key={city.id}
              variant="ghost"
              className="w-full justify-start font-normal"
              onClick={() => {
                handleCitySelect(city);
                onClose();
              }}
            >
              {city.name}
            </Button>
          ))}
          {filteredCities.length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
