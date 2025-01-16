import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeString } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the path to .env
const envPath = path.join(__dirname, "../../../../.env");

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
      .map((line) =>
        line.startsWith("PIXABAY_API_KEY") ? "PIXABAY_API_KEY=***" : line
      )
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
  throw new Error(
    "Missing PIXABAY_API_KEY in environment variables. Please add it to your .env file."
  );
}

const BASE_URL = "https://pixabay.com/api/";
const IMAGES_PER_CITY = 1;

const cities = [
  { city: "", country: "Afghanistan" },
  { city: "", country: "Albania" },
  { city: "", country: "Algeria" },
  { city: "", country: "Andorra" },
  { city: "", country: "Angola" },
  { city: "", country: "Antigua and Barbuda" },
  { city: "", country: "Argentina" },
  { city: "", country: "Armenia" },
  { city: "", country: "Australia" },
  { city: "", country: "Austria" },
  { city: "", country: "Azerbaijan" },
  { city: "", country: "Bahamas" },
  { city: "", country: "Bahrain" },
  { city: "", country: "Bangladesh" },
  { city: "", country: "Barbados" },
  { city: "", country: "Belarus" },
  { city: "", country: "Belgium" },
  { city: "", country: "Belize" },
  { city: "", country: "Benin" },
  { city: "", country: "Bhutan" },
  { city: "", country: "Bolivia" },
  { city: "", country: "Bosnia and Herzegovina" },
  { city: "", country: "Botswana" },
  { city: "", country: "Brazil" },
  { city: "", country: "Brunei" },
  { city: "", country: "Bulgaria" },
  { city: "", country: "Burkina Faso" },
  { city: "", country: "Burundi" },
  { city: "", country: "Cabo Verde" },
  { city: "", country: "Cambodia" },
  { city: "", country: "Cameroon" },
  { city: "", country: "Canada" },
  { city: "", country: "Central African Republic" },
  { city: "", country: "Chad" },
  { city: "", country: "Chile" },
  { city: "", country: "China" },
  { city: "", country: "Colombia" },
  { city: "", country: "Comoros" },
  { city: "", country: "Congo" },
  { city: "", country: "Costa Rica" },
  { city: "", country: "Croatia" },
  { city: "", country: "Cuba" },
  { city: "", country: "Cyprus" },
  { city: "", country: "Czechia" },
  { city: "", country: "Democratic Republic of the Congo" },
  { city: "", country: "Denmark" },
  { city: "", country: "Djibouti" },
  { city: "", country: "Dominica" },
  { city: "", country: "Dominican Republic" },
  { city: "", country: "Ecuador" },
  { city: "", country: "Egypt" },
  { city: "", country: "El Salvador" },
  { city: "", country: "Equatorial Guinea" },
  { city: "", country: "Eritrea" },
  { city: "", country: "Estonia" },
  { city: "", country: "Eswatini" },
  { city: "", country: "Ethiopia" },
  { city: "", country: "Fiji" },
  { city: "", country: "Finland" },
  { city: "", country: "Gabon" },
  { city: "", country: "Gambia" },
  { city: "", country: "Georgia" },
  { city: "", country: "Ghana" },
  { city: "", country: "Greece" },
  { city: "", country: "Grenada" },
  { city: "", country: "Guatemala" },
  { city: "", country: "Guinea" },
  { city: "", country: "Guinea-Bissau" },
  { city: "", country: "Guyana" },
  { city: "", country: "Haiti" },
  { city: "", country: "Holy See" },
  { city: "", country: "Honduras" },
  { city: "", country: "Hungary" },
  { city: "", country: "Iceland" },
  { city: "", country: "India" },
  { city: "", country: "Indonesia" },
  { city: "", country: "Iran" },
  { city: "", country: "Iraq" },
  { city: "", country: "Ireland" },
  { city: "", country: "Israel" },
  { city: "", country: "Italy" },
  { city: "", country: "Ivory Coast" },
  { city: "", country: "Jamaica" },
  { city: "", country: "Japan" },
  { city: "", country: "Jordan" },
  { city: "", country: "Kazakhstan" },
  { city: "", country: "Kenya" },
  { city: "", country: "Kiribati" },
  { city: "", country: "Kuwait" },
  { city: "", country: "Kyrgyzstan" },
  { city: "", country: "Laos" },
  { city: "", country: "Latvia" },
  { city: "", country: "Lebanon" },
  { city: "", country: "Lesotho" },
  { city: "", country: "Liberia" },
  { city: "", country: "Libya" },
  { city: "", country: "Liechtenstein" },
  { city: "", country: "Lithuania" },
  { city: "", country: "Luxembourg" },
  { city: "", country: "Madagascar" },
  { city: "", country: "Malawi" },
  { city: "", country: "Malaysia" },
  { city: "", country: "Maldives" },
  { city: "", country: "Mali" },
  { city: "", country: "Malta" },
  { city: "", country: "Marshall Islands" },
  { city: "", country: "Mauritania" },
  { city: "", country: "Mauritius" },
  { city: "", country: "Mexico" },
  { city: "", country: "Micronesia" },
  { city: "", country: "Moldova" },
  { city: "", country: "Monaco" },
  { city: "", country: "Mongolia" },
  { city: "", country: "Montenegro" },
  { city: "", country: "Morocco" },
  { city: "", country: "Mozambique" },
  { city: "", country: "Myanmar" },
  { city: "", country: "Namibia" },
  { city: "", country: "Nauru" },
  { city: "", country: "Nepal" },
  { city: "", country: "New Zealand" },
  { city: "", country: "Nicaragua" },
  { city: "", country: "Niger" },
  { city: "", country: "Nigeria" },
  { city: "", country: "North Korea" },
  { city: "", country: "North Macedonia" },
  { city: "", country: "Norway" },
  { city: "", country: "Oman" },
  { city: "", country: "Pakistan" },
  { city: "", country: "Palau" },
  { city: "", country: "Palestine" },
  { city: "", country: "Panama" },
  { city: "", country: "Papua New Guinea" },
  { city: "", country: "Paraguay" },
  { city: "", country: "Peru" },
  { city: "", country: "Philippines" },
  { city: "", country: "Poland" },
  { city: "", country: "Portugal" },
  { city: "", country: "Qatar" },
  { city: "", country: "Romania" },
  { city: "", country: "Russia" },
  { city: "", country: "Rwanda" },
  { city: "", country: "Saint Kitts and Nevis" },
  { city: "", country: "Saint Lucia" },
  { city: "", country: "Saint Vincent and the Grenadines" },
  { city: "", country: "Samoa" },
  { city: "", country: "San Marino" },
  { city: "", country: "Sao Tome and Principe" },
  { city: "", country: "Saudi Arabia" },
  { city: "", country: "Senegal" },
  { city: "", country: "Serbia" },
  { city: "", country: "Seychelles" },
  { city: "", country: "Sierra Leone" },
  { city: "", country: "Singapore" },
  { city: "", country: "Slovakia" },
  { city: "", country: "Slovenia" },
  { city: "", country: "Solomon Islands" },
  { city: "", country: "Somalia" },
  { city: "", country: "South Africa" },
  { city: "", country: "South Korea" },
  { city: "", country: "South Sudan" },
  { city: "", country: "Sri Lanka" },
  { city: "", country: "Sudan" },
  { city: "", country: "Suriname" },
  { city: "", country: "Sweden" },
  { city: "", country: "Switzerland" },
  { city: "", country: "Syria" },
  { city: "", country: "Tajikistan" },
  { city: "", country: "Tanzania" },
  { city: "", country: "Thailand" },
  { city: "", country: "Timor-Leste" },
  { city: "", country: "Togo" },
  { city: "", country: "Tonga" },
  { city: "", country: "Trinidad and Tobago" },
  { city: "", country: "Tunisia" },
  { city: "", country: "Turkey" },
  { city: "", country: "Turkmenistan" },
  { city: "", country: "Tuvalu" },
  { city: "", country: "Uganda" },
  { city: "", country: "Ukraine" },
  { city: "", country: "United Arab Emirates" },
  { city: "", country: "Uruguay" },
  { city: "", country: "Uzbekistan" },
  { city: "", country: "Vanuatu" },
  { city: "", country: "Vatican City" },
  { city: "", country: "Venezuela" },
  { city: "", country: "Vietnam" },
  { city: "", country: "Yemen" },
  { city: "", country: "Zambia" },
  { city: "", country: "Zimbabwe" },
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
const formatForFilename = (text) => {
  return normalizeString(text).replace(/ /g, "-");
};

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
      const searchQuery = encodeURIComponent(`${location.country} city`);
      const searchUrl = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&per_page=10&safesearch=true&order=popular`;

      console.log(`Making request to: ${searchUrl}`);

      const searchResponse = await axios.get(searchUrl);

      if (
        !searchResponse.data ||
        !searchResponse.data.hits ||
        searchResponse.data.hits.length === 0
      ) {
        console.log(`No images found for ${location.city}`);
        continue;
      }

      // Download multiple images for this city
      const images = searchResponse.data.hits.slice(0, IMAGES_PER_CITY);
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageUrl = image.largeImageURL;
        const imageNumber = i + 1;
        // Use the new formatting function here
        const filename = `${formatForFilename(
          location.country
        )}-${formatForFilename(location.country)}-${imageNumber}.jpg`;
        const filepath = path.join(downloadDir, filename);

        // Download the image
        console.log(`Downloading image ${imageNumber} for ${location.city}...`);
        await downloadImage(imageUrl, filepath);
        console.log(
          `Successfully downloaded image ${imageNumber} for ${location.city} to ${filename}`
        );

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
