import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { recentActivity } from "@/lib/data/profile/recentActivity";
import { Heart, List, MessageCircle, Share2, Star } from "lucide-react";

export const ProfileActivity = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
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
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Heart className="h-4 w-4" />
                      {activity.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
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
  );
};
