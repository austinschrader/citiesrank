// process-images.js
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

const inputDir = path.join(__dirname, "public");
const outputDir = path.join(__dirname, "public", "images");

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const processImage = async (inputPath) => {
  const filename = path.parse(inputPath).name;

  console.log(`Processing ${filename}...`);

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${filename}-${size.suffix}.jpg`);

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

      console.log(`Generated ${filename}-${size.suffix}.jpg`);
    } catch (error) {
      console.error(`Error processing ${filename} at size ${size.suffix}:`, error);
    }
  }
};

const processAllImages = async () => {
  const files = fs.readdirSync(inputDir).filter((file) => file.toLowerCase().endsWith(".jpg") || file.toLowerCase().endsWith(".jpeg"));

  if (files.length === 0) {
    console.log("No JPG images found in public directory");
    return;
  }

  console.log(`Found ${files.length} images to process`);

  for (const file of files) {
    await processImage(path.join(inputDir, file));
  }

  console.log("All images processed successfully!");
};

processAllImages().catch(console.error);
