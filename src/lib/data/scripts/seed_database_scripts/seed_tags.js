import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

const tags = [
  {
    identifier: "metropolis",
    label: "Major Cities",
    order: 1,
    active: true,
  },
  {
    identifier: "coastal",
    label: "Coastal Cities",
    order: 2,
    active: true,
  },
  {
    identifier: "mountain",
    label: "Mountain Towns",
    order: 3,
    active: true,
  },
  {
    identifier: "historic",
    label: "Historic Sites",
    order: 4,
    active: true,
  },
  {
    identifier: "cultural",
    label: "Cultural Hubs",
    order: 5,
    active: true,
  },
  {
    identifier: "culinary",
    label: "Food & Wine",
    order: 6,
    active: true,
  },
  {
    identifier: "tropical",
    label: "Tropical",
    order: 7,
    active: true,
  },
  {
    identifier: "adventure",
    label: "Adventure",
    order: 8,
    active: true,
  },
  {
    identifier: "wellness",
    label: "Wellness",
    order: 9,
    active: true,
  },
  {
    identifier: "village",
    label: "Small Towns",
    order: 10,
    active: true,
  },
];

async function seedTags() {
  try {
    // Clean up existing records
    console.log("Cleaning up existing tags...");
    const existingTags = await pb.collection("tags").getFullList();
    await Promise.all(
      existingTags.map((tag) => pb.collection("tags").delete(tag.id))
    );

    console.log("\nCreating new tags...");
    let successCount = 0;
    let errorCount = 0;

    for (const tag of tags) {
      try {
        await pb.collection("tags").create(tag);
        console.log(`✓ Created tag: ${tag.label}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to create tag: ${tag.label}`);
        console.error("Error:", error.response?.data || error.message);
        errorCount++;
      }
    }

    console.log("\n=== Seeding Complete ===");
    console.log(`Succeeded: ${successCount} tags`);
    console.log(`Failed: ${errorCount} tags`);
  } catch (error) {
    console.error("\n=== Seeding Failed ===");
    console.error("Error:", error.message);
  }
}

seedTags();
