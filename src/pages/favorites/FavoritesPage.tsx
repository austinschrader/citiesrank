// file location: src/pages/favorites/FavoritesPage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFavorites } from "@/features/places/context/FavoritesContext";
import { Search } from "lucide-react";
import { useState } from "react";

export const FavoritesPage = () => {
  const { user } = useAuth();
  const { cities } = useCities();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");

  const favoritedCities = cities.filter(city => favorites.has(city.id));
  const filteredCities = favoritedCities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 text-center">
            <h3 className="font-semibold text-lg mb-2">
              Please log in to view your favorites
            </h3>
            <p className="text-sm text-muted-foreground">
              Sign in to access your saved places
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Favorite Places</h1>
        <p className="text-muted-foreground">
          Your collection of saved destinations
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search your favorites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <PlaceCard key={city.id} city={city} variant="basic" />
        ))}
      </div>
    </div>
  );
};
