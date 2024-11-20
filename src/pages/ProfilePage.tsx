import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Calendar,
  Globe,
  Twitter,
  Instagram,
  Users,
  MessageCircle,
  Settings,
  Edit,
  Heart,
  Share2,
  List,
  Star,
  LucideIcon,
} from "lucide-react";

interface UserStats {
  placesVisited: number;
  listsCreated: number;
  followers: number;
  following: number;
  contributions: number;
  joined: string;
}

interface Achievement {
  name: string;
  description: string;
  icon: LucideIcon;
  progress: number;
}

interface Activity {
  type: "list" | "review";
  title: string;
  date: string;
  likes: number;
  comments: number;
}

// Mock data with proper types
const userStats: UserStats = {
  placesVisited: 47,
  listsCreated: 15,
  followers: 1234,
  following: 567,
  contributions: 89,
  joined: "March 2023",
};

const achievements: Achievement[] = [
  { name: "Explorer", description: "Visited 25+ places", icon: Globe, progress: 80 },
  { name: "List Master", description: "Created 10+ lists", icon: List, progress: 65 },
  { name: "Contributor", description: "50+ contributions", icon: Star, progress: 45 },
];

const recentActivity: Activity[] = [
  {
    type: "list",
    title: "Hidden Gems of Paris",
    date: "2024-03-15",
    likes: 45,
    comments: 12,
  },
  {
    type: "review",
    title: "Amazing experience at Sagrada Familia",
    date: "2024-03-10",
    likes: 23,
    comments: 5,
  },
];

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <Card className="bg-card/50">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
    </CardContent>
  </Card>
);

export function ProfilePage() {
  const { user } = useAuth();

  const stats: StatCardProps[] = [
    { label: "Places", value: userStats.placesVisited, icon: Globe },
    { label: "Lists", value: userStats.listsCreated, icon: List },
    { label: "Followers", value: userStats.followers, icon: Users },
    { label: "Following", value: userStats.following, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section - removed gradient background */}
      <div className="py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {user?.location ?? "Location not set"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      Joined {userStats.joined}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Globe className="h-3 w-3" />
                      {userStats.placesVisited} places
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="gap-2" variant="outline">
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <div className="flex gap-2">
                  {user?.socialLinks?.twitter && (
                    <Button variant="ghost" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  )}
                  {user?.socialLinks?.instagram && (
                    <Button variant="ghost" size="icon">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="w-full md:w-72 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-background sticky top-16 z-10 -mx-4 px-4 border-b">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lists">Lists</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Achievements Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Badges and milestones earned through your travels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {achievements.map((badge) => (
                      <div key={badge.name} className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <badge.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                          <Progress value={badge.progress} className="h-1.5 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest contributions and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="rounded-lg bg-muted p-2">
                          {activity.type === "list" ? <List className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {activity.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {activity.comments}
                              </span>
                              <Button variant="ghost" size="icon">
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

          <TabsContent value="lists">
            {/* Lists content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Travel Lists</CardTitle>
                    <CardDescription>Collections and guides you've created</CardDescription>
                  </div>
                  <Button>
                    <List className="mr-2 h-4 w-4" />
                    Create List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Your lists will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            {/* Reviews content */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Your thoughts and ratings on places you've visited</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Your reviews will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            {/* Photos content */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Photos</CardTitle>
                <CardDescription>Pictures from your adventures</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Your photos will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
