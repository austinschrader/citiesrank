import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, MessageCircle, Star, Trophy } from "lucide-react";

export const ProfileTabs = () => {
  return (
    <div className="bg-background sticky top-16 z-10 -mx-4 px-4 border-b">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="overview" className="gap-2">
          <Globe className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="favorites" className="gap-2">
          <Star className="h-4 w-4" />
          Favorites
        </TabsTrigger>
        <TabsTrigger value="achievements" className="gap-2">
          <Trophy className="h-4 w-4" />
          Achievements
        </TabsTrigger>
        <TabsTrigger value="activity" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Activity
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
