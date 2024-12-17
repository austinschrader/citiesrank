import { Skeleton } from "@/components/ui/skeleton";
import { CategoryScroll } from "@/features/discovery/components/CategoryScroll";
import { MapHero } from "@/features/discovery/components/MapHero";
import {
  useCities,
  useCitiesActions,
} from "@/features/places/context/CitiesContext";
import { createSlug } from "@/features/places/utils/placeUtils";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Popular Cities",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.averageRating &&
      Boolean(place.averageRating > 3),
  },
  {
    title: "Hidden Gems",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.averageRating &&
      Boolean(place.averageRating > 3) &&
      !!place.accessibility &&
      Boolean(place.accessibility < 6),
  },
  {
    title: "Best Winter Destinations",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.bestSeason &&
      Boolean(place.bestSeason <= 2),
  },
  {
    title: "Summer Hotspots",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.bestSeason &&
      Boolean(place.bestSeason >= 6 && place.bestSeason <= 8),
  },
  {
    title: "Most Accessible Cities",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.accessibility &&
      Boolean(place.accessibility > 8),
  },
  {
    title: "Remote Work Friendly",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.averageRating &&
      Boolean(place.averageRating > 3) &&
      !!place.accessibility &&
      Boolean(place.accessibility > 7),
  },
  {
    title: "Adventure Destinations",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.accessibility &&
      Boolean(place.accessibility < 7) &&
      !!place.averageRating &&
      Boolean(place.averageRating > 3),
  },
  {
    title: "Spring Break Favorites",
    filter: (place: CitiesResponse): boolean =>
      place.type === CitiesTypeOptions.city &&
      !!place.bestSeason &&
      Boolean(place.bestSeason >= 3 && place.bestSeason <= 5),
  },
];

export const DiscoveryPage = () => {
  const navigate = useNavigate();
  const { cities, cityStatus } = useCities();
  const { refreshCities } = useCitiesActions();

  useEffect(() => {
    if (cities.length === 0 && !cityStatus.loading && !cityStatus.error) {
      refreshCities();
    }
  }, [cities.length, cityStatus.loading, cityStatus.error, refreshCities]);

  // Get trending places based on views and ratings
  const trendingPlaces = useMemo(() => {
    return cities
      .filter(
        (place) => place.type === CitiesTypeOptions.city && place.averageRating
      )
      .sort((a, b) => {
        const aScore = (a.averageRating || 0) * (a.averageRating || 0);
        const bScore = (b.averageRating || 0) * (b.averageRating || 0);
        return bScore - aScore;
      })
      .slice(0, 8);
  }, [cities]);

  console.log(trendingPlaces);

  // Get places for each category
  const getCategoryPlaces = useCallback(
    (filter: (place: CitiesResponse) => boolean) => {
      return cities
        .filter(filter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    },
    [cities]
  );

  const handlePlaceClick = (place: CitiesResponse) => {
    navigate(`/places/${place.type}/${createSlug(place.name)}`, {
      state: { placeData: place },
    });
  };

  if (cityStatus.loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-[70vh] w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-4 overflow-x-hidden">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton
                      key={j}
                      className="h-[200px] w-[300px] flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cityStatus.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Error Loading Places</h2>
          <p className="text-muted-foreground">{cityStatus.error}</p>
        </div>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No Places Found</h2>
          <p className="text-muted-foreground">Try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Map */}
      <MapHero
        trendingPlaces={trendingPlaces}
        onPlaceClick={handlePlaceClick}
      />

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryPlaces = getCategoryPlaces(category.filter);
            if (categoryPlaces.length === 0) return null;

            return (
              <CategoryScroll
                key={category.title}
                title={category.title}
                places={categoryPlaces}
                onPlaceClick={handlePlaceClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
