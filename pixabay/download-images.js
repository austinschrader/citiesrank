import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Replace with your actual API key
const API_KEY = "6648147-bdc09ba94bd301f3f48369b1e";
const BASE_URL = "https://pixabay.com/api/";

const cities = [
  { city: "Paris", country: "France" },
  { city: "London", country: "UK" },
  { city: "Tokyo", country: "Japan" },
  { city: "New York", country: "USA" },
  { city: "Sydney", country: "Australia" },
];

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function searchAndDownloadCityImages() {
  // Create downloads directory if it doesn't exist
  const downloadDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  for (const location of cities) {
    try {
      console.log(`Searching for ${location.city}, ${location.country}...`);

      // Create search query with fixed per_page parameter
      const searchQuery = encodeURIComponent(`${location.city} cityscape`);
      const searchUrl = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&per_page=3&safesearch=true&order=popular`;

      console.log(`Making request to: ${searchUrl}`);

      const searchResponse = await axios.get(searchUrl);

      if (!searchResponse.data || !searchResponse.data.hits || searchResponse.data.hits.length === 0) {
        console.log(`No images found for ${location.city}`);
        continue;
      }

      const image = searchResponse.data.hits[0];
      const imageUrl = image.largeImageURL;
      // Format filename in lowercase
      const filename = `${location.city.toLowerCase()}-${location.country.toLowerCase()}-1.jpg`;
      const filepath = path.join(downloadDir, filename);

      // Download the image
      console.log(`Downloading image for ${location.city}...`);
      await downloadImage(imageUrl, filepath);
      console.log(`Successfully downloaded image for ${location.city} to ${filename}`);

      // Wait for 1 second before next request to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${location.city}:`);
      if (error.response) {
        console.error("Error details:", error.response.data);
        console.error("Status:", error.response.status);
      } else {
        console.error("Error:", error.message);
      }
    }
  }
}

// Run the script
searchAndDownloadCityImages()
  .then(() => console.log("All downloads completed!"))
  .catch((error) => console.error("Script failed:", error));
