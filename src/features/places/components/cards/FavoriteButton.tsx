// src/features/places/components/cards/FavoriteButton.tsx
/**
 * Handles favorite functionality for places, including auth checks and API interactions
 */
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { useState } from "react";

interface FavoriteButtonProps {
  placeId: string;
  initialFavorited?: boolean;
  onAuthRequired: () => void;
}

export const FavoriteButton = ({
  placeId,
  initialFavorited = false,
  onAuthRequired,
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { user, pb } = useAuth();
  const { toast } = useToast();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onAuthRequired();
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFavorite) {
        const records = await pb.collection("favorites").getFullList({
          filter: `user = "${user.id}" && city = "${placeId}"`,
          $autoCancel: false,
        });
        if (records.length > 0) {
          await pb.collection("favorites").delete(records[0].id);
        }
        toast({
          title: "Removed from favorites",
          description: "City has been removed from your favorites",
        });
      } else {
        await pb.collection("favorites").create({
          user: user.id,
          city: placeId,
          field: "",
        });
        toast({
          title: "Added to favorites",
          description: "City has been added to your favorites",
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
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
          isFavorite ? "fill-red-500 text-red-500" : "text-white"
        }`}
      />
    </Button>
  );
};
