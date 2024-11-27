import PocketBase from "pocketbase";
import { MOCK_LISTS } from "../raw_data/lists_data.js";

const pb = new PocketBase("http://127.0.0.1:8090");

// Helper functions remain the same
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Updated templates with new fields
const listTemplates = {
  themes: [
    {
      name: "Hidden Gems",
      tags: ["hidden-gems", "off-beaten-path", "authentic"],
      description:
        "Discover secret spots and local favorites off the tourist trail.",
      collection: "want-to-visit",
    },
    {
      name: "Foodie Paradise",
      tags: ["food", "culinary", "restaurants", "gastronomy"],
      description:
        "A culinary journey through the best food scenes and local delicacies.",
      collection: "planning",
    },
    {
      name: "Cultural Journey",
      tags: ["culture", "history", "arts", "museums"],
      description:
        "Immerse yourself in rich cultural heritage and artistic traditions.",
      collection: "favorites",
    },
    {
      name: "Adventure Seekers",
      tags: ["adventure", "outdoor", "hiking", "sports"],
      description:
        "Thrilling experiences and outdoor activities for the adventurous spirit.",
      collection: "visited",
    },
  ],
  collections: ["want-to-visit", "visited", "planning", "favorites"],
  privacyOptions: ["public", "private", "followers"],
  authors: [
    {
      id: "user1",
      name: "Emma Thompson",
      avatar: "/avatars/emma.jpg",
      location: "London, UK",
      bio: "Travel photographer and culinary enthusiast exploring hidden corners of Europe.",
    },
    {
      id: "user2",
      name: "James Wilson",
      avatar: "/avatars/james.jpg",
      location: "Berlin, Germany",
      bio: "Digital nomad and coffee shop connoisseur. Always seeking the next great workspace.",
    },
  ],
  cities: [
    // Cities remain the same
    {
      citySlug: "porto-portugal",
      name: "Porto",
      country: "Portugal",
      description:
        "Historic port city known for its stunning bridges and port wine cellars.",
      highlight: "Ribeira District and Port Wine Cellars",
      rating: 4.8,
      reviews: 2345,
      coordinates: [41.1579, -8.6291],
      tags: ["wine", "history", "architecture"],
      bestTime: "March-October",
      suggestedStay: "3-4 days",
    },
    {
      citySlug: "ljubljana-slovenia",
      name: "Ljubljana",
      country: "Slovenia",
      description:
        "Charming capital with beautiful architecture and vibrant cafe culture.",
      highlight: "Ljubljana Castle and Triple Bridge",
      rating: 4.7,
      reviews: 1876,
      coordinates: [46.0569, 14.5058],
      tags: ["charming", "cafe-culture", "architecture"],
      bestTime: "April-October",
      suggestedStay: "2-3 days",
    },
  ],
};

// Helper functions remain the same
function generatePlaceDetails(city) {
  return {
    id: city.citySlug,
    name: city.name,
    country: city.country,
    imageUrl: `${city.citySlug}-1`,
    description: city.description,
    highlight: city.highlight,
    rating: city.rating,
    reviews: city.reviews,
    coordinates: city.coordinates,
    tags: city.tags,
    bestTime: city.bestTime,
    suggestedStay: city.suggestedStay,
  };
}

function generateRelatedLists(theme, excluded_id) {
  return [
    {
      id: `${createSlug(theme.name)}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      title: `Best of ${theme.name} in Europe`,
      places: randomNumber(5, 12),
      author:
        listTemplates.authors[randomNumber(0, listTemplates.authors.length - 1)]
          .name,
      imageUrl: `${
        listTemplates.cities[randomNumber(0, listTemplates.cities.length - 1)]
          .citySlug
      }-1`,
    },
    {
      id: `${createSlug(theme.name)}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      title: `${theme.name} for Beginners`,
      places: randomNumber(5, 12),
      author:
        listTemplates.authors[randomNumber(0, listTemplates.authors.length - 1)]
          .name,
      imageUrl: `${
        listTemplates.cities[randomNumber(0, listTemplates.cities.length - 1)]
          .citySlug
      }-1`,
    },
  ];
}

