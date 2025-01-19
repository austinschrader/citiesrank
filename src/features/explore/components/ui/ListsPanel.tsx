import { BasePanel } from "@/features/explore/components/ui/BasePanel";
import { ListPreview } from "@/features/lists/components/ListPreview";
import { useMap } from "@/features/map/context/MapContext";

interface ListsPanelProps {
  isCollapsed: boolean;
}

export const ListsPanel = ({ isCollapsed }: ListsPanelProps) => {
  const { visibleLists } = useMap();

  return (
    <BasePanel 
      isCollapsed={isCollapsed}
      isEmpty={visibleLists.length === 0}
      emptyState={{
        title: "No collections found",
        description: "Try zooming out or create a list",
        buttonText: "New List",
        buttonLink: "/lists/create"
      }}
    >
      <div className="flex-1 overflow-auto p-4">
        {visibleLists.map((list) => (
          <ListPreview key={list.id} list={list} />
        ))}
      </div>
    </BasePanel>
  );
};
