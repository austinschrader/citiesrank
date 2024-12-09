import fs from "fs";
import { normalizeString } from "../seed_database_scripts/utils.js";
import { fallbackCityData } from "./cities_data.js";
import { citiesWithLatitudeAndLongitude } from "./updated_latitude_and_longitude_data.js";

// Create a new object to store the transformed data
const transformedCityData = { ...fallbackCityData };

// Update latitude and longitude for each city
Object.entries(fallbackCityData).forEach(([cityName, cityData]) => {
  const normalizedName = normalizeString(cityName);

  // If we have updated coordinates for this city, use them
  if (citiesWithLatitudeAndLongitude[normalizedName]) {
    const [latitude, longitude] =
      citiesWithLatitudeAndLongitude[normalizedName];
    transformedCityData[cityName] = {
      ...cityData,
      latitude,
      longitude,
    };
  }
});

// Convert to string with proper formatting
const outputString = `export const fallbackCityData = ${JSON.stringify(
  transformedCityData,
  null,
  2
)};`;

// Write to a new file
fs.writeFileSync("./transformed_cities_data.js", outputString, "utf8");
