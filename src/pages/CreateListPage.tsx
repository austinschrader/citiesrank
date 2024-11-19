import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Import Lucide icons correctly
import { Search } from "lucide-react";

const SUGGESTED_TAGS = [
  "food",
  "adventure",
  "culture",
  "nature",
  "budget",
  "luxury",
  "family",
  "solo",
  "nightlife",
  "architecture",
  "history",
  "art",
];

export const CreateListPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  interface Place {
    id: string;
    name: string;
    country: string;
  }

  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleMovePlace = (index: number, direction: "up" | "down") => {
    const newPlaces = [...places];
    if (direction === "up" && index > 0) {
      [newPlaces[index], newPlaces[index - 1]] = [newPlaces[index - 1], newPlaces[index]];
    } else if (direction === "down" && index < places.length - 1) {
      [newPlaces[index], newPlaces[index + 1]] = [newPlaces[index + 1], newPlaces[index]];
    }
    setPlaces(newPlaces);
  };

  return (
    <div className="container max-w-screen-2xl py-8 px-4 mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create a List</h1>
        <p className="text-muted-foreground">Curate a collection of destinations and share your travel expertise with the community.</p>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">List Title</Label>
                <Input id="title" placeholder="e.g. Hidden Gems of Eastern Europe" className="text-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Tell us what makes this list special..." className="min-h-[120px] resize-none" />
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Drop an image here or click to upload</p>
                      <p className="text-sm text-muted-foreground">Recommended: 1600x900px or larger</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Places */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Places</h2>
              <Button onClick={() => setIsSearching(true)} className="gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Place
              </Button>
            </div>

            {isSearching ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search for a city or place..." />
                </div>

                <div className="grid gap-2">
                  {["Paris", "Rome", "Barcelona"].map((city) => (
                    <div key={city} className="p-3 border rounded-lg flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md bg-muted" />
                        <div>
                          <p className="font-medium">{city}</p>
                          <p className="text-sm text-muted-foreground">France</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {places.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <svg className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No places added yet</p>
                    <p className="text-sm">Start building your list by adding destinations</p>
                  </div>
                ) : (
                  places.map((place, index) => (
                    <div key={place.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                      <div className="h-12 w-12 rounded-md bg-muted" />
                      <div className="flex-1">
                        <p className="font-medium">{place.name}</p>
                        <p className="text-sm text-muted-foreground">{place.country}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleMovePlace(index, "up")} disabled={index === 0}>
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMovePlace(index, "down")}
                          disabled={index === places.length - 1}>
                          ↓
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setPlaces(places.filter((_, i) => i !== index))}>
                          ×
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags and Categories */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="itinerary">Itinerary</SelectItem>
                    <SelectItem value="guide">City Guide</SelectItem>
                    <SelectItem value="collection">Collection</SelectItem>
                    <SelectItem value="ranking">Ranking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}>
                      {tag}
                      <span>×</span>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SUGGESTED_TAGS.filter((tag) => !selectedTags.includes(tag)).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => setSelectedTags([...selectedTags, tag])}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Sharing */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label>Privacy</Label>
              <Select defaultValue="public">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can view</SelectItem>
                  <SelectItem value="followers">Followers Only</SelectItem>
                  <SelectItem value="private">Private - Only you</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Save as Draft</Button>
          <Button className="gap-2">
            Publish List
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};
