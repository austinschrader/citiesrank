import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PocketBase from "pocketbase";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";
import { getApiUrl } from "@/appConfig";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);
const ITEMS_PER_PAGE = 20;

interface Place {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl?: string;
  population?: number;
  rating?: number;
  destinationTypes?: string[];
}

interface PlaceSearchCardProps {
  onAddPlace: (place: Place) => void;
  onClose: () => void;
}

export const PlaceSearchCard: React.FC<PlaceSearchCardProps> = ({ onAddPlace, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  // Refs for handling cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef(false);

  // Function to load places with pagination and search
  const loadPlaces = async (searchTerm: string, pageNum: number, append: boolean = false) => {
    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;

      const filter = searchTerm ? `name ~ "${searchTerm}" || country ~ "${searchTerm}"` : "";

      const resultList = await pb.collection("cities_list").getList(pageNum, ITEMS_PER_PAGE, {
        sort: "-interesting",
        filter,
        $autoCancel: false, // Disable PocketBase's auto-cancellation
      });

      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      const transformedPlaces = resultList.items.map(
        (record): Place => ({
          id: record.id,
          name: record.name,
          country: record.country,
          description: record.description,
          imageUrl: record.imageUrl,
          population: record.population,
          rating: record.rating,
          destinationTypes: record.destinationTypes
            ? typeof record.destinationTypes === "string"
              ? JSON.parse(record.destinationTypes)
              : record.destinationTypes
            : [],
        })
      );

      setPlaces((prev) => (append ? [...prev, ...transformedPlaces] : transformedPlaces));
      setTotalItems(resultList.totalItems);
      setHasMore(resultList.items.length === ITEMS_PER_PAGE);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error loading places:", error);
        toast({
          title: "Error loading places",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    loadPlaces("", 1).finally(() => setIsLoading(false));
  }, []);

  // Debounced search with cleanup
  const debouncedSearch = debounce(async (query: string) => {
    setIsLoading(true);
    setPage(1);
    await loadPlaces(query, 1);
    setIsLoading(false);
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle infinite scroll with debounce
  const handleScroll = debounce(async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoadingMore && hasMore && !isLoadingRef.current) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      await loadPlaces(searchQuery, nextPage, true);
      setIsLoadingMore(false);
    }
  }, 100);

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleAddPlace = () => {
    if (selectedPlace) {
      onAddPlace(selectedPlace);
    }
  };

  const renderPlace = (place: Place) => (
    <div
      key={place.id}
      onClick={() => handlePlaceClick(place)}
      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary
        ${selectedPlace?.id === place.id ? "ring-2 ring-primary bg-secondary" : ""}
      `}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{place.name}</h3>
          <p className="text-sm text-muted-foreground">{place.country}</p>
          {place.destinationTypes && place.destinationTypes.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {place.destinationTypes.slice(0, 3).map((type) => (
                <span key={type} className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
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
        {place.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span>{place.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Rest of the render code remains the same...
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
          <Input placeholder="Search cities..." className="pl-8" value={searchQuery} onChange={handleSearchChange} autoFocus />
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
            <p className="text-muted-foreground">No places found matching your search</p>
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
          <p className="text-sm text-muted-foreground">{totalItems} places available</p>
          <Button onClick={handleAddPlace} disabled={!selectedPlace || isLoading}>
            Add Selected Place
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
