import PocketBase from "pocketbase";
import { fallbackCityData } from "../raw_data/cities_data.js";
import slugify from "slugify";
import { normalizeString } from "./utils.js";

const pb = new PocketBase("https://api.citiesrank.com");

// Create URL-friendly slug
const createSlug = (name, country) => {
  // Pre-process the name to handle apostrophes consistently
  const processedName = name.replace(/[']/g, "");

  return slugify(`${processedName}-${country}`, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g, // Remove additional special characters
  });
};

// Convert the fallbackCityData into a format suitable for PocketBase
const cityData = Object.entries(fallbackCityData).map(([name, data]) => {
  const normalizedName = normalizeString(name);
  const slug = createSlug(name, data.country);

  // console.log(`Processing ${name}:`);
  // console.log(`- normalizedName: "${normalizedName}"`);
  // console.log(`- slug: "${slug}"`);

  return {
    name,
    normalizedName,
    slug,
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
    coordinates: JSON.stringify(data.coordinates || [0, 0]), // Add default coordinates if none exist
    imageUrl: `${slug}-1`, // Default image naming convention
  };
});

async function migrateCityData() {
  const results = {
    deleted: 0,
    added: 0,
    errors: [],
  };

  try {
    // First, delete existing records
    console.log("Deleting existing city records...");
    const existingRecords = await pb.collection("cities_list").getFullList();

    for (const record of existingRecords) {
      try {
        await pb.collection("cities_list").delete(record.id);
        results.deleted++;
        console.log(`Deleted ${record.name}`);
      } catch (error) {
        results.errors.push({
          type: "deletion",
          city: record.name,
          error: error.message,
        });
        console.error(`Error deleting ${record.name}:`, error.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Add new records
    console.log("\nAdding new city records...");
    for (const city of cityData) {
      try {
        await pb.collection("cities_list").create(city);
        results.added++;
        console.log(`Successfully added ${city.name} (normalized: ${city.normalizedName})`);
      } catch (error) {
        results.errors.push({
          type: "creation",
          city: city.name,
          error: error.message,
          data: city,
        });
        console.error(`Error adding ${city.name}:`, error.message);
        console.error("Data:", city);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    // Print summary
    console.log("\nMigration Summary:");
    console.log(`Records deleted: ${results.deleted}`);
    console.log(`Records added: ${results.added}`);
    console.log(`Errors encountered: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log("\nDetailed Error Report:");
      results.errors.forEach((error, index) => {
        console.log(`\nError ${index + 1}:`);
        console.log(`Type: ${error.type}`);
        console.log(`City: ${error.city}`);
        console.log(`Error: ${error.error}`);
        if (error.data) {
          console.log("Data:", JSON.stringify(error.data, null, 2));
        }
      });
    }

    // Save results to file
    // const fs = await import("fs");
    // fs.writeFileSync("migration-results.json", JSON.stringify(results, null, 2));
    // console.log("\nMigration complete! Results saved to migration-results.json");

    console.log("\nMigration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateCityData().catch(console.error);
