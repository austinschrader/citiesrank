import PocketBase from "pocketbase";
import slugify from "slugify";
import { fallbackCityData } from "../raw_data/cities_data.js";
import { normalizeString } from "./utils.js";

// const pb = new PocketBase("http://127.0.0.1:8090");
const pb = new PocketBase("https://citiesrank-ppe.westus2.cloudapp.azure.com");
// const pb = new PocketBase("https://api.citiesrank.com");

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

      // Convert tags to tag IDs
      const tagIds = (data.tags || [])
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
    // console.log("Deleting existing city records...");
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

async function updateCityTags() {
  const results = {
    deleted: 0,
    updated: 0,
    errors: [],
  };

  try {
    // First, get the tags mapping
    // console.log("Fetching tags mapping...");
    const tagsMapping = await getTagsMapping();
    // console.log("Tags mapping:", JSON.stringify(tagsMapping, null, 2));

    // Convert the fallbackCityData with tag relations
    const cityData = Object.entries(fallbackCityData).map(([name, data]) => {
      const normalizedName = normalizeString(name);
      const slug = createSlug(name, data.country);

      // Log raw tags before conversion
      // console.log(`\nProcessing ${name}:`);
      // console.log("Raw tags:", data.tags || []);

      // Convert tags to tag IDs
      const tagIds = (data.tags || [])
        .map((type) => {
          const id = tagsMapping[type];
          if (!id) {
            // console.warn(
            //   `Warning: No mapping found for tag type "${type}" in city "${name}"`
            // );
          }
          return id;
        })
        .filter((id) => id);

      // console.log("Converted tag IDs:", tagIds);

      return {
        name,
        normalizedName,
        country: data.country,
        cost: data.cost,
        interesting: data.interesting,
        transit: data.transit,
        description: data.description,
        population: data.population,
        highlights: data.highlights,
        averageRating: data.averageRating,
        totalReviews: data.totalReviews,
        tags: tagIds,
        crowdLevel: data.crowdLevel,
        recommendedStay: data.recommendedStay,
        bestSeason: data.bestSeason,
        accessibility: data.accessibility,
        costIndex: data.costIndex,
        safetyScore: data.safetyScore,
        walkScore: data.walkScore,
        transitScore: data.transitScore,
      };
    });

    // Update existing records
    // console.log("\nUpdating city tags...");
    for (const city of cityData) {
      try {
        // Find existing city by normalized name
        const existingCity = await pb
          .collection("cities_list")
          .getFirstListItem(`normalizedName = "${city.normalizedName}"`);

        console.log(city.normalizedName);
        // console.log(`\nProcessing update for ${city.name}:`);
        // console.log(`Normalized name: ${city.normalizedName}`);
        // console.log(`Tags to update:`, city.tags);

        // Update with all fields from cities_data.js
        const updateData = {
          ...city,
          "@collection": "cities_list",
          "@collectionId": existingCity.collectionId,
        };

        // Update the record with all fields
        await pb.collection("cities_list").update(existingCity.id, updateData);
        results.updated++;
        // console.log(`✅ Updated ${city.name}`);
      } catch (error) {
        results.errors.push({
          type: "update",
          city: city.name,
          time: new Date(),
          error: `Failed to update: ${error.message}`,
          payload: error.data,
          details: {
            normalizedName: city.normalizedName,
            proposedTags: city.tags,
          },
        });
        console.error(`\n❌ Error updating ${city.name}:`);
        console.error(`Failed to update: ${error.message}`);
        console.error(`Update payload:`, error.data);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    // Print summary
    console.log("\nMigration Summary:");
    console.log(`Records updated: ${results.updated}`);
    console.log(`Errors encountered: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log("\nDetailed Error Report:");
      results.errors.forEach((error, index) => {
        console.log(`\nError ${index + 1}:`);
        console.log(`Type: ${error.type}`);
        console.log(`City: ${error.city}`);
        console.log(`Time: ${error.time}`);
        console.log(`Error: ${error.error}`);
        console.log(`Details:`, error.details);
      });
    }

    console.log("\nMigration complete!");
  } catch (error) {
    console.error("\n❌ Migration failed with critical error:", error);
    throw error;
  }
}

// Run the migration
// migrateCityData().catch(console.error);

// Run the update
updateCityTags().catch(console.error);
