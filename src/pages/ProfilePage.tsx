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
  LinkIcon,
  PenLine,
  Heart,
  Share2,
  List,
  Star,
  Trophy,
  BookOpen,
  Camera,
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
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">View and manage your personal profile, contributions, and achievements.</p>
        </div>

        <div className="grid gap-8">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Profile Overview</CardTitle>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <PenLine className="h-4 w-4" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-4xl">{user?.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>

                  {/* Social Links moved under avatar */}
                  <div className="flex gap-2">
                    {user?.socialLinks?.twitter && (
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    {user?.socialLinks?.instagram && (
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      {user?.location ?? "Location not set"}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="secondary" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        Top Contributor
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Member since {userStats.joined}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Globe className="h-3 w-3" />
                        {userStats.placesVisited} places visited
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Grid with improved styling */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                      <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs - Now with better spacing and consistency */}
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="bg-background sticky top-16 z-10 -mx-4 px-4 border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="lists" className="gap-2">
                  <List className="h-4 w-4" />
                  Lists
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                  <Star className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="photos" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Photos
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
                    <CardDescription>Milestones and badges earned through your travels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {achievements.map((badge) => (
                        <div key={badge.name} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2">
                              <badge.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{badge.name}</h4>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                            <span className="text-sm font-medium">{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="h-2" />
                        </div>
                      ))}
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
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{activity.title}</h4>
                                <p className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
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
              </div>
            </TabsContent>

            {/* Other tab contents remain similar but with improved styling */}
            <TabsContent value="lists">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Travel Lists</CardTitle>
                      <CardDescription>Collections and guides you've created</CardDescription>
                    </div>
                    <Button className="gap-2">
                      <List className="h-4 w-4" />
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
    </div>
  );
}
