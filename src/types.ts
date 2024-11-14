export interface CityData {
  country: string;
  weather: number;
  populationDensity: number;
  description: string;
  population: string;
}

export interface RankedCity extends CityData {
  name: string;
  matchScore: number;
  attributeMatches: {
    weather: number;
    density: number;
  };
}

export interface UserPreferences {
  weather: number;
  density: number;
}
