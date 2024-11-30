import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCities } from "@/features/places/context/CitiesContext";
import { useCountries } from "@/features/places/context/CountriesContext";
import { Achievement } from "@/features/profile/types";
import { Building2, Globe, Landmark, Map, Star, Trophy } from "lucide-react";

export const AchievementsListCard = () => {
  const { user } = useAuth();
  const { cities: places, totalCities, cityStatus } = useCities();
  const { countries, totalCountries, countryStatus } = useCountries();

  const visitedCitiesCount = user?.places_visited?.length || 0;
  const visitedCountries = places
    .map((place) => place.country)
    .filter(
      (country, index, countries) => countries.indexOf(country) === index
    ).length;

  const achievementsList: Achievement[] = [
    {
      name: "Global Explorer",
      description: `Visited ${visitedCountries} out of ${totalCountries} countries`,
      progress: visitedCountries,
      total: totalCountries,
      icon: <Globe className="h-4 w-4" />,
    },
    {
      name: "City Conqueror",
      description: `Explored ${visitedCitiesCount} out of ${totalCities} major cities`,
      progress: visitedCitiesCount,
      total: totalCities,
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

  if (cityStatus.loading || countryStatus.loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievementsList.map((achievement, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                {achievement.icon}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-medium">{achievement.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
