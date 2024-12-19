import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";
import { usePagination } from "@/features/places/hooks/usePagination";
import { useEffect, useState } from "react";
import { PlaceCard } from "../cards/PlaceCard";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

export const FeaturedPlaces = () => {
  const { cities } = useCities();
  const { filters, setFilter, resetFilters } = useFilters();
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(
    null
  );

  // Reset filters when component unmounts
  useEffect(() => {
    return () => resetFilters();
  }, [resetFilters]);

  // Filter types for quick access
  const archetypeFilters = [
    {
      id: "culture",
      label: "OMG!",
      emoji: "💫",
      description: "Jaw-dropping & magical",
      hoverGradient:
        "from-purple-200/80 via-fuchsia-100 to-pink-200/80 dark:from-purple-800/30 dark:via-fuchsia-900/20 dark:to-pink-800/30",
      activeGradient: "from-purple-500 to-pink-500",
    },
    {
      id: "outdoor",
      label: "Wild Wonder",
      emoji: "🗻",
      description: "Natural beauty & peace",
      hoverGradient:
        "from-emerald-200/80 via-green-100 to-lime-200/80 dark:from-emerald-800/30 dark:via-green-900/20 dark:to-lime-800/30",
      activeGradient: "from-emerald-500 to-green-500",
    },
    {
      id: "foodie",
      label: "Cuisine",
      emoji: "🍜",
      description: "Markets, food & drinks",
      hoverGradient:
        "from-amber-200/80 via-yellow-100 to-orange-200/80 dark:from-amber-800/30 dark:via-yellow-900/20 dark:to-orange-800/30",
      activeGradient: "from-amber-500 to-yellow-500",
    },
    {
      id: "family",
      label: "Family Friendly",
      emoji: "🎠",
      description: "Safe & family fun",
      hoverGradient:
        "from-sky-200/80 via-cyan-100 to-blue-200/80 dark:from-sky-800/30 dark:via-cyan-900/20 dark:to-blue-800/30",
      activeGradient: "from-sky-500 to-blue-500",
    },
    {
      id: "digital-nomad",
      label: "Work",
      emoji: "💻",
      description: "Fast WiFi & coworking",
      hoverGradient:
        "from-indigo-200/80 via-blue-100 to-violet-200/80 dark:from-indigo-800/30 dark:via-blue-900/20 dark:to-violet-800/30",
      activeGradient: "from-indigo-500 to-violet-500",
    },
    {
      id: "nightlife",
      label: "Night Scene",
      emoji: "🎉",
      description: "Vibrant nights & energy",
      hoverGradient:
        "from-violet-200/80 via-purple-100 to-fuchsia-200/80 dark:from-violet-800/30 dark:via-purple-900/20 dark:to-fuchsia-800/30",
      activeGradient: "from-violet-500 to-fuchsia-500",
    },
  ];

  const filteredCities = cities
    .filter((city) => {
      // If no archetype is selected, show all cities
      if (!selectedArchetype) return true;

      // Temporary hardcoded filtering logic
      switch (selectedArchetype) {
        case "culture":
          return [
            "Acropolis",
            "Kyoto",
            "Le Marais",
            "Tuscany",
            "Andalusia",
            "Colosseum",
            "Sagrada Familia",
          ].includes(city.name);
        case "outdoor":
          return [
            "Provence",
            "Bavaria",
            "Queensland",
            "Great Wall of China",
            "Kyushu",
            "California",
          ].includes(city.name);
        case "foodie":
          return [
            "Kansai",
            "Lyon",
            "Barcelona",
            "Tuscany",
            "SoHo",
            "Kreuzberg",
          ].includes(city.name);
        case "family":
          return [
            "Bavaria",
            "Eiffel Tower",
            "Colosseum",
            "Great Wall of China",
            "Queensland",
            "California",
          ].includes(city.name);
        case "digital-nomad":
          return [
            "Berlin",
            "Barcelona",
            "Kyoto",
            "Amsterdam",
            "SoHo",
            "Kreuzberg",
          ].includes(city.name);
        case "nightlife":
          return [
            "Berlin",
            "Kreuzberg",
            "Le Marais",
            "SoHo",
            "Barcelona",
            "Hamburg",
          ].includes(city.name);
        default:
          return true;
      }
    })
    .filter((city) => filters.activeTypes.includes(city.type as CitiesTypeOptions));

  const {
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
  } = usePagination(filteredCities);

  const observerTarget = useInfiniteScroll(loadMore, hasMore, isLoadingMore);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      {/* Archetype Filters */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Explore by Travel Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {archetypeFilters.map((type) => (
            <button
              key={type.id}
              onClick={() =>
                setSelectedArchetype(
                  selectedArchetype === type.id ? null : type.id
                )
              }
              className={`
                group flex flex-col items-center p-3 rounded-xl transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98] 
                ${
                  selectedArchetype === type.id
                    ? `bg-gradient-to-br ${type.activeGradient} shadow-lg scale-[1.02] ring-1 ring-white/50`
                    : `bg-white dark:bg-gray-800
                       shadow-md hover:shadow-lg
                       border border-gray-200 dark:border-gray-700
                       hover:bg-gradient-to-tl ${type.hoverGradient} hover:border-transparent
                       relative`
                }
              `}
            >
              <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-300">
                {type.emoji}
              </span>
              <span
                className={`
                font-medium text-sm text-center transition-colors duration-300
                ${
                  selectedArchetype === type.id
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-200 group-hover:text-foreground/90"
                }
              `}
              >
                {type.label}
              </span>
              <p
                className={`
                text-xs text-center mt-0.5 line-clamp-1
                ${
                  selectedArchetype === type.id
                    ? "text-white/90"
                    : "text-muted-foreground group-hover:text-foreground"
                }
              `}
              >
                {type.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Place Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getPaginatedData().map((city) => (
          <PlaceCard key={city.id} city={city} variant="basic" />
        ))}
      </div>

      {/* Infinite Scroll Observer */}
      <div ref={observerTarget} className="h-4 w-full" />
    </div>
  );
};
