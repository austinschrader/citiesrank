import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CityCard } from "@/features/places/components/CityCard";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export const ProfileFavorites = () => {
  const { user, pb } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsLoading(true);
      await pb.collection("users").update(user.id, formData);

      // Force auth refresh and get the new avatar URL
      const updatedUser = await pb.collection("users").authRefresh();

      // Log to check what we're getting
      console.log("Updated user:", updatedUser);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const [favoriteCities, setFavoriteCities] = useState<CitiesResponse[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

  // Fetch favorite cities
  useEffect(() => {
    let isSubscribed = true;

    async function fetchFavorites() {
      if (!user) return;

      setIsFavoritesLoading(true);
      try {
        const favorites = await pb.collection("favorites").getFullList({
          filter: `user = "${user.id}"`,
          expand: "city",
          $autoCancel: false,
        });

        if (isSubscribed) {
          const favoritedCities = favorites
            .map((favorite) => favorite.expand?.city)
            .filter(Boolean);

          setFavoriteCities(favoritedCities);
        }
      } catch (error) {
        // Only show error if component is still mounted and error is not a cancellation
        if (
          isSubscribed &&
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Error fetching favorites:", error);
          toast({
            title: "Error loading favorites",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      } finally {
        if (isSubscribed) {
          setIsFavoritesLoading(false);
        }
      }
    }

    fetchFavorites();

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Favorite Cities
          </h2>
          <p className="text-sm text-muted-foreground">
            Cities you've marked as favorites
          </p>
        </div>
      </div>

      {isFavoritesLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : favoriteCities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 text-center">
            <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              No Favorite Cities Yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Start exploring cities and click the star icon to add them to your
              favorites!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCities.map((city) => (
            <CityCard key={city.id} city={city} variant="basic" />
          ))}
        </div>
      )}
    </div>
  );
};
