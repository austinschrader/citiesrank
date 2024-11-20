// Deletes all existing records in the cities_list collection and populates it with the data from the raw_data/cities_data.js file

import PocketBase from "pocketbase";
import { fallbackCityData } from "../raw_data/cities_data.js";

const pb = new PocketBase("https://api.citiesrank.com");

// Convert the fallbackCityData into a format suitable for PocketBase
const cityData = Object.entries(fallbackCityData).map(([name, data]) => ({
  name,
  country: data.country,
  cost: data.cost,
  interesting: data.interesting,
  transit: data.transit,
  description: data.description,
  population: data.population,
  highlights: JSON.stringify(data.highlights),
  reviews: JSON.stringify(data.reviews),
  destinationTypes: JSON.stringify(data.destinationTypes),
  crowdLevel: data.crowdLevel,
  recommendedStay: data.recommendedStay,
  bestSeason: data.bestSeason,
  accessibility: data.accessibility,
}));

async function migrateCityData() {
  try {
    // First, delete existing records
    console.log("Deleting existing city records...");
    const existingRecords = await pb.collection("cities_list").getFullList();
    for (const record of existingRecords) {
      try {
        await pb.collection("cities_list").delete(record.id);
        console.log(`Deleted ${record.name}`);
      } catch (error) {
        console.error(`Error deleting ${record.name}:`, error.message);
      }
    }

    // Add new records
    console.log("\nAdding new city records...");
    for (const city of cityData) {
      try {
        await pb.collection("cities_list").create(city);
        console.log(`Successfully added ${city.name}`);
      } catch (error) {
        console.error(`Error adding ${city.name}:`, error.message);
        console.error("Data:", city);
      }
      // Add a small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    console.log("\nMigration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run the migration
migrateCityData();
