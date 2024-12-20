import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFavoriteStatus } from "@/features/places/hooks/useFavoriteStatus";
import { getPlaceImage } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Heart,
  LucideIcon,
  Shield,
  Star,
  Users,
} from "lucide-react";
import React, { useEffect } from "react";
import { MapPlace } from "../types";

interface PlaceModalProps {
  place: MapPlace;
  isOpen: boolean;
  onClose: () => void;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color,
}) => (
  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-sm">
    <Icon className={cn("w-5 h-5", color)} />
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  </div>
);

export const PlaceModal: React.FC<PlaceModalProps> = ({
  place,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [preloadedImages, setPreloadedImages] = React.useState<string[]>([]);
  const { isFavorited, refresh } = useFavoriteStatus(place.id);
  const { user, pb } = useAuth();
  const totalImages = 4;

  const getImageUrl = (index: number) => {
    const baseUrl = place.imageUrl.replace(/-\d+$/, "");
    return `${baseUrl}-${index + 1}`;
  };

  useEffect(() => {
    if (isOpen) {
      const imageUrls = Array.from({ length: totalImages }, (_, i) =>
        getPlaceImage(getImageUrl(i), "wide")
      );

      imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });

      setPreloadedImages(imageUrls);
    }
  }, [isOpen, place.imageUrl]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFavorited) {
        // Find and delete the favorite
        const favorites = await pb.collection("favorites").getList(1, 1, {
          filter: `user = "${user.id}" && city = "${place.id}"`,
        });

        if (favorites.items.length > 0) {
          await pb.collection("favorites").delete(favorites.items[0].id);
        }
      } else {
        // Create new favorite
        await pb.collection("favorites").create({
          user: user.id,
          city: place.id,
        });
      }
      refresh();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 gap-0 h-[90vh]">
        {/* Image Gallery */}
        <div className="relative h-[75vh] bg-muted">
          {preloadedImages[currentImageIndex] && (
            <img
              src={preloadedImages[currentImageIndex]}
              alt={`${place.name} view ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          )}

          {/* Navigation Buttons */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={prevImage}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={nextImage}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Navigation Dots */}
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
            {Array.from({ length: totalImages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentImageIndex === index
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-background">
          <div className="space-y-6">
            {/* Header and Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{place.name}</h2>
                  <p className="text-muted-foreground">
                    {place.country || ''}
                  </p>
                </div>
                {user && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className={cn(
                      "rounded-full",
                      isFavorited && "bg-red-500/20 hover:bg-red-500/30"
                    )}
                    onClick={toggleFavorite}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        isFavorited && "fill-red-500 text-red-500"
                      )}
                    />
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {place.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Star}
                label="Rating"
                value={place.averageRating?.toFixed(1) || "N/A"}
                color="text-yellow-500"
              />
              <StatCard
                icon={DollarSign}
                label="Cost"
                value={place.cost || "N/A"}
                color="text-green-500"
              />
              <StatCard
                icon={Users}
                label="Population"
                value={place.population?.toLocaleString() || "N/A"}
                color="text-blue-500"
              />
              <StatCard
                icon={Shield}
                label="Safety"
                value={place.safetyScore || "N/A"}
                color="text-red-500"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
