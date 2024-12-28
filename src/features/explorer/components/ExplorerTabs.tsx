import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListPreview } from "@/features/lists/components/ListPreview";
import { useMap } from "@/features/map/context/MapContext";
import { ResultsPanel } from "./ResultsPanel";
import { Link } from "react-router-dom";
import { ListPlus, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ExplorerTabsProps {
  isLoadingMore: boolean;
  observerTarget: React.RefObject<HTMLDivElement>;
  isResultsPanelCollapsed: boolean;
  setIsResultsPanelCollapsed: (value: boolean) => void;
  paginatedFilteredPlaces: any[]; // TODO: Add proper type
  itemsPerPage: number;
  onPageSizeChange: (size: number) => void;
}

export const ExplorerTabs = ({
  isLoadingMore,
  observerTarget,
  isResultsPanelCollapsed,
  setIsResultsPanelCollapsed,
  paginatedFilteredPlaces,
  itemsPerPage,
  onPageSizeChange,
}: ExplorerTabsProps) => {
  const { visibleLists } = useMap();
  const [value, setValue] = useState("places");

  return (
    <div className="h-full flex">
      <Tabs defaultValue="places" className="h-full flex flex-col w-full" onValueChange={setValue}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b">
          <TabsList>
            <TabsTrigger value="places">Places</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
          </TabsList>
          {value === "places" ? (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600",
                "transition-all duration-200 shadow-sm"
              )}
            >
              <Link to="/my-places" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Manage Places
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600",
                "transition-all duration-200 shadow-sm"
              )}
            >
              <Link to="/lists/create" className="flex items-center gap-2">
                <ListPlus className="w-4 h-4" />
                Create New List
              </Link>
            </Button>
          )}
        </div>

        <TabsContent value="places" className="flex-1 overflow-hidden">
          <div className="h-[calc(100%-3rem)]">
            <ResultsPanel
              isLoadingMore={isLoadingMore}
              observerTarget={observerTarget}
              isResultsPanelCollapsed={false}
              setIsResultsPanelCollapsed={() => {}}
              paginatedFilteredPlaces={paginatedFilteredPlaces}
              itemsPerPage={itemsPerPage}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="lists" className="h-full">
          <div className="h-[calc(100%-3rem)]">
            {visibleLists.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No lists found in this area
              </div>
            ) : (
              visibleLists.map((list) => (
                <ListPreview key={list.id} list={list} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
