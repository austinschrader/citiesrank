export type TravelStyle = 
  | "cultural"
  | "adventure"
  | "food"
  | "family"
  | "digital"
  | "nightlife";

type ScoreCriteria = {
  walkScore?: number;
  transitScore?: number;
  interesting?: number;
};

type RangeCriteria = {
  min?: number;
  max?: number;
};

export interface StyleCriteria {
  minRating?: number;
  crowdLevel?: RangeCriteria;
  accessibility?: RangeCriteria;
  safetyScore?: number;
  costIndex?: RangeCriteria;
  preferredScores?: ScoreCriteria;
}

export interface TravelStyleDefinition {
  label: string;
  description: string;
  emoji: string;
  hoverGradient: string;
  activeGradient: string;
  tags: readonly string[];
  criteria: StyleCriteria;
}
