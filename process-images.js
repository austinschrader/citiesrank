import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { width: 400, height: 250, suffix: "400" },
  { width: 600, height: 375, suffix: "600" },
  { width: 800, height: 500, suffix: "800" },
  { width: 1200, height: 750, suffix: "1200" },
  { width: 1600, height: 1000, suffix: "1600" },
];

const inputDir = path.join(__dirname, "public", "images-raw");
const outputDir = path.join(__dirname, "public", "images");

// Create the necessary directories if they don't exist
const createDirectories = () => {
  const dirs = [outputDir, path.join(outputDir, "cities"), path.join(outputDir, "attractions")];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
};

const processImage = async (inputPath, outputBasePath, slug) => {
  console.log(`Processing ${slug}...`);

  for (const size of sizes) {
    const outputPath = path.join(outputBasePath, `${slug}-${size.suffix}.jpg`);

    try {
      await sharp(inputPath)
        .resize(size.width, size.height, {
          fit: "cover",
          position: "centre",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 82,
          progressive: true,
          chromaSubsampling: "4:4:4",
          mozjpeg: true,
        })
        .toFile(outputPath);

      console.log(`Generated ${slug}-${size.suffix}.jpg`);
    } catch (error) {
      console.error(`Error processing ${slug} at size ${size.suffix}:`, error);
    }
  }
};

const processCityImages = async () => {
  const cityInputDir = path.join(inputDir, "cities");
  const cityOutputDir = path.join(outputDir, "cities");

  if (!fs.existsSync(cityInputDir)) {
    console.log("No cities directory found in images-raw");
    return;
  }

  const files = fs.readdirSync(cityInputDir).filter((file) => file.toLowerCase().endsWith(".jpg") || file.toLowerCase().endsWith(".jpeg"));

  console.log(`Found ${files.length} city images to process`);

  for (const file of files) {
    const cityName = path.parse(file).name;
    const citySlug = createSlug(cityName);
    await processImage(path.join(cityInputDir, file), cityOutputDir, citySlug);
  }
};

const processAttractionImages = async () => {
  const attractionsInputDir = path.join(inputDir, "attractions");
  const attractionsOutputDir = path.join(outputDir, "attractions");

  if (!fs.existsSync(attractionsInputDir)) {
    console.log("No attractions directory found in images-raw");
    return;
  }

  // Process each city's attractions
  const cities = fs.readdirSync(attractionsInputDir).filter((file) => fs.statSync(path.join(attractionsInputDir, file)).isDirectory());

  for (const city of cities) {
    const citySlug = createSlug(city);
    const cityAttractionsDir = path.join(attractionsInputDir, city);
    const cityOutputDir = path.join(attractionsOutputDir, citySlug);

    // Create output directory for this city's attractions
    if (!fs.existsSync(cityOutputDir)) {
      fs.mkdirSync(cityOutputDir, { recursive: true });
    }

    const attractions = fs
      .readdirSync(cityAttractionsDir)
      .filter((file) => file.toLowerCase().endsWith(".jpg") || file.toLowerCase().endsWith(".jpeg"));

    console.log(`Found ${attractions.length} attractions for ${city}`);

    for (const attraction of attractions) {
      const attractionName = path.parse(attraction).name;
      const attractionSlug = createSlug(attractionName);
      await processImage(path.join(cityAttractionsDir, attraction), cityOutputDir, attractionSlug);
    }
  }
};

const processAllImages = async () => {
  // Create necessary directories
  createDirectories();

  // Process both city and attraction images
  await processCityImages();
  await processAttractionImages();

  console.log("All images processed successfully!");
};

processAllImages().catch(console.error);
