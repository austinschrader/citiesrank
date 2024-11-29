import { useState, useCallback } from "react";
import { UserPreferences, MatchScoreInput, MatchScoreResult } from "@/types";

// Define the shape of our context value
export interface MatchScoreContextValue {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  updatePreference: (key: keyof UserPreferences, value: number) => void;
  calculateMatchForCity: (cityAttributes: MatchScoreInput) => MatchScoreResult;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  budget: 50,
  crowds: 50,
  tripLength: 50,
  season: 50,
  transit: 50,
  accessibility: 50,
};

const calculateMatchScores = (
  cityAttributes: MatchScoreInput,
  userPreferences: UserPreferences
): MatchScoreResult => {
  const matches = {
    budget: 100 - Math.abs(cityAttributes.cost - userPreferences.budget),
    crowds: 100 - Math.abs(cityAttributes.crowdLevel - userPreferences.crowds),
    tripLength:
      100 -
      Math.abs(cityAttributes.recommendedStay - userPreferences.tripLength),
    season: 100 - Math.abs(cityAttributes.bestSeason - userPreferences.season),
    transit: 100 - Math.abs(cityAttributes.transit - userPreferences.transit),
    accessibility:
      100 -
      Math.abs(cityAttributes.accessibility - userPreferences.accessibility),
  };

  const weightedMatch =
    (matches.budget * 1.2 +
      matches.crowds * 1.0 +
      matches.tripLength * 0.8 +
      matches.season * 1.1 +
      matches.transit * 1.0 +
      matches.accessibility * 0.9) /
    6;

  return {
    matchScore: weightedMatch,
    attributeMatches: matches,
  };
};

export const useMatchScores = (
  initialPreferences: Partial<UserPreferences> = {}
): MatchScoreContextValue => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...DEFAULT_PREFERENCES,
    ...initialPreferences,
  });

  const calculateMatchForCity = useCallback(
    (cityAttributes: MatchScoreInput) => {
      return calculateMatchScores(cityAttributes, preferences);
    },
    [preferences]
  );

  const updatePreference = useCallback(
    (key: keyof UserPreferences, value: number) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    preferences,
    setPreferences,
    updatePreference,
    calculateMatchForCity,
  } as const;
};
