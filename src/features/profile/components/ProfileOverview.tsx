import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCities } from "@/features/places/context/CitiesContext";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { MapPin, PenLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const ProfileOverview = () => {
  const { user, pb } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const { sortedCities, cityStatus } = useCities();
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

  // Get the full avatar URL
  const getAvatarUrl = () => {
    if (!user?.avatar) return "";

    // PocketBase automatically adds a timestamp to avoid caching
    return pb.files.getUrl(user, user.avatar);
  };

  const handleAddPlace = async () => {
    if (!selectedCity || !user) return;

    try {
      setIsLoading(true);
      const currentPlaces = user.places_visited || [];
      if (!currentPlaces.includes(selectedCity)) {
        await pb.collection("users").update(user.id, {
          places_visited: [...currentPlaces, selectedCity],
        });
        await pb.collection("users").authRefresh();
      }
      setSelectedCity("");
    } catch (error) {
      console.error("Error adding place:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePlace = async (cityId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const currentPlaces = user.places_visited || [];
      await pb.collection("users").update(user.id, {
        places_visited: currentPlaces.filter((id: string) => id !== cityId),
      });
      await pb.collection("users").authRefresh();
    } catch (error) {
      console.error("Error removing place:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Display name logic
  const displayName = user?.name || user?.username;
  const showUsernameHint = !user?.name && user?.username;

  const hasChanges = useMemo(() => {
    return (
      formData.name !== user?.name ||
      formData.bio !== user?.bio ||
      formData.location !== user?.location ||
      formData.username !== user?.username ||
      formData.isPrivate !== user?.isPrivate
    );
  }, [formData, user]);

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
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Profile Overview</CardTitle>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              if (isEditing && hasChanges) {
                if (
                  !window.confirm(
                    "You have unsaved changes. Are you sure you want to cancel?"
                  )
                ) {
                  return;
                }
              }
              setIsEditing(!isEditing);
              if (!isEditing) {
                setFormData({
                  name: user?.name || "",
                  bio: user?.bio || "",
                  location: user?.location || "",
                  username: user?.username || "",
                  isPrivate: user?.isPrivate || false,
                });
              }
            }}
          >
            <PenLine className="h-4 w-4" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="text-4xl">
                  {displayName?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90"
                >
                  <PenLine className="h-4 w-4" />
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </Label>
              )}
            </div>

            {!isEditing ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold">{displayName}</h2>
                {showUsernameHint && (
                  <p className="text-sm text-muted-foreground">
                    @{user?.username}
                  </p>
                )}
                {user?.location && (
                  <div className="flex items-center justify-center gap-1 mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user?.bio && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {user.bio}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center space-x-2 h-[68px]">
                  <div className="flex items-center space-x-2">
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
                      <p className="text-sm text-muted-foreground">
                        Hide profile from other users
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  disabled={isLoading}
                  className="resize-none"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
              {hasChanges && (
                <div className="bg-muted/50 px-4 py-3 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    You have unsaved changes
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setFormData({
                          name: user?.name || "",
                          bio: user?.bio || "",
                          location: user?.location || "",
                          username: user?.username || "",
                          isPrivate: user?.isPrivate || false,
                        });
                      }}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
