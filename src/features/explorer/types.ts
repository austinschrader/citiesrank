export interface Creator {
  name: string;
  avatar: string;
  followers: number;
}

export interface List {
  id: string;
  name: string;
  description: string;
  coverImages: string[];
  places: number;
  followers: number;
  creator: Creator;
  tags: string[];
  stats?: {
    saves: number;
    shares: number;
    views: number;
  };
  isVerified?: boolean;
  category: string;
}

export interface FeaturedCardProps {
  title: string;
  list: string;
  image: string;
  stats?: string;
}
