import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CityMap } from "@/features/map/components/CityMap";
import { LocationProvider } from "@/features/map/context/LocationContext";
import { MapProvider } from "@/features/map/context/MapContext";
import { SelectionProvider } from "@/features/map/context/SelectionContext";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Coffee,
  DollarSign,
  Globe,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Sample initial cities data
const majorCities = [
  {
    id: 1,
    name: "New York",
    latitude: 40.7128,
    longitude: -74.006,
    culture: 9,
    price: 8,
    vibe: 8,
  },
  {
    id: 2,
    name: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    culture: 9,
    price: 7,
    vibe: 7,
  },
  {
    id: 3,
    name: "Paris",
    latitude: 48.8566,
    longitude: 2.3522,
    culture: 10,
    price: 8,
    vibe: 8,
  },
  {
    id: 4,
    name: "Mexico City",
    latitude: 19.4326,
    longitude: -99.1332,
    culture: 8,
    price: 4,
    vibe: 9,
  },
  {
    id: 5,
    name: "Bangkok",
    latitude: 13.7563,
    longitude: 100.5018,
    culture: 8,
    price: 3,
    vibe: 8,
  },
  {
    id: 6,
    name: "Lisbon",
    latitude: 38.7223,
    longitude: -9.1393,
    culture: 7,
    price: 5,
    vibe: 9,
  },
  {
    id: 7,
    name: "Cape Town",
    latitude: -33.9249,
    longitude: 18.4241,
    culture: 7,
    price: 4,
    vibe: 8,
  },
];

export const SimpleExplorer = () => {
  const [filters, setFilters] = useState({
    price: 5,
    culture: 5,
    vibe: 5,
  });

  const navigate = useNavigate();

  // Calculate city scores based on filters
  const rankedCities = majorCities
    .map((city) => ({
      ...city,
      score:
        (city.culture * (filters.culture / 5) +
          (10 - city.price) * (filters.price / 5) +
          city.vibe * (filters.vibe / 5)) /
        3,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Find Your Perfect City
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover cities that match your lifestyle with our simple filters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[400px] rounded-xl overflow-hidden shadow-xl"
          >
            <MapProvider>
              <SelectionProvider>
                <LocationProvider>
                  <CityMap />
                </LocationProvider>
              </SelectionProvider>
            </MapProvider>
          </motion.div>

          {/* Controls Section */}
          <div className="space-y-8">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Budget Friendly</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {filters.price}/10
                  </span>
                </div>
                <Slider
                  value={[filters.price]}
                  onValueChange={([value]) =>
                    setFilters((prev) => ({ ...prev, price: value }))
                  }
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Cultural Richness</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {filters.culture}/10
                  </span>
                </div>
                <Slider
                  value={[filters.culture]}
                  onValueChange={([value]) =>
                    setFilters((prev) => ({ ...prev, culture: value }))
                  }
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">City Vibe</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {filters.vibe}/10
                  </span>
                </div>
                <Slider
                  value={[filters.vibe]}
                  onValueChange={([value]) =>
                    setFilters((prev) => ({ ...prev, vibe: value }))
                  }
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </motion.div>

            {/* Top Cities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Matches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate("/explore")}
                >
                  <Globe className="w-4 h-4" />
                  <span>Explore All Cities</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {rankedCities.slice(0, 4).map((city, index) => (
                  <div
                    key={city.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{city.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Match Score:
                          </span>
                          <span className="text-xs font-medium text-purple-500">
                            {Math.round(city.score * 10)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2"
            onClick={() => navigate("/explore")}
          >
            <Globe className="w-5 h-5" />
            Explore All 2,500+ Cities
            <ChevronRight className="w-5 h-5" />
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Access detailed insights, 20+ filters, and personalized
            recommendations
          </p>
        </motion.div>
      </div>
    </div>
  );
};
