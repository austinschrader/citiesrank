import { Badge } from "@/components/ui/badge";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import { mockLists } from "../data/mockLists";
import { ExplorerHeader } from "./ExplorerHeader";
import { ListCard } from "./ListCard";

// components/FiltersBar.tsx
export const FiltersBar = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b px-4 py-2 overflow-x-auto whitespace-nowrap">
    <div className="flex gap-2 max-w-7xl mx-auto">{children}</div>
  </div>
);

export const BadgeGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 overflow-x-auto">{children}</div>
);

// components/SplitExplorer.tsx

export const SplitExplorer = () => {
  const { viewMode } = useMap();

  return (
    <div className="h-screen flex flex-col">
      <ExplorerHeader />

      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "flex-1 overflow-y-auto p-4",
            viewMode === "split" && "w-[65%]"
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Featured Content Grid - Redesigned for better aspect ratios */}
            <div className="grid grid-cols-3 gap-4">
              {/* Main Featured Item */}
              <div className="col-span-3 h-72 relative rounded-xl overflow-hidden">
                <img
                  src="/featured/1.jpg"
                  className="object-cover w-full h-full"
                  alt="Featured"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 p-6 flex flex-col justify-end">
                  <Badge className="w-fit bg-primary hover:bg-primary/90 mb-2">
                    Top This Week
                  </Badge>
                  <h2 className="text-2xl text-white font-semibold">
                    30 Days Through Southeast Asia
                  </h2>
                  <p className="text-white/80 mt-2">
                    22 locations • 45k followers
                  </p>
                </div>
              </div>

              {/* Secondary Featured Items */}
              <div className="h-48 relative rounded-xl overflow-hidden">
                <img
                  src="/featured/2.jpg"
                  className="object-cover w-full h-full"
                  alt="Popular Route"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                  <Badge className="w-fit bg-primary/80 hover:bg-primary/90 mb-2">
                    Most Popular
                  </Badge>
                  <h3 className="text-white font-medium">
                    Pacific Coast Highway
                  </h3>
                </div>
              </div>

              <div className="h-48 relative rounded-xl overflow-hidden">
                <img
                  src="/featured/3.jpg"
                  className="object-cover w-full h-full"
                  alt="Editor's Pick"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                  <Badge className="w-fit bg-primary/80 hover:bg-primary/90 mb-2">
                    Editor's Pick
                  </Badge>
                  <h3 className="text-white font-medium">
                    Hidden Tokyo Vinyl Bars
                  </h3>
                </div>
              </div>

              <div className="h-48 relative rounded-xl overflow-hidden">
                <img
                  src="/featured/4.jpg"
                  className="object-cover w-full h-full"
                  alt="Trending"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                  <Badge className="w-fit bg-primary/80 hover:bg-primary/90 mb-2">
                    Trending Now
                  </Badge>
                  <h3 className="text-white font-medium">
                    European Christmas Markets
                  </h3>
                </div>
              </div>
            </div>

            {mockLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        </div>

        {viewMode !== "list" && (
          <div
            className={cn(
              "border-l",
              viewMode === "split" ? "w-[35%]" : "flex-1"
            )}
          >
            <CityMap className="h-full" />
          </div>
        )}
      </div>
    </div>
  );
};
