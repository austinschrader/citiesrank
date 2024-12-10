import { VerticalFilters } from "@/features/places/search/components/VerticalFilters";

interface PlacesLayoutProps {
  children: React.ReactNode;
}

export const PlacesLayout = ({ children }: PlacesLayoutProps) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 sm:pb-20 md:pb-0">
      <div className="mx-4 sm:mx-6 md:mx-8 2xl:mx-16">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2">
            <VerticalFilters />
          </div>
          <div className="hidden lg:block w-80">
            <div className="sticky top-8">
              <VerticalFilters />
            </div>
          </div>
          <div className="flex-1 pt-2 lg:pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
};
