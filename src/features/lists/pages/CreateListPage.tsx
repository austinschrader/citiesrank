import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLists } from "@/features/lists/context/ListsContext";
import {
  useCities,
  useCitiesActions,
} from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { getPlaceTypeInfo } from "@/features/places/utils/placeUtils";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { getCountryCode } from "@/lib/utils/countryUtils";
import * as Flags from "country-flag-icons/react/3x2";
import {
  Globe2,
  Loader2,
  Lock,
  Map,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateListLocation } from "../utils/listLocation";

type VisibilityOption = "public" | "private" | "unlisted";

interface VisibilitySetting {
  value: VisibilityOption;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const visibilitySettings: VisibilitySetting[] = [
  {
    value: "public",
    label: "Public",
    icon: <Globe2 className="h-4 w-4" />,
    description: "Everyone can see this list",
  },
  {
    value: "unlisted",
    label: "Unlisted",
    icon: <Map className="h-4 w-4" />,
    description: "Only people with the link can see this list",
  },
  {
    value: "private",
    label: "Private",
    icon: <Lock className="h-4 w-4" />,
    description: "Only you can see this list",
  },
];

export const CreateListPage = () => {
  const navigate = useNavigate();
  const { cities, cityStatus } = useCities();
  const { fetchCitiesPaginated } = useCitiesActions();
  const { filters, getFilteredCities } = useFilters();
  const { createList } = useLists();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [paginatedCities, setPaginatedCities] = useState<CitiesResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // List details state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<VisibilityOption>("public");
  const [enableComments, setEnableComments] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Places selection state
  const [selectedPlaces, setSelectedPlaces] = useState<CitiesResponse[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Load more cities when scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  // Load cities when search or filters change
  useEffect(() => {
    setPage(1);
    setPaginatedCities([]);
    setHasMore(true);
    loadMore(true);
  }, [searchQuery, selectedCountries]);

  const loadMore = async (reset = false) => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const currentPage = reset ? 1 : page;

      const result = await fetchCitiesPaginated(currentPage, perPage, {
        searchTerm: searchQuery,
      });

      // Check if we have valid data
      if (!result || !Array.isArray(result.items)) {
        console.error("Invalid response format:", result);
        return;
      }

      let filteredResults = result.items;

      // Apply country filter if needed
      if (selectedCountries.length > 0) {
        filteredResults = filteredResults.filter((city: { country: string }) =>
          selectedCountries.includes(city.country)
        );
      }

      setPaginatedCities((prev) =>
        reset ? filteredResults : [...prev, ...filteredResults]
      );

      // Check if we have more pages
      const totalPages = Math.ceil(result.totalItems / perPage);
      setHasMore(currentPage < totalPages);
      setPage((prev) => (reset ? 2 : prev + 1));
    } catch (error) {
      console.error("Failed to load more cities:", error);
      toast({
        title: "Error",
        description: "Failed to load more cities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      selectedPlaces.length > 0
    );
  }, [title, description, selectedPlaces]);

  // Filter cities based on search and selected countries
  const filteredCities = useMemo(() => {
    let filtered = paginatedCities;

    if (searchQuery) {
      filtered = filtered.filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountries.length > 0) {
      filtered = filtered.filter((city) =>
        selectedCountries.includes(city.country)
      );
    }

    return filtered;
  }, [paginatedCities, searchQuery, selectedCountries]);

  // Get unique countries from cities
  const uniqueCountries = useMemo(() => {
    return Array.from(
      new Set(paginatedCities.map((city) => city.country))
    ).sort();
  }, [paginatedCities]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      if (!isFormValid) {
        toast({
          title: "Invalid form",
          description:
            "Please fill in all required fields and select at least one place.",
          variant: "destructive",
        });
        return;
      }

      try {
        const metadata = {
          visibility,
          enableComments,
          tags: selectedTags,
        };

        const enhancedDescription = JSON.stringify({
          description: description.trim(),
          metadata,
        });

        const list = await createList({
          title: title.trim(),
          description: enhancedDescription,
          places: selectedPlaces.map((place) => place.id),
        });

        await updateListLocation(list.id);

        toast({
          title: "Success!",
          description: "Your new list has been created successfully.",
        });

        navigate(`/lists/${list.id}`);
      } catch (error) {
        console.error("Failed to create list:", error);
        toast({
          title: "Error",
          description: "Failed to create list. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isFormValid,
      title,
      description,
      selectedPlaces,
      visibility,
      enableComments,
      selectedTags,
      createList,
      navigate,
      toast,
    ]
  );

  const togglePlace = useCallback((place: CitiesResponse) => {
    setSelectedPlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) {
        return prev.filter((p) => p.id !== place.id);
      }
      return [...prev, place];
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create a New List
            </h1>
            <p className="text-muted-foreground mt-2">
              Share your favorite places with the world
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create List"
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - List Details */}
          <div className="col-span-5">
            <Card className="p-6">
              <div className="space-y-6">
                {/* List Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">List Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Hidden Gems of Europe"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* List Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your list..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-none"
                    rows={4}
                  />
                </div>

                <Separator />

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <Label>Privacy Settings</Label>
                  <div className="grid gap-4">
                    {visibilitySettings.map((setting) => (
                      <div
                        key={setting.value}
                        className={cn(
                          "flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors",
                          visibility === setting.value
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setVisibility(setting.value)}
                      >
                        <div
                          className={cn(
                            "shrink-0 rounded-lg p-2",
                            visibility === setting.value
                              ? "bg-primary/10"
                              : "bg-muted"
                          )}
                        >
                          {setting.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {setting.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Additional Settings */}
                <div className="space-y-4">
                  <Label>Additional Settings</Label>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="comments">Enable Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to discuss and share insights
                      </p>
                    </div>
                    <Switch
                      id="comments"
                      checked={enableComments}
                      onCheckedChange={setEnableComments}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Place Selection */}
          <div className="col-span-7 space-y-6">
            {/* Search and Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search places..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(showFilters && "bg-muted")}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t">
                  <Label className="mb-2 block">Filter by Country</Label>
                  <ScrollArea className="h-[100px]">
                    <div className="space-y-2">
                      {uniqueCountries.map((country) => {
                        const countryCode = getCountryCode(country);
                        const FlagComponent =
                          countryCode &&
                          Flags[countryCode as keyof typeof Flags];

                        return (
                          <div
                            key={country}
                            className="flex items-center gap-2"
                          >
                            <Switch
                              checked={selectedCountries.includes(country)}
                              onCheckedChange={(checked) => {
                                setSelectedCountries((prev) =>
                                  checked
                                    ? [...prev, country]
                                    : prev.filter((c) => c !== country)
                                );
                              }}
                            />
                            {FlagComponent && (
                              <div className="h-3 w-4 rounded overflow-hidden">
                                <FlagComponent className="w-full h-full object-cover" />
                              </div>
                            )}
                            <span className="text-sm">{country}</span>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </Card>

            {/* Places Grid */}
            <Card className="p-4">
              <ScrollArea className="h-[600px]">
                <div className="grid gap-4">
                  {filteredCities.map((place) => {
                    const isSelected = selectedPlaces.some(
                      (p) => p.id === place.id
                    );
                    const typeInfo = getPlaceTypeInfo([place.type]);
                    const TypeIcon = typeInfo.icon;

                    return (
                      <div
                        key={place.id}
                        className={cn(
                          "group flex items-start gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-accent cursor-pointer",
                          isSelected && "bg-accent"
                        )}
                        onClick={() => togglePlace(place)}
                      >
                        <div className="relative aspect-video w-48 rounded-lg overflow-hidden">
                          <ImageGallery
                            imageUrl={place.imageUrl}
                            cityName={place.name}
                            country={place.country}
                            showControls={false}
                            variant="default"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlace(place);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-medium truncate">
                              {place.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            {(() => {
                              const countryCode = getCountryCode(place.country);
                              if (countryCode && countryCode in Flags) {
                                const FlagComponent =
                                  Flags[countryCode as keyof typeof Flags];
                                return (
                                  <div className="h-3 w-4 rounded overflow-hidden">
                                    <FlagComponent className="w-full h-full object-cover" />
                                  </div>
                                );
                              }
                              return null;
                            })()}
                            <span className="truncate">{place.country}</span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {place.description}
                          </p>
                        </div>

                        {isSelected && (
                          <Badge variant="outline" className="ml-2">
                            Selected
                          </Badge>
                        )}
                      </div>
                    );
                  })}

                  {/* Load more trigger */}
                  <div
                    ref={loadMoreRef}
                    className="h-10 flex items-center justify-center"
                  >
                    {isLoadingMore && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more places...
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
