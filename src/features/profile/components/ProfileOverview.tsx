import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCities } from "@/features/places/context/CitiesContext";
import { StatCard } from "@/features/profile/components/StatCard";
import { SimpleCity } from "@/features/profile/types";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { MapPin, PenLine, Settings } from "lucide-react";
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

  // Group places by country
  const visitedPlaces = useMemo(() => {
    if (!user?.places_visited || !sortedCities.length) return {};

    return sortedCities
      .filter((city) => user.places_visited?.includes(city.id))
      .reduce((acc, city) => {
        if (!acc[city.country]) {
          acc[city.country] = [];
        }
        acc[city.country].push(city);
        return acc;
      }, {} as Record<string, SimpleCity[]>);
  }, [user?.places_visited, sortedCities]);

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

            <div className="flex gap-2">
              <Button
                variant={isEditing ? "destructive" : "outline"}
                onClick={() => {
                  if (isEditing) {
                    setFormData({
                      name: user?.name || "",
                      bio: user?.bio || "",
                      location: user?.location || "",
                      username: user?.username || "",
                      isPrivate: user?.isPrivate || false,
                    });
                  }
                  setIsEditing(!isEditing);
                }}
                disabled={isLoading}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              {isEditing && (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Add your real name"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      @
                    </span>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="pl-7 mt-1"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="City, Country"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    placeholder="Tell us about yourself..."
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Add Places You've Visited</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedCity}
                      onValueChange={setSelectedCity}
                      disabled={isLoading || cityStatus.loading === false}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedCities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}, {city.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddPlace}
                      disabled={!selectedCity || isLoading}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Places Visited</h3>
                  {Object.entries(visitedPlaces).map(([country, cities]) => (
                    <div key={country} className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        {country}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {cities.map((city) => (
                          <Badge
                            key={city.id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {city.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemovePlace(city.id)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPrivate">Private Profile</Label>
                    <Switch
                      id="isPrivate"
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPrivate: checked,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, only you can see your profile details and
                    travel history
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold">{displayName}</h2>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                    {showUsernameHint && (
                      <p className="text-sm text-muted-foreground">
                        Add your real name to personalize your profile
                      </p>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                {user.bio && (
                  <p className="text-muted-foreground">{user.bio}</p>
                )}
              </>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Places"
                value={user.places_visited?.length || 0}
                icon="Globe"
              />
              <StatCard
                label="Lists"
                value={user.lists_count || 0}
                icon="List"
              />
              <StatCard label="Joined" value={0} icon="Calendar" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
