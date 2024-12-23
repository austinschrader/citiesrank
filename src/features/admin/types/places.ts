export interface Place {
  name: string;
  normalizedName: string;
  country: string;
  cost: number;
  interesting: number;
  transit: number;
  description: string;
  population: string;
  highlights: any;
  crowdLevel: number;
  recommendedStay: number;
  bestSeason: number;
  accessibility: number;
  slug: string;
  imageUrl: string;
  averageRating?: number;
  totalReviews?: number;
  costIndex: number;
  safetyScore: number;
  walkScore: number;
  transitScore: number;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  type?: "country" | "region" | "city" | "neighborhood" | "sight";
  parentId?: string;
  climate?: string;
}

export interface ValidationResult {
  name: string;
  isValid: boolean;
  errors: string[];
  data: Partial<Place>;
}

export interface SeedFile {
  default: Place[];
}
