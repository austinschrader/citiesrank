import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCities } from "@/features/places/context/CitiesContext";
import { AchievementsList } from "@/features/profile/components/AchievementsList";
import { ProfileFavorites } from "@/features/profile/components/ProfileFavorites";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileOverview } from "@/features/profile/components/ProfileOverview";
import { useToast } from "@/hooks/use-toast";
import { recentActivity } from "@/lib/data/profile/recentActivity";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import {
  BookOpen,
  Globe,
  Heart,
  List,
  MessageCircle,
  Share2,
  Star,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

export const ProfilePage = () => {
  const { user, pb } = useAuth();
  const { cities } = useCities();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    username: user?.username || "",
    isPrivate: user?.isPrivate || false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsLoading(true);
      await pb.collection("users").update(user.id, formData);

      // Force auth refresh and get the new avatar URL
      const updatedUser = await pb.collection("users").authRefresh();

      // Log to check what we're getting
      console.log("Updated user:", updatedUser);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const [favoriteCities, setFavoriteCities] = useState<CitiesResponse[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

  // Fetch favorite cities
  useEffect(() => {
    let isSubscribed = true;

    async function fetchFavorites() {
      if (!user) return;

      setIsFavoritesLoading(true);
      try {
        const favorites = await pb.collection("favorites").getFullList({
          filter: `user = "${user.id}"`,
          expand: "city",
          $autoCancel: false,
        });

        if (isSubscribed) {
          const favoritedCities = favorites
            .map((favorite) => favorite.expand?.city)
            .filter(Boolean);

          setFavoriteCities(favoritedCities);
        }
      } catch (error) {
        // Only show error if component is still mounted and error is not a cancellation
        if (
          isSubscribed &&
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Error fetching favorites:", error);
          toast({
            title: "Error loading favorites",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      } finally {
        if (isSubscribed) {
          setIsFavoritesLoading(false);
        }
      }
    }

    fetchFavorites();

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <ProfileHeader />

        <div className="grid gap-8">
          <ProfileOverview />

          {/* Main Content Tabs - Now with better spacing and consistency */}
          <Tabs defaultValue="overview" className="space-y-6">
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

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Achievements Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Achievements
                    </CardTitle>
                    <CardDescription>
                      Milestones and badges earned through your travels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <AchievementsList />
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest contributions and interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="rounded-lg bg-muted p-2">
                            {activity.type === "list" ? (
                              <List className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {activity.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(activity.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <Heart className="h-4 w-4" />
                                  {activity.likes}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  {activity.comments}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <ProfileFavorites />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AchievementsList />
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest contributions and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="rounded-lg bg-muted p-2">
                          {activity.type === "list" ? (
                            <List className="h-4 w-4" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                              >
                                <Heart className="h-4 w-4" />
                                {activity.likes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                              >
                                <MessageCircle className="h-4 w-4" />
                                {activity.comments}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
