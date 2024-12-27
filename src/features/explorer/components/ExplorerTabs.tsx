import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ResultsPanel } from "./ResultsPanel";

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

  return (
    <div
      className={cn(
        "absolute right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-lg transition-transform duration-300 overflow-hidden",
        {
          "translate-x-full": isResultsPanelCollapsed,
        }
      )}
    >
      <Tabs defaultValue="places" className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList>
            <TabsTrigger value="places">Places</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="places" className="flex-1 overflow-y-auto">
          <ResultsPanel
            isLoadingMore={isLoadingMore}
            observerTarget={observerTarget}
            isResultsPanelCollapsed={false} // Always false since collapsing is handled at this level
            setIsResultsPanelCollapsed={() => {}} // No-op since collapsing is handled at this level
            paginatedFilteredPlaces={paginatedFilteredPlaces}
            itemsPerPage={itemsPerPage}
            onPageSizeChange={onPageSizeChange}
          />
        </TabsContent>

        <TabsContent value="lists" className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {visibleLists.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No lists found in this area
              </div>
            ) : (
              visibleLists.map((list) => (
                <Link key={list.id} to={`/lists/${list.id}`}>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">
                      {list.title || "Untitled List"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {list.description || "No description"}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
