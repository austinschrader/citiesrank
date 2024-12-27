import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/bunny";
import {
  ArrowLeft,
  BookmarkPlus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  MapPin,
  Share2,
  Users,
  X,
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLists } from "@/features/lists/context/ListsContext";

interface Place {
  id: string;
  name: string;
  country: string;
  description: string;
  rating: number;
  imageUrl: string;
}

interface ListDetails {
  id: string;
  title: string;
  description: string;
  curator: {
    name: string;
    avatar: string;
  };
  stats: {
    places: number;
    saves: number;
    shares: number;
    contributors: number;
  };
  places: Place[];
  createdAt: string;
  updatedAt: string;
}

interface ListsResponse {
  id: string;
  title: string;
  description: string;
  curator: {
    name: string;
    avatar: string;
  };
  stats: {
    places: number;
    saves: number;
    shares: number;
    contributors: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CitiesResponse {
  id: string;
  name: string;
  country: string;
  description: string;
  rating: number;
  imageUrl: string;
}

export const ListDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getList, updateList, deleteList } = useLists();
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<ListsResponse & { places: CitiesResponse[] } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadList = async () => {
      try {
        setIsLoading(true);
        const listData = await getList(id);
        setList(listData);
      } catch (error) {
        console.error('Failed to load list:', error);
        // TODO: Add toast notification for error
      } finally {
        setIsLoading(false);
      }
    };

    loadList();
  }, [id, getList]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">List not found</h1>
        </div>
      </div>
    );
  }

  const coverImage = list.places[0]?.imageUrl;

  const handleShare = useCallback(async () => {
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

  const handleImageClick = (place: CitiesResponse) => {
    setSelectedImage({
      url: getImageUrl(place.imageUrl, "fullscreen"),
      title: place.name,
      description: place.description,
    });
  };

  const handlePreviousImage = () => {
    if (!selectedImage) return;
    const currentIndex = list.places.findIndex(
      (place) => getImageUrl(place.imageUrl, "fullscreen") === selectedImage.url
    );
    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : list.places.length - 1;
    const previousPlace = list.places[previousIndex];
    setSelectedImage({
      url: getImageUrl(previousPlace.imageUrl, "fullscreen"),
      title: previousPlace.name,
      description: previousPlace.description,
    });
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = list.places.findIndex(
      (place) => getImageUrl(place.imageUrl, "fullscreen") === selectedImage.url
    );
    const nextIndex =
      currentIndex < list.places.length - 1 ? currentIndex + 1 : 0;
    const nextPlace = list.places[nextIndex];
    setSelectedImage({
      url: getImageUrl(nextPlace.imageUrl, "fullscreen"),
      title: nextPlace.name,
      description: nextPlace.description,
    });
  };

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
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] bg-black">
        {coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
            style={{
              backgroundImage: `url(${getImageUrl(coverImage, "fullscreen")})`,
            }}
            onClick={() => list.places[0] && handleImageClick(list.places[0])}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {list.title}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              {list.description}
            </p>

            {/* Stats and Actions */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="h-4 w-4" />
                <span>{list.stats.contributors} contributors</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="h-4 w-4" />
                <span>{list.stats.places} places</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated {new Date(list.updatedAt).toLocaleDateString()}
                </span>
              </div>
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
                      src={getImageUrl(place.imageUrl, "standard")}
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
                      <Expand className="h-4 w-4" />
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
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-purple-50 hover:text-purple-600"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
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
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save List
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
                  size="lg"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
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
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                  <span className="text-muted-foreground">Shares</span>
                  <span className="font-semibold text-purple-600">
                    {list.stats.shares}
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
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-4 w-4" />
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
