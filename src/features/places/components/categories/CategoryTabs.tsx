import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilters } from "../../context/FiltersContext";
import { useTags } from "../../hooks/useTags";
import { useCities } from "../../context/CitiesContext";
import { useCallback } from "react";

const CITIES_PER_CATEGORY = 12;

export const CategoryTabs = () => {
  const { filterOptions } = useTags();
  const { cities } = useCities();
  const { filters, setFilters } = useFilters();

  const categories = [
    { id: "all", label: "All", tagIds: [] },
    { 
      id: "trending", 
      label: "Trending", 
      tagIds: filterOptions
        .filter(tag => ["trending", "popular", "upcoming"].includes(tag.identifier))
        .map(tag => tag.id)
    },
    { 
      id: "nature", 
      label: "Nature", 
      tagIds: filterOptions
        .filter(tag => ["nature", "outdoors", "mountains", "beach"].includes(tag.identifier))
        .map(tag => tag.id)
    },
    { 
      id: "culture", 
      label: "Culture", 
      tagIds: filterOptions
        .filter(tag => ["culture", "history", "art", "museums"].includes(tag.identifier))
        .map(tag => tag.id)
    },
    { 
      id: "nomad", 
      label: "Nomad-friendly", 
      tagIds: filterOptions
        .filter(tag => ["digital-nomad", "coworking", "wifi", "cafes"].includes(tag.identifier))
        .map(tag => tag.id)
    },
  ];

  const getRandomCities = useCallback((tagIds: string[]) => {
    if (tagIds.length === 0) {
      const shuffled = [...cities].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, CITIES_PER_CATEGORY);
    }

    const citiesWithTags = cities.filter(city => 
      city.tags?.some(tag => tagIds.includes(tag))
    );
    const shuffled = [...citiesWithTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, CITIES_PER_CATEGORY);
  }, [cities]);

  const handleCategoryChange = (value: string) => {
    const category = categories.find((c) => c.id === value);
    if (category) {
      const randomCities = getRandomCities(category.tagIds);
      setFilters({
        ...filters,
        tags: category.tagIds,
        randomSelection: randomCities.map(city => city.id)
      });
    }
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleCategoryChange}
      >
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
