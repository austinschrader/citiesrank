export interface Discussion {
  id: string;
  placeId: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    level: number;
    expertise: string[];
  };
  category: DiscussionCategory;
  tags: string[];
  created: Date;
  updated: Date;
  stats: {
    views: number;
    replies: number;
    likes: number;
  };
  status: "active" | "resolved" | "featured";
}

export type DiscussionCategory =
  | "local_tips" // Insider knowledge
  | "photo_spots" // Best photography locations
  | "events" // Local events and happenings
  | "questions" // Q&A about the place
  | "meetups" // Community meetups
  | "reviews" // Detailed reviews & experiences
  | "recommendations"; // Specific recommendations

export interface Reply {
  id: string;
  discussionId: string;
  content: string;
  author: {
    id: string;
    name: string;
    level: number;
  };
  created: Date;
  updated: Date;
  likes: number;
  endorsed: boolean; // Endorsed by original poster
}
