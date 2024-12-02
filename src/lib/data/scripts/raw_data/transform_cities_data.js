import fs from 'fs';
import { fallbackCityData } from './cities_data.js';

// Transform function to convert from old format to new format
function transformCityData(oldData) {
    const transformed = {};
    
    for (const [cityName, cityData] of Object.entries(oldData)) {
        transformed[cityName] = {
            country: cityData.country,
            cost: cityData.cost,
            interesting: cityData.interesting,
            transit: cityData.transit,
            description: cityData.description,
            population: cityData.population,
            highlights: cityData.highlights,
            averageRating: cityData.reviews?.averageRating || 0,
            totalReviews: cityData.reviews?.totalReviews || 0,
            tags: cityData.destinationTypes || [],
            crowdLevel: cityData.crowdLevel,
            recommendedStay: cityData.recommendedStay,
            bestSeason: cityData.bestSeason,
            accessibility: cityData.accessibility,
            costIndex: Math.round(cityData.cost / 10), // Derive costIndex from cost
            safetyScore: 7.5, // Default value
            walkScore: 8.0, // Default value
            transitScore: cityData.transit / 10, // Derive from transit score
        };
    }
    
    return transformed;
}

// Transform the data
const transformedData = transformCityData(fallbackCityData);

// Create the output string
const outputString = `export const fallbackCityData = ${JSON.stringify(transformedData, null, 2)};`;

// Write to a new file
fs.writeFileSync('./transformed_cities_data.js', outputString, 'utf8');

console.log('Transformation complete! Check transformed_cities_data.js');
