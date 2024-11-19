import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetHeader } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Legend } from "@/components/Legend";
import { PreferencesCard } from "@/components/PreferencesCard";
import { UserPreferences } from "@/types";

interface PlacesLayoutProps {
  children: React.ReactNode;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  tempPreferences: UserPreferences;
  onTempPreferencesChange: (preferences: UserPreferences) => void;
  onApplyFilters: () => void;
}

export const PlacesLayout = ({
  children,
  isFilterOpen,
  onFilterOpenChange,
  tempPreferences,
  onTempPreferencesChange,
  onApplyFilters,
}: PlacesLayoutProps) => {
  return (
    // Container that adds bottom padding on mobile for the nav
    <div className="min-h-[calc(100vh-4rem)] md:min-h-0 pb-20 md:pb-0">
      {/* Mobile Controls */}
      <div className="border-b">
        <div className="container px-4 py-3 md:hidden flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                Categories
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <Legend variant="vertical" />
            </PopoverContent>
          </Popover>

          <Sheet open={isFilterOpen} onOpenChange={onFilterOpenChange}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] p-0 overflow-hidden flex flex-col">
              <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
                <SheetTitle className="text-lg font-semibold">Customize Search</SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-1 px-6 py-4">
                <PreferencesCard preferences={tempPreferences} onPreferencesChange={onTempPreferencesChange} />
              </ScrollArea>

              <div className="flex-shrink-0 border-t p-4">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => onFilterOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={onApplyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};
