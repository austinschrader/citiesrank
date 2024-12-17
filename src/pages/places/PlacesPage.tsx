// file location: src/pages/places/PlacesPage.tsx
import { LoadingSpinner } from "@/features/places/components/loading/LoadingSpinner";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { usePagination } from "@/features/places/hooks/usePagination";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { PlacesLayout } from "@/layouts/PlacesLayout";
import { CategoryTabs } from "@/features/places/components/categories/CategoryTabs";
import { CitiesGrid } from "@/features/places/components/grid/CitiesGrid";

export const PlacesPage = () => {
  const { preferences, calculateMatchForCity } = usePreferences();
  const { filters, getFilteredCities } = useFilters();
  const {
    cities,
    cityStatus: { loading },
  } = useCities();

  // Get filtered cities with match scores
  const filteredCities = getFilteredCities(cities, calculateMatchForCity);

  const {
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
  } = usePagination(filteredCities);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PlacesLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <CategoryTabs />
        <CitiesGrid
          cities={getPaginatedData()}
          onLoadMore={loadMore}
          hasMore={hasMore()}
        />
      </div>
    </PlacesLayout>
  );
};
