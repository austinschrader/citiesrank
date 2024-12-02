import fs from "fs";
import { normalizeString } from "../seed_database_scripts/utils.js";
import { fallbackCityData } from "./cities_data.js";
import { updatedCityTags } from "./updated_tags_data.js";

// Create a new object to store the transformed data
const transformedCityData = { ...fallbackCityData };

// Update tags for each city
Object.entries(fallbackCityData).forEach(([cityName, cityData]) => {
  const normalizedName = normalizeString(cityName);

  // If we have updated tags for this city, use them
  if (updatedCityTags[normalizedName]) {
    transformedCityData[cityName] = {
      ...cityData,
      tags: updatedCityTags[normalizedName],
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

console.log("Transformation complete! Check transformed_cities_data.js");
