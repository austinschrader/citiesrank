import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useLists } from "@/features/lists/context/ListsContext";
import { CitiesResponse, ListsResponse } from "@/lib/types/pocketbase-types";
import { Loader2, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type ListWithPlaces = ListsResponse & {
  places: CitiesResponse[];
  stats: {
    places: number;
    saves: number;
  };
  curator: {
    name: string;
    avatar: string;
  };
  expand?: {
    user: {
      name: string;
      avatar: string;
    };
  };
};

export const ListDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getList } = useLists();

  // State hooks
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [list, setList] = useState<ListWithPlaces | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);

  // Load list data
  const loadList = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const listData = await getList(id);
      setList(listData as ListWithPlaces);
    } catch (error) {
      console.error("Failed to load list:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id, getList]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!mounted) return;
      await loadList();
    };

    load();

    return () => {
      mounted = false;
    };
  }, [loadList]);

  const handleImageClick = useCallback((place: CitiesResponse) => {
    setSelectedImage({
      url: place.imageUrl,
      title: place.name,
      description: place.description,
    });
  }, []);

  const handlePreviousImage = useCallback(() => {
    if (!selectedImage || !list) return;
    const currentIndex = list.places.findIndex(
      (place) => place.imageUrl === selectedImage.url
    );
    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : list.places.length - 1;
    const previousPlace = list.places[previousIndex];
    setSelectedImage({
      url: previousPlace.imageUrl,
      title: previousPlace.name,
      description: previousPlace.description,
    });
  }, [selectedImage, list]);

  const handleNextImage = useCallback(() => {
    if (!selectedImage || !list) return;
    const currentIndex = list.places.findIndex(
      (place) => place.imageUrl === selectedImage.url
    );
    const nextIndex =
      currentIndex < list.places.length - 1 ? currentIndex + 1 : 0;
    const nextPlace = list.places[nextIndex];
    setSelectedImage({
      url: nextPlace.imageUrl,
      title: nextPlace.name,
      description: nextPlace.description,
    });
  }, [selectedImage, list]);

  const handleShare = useCallback(async () => {
    if (!list) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: list.title,
          text: list.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [list]);

  const coverImage = useMemo(() => list?.places[0]?.imageUrl, [list]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Failed to load list</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message || "Something went wrong"}
          </p>
          <Button onClick={() => navigate("/lists")}>Back to Lists</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white/95 hover:scale-105 transition-all duration-300 shadow-lg"
          onClick={() => navigate(-1)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] bg-black">
        {coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
            style={{
              backgroundImage: `url(${coverImage})`,
            }}
            onClick={() => list.places[0] && handleImageClick(list.places[0])}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        {/* Header Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <h1 className="text-4xl font-bold text-white mb-4">{list.title}</h1>
          <p className="text-lg text-white/90 mb-6">{list.description}</p>

          {/* Stats and Actions */}
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="h-4 w-4" />
              <span>{list.place_count || 0} places</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="h-4 w-4" />
              <span>Created by {list.expand?.user?.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="h-4 w-4" />
              <span>Updated {new Date(list.updated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Places Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.places.map((place, index) => (
                <Card
                  key={place.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-purple-500/90 to-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-white shadow-lg">
                      <span className="font-medium">#{index + 1}</span>
                    </div>
                  </div>

                  <div className="relative aspect-[4/3]">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {place.name}
                        </h3>
                        <p className="text-white/90 text-sm line-clamp-2">
                          {place.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                      onClick={() => handleImageClick(place)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Place Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{place.name}</h3>
                        <span className="text-sm text-purple-500 font-medium">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {place.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{place.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-purple-50 hover:text-purple-600"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-purple-50 hover:text-purple-600"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              {/* Primary Actions */}
              <div className="space-y-3 mb-6">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Save List
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
                  size="lg"
                  onClick={handleShare}
                >
                  <X className="h-4 w-4 mr-2" />
                  Share List
                </Button>
              </div>

              <Separator className="mb-6" />

              {/* List Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                  <span className="text-muted-foreground">Places</span>
                  <span className="font-semibold text-purple-600">
                    {list.stats.places}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                  <span className="text-muted-foreground">Saves</span>
                  <span className="font-semibold text-purple-600">
                    {list.stats.saves}
                  </span>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Curator Info - More Subtle */}
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                <img
                  src={list.curator.avatar}
                  alt={list.curator.name}
                  className="w-8 h-8 rounded-full ring-2 ring-purple-100"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Curated by</p>
                  <p className="font-medium text-purple-900">
                    {list.curator.name}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95">
          <div className="relative h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 z-50 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handlePreviousImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleNextImage}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image */}
            {selectedImage && (
              <div className="relative w-full h-full">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-white/90">{selectedImage.description}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
