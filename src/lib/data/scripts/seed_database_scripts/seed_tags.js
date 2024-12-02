import PocketBase from "pocketbase";
import { TAGS } from "../raw_data/tags_data.js";

// const pb = new PocketBase("http://127.0.0.1:8090");
const pb = new PocketBase("https://citiesrank-ppe.westus2.cloudapp.azure.com");
// const pb = new PocketBase("https://api.citiesrank.com");

async function seedTags() {
  try {
    console.log("Starting tags seeding...");

    // First, clear existing tags
    const existingTags = await pb.collection("tags").getFullList();
    for (const tag of existingTags) {
      console.log(`Deleting tag: ${tag.label}`);
      await pb.collection("tags").delete(tag.id);
    }

    console.log("@@@@@@@@@Existing tags deleted.@@@@@@@@");

    // Create new tags
    for (const tag of TAGS) {
      console.log(`Creating tag: ${tag.label}`);
      await pb.collection("tags").create(tag);
    }

    console.log("Tags seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding tags:", error);
  }
}

// Run the seeding
seedTags().catch(console.error);
