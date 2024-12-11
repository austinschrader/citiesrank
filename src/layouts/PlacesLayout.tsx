import { DesktopFilters } from "@/features/places/search/components/filters/desktop/DesktopFilters";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

interface PlacesLayoutProps {
  children: React.ReactNode;
}

export const PlacesLayout = ({ children }: PlacesLayoutProps) => {
  const { preferences, setPreferences } = usePreferences();

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 sm:pb-20 md:pb-0">
      <div className="mx-1 sm:mx-2 md:mx-4">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2">
            <DesktopFilters 
              preferences={preferences}
              setPreferences={setPreferences}
            />
          </div>
          <div className="hidden lg:block min-w-[420px] max-w-[460px]">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <DesktopFilters 
                preferences={preferences}
                setPreferences={setPreferences}
              />
            </div>
          </div>
          <div className="flex-1 pt-2 lg:pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
};
