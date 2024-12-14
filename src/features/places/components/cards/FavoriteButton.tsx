// src/features/places/components/cards/FavoriteButton.tsx
/**
 * Handles favorite functionality for places, including auth checks and API interactions
 */
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "../../context/FavoritesContext";

interface FavoriteButtonProps {
  placeId: string;
  onAuthRequired: () => void;
}

export const FavoriteButton = ({
  placeId,
  onAuthRequired,
}: FavoriteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isFavorited, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    try {
      await toggleFavorite(placeId);
      toast({
        title: isFavorited(placeId)
          ? "Removed from favorites"
          : "Added to favorites",
        description: isFavorited(placeId)
          ? "City has been removed from your favorites"
          : "City has been added to your favorites",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Must be logged in to favorite"
      ) {
        onAuthRequired();
      } else {
        console.error("Error toggling favorite:", error);
        toast({
          title: "Error",
          description: "Failed to update favorites. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFavoriteClick}
      disabled={isLoading}
      className="absolute top-3 right-3 z-30 p-3 rounded-full transition-all duration-300
                transform hover:scale-110 active:scale-95
                shadow-lg backdrop-blur-sm
                bg-white/20 hover:bg-white/30"
    >
      <Heart
        className={`w-6 h-6 transition-all duration-300 ${
          isFavorited(placeId) ? "fill-red-500 text-red-500" : "text-white"
        }`}
      />
    </Button>
  );
};
