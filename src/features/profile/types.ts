export interface Achievement {
  name: string;
  description: string;
  progress: number;
  total: number;
  icon: React.ReactNode;
}

export interface Activity {
  type: "list" | "review";
  title: string;
  date: string;
  likes: number;
  comments: number;
}

export interface SimpleCity {
  id: string;
  name: string;
  country: string;
}

export interface AchievementDetails {
  [key: string]: {
    completed: string[];
    remaining: string[];
    description: string;
  };
}

export interface UserStats {
  placesVisited: number;
  listsCreated: number;
  followers: number;
  following: number;
  comments: number;
}
