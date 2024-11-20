import PocketBase from "pocketbase";

const pb = new PocketBase("https://api.citiesrank.com");

async function getCountries() {
  try {
    // Get all records from the countries collection
    const records = await pb.collection("countries").getFullList({
      sort: "name",
    });

    console.log("Current countries in database:");
    records.forEach((record) => {
      console.log(`${record.id}: ${record.name} (${record.population})`);
    });

    console.log("\nTotal countries:", records.length);

    return records;
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

// Run the function
getCountries();
