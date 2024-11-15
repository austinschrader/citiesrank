export interface CityMetrics {
  valueScore: {
    localFoodCost: number;
    accommodationValue: number;
    activityCosts: number;
  };
  authenticityScore: {
    localRatio: number;
    localPreservation: number;
    traditionalScene: number;
  };
  practicalScore: {
    walkability: number;
    transitAccess: number;
    digitalFriendly: number;
  };
  culturalScore: {
    archDensity: number;
    culturalEvents: number;
    universityCulture: number;
  };
  specialScore: {
    foodScene: number;
    cafeLife: number;
    eveningAtmosphere: number;
    baseLocation: number;
  };
}

export interface CityData extends CityMetrics {
  name: string;
  country: string;
  description: string;
  population: string;
  highlights: string[];
  imageUrl?: string;
  knownFor: string[];
  regionalAccess: string[];
}

export interface UserPreferences {
  valueImportance: number;
  authenticityImportance: number;
  practicalityImportance: number;
  culturalImportance: number;
  specialFeatures: {
    foodFocus: boolean;
    cafeCulture: boolean;
    nightlife: boolean;
    baseLocation: boolean;
  };
}

export interface RankedCity extends CityData {
  matchScore: number;
  categoryScores: {
    value: number;
    authenticity: number;
    practical: number;
    cultural: number;
    special: number;
  };
}
