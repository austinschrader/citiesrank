import PocketBase from "pocketbase";
import slugify from "slugify";
import { cities } from "../../places/citiesData.js";
import { neighborhoodsData } from "../../places/neighborhoodsData.js";
import { regionsData } from "../../places/regionsData.js";
import { sightsData } from "../../places/sightsData.js";
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

  // Ensure all scores are less than 10
  const normalizeScore = (score) => {
    if (score === null || score === undefined) return 0;
    // If score is greater than 10, assume it's on a 100 scale and convert
    return score > 10 ? score / 10 : score;
  };

  const transformedData = {
    name,
    normalizedName,
    slug,
    country: data.country,
    cost: data.cost,
    interesting: normalizeScore(data.interesting),
    transit: normalizeScore(data.transit),
    description: data.description,
    population: data.population,
    highlights: JSON.stringify(
      data.highlights || [
        `Explore ${name}`,
        `Experience local culture`,
        `Visit historic sites`,
        `Enjoy local cuisine`,
        `Discover natural beauty`,
      ]
    ),
    tags: JSON.stringify(tagIds),
    crowdLevel: normalizeScore(data.crowdLevel),
    recommendedStay: normalizeScore(data.recommendedStay),
    bestSeason: normalizeScore(data.bestSeason),
    accessibility: normalizeScore(data.accessibility),
    imageUrl: `${slug}-1`,
    averageRating: data.averageRating,
    totalReviews: data.totalReviews,
    costIndex: data.costIndex,
    transitScore: normalizeScore(data.transitScore),
    walkScore: normalizeScore(data.walkScore),
    safetyScore: normalizeScore(data.safetyScore),
    latitude: data.latitude,
    longitude: data.longitude,
  };

  return transformedData;
};

// Transform raw region data into database format
const transformRegionData = (data, tagsMapping) => {
  const normalizedName = normalizeString(data.name);
  const slug = createSlug(data.name, data.country);
  const tagIds = (data.tags || [])
    .map((type) => tagsMapping[type])
    .filter((id) => id);

  // Ensure all scores are less than 10
  const normalizeScore = (score) => {
    if (score === null || score === undefined) return 0;
    // If score is greater than 10, assume it's on a 100 scale and convert
    return score > 10 ? score / 10 : score;
  };

  const transformedData = {
    name: data.name,
    normalizedName,
    slug,
    country: data.country,
    cost: data.cost || 0,
    costIndex: normalizeScore(data.costIndex),
    interesting: normalizeScore(data.interesting),
    transit: normalizeScore(data.transit),
    transitScore: normalizeScore(data.transitScore),
    description: data.description || "",
    population: data.population || "Unknown",
    highlights: JSON.stringify(
      data.highlights || [
        `Explore ${data.name}`,
        `Experience local culture`,
        `Visit historic sites`,
        `Enjoy local cuisine`,
        `Discover natural beauty`,
      ]
    ),
    tags: JSON.stringify(tagIds),
    crowdLevel: normalizeScore(data.crowdLevel),
    recommendedStay: normalizeScore(data.recommendedStay),
    bestSeason: normalizeScore(data.bestSeason),
    accessibility: normalizeScore(data.accessibility),
    imageUrl: data.imageUrl || `${slug}-1`,
    averageRating: data.averageRating || 0,
    totalReviews: data.totalReviews || 0,
    walkScore: normalizeScore(data.walkScore),
    safetyScore: normalizeScore(data.safetyScore),
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
  };

  // Log the first region's data for debugging
  if (data.name === "Provence") {
    console.log("\nFirst region (Provence) transformed data:");
    console.log(JSON.stringify(transformedData, null, 2));
  }

  return transformedData;
};

// Transform raw neighborhood data into database format
const transformNeighborhoodData = (data, tagsMapping) => {
  const normalizedName = normalizeString(data.name);
  const slug = createSlug(data.name, data.city);
  const tagIds = (data.tags || [])
    .map((type) => tagsMapping[type])
    .filter((id) => id);

  // Ensure all scores are less than 10
  const normalizeScore = (score) => {
    if (score === null || score === undefined) return 0;
    // If score is greater than 10, assume it's on a 100 scale and convert
    return score > 10 ? score / 10 : score;
  };

  const transformedData = {
    name: data.name,
    normalizedName,
    slug,
    type: "neighborhood",
    country: data.country,
    city: data.city,
    cost: data.cost || 0,
    costIndex: normalizeScore(data.costIndex),
    interesting: normalizeScore(data.interesting),
    transit: normalizeScore(data.transit),
    transitScore: normalizeScore(data.transitScore),
    description: data.description || "",
    population: data.population || "Unknown",
    highlights: JSON.stringify(
      data.highlights || [
        `Explore ${data.name}`,
        `Experience local culture`,
        `Visit local landmarks`,
        `Enjoy local restaurants`,
        `Discover hidden gems`,
      ]
    ),
    tags: JSON.stringify(tagIds),
    crowdLevel: normalizeScore(data.crowdLevel),
    recommendedStay: normalizeScore(data.recommendedStay),
    bestSeason: normalizeScore(data.bestSeason),
    accessibility: normalizeScore(data.accessibility),
    imageUrl: data.imageUrl || `${slug}-1`,
    averageRating: data.averageRating || 0,
    totalReviews: data.totalReviews || 0,
    walkScore: normalizeScore(data.walkScore),
    safetyScore: normalizeScore(data.safetyScore),
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
  };

  // Log the first neighborhood's data for debugging
  if (data.name === "Le Marais") {
    console.log("\nFirst neighborhood (Le Marais) transformed data:");
    console.log(JSON.stringify(transformedData, null, 2));
  }

  return transformedData;
};

