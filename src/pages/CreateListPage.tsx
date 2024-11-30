import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TemplateCard } from "@/components/lists/create/TemplateCard";
import { PopularListCard } from "@/components/lists/create/PopularListCard";
import { ListHeader } from "@/components/lists/create/ListHeader";
import { PlaceSearchCard } from "@/components/lists/create/PlaceSearchCard";
import { PlaceCard } from "@/components/lists/create/PlaceCard";
import { PreviewCard } from "@/components/lists/create/PreviewCard";
import {
  LIST_TEMPLATES,
  POPULAR_LISTS,
} from "@/components/lists/create/templates";
import PocketBase from "pocketbase";
import type { Template, PopularList, Place } from "@/types/lists-create";

import { getApiUrl } from "@/appConfig";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

export function CreateListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleDone = async () => {
    if (isSaving) return;
    if (!title.trim() || !places.length || !user?.id) return;

    setIsSaving(true);
    try {
      const listData = {
        // Basic fields that match the migration script
        title: title.trim(),
        description: `A curated list of places in ${places
          .map((p) => p.name)
          .join(", ")}`,
        places: JSON.stringify(places),
        tags: JSON.stringify(
          tags.length > 0 ? tags : [selectedTemplate?.title || "Travel"]
        ),
        totalPlaces: places.length,

        // Match exact format from migration script
        author: JSON.stringify({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }),

        stats: JSON.stringify({
          views: 0,
          likes: 0,
          saves: 0,
          shares: 0,
        }),

        metadata: JSON.stringify({
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isVerified: false,
          category: selectedTemplate?.title || "Travel",
        }),

        // These fields are in the migration script but were missing
        status: "published",
        collection: selectedTemplate?.collection || null,
        privacy: isPrivate ? "private" : "public",

        // Empty related lists to match migration
        relatedLists: JSON.stringify([]),
        likes: 1,
        shares: 1,
        saves: 1,
      };

      const record = await pb.collection("lists").create(listData);

      toast({
        title: "List Saved!",
        description: "Your list has been successfully saved.",
      });

      navigate(`/lists/${record.id}`);
    } catch (error) {
      console.error("Error saving list:", error);
      toast({
        title: "Error",
        description: "Failed to save your list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    if (title || places.length > 0) {
      setAutoSaveStatus("saving...");
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, places, tags, isPrivate]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.placeholderTitle);
    setTags(template.tags);
    toast({
      title: "Template Selected",
      description:
        "We've started you off with some suggestions. Add your own places!",
    });
  };

  const handleForkList = (list: PopularList) => {
    toast({
      title: "List Forked",
      description: "You can now customize this list and make it your own!",
    });
    setTitle(`${list.title} (Remixed)`);
    setSelectedTemplate(LIST_TEMPLATES[0]);
  };

  const handleAddPlace = (place: Place) => {
    setPlaces((prevPlaces) => {
      const newPlaces = [...prevPlaces, place];
      return newPlaces;
    });
    setIsSearching(false);
  };

  const handleRemovePlace = (id: string) => {
    setPlaces((prevPlaces) => {
      const newPlaces = prevPlaces.filter((place) => place.id !== id);
      return newPlaces;
    });
  };

  if (!selectedTemplate) {
    return (
      <div className="container max-w-screen-xl py-8 px-4 mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Create Your Perfect List</h1>
          <p className="text-muted-foreground">
            Start with a template or remix someone else's list to make it your
            own
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Start Fresh</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {LIST_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={handleTemplateSelect}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Or Remix a Popular List</h2>
            <div className="space-y-4">
              {POPULAR_LISTS.map((list) => (
                <PopularListCard
                  key={list.id}
                  list={list}
                  onRemix={handleForkList}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-8 px-4 mx-auto">
      <ListHeader
        title={title}
        onTitleChange={setTitle}
        autoSaveStatus={autoSaveStatus}
        onPreview={() => {}}
        onDone={handleDone}
        isSubmitting={isSaving}
      />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Places ({places.length})</h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsSearching(true)}
            >
              <Plus className="h-4 w-4" />
              Add Place
            </Button>
          </div>

          {isSearching ? (
            <PlaceSearchCard
              onAddPlace={handleAddPlace}
              onClose={() => setIsSearching(false)}
            />
          ) : places.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Start adding places to your list
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onRemove={handleRemovePlace}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="font-semibold">Preview</h2>
          <PreviewCard
            template={{
              ...selectedTemplate,
              title: title || selectedTemplate.placeholderTitle,
              description: `A curated list of ${places.length} places`,
            }}
            places={places} // Add this line
            userName={user?.name}
            userAvatar={user?.avatar}
            onTagsChange={setTags}
            onPrivacyChange={setIsPrivate}
          />
        </div>
      </div>
    </div>
  );
}
