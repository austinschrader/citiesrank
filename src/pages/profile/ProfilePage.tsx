import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AchievementsListCard } from "@/features/profile/components/AchievementsListCard";
import { ProfileActivity } from "@/features/profile/components/ProfileActivity";
import { ProfileFavorites } from "@/features/profile/components/ProfileFavorites";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileOverview } from "@/features/profile/components/ProfileOverview";
import { ProfileTabs } from "@/features/profile/components/ProfileTabs";

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <ProfileHeader />

        <div className="grid gap-8">
          <ProfileOverview />

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <ProfileTabs />

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Achievements Card */}

                <AchievementsListCard />

                {/* Recent Activity Card */}
                <Card>
                  <ProfileActivity />
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
                <AchievementsListCard />
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <ProfileActivity />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
