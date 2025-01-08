export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  timeLimit?: {
    start: Date;
    end: Date;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  participants: number;
  completions: number;
}

export type ChallengeType = 
  | 'photo_hunt'      // Take photos of specific places/things
  | 'explorer'        // Visit X number of new places
  | 'local_expert'    // Write detailed reviews
  | 'social'          // Engage with community
  | 'seasonal'        // Time-limited special challenges
  | 'collection'      // Collect specific types of places
  | 'achievement';    // Milestone achievements

export interface ChallengeRequirement {
  type: 'visit' | 'photo' | 'review' | 'interaction';
  count: number;
  target?: string;    // Specific place or category
  criteria?: any;     // Additional validation rules
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'title' | 'feature_unlock';
  value: number | string;
  icon?: string;
}
