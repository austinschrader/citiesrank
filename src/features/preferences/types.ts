// file location: src/features/preferences/types.ts
import { LucideIcon } from "lucide-react";

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

// Component types
export interface PreferencesCardProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export interface PreferenceSliderProps {
  icon: LucideIcon;
  label: string;
  value: number;
  onChange: (value: number) => void;
  labels: string[];
  getCurrentLabel: (value: number) => string;
  hint: string;
}
