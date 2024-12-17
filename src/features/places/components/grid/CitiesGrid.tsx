import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Masonry from "react-masonry-css";
import { CityCard } from "@/features/places/components/cards/CityCard";
import { useMap } from "@/features/map/context/MapContext";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { CityMap } from "@/features/map/components/CityMap";
import { motion, AnimatePresence } from "framer-motion";

interface CitiesGridProps {
  cities: CitiesResponse[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const CitiesGrid = ({ cities, onLoadMore, hasMore }: CitiesGridProps) => {
  const { ref: loadMoreRef, inView } = useInView();
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleCities, setVisibleCities] = useState<CitiesResponse[]>([]);
  const { setCenter, setZoom } = useMap();

  // Update visible cities when scrolling
  useEffect(() => {
    const updateVisibleCities = () => {
      if (!gridRef.current) return;

      const cards = gridRef.current.getElementsByClassName("city-card");
      const visible: CitiesResponse[] = [];

      Array.from(cards).forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.left >= 0 &&
          rect.right <= window.innerWidth;

        if (isVisible && cities[index]) {
          visible.push(cities[index]);
        }
      });

      setVisibleCities(visible);
    };

    const observer = new IntersectionObserver(updateVisibleCities, {
      threshold: 0.1,
    });

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    window.addEventListener("scroll", updateVisibleCities);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateVisibleCities);
    };
  }, [cities]);

  // Update map center when visible cities change
  useEffect(() => {
    if (visibleCities.length > 0) {
      // Calculate the center point of visible cities
      const centerLat =
        visibleCities.reduce((sum, city) => sum + city.latitude, 0) /
        visibleCities.length;
      const centerLng =
        visibleCities.reduce((sum, city) => sum + city.longitude, 0) /
        visibleCities.length;

      setCenter([centerLat, centerLng]);
      setZoom(4);
    }
  }, [visibleCities, setCenter, setZoom]);

  // Load more cities when reaching the bottom
  useEffect(() => {
    if (inView && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  const breakpointCols = {
    default: 4,
    1536: 3,
    1280: 3,
    1024: 2,
    768: 2,
    640: 1,
  };

  return (
    <div className="relative w-full" ref={gridRef}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 w-64 h-64 bg-white rounded-lg shadow-lg overflow-hidden z-50"
      >
        <CityMap className="w-full h-full" places={visibleCities} />
      </motion.div>
      <AnimatePresence>
        <Masonry
          breakpointCols={breakpointCols}
          className="flex w-full -ml-4"
          columnClassName="pl-4"
        >
          {cities.map((city) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4 city-card"
            >
              <CityCard city={city} />
            </motion.div>
          ))}
        </Masonry>
      </AnimatePresence>
      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </div>
  );
};
