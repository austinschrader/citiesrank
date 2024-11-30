import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Legend } from "@/components/ui/Legend";
import { UserPreferences } from "@/types";
import { PreferencesCard } from "@/components/ui/PreferencesCard";

interface LayoutProps {
  children: React.ReactNode;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  tempPreferences?: UserPreferences;
  onTempPreferencesChange?: (preferences: UserPreferences) => void;
  onApplyFilters?: () => void;
}

export const Layout = ({
  children,
  isFilterOpen = false,
  onFilterOpenChange,
  tempPreferences,
  onTempPreferencesChange,
  onApplyFilters,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 mx-auto">
          {/* Upper Navigation */}
          <div className="h-14 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/favicon.svg"
                alt="European Gems Logo"
                className="w-8 h-8"
              />
              <span className="font-bold text-xl hidden sm:inline">
                TravelGems
              </span>
              <span className="font-bold text-xl sm:hidden">Gems</span>
            </a>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities & places..."
                  className="pl-8 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Categories Popover on Mobile */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="md:hidden gap-1.5"
                  >
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <Legend variant="vertical" />
                </PopoverContent>
              </Popover>

              {/* Mobile Filter Button */}
              {onFilterOpenChange &&
                tempPreferences &&
                onTempPreferencesChange && (
                  <Sheet open={isFilterOpen} onOpenChange={onFilterOpenChange}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden gap-1.5"
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="h-[85vh] p-0 overflow-hidden flex flex-col"
                    >
                      <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <SheetTitle className="text-lg font-semibold">
                            Customize Search
                          </SheetTitle>
                        </div>
                      </SheetHeader>

                      <ScrollArea className="flex-1 px-6 py-4">
                        <PreferencesCard
                          preferences={tempPreferences}
                          onPreferencesChange={onTempPreferencesChange}
                        />
                      </ScrollArea>

                      <div className="flex-shrink-0 border-t p-4">
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onFilterOpenChange(false)}
                          >
                            Cancel
                          </Button>
                          <Button className="flex-1" onClick={onApplyFilters}>
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
            </div>
          </div>

          {/* Lower Navigation */}
        </div>
      </header>
      {children}
    </div>
  );
};
