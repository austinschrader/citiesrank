import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePlaces } from "@/features/places/context/PlacesContext";
import { AchievementCard } from "@/features/profile/components/AchievementCard";
import { Achievement } from "@/features/profile/types";
import { Building2, Globe, Landmark, Map, Star } from "lucide-react";

export const AchievementsList = () => {
  const { user } = useAuth();
  const { places, stats, status } = usePlaces();

  const visitedCitiesCount = user?.places_visited?.length || 0;
  const visitedCountries = new Set(
    places.cities
      .filter((city) => user?.places_visited?.includes(city.id))
      .map((city) => city.country)
  ).size;

  const achievements: Achievement[] = [
    {
      name: "Global Explorer",
      description: `Visited ${visitedCountries} out of ${stats.totalCountries} countries`,
      progress: visitedCountries,
      total: stats.totalCountries,
      icon: <Globe className="h-4 w-4" />,
    },
    {
      name: "City Conqueror",
      description: `Explored ${visitedCitiesCount} out of ${stats.totalCities} major cities`,
      progress: visitedCitiesCount,
      total: stats.totalCities,
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      name: "Continental Coverage",
      description: "Visited 3 out of 7 continents",
      progress: 3,
      total: 7,
      icon: <Map className="h-4 w-4" />,
    },
    {
      name: "Capital Collector",
      description: "Visited 12 out of 196 capital cities",
      progress: 12,
      total: 196,
      icon: <Star className="h-4 w-4" />,
    },
    {
      name: "UNESCO Heritage Explorer",
      description: "Discovered 3 out of 1,223 UNESCO heritage sites",
      progress: 3,
      total: 1223,
      icon: <Landmark className="h-4 w-4" />,
    },
  ];

  if (status.loading) return <div>Loading achievements...</div>;
  if (status.error)
    return <div>Error loading achievements: {status.error}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.name} achievement={achievement} />
      ))}
    </div>
  );
};
