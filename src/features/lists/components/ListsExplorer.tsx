import { FiltersBar } from "@/features/explorer/components/FiltersBar";
import { ResultsPanel } from "@/features/explorer/components/ResultsPanel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const pageSizeOptions = [15, 25, 50, 100];

export const ListsExplorer = () => {
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // TODO: Replace with actual lists data
  const mockLists = [
    {
      id: "1",
      title: "European Gems",
      description: "Hidden treasures across Europe",
      places: ["Paris", "Rome", "Barcelona"],
      author: "Travel Expert",
      likes: 1200
    },
    // Add more mock data as needed
  ];

  const paginatedLists = mockLists.slice(0, itemsPerPage);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col h-full">
        <FiltersBar />
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {mockLists.length} lists found
            </span>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className={cn(
            "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden w-full"
          )}>
            <ResultsPanel
              isLoadingMore={isLoadingMore}
              observerTarget={observerTarget}
              isResultsPanelCollapsed={isResultsPanelCollapsed}
              setIsResultsPanelCollapsed={setIsResultsPanelCollapsed}
              paginatedFilteredPlaces={paginatedLists}
              itemsPerPage={itemsPerPage}
              onPageSizeChange={(newSize) => {
                setItemsPerPage(newSize);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
