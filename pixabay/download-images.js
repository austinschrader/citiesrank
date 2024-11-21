import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the path to .env
const envPath = path.join(__dirname, "../.env");

// Debug info
console.log("Current directory:", __dirname);
console.log("Looking for .env at:", envPath);
console.log("File exists:", fs.existsSync(envPath));

// If the file exists, let's see what's in it (careful not to log sensitive data)
if (fs.existsSync(envPath)) {
  console.log("Contents of .env file:");
  const envContents = fs.readFileSync(envPath, "utf8");
  console.log(
    envContents
      .split("\n")
      .map((line) => (line.startsWith("PIXABAY_API_KEY") ? "PIXABAY_API_KEY=***" : line))
      .join("\n")
  );
}

// Load the env file
const result = dotenv.config({ path: envPath });
console.log("dotenv config result:", result.error || "success");

// Show all environment variables (but hide sensitive values)
console.log("\nEnvironment variables:");
console.log("PIXABAY_API_KEY exists:", !!process.env.PIXABAY_API_KEY);
console.log("VITE_PIXABAY_API_KEY exists:", !!process.env.VITE_PIXABAY_API_KEY);

const API_KEY = process.env.PIXABAY_API_KEY;
if (!API_KEY) {
  throw new Error("Missing PIXABAY_API_KEY in environment variables. Please add it to your .env file.");
}

const BASE_URL = "https://pixabay.com/api/";
const IMAGES_PER_CITY = 4;

const cities = [
  { city: "Kyoto", country: "Japan" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Queenstown", country: "New Zealand" },
  { city: "Cusco", country: "Peru" },
  { city: "Santorini", country: "Greece" },
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

      // Request more images than we need in case some fail
      const searchQuery = encodeURIComponent(`${location.city} cityscape`);
      const searchUrl = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&per_page=10&safesearch=true&order=popular`;

      console.log(`Making request to: ${searchUrl}`);

      const searchResponse = await axios.get(searchUrl);

      if (!searchResponse.data || !searchResponse.data.hits || searchResponse.data.hits.length === 0) {
        console.log(`No images found for ${location.city}`);
        continue;
      }

      // Download multiple images for this city
      const images = searchResponse.data.hits.slice(0, IMAGES_PER_CITY);
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageUrl = image.largeImageURL;
        const imageNumber = i + 1;
        const filename = `${location.city.toLowerCase()}-${location.country.toLowerCase()}-${imageNumber}.jpg`;
        const filepath = path.join(downloadDir, filename);

        // Download the image
        console.log(`Downloading image ${imageNumber} for ${location.city}...`);
        await downloadImage(imageUrl, filepath);
        console.log(`Successfully downloaded image ${imageNumber} for ${location.city} to ${filename}`);

        // Wait for 1 second before next request to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log(`Completed downloading all images for ${location.city}`);
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
