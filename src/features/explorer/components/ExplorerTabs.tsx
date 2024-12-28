import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListPreview } from "@/features/lists/components/ListPreview";
import { useMap } from "@/features/map/context/MapContext";
import { ResultsPanel } from "./ResultsPanel";
import { Link } from "react-router-dom";
import { ListPlus, MapPin } from "lucide-react";
import { useState } from "react";

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
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList>
            <TabsTrigger value="places">Places</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
          </TabsList>
          {value === "places" ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/my-places">
                <MapPin className="w-4 h-4 mr-2" />
                Manage Places
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/lists/create">
                <ListPlus className="w-4 h-4 mr-2" />
                Create New List
              </Link>
            </Button>
          )}
        </div>

        <TabsContent value="places" className="h-full">
          <div className="flex justify-end mb-4" />
          <div className="h-[calc(100%-3rem)]">
            <ResultsPanel
              isLoadingMore={isLoadingMore}
              observerTarget={observerTarget}
              isResultsPanelCollapsed={false} // Always false since collapsing is handled at this level
              setIsResultsPanelCollapsed={() => {}} // No-op since collapsing is handled at this level
              paginatedFilteredPlaces={paginatedFilteredPlaces}
              itemsPerPage={itemsPerPage}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="lists" className="h-full">
          <div className="flex justify-end mb-4" />
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
