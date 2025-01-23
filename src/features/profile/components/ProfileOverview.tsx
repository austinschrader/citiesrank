// file location: src/features/profile/components/ProfileOverview.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Globe, ListChecks, MapPin, PenLine } from "lucide-react";
import { useState } from "react";

export const ProfileOverview = () => {
  const { user, pb } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    username: user?.username || "",
    isPrivate: user?.isPrivate || false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      // Check if username changed and validate it
      if (formData.username !== user.username) {
        // Check if username is available
        const exists = await pb
          .collection("users")
          .getFirstListItem(`username="${formData.username}"`)
          .catch(() => null);
        if (exists) {
          toast({
            title: "Username taken",
            description: "Please choose a different username",
            variant: "destructive",
          });
          return;
        }
      }

      await pb.collection("users").update(user.id, {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        username: formData.username,
        isPrivate: formData.isPrivate,
      });
      await pb.collection("users").authRefresh();
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-muted/50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || "",
                    bio: user?.bio || "",
                    location: user?.location || "",
                    username: user?.username || "",
                    isPrivate: user?.isPrivate || false,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Display Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={isLoading}
                      placeholder="Your display name"
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is how your name will appear publicly
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      disabled={isLoading}
                      placeholder="@username"
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your unique username for WurldMap
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      disabled={isLoading}
                      placeholder="Where are you based?"
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Share your current city or region
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      disabled={isLoading}
                      className="resize-none bg-background"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex flex-row-reverse items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2">Saving</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            ⚪
                          </motion.div>
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="private"
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPrivate: checked })
                      }
                      disabled={isLoading}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="private">Private Profile</Label>
                      <p className="text-xs text-muted-foreground">
                        Only you can see your profile
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Tabs defaultValue="lists" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="lists" className="flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          Lists
        </TabsTrigger>
        <TabsTrigger value="places" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Places Visited
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="lists">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Lists</CardTitle>
                <CardDescription>
                  Collections of places you've created and curated
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <PenLine className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {user.lists_count === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ListChecks className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You haven't created any lists yet.</p>
                <p className="text-sm mt-2">
                  Start creating lists to organize your favorite places!
                </p>
              </div>
            ) : (
              <div>Lists will be rendered here</div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="places">
        <Card>
          <CardHeader>
            <CardTitle>Places Visited</CardTitle>
            <CardDescription>
              Cities and places you've marked as visited
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user.places_visited?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You haven't marked any places as visited yet.</p>
                <p className="text-sm mt-2">
                  Mark places as visited to keep track of your travels!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {/* Places will be rendered here */}
                  <div className="text-muted-foreground">
                    {user.places_visited.length} places visited
                  </div>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Activity feed coming soon!</p>
              <p className="text-sm mt-2">
                We're working on bringing you a personalized activity feed.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
