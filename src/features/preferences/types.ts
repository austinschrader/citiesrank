// file location: src/features/preferences/types.ts

// Core preference types
export interface UserPreferences {
  budget: number;
  crowds: number;
  tripLength: number;
  season: number;
  transit: number;
  accessibility: number;
}

// Matching/Scoring types
export interface MatchScore {
  matchScore: number;
  attributeMatches: {
    budget: number;
    crowds: number;
    tripLength: number;
    season: number;
    transit: number;
    accessibility: number;
  };
}

export interface MatchScoreContextValue {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  updatePreference: (key: keyof UserPreferences, value: number) => void;
  calculateMatchForCity: (cityAttributes: MatchScoreInput) => MatchScore;
}

export interface MatchScoreInput {
  cost: number;
  crowdLevel: number;
  recommendedStay: number;
  bestSeason: number;
  transit: number;
  accessibility: number;
}
