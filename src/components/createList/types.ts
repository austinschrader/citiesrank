export interface Template {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  image: string;
  tags: string[];
  placeholderTitle: string;
  collection?: string | null;
}

export interface PopularList {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  places: number;
  likes: number;
}

export interface Place {
  id: string;
  name: string;
  country: string;
  image?: string;
}
