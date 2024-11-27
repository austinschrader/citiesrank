// Deletes all existing records in the countries collection and populates it with the data from the raw_data/countries_data.js file

import PocketBase from "pocketbase";
import { europeanCountries } from "../raw_data/countries_data.js";

const pb = new PocketBase("https://api.citiesrank.com");

async function populateCountries() {
  try {
    // First delete all existing records
    console.log("Deleting existing records...");
    const existingRecords = await pb.collection("countries").getFullList();
    for (const record of existingRecords) {
      try {
        await pb.collection("countries").delete(record.id); // Use record.id instead of record.isoCode
        console.log(`Deleted ${record.name}`);
      } catch (error) {
        console.error(`Error deleting ${record.name}:`, error.message);
      }
    }
    console.log("Deletion complete!");

    // Small delay to ensure deletions are processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create new records
    console.log("\nAdding new records...");
    for (const country of europeanCountries) {
      try {
        await pb.collection("countries").create({
          isoCode: country.isoCode,
          name: country.name,
          population: country.population,
          description: country.description,
        });
        console.log(`Successfully added ${country.name}`);
      } catch (error) {
        console.error(`Error adding ${country.name}:`, error.message);
      }
    }

    console.log("\nPopulation complete!");
  } catch (error) {
    console.error("Error in population script:", error);
  }
}

// Run the population script
populateCountries();
