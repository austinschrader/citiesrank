import {
  Heart,
  Share2,
  Globe,
  Lock,
  PenLine,
  Tag as TagIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Place } from "../types";
import { getCityImage } from "@/lib/cloudinary";
import { createSlug } from "@/lib/imageUtils";

interface PreviewCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
  };
  places: Place[];
  userName?: string;
  userAvatar?: string;
  onTagsChange?: (tags: string[]) => void;
  onPrivacyChange?: (isPrivate: boolean) => void;
}

export function PreviewCard({
  template,
  places,
  userName,
  userAvatar,
  onTagsChange,
  onPrivacyChange,
}: PreviewCardProps) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(template.tags);

  const getPlaceImage = (name: string, country: string) => {
    const citySlug = createSlug(name);
    const countrySlug = createSlug(country);
    return getCityImage(`${citySlug}-${countrySlug}-1`, "standard");
  };

  const handlePrivacyToggle = () => {
    setIsPrivate(!isPrivate);
    onPrivacyChange?.(!isPrivate);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      onTagsChange?.(updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    onTagsChange?.(updatedTags);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-muted relative">
          {places.length > 0 && (
            <img
              src={getPlaceImage(places[0].name, places[0].country)}
              alt={places[0].name}
              className="w-full h-full object-cover absolute inset-0"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-semibold text-white mb-2">
              {template.title}
            </h2>
            <p className="text-sm text-white/90">{template.description}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Author and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handlePrivacyToggle}>
                {isPrivate ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Places Preview */}
          {places.length > 0 && (
            <div className="space-y-2">
              <div className="space-y-2">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={getPlaceImage(place.name, place.country)}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{place.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {place.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TagIcon className="h-4 w-4" />
                <span>Tags</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTags(!isEditingTags)}
              >
                <PenLine className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="group">
                  {tag}
                  {isEditingTags && (
                    <button
                      className="ml-1 opacity-0 group-hover:opacity-100"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {isEditingTags && (
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleAddTag}
                  placeholder="Add tag..."
                  className="w-24 h-6 text-sm"
                />
              )}
            </div>
          </div>

          {/* Privacy Status */}
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {isPrivate ? (
              <>
                <Lock className="h-4 w-4" />
                Private list - Only you can see this
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                Public list - Anyone can see this
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
