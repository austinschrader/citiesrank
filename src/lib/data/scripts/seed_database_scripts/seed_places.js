import PocketBase from "pocketbase";
import slugify from "slugify";
import { fallbackCityData } from "../../places/citiesData.js";
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

// Transform raw city data into database format
const transformCityData = (name, data, tagsMapping) => {
  const normalizedName = normalizeString(name);
  const slug = createSlug(name, data.country);
  const tagIds = (data.tags || [])
    .map((type) => tagsMapping[type])
    .filter((id) => id);

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
    tags: JSON.stringify(tagIds),
    crowdLevel: data.crowdLevel,
    recommendedStay: data.recommendedStay,
    bestSeason: data.bestSeason,
    accessibility: data.accessibility,
    imageUrl: `${slug}-1`,
    averageRating: data.averageRating,
    totalReviews: data.totalReviews,
    costIndex: data.costIndex,
    transitScore: data.transitScore,
    walkScore: data.walkScore,
    safetyScore: data.safetyScore,
    latitude: data.latitude,
    longitude: data.longitude,
  };
};

// Get tags mapping
async function getTagsMapping() {
  const tags = await pb.collection("tags").getFullList();
  return tags.reduce((acc, tag) => {
    acc[tag.identifier] = tag.id;
    return acc;
  }, {});
}

// Delete all existing records
async function deleteExistingRecords() {
  const existingRecords = await pb.collection("cities_list").getFullList();
  let deleted = 0;
  const errors = [];

  for (const record of existingRecords) {
    try {
      await pb.collection("cities_list").delete(record.id);
      deleted++;
      console.log(`Deleted ${record.name}`);
    } catch (error) {
      errors.push({
        type: "deletion",
        city: record.name,
        error: error.message,
      });
      console.error(`Error deleting ${record.name}:`, error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { deleted, errors };
}

async function migrateCityData() {
  const results = {
    deleted: 0,
    added: 0,
    errors: [],
  };

  try {
    // Get tags mapping
    console.log("Fetching tags mapping...");
    const tagsMapping = await getTagsMapping();

    // Delete existing records
    console.log("Deleting existing records...");
    const deleteResults = await deleteExistingRecords();
    results.deleted = deleteResults.deleted;
    results.errors.push(...deleteResults.errors);

    // Transform and add new records
    console.log("Adding new records...");
    const cityData = Object.entries(fallbackCityData).map(([name, data]) =>
      transformCityData(name, data, tagsMapping)
    );

    for (const city of cityData) {
      try {
        await pb.collection("cities_list").create(city);
        results.added++;
        console.log(`Added ${city.name}`);
      } catch (error) {
        results.errors.push({
          type: "creation",
          city: city.name,
          error: error.message,
        });
        console.error(`Error adding ${city.name}:`, error.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Print summary
    console.log("\nMigration Summary:");
    console.log(`Records deleted: ${results.deleted}`);
    console.log(`Records added: ${results.added}`);
    console.log(`Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log("\nErrors:");
      results.errors.forEach((error, i) =>
        console.log(`${i + 1}. ${error.city}: ${error.error}`)
      );
    }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }

  return results;
}

// Run the migration
migrateCityData().catch(console.error);
