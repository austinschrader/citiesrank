import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useLists } from "@/features/lists/context/ListsContext";
import { PlaceSearch } from "@/features/places/components/filters/PlaceSearch";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateListLocation } from "../utils/listLocation";

export const CreateListPage = () => {
  const navigate = useNavigate();
  const { cities } = useCities();
  const { getFilteredCities } = useFilters();
  const { createList } = useLists();
  const { toast } = useToast();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [itemsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState<CitiesResponse[]>([]);

  // Get filtered and paginated cities
  const allFilteredPlaces = getFilteredCities(cities);
  const paginatedFilteredPlaces = allFilteredPlaces.slice(
    0,
    page * itemsPerPage
  );

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setTimeout(() => {
            setPage((prev) => prev + 1);
          }, 500);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, paginatedFilteredPlaces.length, allFilteredPlaces.length]);

  const handleSelect = useCallback((city: CitiesResponse) => {
    setSelectedPlaces((prev) => {
      if (prev.some((c) => c.id === city.id)) {
        return prev;
      }
      return [...prev, city];
    });
  }, []);

  const handleRemove = useCallback((cityId: string) => {
    setSelectedPlaces((prev) => prev.filter((city) => city.id !== cityId));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setIsSubmitting(true);

        const list = await createList({
          title,
          description,
          places: selectedPlaces.map((place) => place.id),
        });

        await updateListLocation(list.id);

        toast({
          title: "List created!",
          description: "Your new list has been created successfully.",
        });

        // Navigate to the new list
        navigate(`/lists/${list.id}`);
      } catch (error) {
        console.error("Failed to create list:", error);
        toast({
          title: "Failed to create list",
          description:
            "Please try again. If the problem persists, contact support.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      title,
      description,
      selectedPlaces,
      createList,
      navigate,
      toast,
      isSubmitting,
    ]
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create a New List</h1>
        <p className="text-muted-foreground text-lg">
          Create a curated collection of your favorite places
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          {/* List Details */}
          <div className="space-y-4 mb-8">
            <div>
              <Label htmlFor="title">List Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Hidden Gems of Europe"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what makes this list special..."
                className="mt-1.5 resize-none"
                rows={4}
              />
            </div>
          </div>

          <Separator className="mb-8" />

          {/* City Selection */}
          <div className="space-y-4">
            <Label>Add Places</Label>
            <PlaceSearch />

            {/* Cities List */}
            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="p-4 space-y-2">
                {paginatedFilteredPlaces.map((city) => (
                  <div
                    key={city.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer"
                    onClick={() => handleSelect(city)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {city.country}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedPlaces.some((c) => c.id === city.id)
                          ? "opacity-100 text-purple-500"
                          : "opacity-0"
                      )}
                    />
                  </div>
                ))}
                <div ref={observerTarget} className="h-8">
                  {isLoadingMore && (
                    <div className="text-sm text-center text-muted-foreground">
                      Loading more...
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Selected Cities */}
            <div className="space-y-2 mt-4">
              <Label>Selected Places</Label>
              {selectedPlaces.map((city, index) => (
                <div
                  key={city.id}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg group"
                >
                  <div className="h-6 w-6 flex items-center justify-center bg-background rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{city.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {city.country}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(city.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
              disabled={!title || selectedPlaces.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Create List"
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
