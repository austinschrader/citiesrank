import type { MatchScore } from "@/features/preferences/types";
import type { CitiesResponse } from "@/lib/types/pocketbase-types";

export interface BaseCityCardProps {
  variant: "ranked" | "basic";
}

export interface RankedCityCardProps extends BaseCityCardProps {
  variant: "ranked";
  city: CitiesResponse;
  matchScore: MatchScore;
}

export interface BasicCityCardProps extends BaseCityCardProps {
  variant: "basic";
  city: CitiesResponse;
}

export type CityCardProps = RankedCityCardProps | BasicCityCardProps;

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
  destinationTypes: string[];
  crowdLevel: number;
  recommendedStay: number;
  bestSeason: number;
  accessibility: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}
