import { BasePanel } from "@/features/explore/components/ui/BasePanel";
import { EmptyState } from "@/features/explore/components/ui/EmptyState";
import { ListPreview } from "@/features/lists/components/ListPreview";
import { useMap } from "@/features/map/context/MapContext";

interface ListsPanelProps {
  isCollapsed: boolean;
}

export const ListsPanel = ({ isCollapsed }: ListsPanelProps) => {
  const { visibleLists } = useMap();

  return (
    <BasePanel isCollapsed={isCollapsed}>
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {visibleLists.length === 0 ? (
            <EmptyState
              title="No collections found"
              description="Try zooming out or create a list"
              buttonText="New List"
              buttonLink="/lists/create"
            />
          ) : (
            <div className="space-y-4">
              {visibleLists.map((list) => (
                <ListPreview key={list.id} list={list} />
              ))}
            </div>
          )}
        </div>
      </div>
    </BasePanel>
  );
};
