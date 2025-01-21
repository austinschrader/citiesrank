import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const placesDir = join(__dirname, '..', 'seed', 'places');
const cityFiles = readdirSync(placesDir)
  .filter(file => file.endsWith('-cities.json'));

const allCities = new Set();

cityFiles.forEach(file => {
  const filePath = join(placesDir, file);
  const content = JSON.parse(readFileSync(filePath, 'utf8'));
  
  content.forEach(city => {
    if (city.name && city.country) {
      // Convert city name to slug format
      const slug = `${city.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}-${city.country.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`;
      
      allCities.add(slug);
    }
  });
});

// Output as comma-separated list
console.log([...allCities].sort().join(','));
