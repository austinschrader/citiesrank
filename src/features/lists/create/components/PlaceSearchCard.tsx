import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useCities,
  useCitiesActions,
} from "@/features/places/context/CitiesContext";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import debounce from "lodash/debounce";
import { Loader2, MapPin, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 20;

interface PlaceSearchCardProps {
  onAddPlace: (place: CitiesResponse) => void;
  onClose: () => void;
}

export const PlaceSearchCard: React.FC<PlaceSearchCardProps> = ({
  onAddPlace,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<CitiesResponse | null>(
    null
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const {
    cities: places,
    totalCities: totalItems,
    cityStatus: { loading: isLoading },
  } = useCities();
  const { fetchCitiesPaginated } = useCitiesActions();

  // Initial load
  useEffect(() => {
    fetchCitiesPaginated(1, ITEMS_PER_PAGE);
  }, []);

  const debouncedSearch = React.useCallback(
    debounce((query: string) => {
      setPage(1);
      fetchCitiesPaginated(1, ITEMS_PER_PAGE, { searchTerm: query });
    }, 300),
    [fetchCitiesPaginated]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle infinite scroll with debounce
  const handleScroll = debounce(async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const hasMore = places.length < totalItems;

    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      !isLoadingMore &&
      hasMore &&
      !isLoading
    ) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchCitiesPaginated(nextPage, ITEMS_PER_PAGE, {
        searchTerm: searchQuery,
      });
      setIsLoadingMore(false);
    }
  }, 100);

  const handlePlaceClick = (place: CitiesResponse) => {
    setSelectedPlace(place);
  };

  const handleAddPlace = () => {
    if (selectedPlace) {
      onAddPlace(selectedPlace);
    }
  };

  const renderPlace = (place: CitiesResponse) => (
    <div
      key={place.id}
      onClick={() => handlePlaceClick(place)}
      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary
        ${
          selectedPlace?.id === place.id
            ? "ring-2 ring-primary bg-secondary"
            : ""
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{place.name}</h3>
          <p className="text-sm text-muted-foreground">{place.country}</p>
          {Array.isArray(place.destinationTypes) &&
            place.destinationTypes.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {place.destinationTypes
                  .filter((type): type is string => typeof type === "string")
                  .slice(0, 3)
                  .map((type) => (
                    <span
                      key={type}
                      className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs"
                    >
                      {type}
                    </span>
                  ))}
                {place.destinationTypes.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
                    +{place.destinationTypes.length - 3}
                  </span>
                )}
              </div>
            )}
        </div>

        {/* {place.reviews &&
          typeof place.reviews === "object" &&
          (place.reviews as ReviewSummary).averageRating && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span>
                {Number((place.reviews as ReviewSummary).averageRating).toFixed(
                  1
                )}
              </span>
            </div>
          )} */}
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle>Add Place</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : places.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center">
            <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No places found matching your search
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4" onScrollCapture={handleScroll}>
            <div className="space-y-2">
              {places.map(renderPlace)}
              {isLoadingMore && (
                <div className="py-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/50">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-muted-foreground">
            {totalItems} places available
          </p>
          <Button
            onClick={handleAddPlace}
            disabled={!selectedPlace || isLoading}
          >
            Add Selected Place
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
