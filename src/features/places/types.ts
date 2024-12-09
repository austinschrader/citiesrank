import type { MatchScore } from "@/features/preferences/types";
import type { CitiesResponse } from "@/lib/types/pocketbase-types";

export interface BasePlaceCardProps {
  variant: "ranked" | "basic";
}

export interface RankedPlaceCardProps extends BasePlaceCardProps {
  variant: "ranked";
  city: CitiesResponse;
  matchScore: MatchScore;
}

export interface BasicPlaceCardProps extends BasePlaceCardProps {
  variant: "basic";
  city: CitiesResponse;
}

export type PlaceCardProps = RankedPlaceCardProps | BasicPlaceCardProps;

// City data types
export interface CityData {
  country: string;
  name: string;
  cost: number;
  interesting: number;
  transit: number;
  description: string;
  population: string;
  highlights: string[];
  reviews?: ReviewSummary;
  tags: string[];
  crowdLevel: number;
  recommendedStay: number;
  bestSeason: number;
  accessibility: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export type SimpleCity = {
  id: string;
  name: string;
  country: string;
};
