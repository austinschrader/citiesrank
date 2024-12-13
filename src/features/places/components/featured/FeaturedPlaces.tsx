import { Button } from "@/components/ui/button";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { PlaceCard } from "../cards/PlaceCard";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

export const FeaturedPlaces = () => {
  const { cities } = useCities();
  const { filters, setFilter } = useFilters();

  // Filter types for quick access
  const filterTypes = [
    { id: CitiesTypeOptions.city, label: "Cities" },
    { id: CitiesTypeOptions.region, label: "Regions" },
    { id: CitiesTypeOptions.country, label: "Countries" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {filterTypes.map((type) => (
          <Button
            key={type.id}
            variant={filters.placeType === type.id ? "default" : "outline"}
            onClick={() =>
              setFilter("placeType", filters.placeType === type.id ? null : type.id)
            }
            className="whitespace-nowrap"
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Place Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities
          .filter(
            (city) => !filters.placeType || city.type === filters.placeType
          )
          .slice(0, 6)
          .map((city) => (
            <PlaceCard key={city.id} city={city} variant="basic" />
          ))}
      </div>
    </div>
  );
};
