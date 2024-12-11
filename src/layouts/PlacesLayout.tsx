import { VerticalFilters } from "@/features/places/search/components/VerticalFilters";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

interface PlacesLayoutProps {
  children: React.ReactNode;
  selectedDestinationType?: CitiesTypeOptions | null;
  onDestinationTypeSelect?: (type: CitiesTypeOptions) => void;
}

export const PlacesLayout = ({ 
  children, 
  selectedDestinationType,
  onDestinationTypeSelect 
}: PlacesLayoutProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 sm:pb-20 md:pb-0">
      <div className="flex">
        <aside className="hidden lg:block w-80 border-r min-h-[calc(100vh-4rem)] p-4">
          <VerticalFilters
            selectedDestinationType={selectedDestinationType}
            onDestinationTypeSelect={onDestinationTypeSelect}
          />
        </aside>
        <div className="flex-1 mx-1 sm:mx-2 md:mx-4">
          {children}
        </div>
      </div>
    </div>
  );
};
