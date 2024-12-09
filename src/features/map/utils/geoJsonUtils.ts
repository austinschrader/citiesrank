import * as turf from '@turf/turf';
import { CitiesTypeOptions } from '@/lib/types/pocketbase-types';
import { MapPlace } from '../types';
import { feature } from 'topojson-client';
import worldAtlas from 'world-atlas/countries-50m.json';
import usAtlas from 'us-atlas/states-10m.json';

// Cache for GeoJSON data
const geoJsonCache = new Map<string, any>();

// Convert TopoJSON to GeoJSON once
const worldGeoJson = feature(worldAtlas as any, (worldAtlas as any).objects.countries);
const usGeoJson = feature(usAtlas as any, (usAtlas as any).objects.states);

export async function getPlaceGeoJson(place: MapPlace) {
  const cacheKey = `${place.type}-${place.id}`;
  
  // Return cached data if available
  if (geoJsonCache.has(cacheKey)) {
    return geoJsonCache.get(cacheKey);
  }

  let geoJsonData;

  switch (place.type) {
    case 'country': {
      // Find the country in world-atlas data
      // TODO fix types
      const countryFeature = worldGeoJson.features.find(
        (f: any) => f.properties.name?.toLowerCase() === place.name.toLowerCase()
      );
      
      if (countryFeature) {
        geoJsonData = countryFeature;
      } else {
        // Fallback to buffer if country not found
        geoJsonData = createBufferFeature(place, 200);
      }
      break;
    }
    
    case 'region': {
      // For US states, use us-atlas data
      if (place.country === 'United States') {
        const stateFeature = usGeoJson.features.find(
          (f: any) => f.properties.name?.toLowerCase() === place.name.toLowerCase()
        );
        if (stateFeature) {
          geoJsonData = stateFeature;
          break;
        }
      }
      // Fallback to buffer for non-US regions or if region not found
      geoJsonData = createBufferFeature(place, 50);
      break;
    }
    
    case 'city': {
      // For cities, create a more accurate circular boundary based on population
      const radius = calculateCityRadius(place.population);
      geoJsonData = createBufferFeature(place, radius);
      break;
    }
    
    case 'neighborhood': {
      geoJsonData = createBufferFeature(place, 1);
      break;
    }
    
    case 'sight': {
      geoJsonData = createBufferFeature(place, 0.2);
      break;
    }
    
    default: {
      geoJsonData = createBufferFeature(place, 1);
    }
  }

  // Add place properties
  geoJsonData.properties = {
    ...geoJsonData.properties,
    name: place.name,
    type: place.type,
    population: place.population,
    description: place.description
  };

  // Cache the result
  geoJsonCache.set(cacheKey, geoJsonData);
  
  return geoJsonData;
}

function createBufferFeature(place: MapPlace, radiusKm: number) {
  const point = turf.point([place.longitude || 0, place.latitude || 0]);
  return turf.buffer(point, radiusKm, { units: 'kilometers' });
}

function calculateCityRadius(population?: string): number {
  if (!population) return 5;
  
  // Convert population string to number, removing commas
  const pop = parseInt(population.replace(/,/g, ''));
  
  // Calculate radius based on population
  // Using a logarithmic scale: radius = base_radius * log10(population/base_population)
  const baseRadius = 5; // 5km base radius
  const basePopulation = 100000; // Base population for calculation
  
  if (pop <= basePopulation) return baseRadius;
  
  return baseRadius * Math.log10(pop/basePopulation);
}