// Transform raw sight data into database format
const transformSightData = (data, tagsMapping) => {
  const normalizedName = normalizeString(data.name);
  const slug = createSlug(data.name, data.city);
  const tagIds = (data.tags || [])
    .map((type) => tagsMapping[type])
    .filter((id) => id);

  // Ensure all scores are less than 10
  const normalizeScore = (score) => {
    if (score === null || score === undefined) return 0;
    // If score is greater than 10, assume it's on a 100 scale and convert
    return score > 10 ? score / 10 : score;
  };

  const transformedData = {
    name: data.name,
    normalizedName,
    slug,
    type: "sight",
    country: data.country,
    city: data.city,
    cost: data.cost || 0,
    costIndex: normalizeScore(data.costIndex),
    interesting: normalizeScore(data.interesting),
    transit: normalizeScore(data.transit),
    transitScore: normalizeScore(data.transitScore),
    description: data.description || "",
    population: data.population || "N/A",
    highlights: JSON.stringify(
      data.highlights || [
        `Visit ${data.name}`,
        `Learn about its history`,
        `Take photos`,
        `Explore the surroundings`,
        `Experience the atmosphere`,
      ]
    ),
    tags: JSON.stringify(tagIds),
    crowdLevel: normalizeScore(data.crowdLevel),
    recommendedStay: normalizeScore(data.recommendedStay),
    bestSeason: normalizeScore(data.bestSeason),
    accessibility: normalizeScore(data.accessibility),
    imageUrl: data.imageUrl || `${slug}-1`,
    averageRating: data.averageRating || 0,
    totalReviews: data.totalReviews || 0,
    walkScore: normalizeScore(data.walkScore),
    safetyScore: normalizeScore(data.safetyScore),
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
  };

  // Log the first sight's data for debugging
  if (data.name === "Eiffel Tower") {
    console.log("\nFirst sight (Eiffel Tower) transformed data:");
    console.log(JSON.stringify(transformedData, null, 2));
  }

  return transformedData;
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
    added: { cities: 0, regions: 0, neighborhoods: 0, sights: 0 },
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

    // Transform and add new city records
    console.log("Adding city records...");
    const cityData = Object.entries(cities).map(([name, data]) =>
      transformCityData(name, data, tagsMapping)
    );

    for (const city of cityData) {
      try {
        await pb.collection("cities_list").create(city);
        results.added.cities++;
        console.log(`Added city: ${city.name}`);
      } catch (error) {
        results.errors.push({
          type: "creation",
          entity: `city: ${city.name}`,
          error: error.message,
          details: error.data?.data,
        });
        console.error(`Error adding city ${city.name}:`, error.message);
        console.error("Validation errors:", error.data?.data);
        console.error("Attempted data:", city);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Transform and add new region records
    console.log("\nAdding region records...");
    const regionData = regionsData.map((data) =>
      transformRegionData(data, tagsMapping)
    );

    for (const region of regionData) {
      try {
        await pb.collection("cities_list").create(region);
        results.added.regions++;
        console.log(`Added region: ${region.name}`);
      } catch (error) {
        results.errors.push({
          type: "creation",
          entity: `region: ${region.name}`,
          error: error.message,
          details: error.data?.data,
        });
        console.error(`Error adding region ${region.name}:`, error.message);
        console.error("Validation errors:", error.data?.data);
        console.error("Attempted data:", region);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Transform and add new neighborhood records
    console.log("\nAdding neighborhood records...");
    const neighborhoodData = neighborhoodsData.map((data) =>
      transformNeighborhoodData(data, tagsMapping)
    );

    for (const neighborhood of neighborhoodData) {
      try {
        await pb.collection("cities_list").create(neighborhood);
        results.added.neighborhoods++;
        console.log(`Added neighborhood: ${neighborhood.name}`);
      } catch (error) {
        results.errors.push({
          type: "creation",
          entity: `neighborhood: ${neighborhood.name}`,
          error: error.message,
          details: error.data?.data,
        });
        console.error(
          `Error adding neighborhood ${neighborhood.name}:`,
          error.message
        );
        console.error("Validation errors:", error.data?.data);
        console.error("Attempted data:", neighborhood);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Transform and add new sight records
    console.log("\nAdding sight records...");
    const sightData = sightsData.map((data) =>
      transformSightData(data, tagsMapping)
    );

    for (const sight of sightData) {
      try {
        await pb.collection("cities_list").create(sight);
        results.added.sights++;
        console.log(`Added sight: ${sight.name}`);
      } catch (error) {
        results.errors.push({
          type: "creation",
          entity: `sight: ${sight.name}`,
          error: error.message,
          details: error.data?.data,
        });
        console.error(`Error adding sight ${sight.name}:`, error.message);
        console.error("Validation errors:", error.data?.data);
        console.error("Attempted data:", sight);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Print summary
    console.log("\nMigration Summary:");
    console.log(`Records deleted: ${results.deleted}`);
    console.log(`Cities added: ${results.added.cities}`);
    console.log(`Regions added: ${results.added.regions}`);
    console.log(`Neighborhoods added: ${results.added.neighborhoods}`);
    console.log(`Sights added: ${results.added.sights}`);
    console.log(
      `Total records added: ${
        results.added.cities +
        results.added.regions +
        results.added.neighborhoods +
        results.added.sights
      }`
    );
    console.log(`Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log("\nErrors:");
      results.errors.forEach((error, i) =>
        console.log(`${i + 1}. ${error.entity}: ${error.error}`)
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
