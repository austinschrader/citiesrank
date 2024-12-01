import PocketBase from "pocketbase";
import slugify from "slugify";
import { fallbackCityData } from "../raw_data/cities_data.js";
import { normalizeString } from "./utils.js";

const pb = new PocketBase("http://127.0.0.1:8090");

// Create URL-friendly slug
const createSlug = (name, country) => {
  const processedName = name.replace(/[']/g, "");
  return slugify(`${processedName}-${country}`, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

// Fetch all tags and create a mapping of identifier to ID
async function getTagsMapping() {
  const tags = await pb.collection("tags").getFullList();
  return tags.reduce((acc, tag) => {
    acc[tag.identifier] = tag.id;
    return acc;
  }, {});
}

async function migrateCityData() {
  const results = {
    deleted: 0,
    added: 0,
    errors: [],
  };

  try {
    // First, get the tags mapping
    console.log("Fetching tags mapping...");
    const tagsMapping = await getTagsMapping();

    // Convert the fallbackCityData with tag relations
    const cityData = Object.entries(fallbackCityData).map(([name, data]) => {
      const normalizedName = normalizeString(name);
      const slug = createSlug(name, data.country);

      // Convert destinationTypes to tag IDs
      const tagIds = (data.destinationTypes || [])
        .map((type) => tagsMapping[type])
        .filter((id) => id); // Remove any undefined mappings

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
        tags: JSON.stringify(tagIds), // Store tag IDs instead of destinationTypes
        crowdLevel: data.crowdLevel,
        recommendedStay: data.recommendedStay,
        bestSeason: data.bestSeason,
        accessibility: data.accessibility,
        coordinates: JSON.stringify(data.coordinates || [0, 0]),
        imageUrl: `${slug}-1`,
        averageRating: data.averageRating,
        totalReviews: data.totalReviews,
        costIndex: data.costIndex,
        transitScore: data.transitScore,
        walkScore: data.walkScore,
        safetyScore: data.safetyScore,
      };
    });

    // Delete existing records
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
        const newCity = await pb.collection("cities_list").create(city);
        results.added++;
        console.log(
          `Successfully added ${city.name} (normalized: ${
            city.normalizedName
          }) with ${JSON.parse(city.tags).length} tags`
        );
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

    console.log("\nMigration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateCityData().catch(console.error);
