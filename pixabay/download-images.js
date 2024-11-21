import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { normalizeString } from "./utils.js";

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
  { city: "Paris", country: "France" },
  { city: "Versailles", country: "France" },
  { city: "Fontainebleau", country: "France" },
  { city: "Nice", country: "France" },
  { city: "Marseille", country: "France" },
  { city: "Cannes", country: "France" },
  { city: "Aix-en-Provence", country: "France" },
  { city: "Saint-Tropez", country: "France" },
  { city: "Avignon", country: "France" },

  { city: "Arles", country: "France" },
  { city: "Grasse", country: "France" },
  { city: "Menton", country: "France" },
  { city: "Toulouse", country: "France" },

  { city: "Montpellier", country: "France" },
  { city: "Carcassonne", country: "France" },
  { city: "Albi", country: "France" },
  { city: "Nîmes", country: "France" },
  { city: "Collioure", country: "France" },
  { city: "Lourdes", country: "France" },
  { city: "Bordeaux", country: "France" },
  { city: "Saint-Émilion", country: "France" },
  { city: "Biarritz", country: "France" },

  { city: "Arcachon", country: "France" },
  { city: "La Rochelle", country: "France" },
  { city: "Cognac", country: "France" },
  { city: "Angoulême", country: "France" },
  { city: "Rennes", country: "France" },
  { city: "Saint-Malo", country: "France" },
  { city: "Quimper", country: "France" },
  { city: "Dinan", country: "France" },
  { city: "Vannes", country: "France" },

  { city: "Concarneau", country: "France" },
  { city: "Rouen", country: "France" },
  { city: "Caen", country: "France" },
  { city: "Honfleur", country: "France" },
  { city: "Bayeux", country: "France" },
  { city: "Etretat", country: "France" },
  { city: "Mont Saint-Michel", country: "France" },
  { city: "Strasbourg", country: "France" },

  { city: "Colmar", country: "France" },
  { city: "Metz", country: "France" },
  { city: "Reims", country: "France" },
  { city: "Mulhouse", country: "France" },
  { city: "Dijon", country: "France" },
  { city: "Beaune", country: "France" },
  { city: "Besançon", country: "France" },
  { city: "Auxerre", country: "France" },

  { city: "Lyon", country: "France" },
  { city: "Grenoble", country: "France" },
  { city: "Annecy", country: "France" },
  { city: "Clermont-Ferrand", country: "France" },
  { city: "Chamonix", country: "France" },
  { city: "Vienne", country: "France" },
  { city: "Aix-les-Bains", country: "France" },
  { city: "Nantes", country: "France" },

  { city: "Angers", country: "France" },
  { city: "Le Mans", country: "France" },
  { city: "La Roche-sur-Yon", country: "France" },
  { city: "Tours", country: "France" },
  { city: "Bourges", country: "France" },
  { city: "Orléans", country: "France" },
  { city: "Blois", country: "France" },

  { city: "Amboise", country: "France" },
  { city: "Ajaccio", country: "France" },
  { city: "Bonifacio", country: "France" },
  { city: "Calvi", country: "France" },
  { city: "Bastia", country: "France" },
  { city: "L'Aquila", country: "Italy" },
  { city: "Sulmona", country: "Italy" },
  { city: "Pescara", country: "Italy" },

  { city: "Matera", country: "Italy" },
  { city: "Potenza", country: "Italy" },
  { city: "Tropea", country: "Italy" },
  { city: "Scilla", country: "Italy" },
  { city: "Reggio Calabria", country: "Italy" },
  { city: "Sorrento", country: "Italy" },
  { city: "Positano", country: "Italy" },
  { city: "Pompeii", country: "Italy" },

  { city: "Ravenna", country: "Italy" },
  { city: "Parma", country: "Italy" },
  { city: "Modena", country: "Italy" },
  { city: "Ferrara", country: "Italy" },
  { city: "Trieste", country: "Italy" },
  { city: "Udine", country: "Italy" },
  { city: "Grado", country: "Italy" },

  { city: "Tivoli", country: "Italy" },
  { city: "Viterbo", country: "Italy" },
  { city: "Genoa", country: "Italy" },
  { city: "Monterosso al Mare", country: "Italy" },
  { city: "Vernazza", country: "Italy" },
  { city: "Corniglia", country: "Italy" },
  { city: "Manarola", country: "Italy" },
  { city: "Riomaggiore", country: "Italy" },

  { city: "Bergamo", country: "Italy" },
  { city: "Como", country: "Italy" },
  { city: "Lecco", country: "Italy" },
  { city: "Pavia", country: "Italy" },
  { city: "Ancona", country: "Italy" },
  { city: "Urbino", country: "Italy" },
  { city: "Ascoli Piceno", country: "Italy" },
  { city: "Campobasso", country: "Italy" },
  { city: "Termoli", country: "Italy" },

  { city: "Asti", country: "Italy" },
  { city: "Bari", country: "Italy" },
  { city: "Lecce", country: "Italy" },
  { city: "Alberobello", country: "Italy" },
  { city: "Polignano a Mare", country: "Italy" },
  { city: "Ostuni", country: "Italy" },
  { city: "Cagliari", country: "Italy" },
  { city: "Alghero", country: "Italy" },
  { city: "Olbia", country: "Italy" },
  { city: "Bosa", country: "Italy" },
  { city: "Palermo", country: "Italy" },

  { city: "Catania", country: "Italy" },
  { city: "Taormina", country: "Italy" },
  { city: "Siracusa", country: "Italy" },
  { city: "Agrigento", country: "Italy" },
  { city: "Noto", country: "Italy" },
  { city: "Cefalù", country: "Italy" },
  { city: "Lucca", country: "Italy" },
  { city: "Arezzo", country: "Italy" },

  { city: "Volterra", country: "Italy" },
  { city: "Bolzano", country: "Italy" },
  { city: "Trento", country: "Italy" },
  { city: "Merano", country: "Italy" },
  { city: "Bressanone", country: "Italy" },
  { city: "Perugia", country: "Italy" },
  { city: "Assisi", country: "Italy" },
  { city: "Todi", country: "Italy" },
  { city: "Norcia", country: "Italy" },

  { city: "Spoleto", country: "Italy" },
  { city: "Ravello", country: "Italy" },
  { city: "Portofino", country: "Italy" },
  { city: "San Gimignano", country: "Italy" },
  { city: "Orvieto", country: "Italy" },

  { city: "Padua", country: "Italy" },
  { city: "Vicenza", country: "Italy" },
  { city: "Treviso", country: "Italy" },
  { city: "Tokyo", country: "Japan" },

  { city: "Kyoto", country: "Japan" },
  { city: "Osaka", country: "Japan" },
  { city: "Sapporo", country: "Japan" },
  { city: "Otaru", country: "Japan" },
  { city: "Furano", country: "Japan" },
  { city: "Nara", country: "Japan" },
  { city: "Hakone", country: "Japan" },
  { city: "Kanazawa", country: "Japan" },
  { city: "Nikko", country: "Japan" },
  { city: "Takayama", country: "Japan" },
  { city: "Kamakura", country: "Japan" },
  { city: "Fukuoka", country: "Japan" },
  { city: "Hiroshima", country: "Japan" },
  { city: "Miyajima", country: "Japan" },
  { city: "Kobe", country: "Japan" },
  { city: "Nagoya", country: "Japan" },
  { city: "Yokohama", country: "Japan" },

  { city: "Nagasaki", country: "Japan" },
  { city: "Ise", country: "Japan" },
  { city: "Karuizawa", country: "Japan" },
  { city: "Kusatsu", country: "Japan" },
  { city: "Beppu", country: "Japan" },
  { city: "Kawagoe", country: "Japan" },
  { city: "Arashiyama", country: "Japan" },
  { city: "Shirakawa-go", country: "Japan" },
  { city: "Kawaguchi", country: "Japan" },

  { city: "Matsumoto", country: "Japan" },
  { city: "Gifu", country: "Japan" },
  { city: "Uji", country: "Japan" },
  { city: "Ohara", country: "Japan" },
  { city: "Asuka", country: "Japan" },
  { city: "Hakodate", country: "Japan" },
  { city: "Katoomba", country: "Australia" },
  { city: "Wollongong", country: "Australia" },
  { city: "Bowral", country: "Australia" },

  { city: "Apollo Bay", country: "Australia" },
  { city: "Lorne", country: "Australia" },
  { city: "Daylesford", country: "Australia" },
  { city: "Bright", country: "Australia" },
  { city: "Phillip Island", country: "Australia" },
  { city: "Ballarat", country: "Australia" },
  { city: "Mornington Peninsula", country: "Australia" },

  { city: "Noosa", country: "Australia" },
  { city: "Airlie Beach", country: "Australia" },

  { city: "Townsville", country: "Australia" },
  { city: "Hervey Bay", country: "Australia" },

  { city: "Kangaroo Island", country: "Australia" },
  { city: "Tanunda", country: "Australia" },
  { city: "Angaston", country: "Australia" },
  { city: "Victor Harbor", country: "Australia" },
  { city: "Clare Valley", country: "Australia" },
  { city: "Perth", country: "Australia" },
  { city: "Margaret River", country: "Australia" },
  { city: "Broome", country: "Australia" },

  { city: "Albany", country: "Australia" },

  { city: "Launceston", country: "Australia" },
  { city: "Cradle Mountain", country: "Australia" },
  { city: "Port Arthur", country: "Australia" },
  { city: "St Helens", country: "Australia" },
  { city: "Darwin", country: "Australia" },
  { city: "Alice Springs", country: "Australia" },
  { city: "Uluru", country: "Australia" },

  { city: "Katherine", country: "Australia" },

  { city: "Amsterdam", country: "Netherlands" },
  { city: "Rotterdam", country: "Netherlands" },
  { city: "Utrecht", country: "Netherlands" },
  { city: "Haarlem", country: "Netherlands" },
  { city: "The Hague", country: "Netherlands" },
  { city: "Giethoorn", country: "Netherlands" },
  { city: "Leiden", country: "Netherlands" },
  { city: "Maastricht", country: "Netherlands" },
  { city: "Delft", country: "Netherlands" },
  { city: "Edam", country: "Netherlands" },
  { city: "Zaanse Schans", country: "Netherlands" },
  { city: "Alkmaar", country: "Netherlands" },
  { city: "Arnhem", country: "Netherlands" },
  { city: "Zwolle", country: "Netherlands" },
  { city: "Gouda", country: "Netherlands" },
  { city: "Enkhuizen", country: "Netherlands" },
  { city: "Hoorn", country: "Netherlands" },
  { city: "Den Bosch", country: "Netherlands" },
  { city: "Middelburg", country: "Netherlands" },
  { city: "Volendam", country: "Netherlands" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Gothenburg", country: "Sweden" },
  { city: "Malmö", country: "Sweden" },
  { city: "Kiruna", country: "Sweden" },
  { city: "Visby", country: "Sweden" },
  { city: "Uppsala", country: "Sweden" },
  { city: "Lund", country: "Sweden" },
  { city: "Helsingborg", country: "Sweden" },
  { city: "Åre", country: "Sweden" },
  { city: "Östersund", country: "Sweden" },
  { city: "Vimmerby", country: "Sweden" },
  { city: "Kalmar", country: "Sweden" },
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
        // Use the new formatting function here
        const filename = `${formatForFilename(location.city)}-${formatForFilename(location.country)}-${imageNumber}.jpg`;
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