function generateAdditionalLists(count) {
  const newLists = [];
  const baseDate = new Date("2024-01-01");

  for (let i = 0; i < count; i++) {
    const theme = listTemplates.themes[i % listTemplates.themes.length];
    const author = listTemplates.authors[i % listTemplates.authors.length];
    const selectedCities = getRandomItems(
      listTemplates.cities,
      randomNumber(3, 6)
    );
    const createdDate = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
    const isDraft = Math.random() > 0.8; // 20% chance of being a draft

    const newList = {
      id: `generated_${i + 1}`,
      title: `${theme.name} in Europe: ${new Date().getFullYear()} Edition`,
      description: theme.description,
      author: {
        id: author.id,
        name: author.name,
        avatar: author.avatar,
        location: author.location,
        bio: author.bio,
      },
      places: selectedCities.map((city) => generatePlaceDetails(city)),
      stats: {
        views: randomNumber(5000, 50000),
        likes: randomNumber(100, 3000),
        saves: randomNumber(100, 1000),
        shares: randomNumber(50, 500),
      },
      metadata: {
        createdAt: createdDate.toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: Math.random() > 0.3,
        category: theme.name,
      },
      tags: [...theme.tags, "europe", selectedCities[0].country.toLowerCase()],
      relatedLists: generateRelatedLists(theme, `generated_${i + 1}`),
      totalPlaces: selectedCities.length,
      // New fields
      status: isDraft ? "draft" : "published",
      collection: isDraft ? null : theme.collection,
      privacy: isDraft
        ? "private"
        : listTemplates.privacyOptions[randomNumber(0, 2)],
    };

    newLists.push(newList);
  }

  return newLists;
}

async function migrateTravelLists(generateCount = 20) {
  try {
    const additionalLists = generateAdditionalLists(generateCount);
    const allLists = [...MOCK_LISTS, ...additionalLists];

    // Clean up existing records
    console.log("Cleaning up existing records...");
    await pb
      .collection("lists")
      .getFullList()
      .then((records) =>
        Promise.all(records.map((r) => pb.collection("lists").delete(r.id)))
      );

    const cities = await pb.collection("cities").getFullList();
    // Use normalizedName instead of slug
    const cityMap = new Map(
      cities.map((city) => [city.normalizedName.toLowerCase(), city.id])
    );

    console.log(`\nProcessing ${allLists.length} lists...`);
    let successCount = 0;
    let errorCount = 0;

    for (const list of allLists) {
      try {
        // Get city IDs, using normalizedName
        const cityIds = list.places
          .map((place) => {
            const normalizedName = place.name
              .toLowerCase()
              .replace(/[^a-z0-9 ]/g, "");
            const cityId = cityMap.get(normalizedName);
            if (!cityId) {
              console.error(
                `City not found: ${place.name} (normalized: ${normalizedName})`
              );
            }
            return cityId;
          })
          .filter((id) => id);

        if (cityIds.length !== list.places.length) {
          throw new Error(`Some cities were not found for list: ${list.title}`);
        }

        const listData = {
          title: list.title,
          description: list.description,
          author: "66n5q77pkxvgzxb",
          list_places: cityIds,
          stats: JSON.stringify(list.stats),
          metadata: JSON.stringify(list.metadata),
          tags: JSON.stringify(list.tags),
          relatedLists: JSON.stringify(list.relatedLists),
          likes: list.stats.likes,
          shares: list.stats.shares,
          saves: list.stats.saves,
          totalPlaces: cityIds.length,
          category: list.metadata.category || "Uncategorized",
          status: list.status || "published",
          collection: list.collection || "want-to-visit",
          privacy: list.privacy || "public",
        };

        await pb.collection("lists").create(listData);
        console.log(
          `✓ Created list: ${list.title} with ${cityIds.length} places`
        );
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to create list: ${list.title}`);
        console.error("Error:", error.response?.data || error.message);
        errorCount++;
      }
    }

    console.log(`\n=== Migration Complete ===`);
    console.log(`Succeeded: ${successCount} lists`);
    console.log(`Failed: ${errorCount} lists`);
  } catch (error) {
    console.error("\n=== Migration Failed ===");
    console.error("Error:", error.message);
  }
}

migrateTravelLists(5);
