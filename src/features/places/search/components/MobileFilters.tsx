import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { Filter, X } from "lucide-react";
import { VerticalFilters } from "./VerticalFilters";

interface MobileFiltersProps {
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
  selectedDestinationType: CitiesTypeOptions | null;
  onDestinationTypeSelect: (type: CitiesTypeOptions) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  filterOptions: Array<{ id: string; label: string }>;
}

export const MobileFilters = ({
  isFilterSheetOpen,
  setIsFilterSheetOpen,
  selectedFilter,
  onFilterSelect,
  selectedDestinationType,
  onDestinationTypeSelect,
  sortOrder,
  setSortOrder,
  filterOptions,
}: MobileFiltersProps) => {
  const activeFilterCount = filterOptions.filter(
    (option) => option.id === selectedFilter
  ).length;

  return (
    <div className="md:hidden flex items-center gap-2 p-4 sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
      <Dialog open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 py-2 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Filters</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsFilterSheetOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="px-4 py-2 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Sort by</h3>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sort Options</SelectLabel>
                        <SelectItem value="match">Best Match</SelectItem>
                        <SelectItem value="population">Population</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <VerticalFilters
                  selectedDestinationType={selectedDestinationType}
                  onDestinationTypeSelect={onDestinationTypeSelect}
                />
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
