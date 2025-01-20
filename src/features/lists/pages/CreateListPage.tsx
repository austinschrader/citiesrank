import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLists } from "@/features/lists/context/ListsContext";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Globe2, Loader2, Lock, Map } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectablePlacesPanel } from "../components/SelectablePlacesPanel";
import { updateListLocation } from "../utils/listLocation";

type VisibilityOption = "public" | "private" | "unlisted";

interface VisibilitySetting {
  value: VisibilityOption;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const visibilitySettings: VisibilitySetting[] = [
  {
    value: "public",
    label: "Public",
    icon: <Globe2 className="h-4 w-4" />,
    description: "Everyone can see this list",
  },
  {
    value: "unlisted",
    label: "Unlisted",
    icon: <Map className="h-4 w-4" />,
    description: "Only people with the link can see this list",
  },
  {
    value: "private",
    label: "Private",
    icon: <Lock className="h-4 w-4" />,
    description: "Only you can see this list",
  },
];

export const CreateListPage = () => {
  const navigate = useNavigate();
  const { createList } = useLists();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // List details state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<VisibilityOption>("public");
  const [enableComments, setEnableComments] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<CitiesResponse[]>([]);

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      selectedPlaces.length > 0
    );
  }, [title, description, selectedPlaces]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;

      try {
        setIsSubmitting(true);

        const list = await createList({
          title: title.trim(),
          description: description.trim(),
          places: selectedPlaces.map((place) => place.id),
        });

        // Update list location
        await updateListLocation(list.id);

        toast({
          title: "Success",
          description: "List created successfully!",
        });

        navigate(`/lists/${list.id}`);
      } catch (error) {
        console.error("Failed to create list:", error);
        toast({
          title: "Error",
          description: "Failed to create list. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isFormValid,
      title,
      description,
      selectedPlaces,
      createList,
      navigate,
      toast,
    ]
  );

  const handlePlacesSelected = useCallback((places: CitiesResponse[]) => {
    setSelectedPlaces(places);
  }, []);

  return (
    <div className="container max-w-7xl py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Create List</h1>
        <Button onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create List"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* List Details */}
        <div className="col-span-5 space-y-6">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome List"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this list about?"
                  className="h-32"
                />
              </div>

              <div>
                <Label>Visibility</Label>
                <div className="grid gap-4 mt-2">
                  {visibilitySettings.map((setting) => (
                    <div
                      key={setting.value}
                      className={cn(
                        "flex items-center space-x-4 rounded-lg border p-4",
                        visibility === setting.value && "border-primary"
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {setting.icon}
                          <h3 className="font-medium">{setting.label}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {setting.description}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <input
                          type="radio"
                          name="visibility"
                          checked={visibility === setting.value}
                          onChange={() => setVisibility(setting.value)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full border-2 border-primary",
                            visibility === setting.value && "bg-primary"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="comments"
                  checked={enableComments}
                  onCheckedChange={setEnableComments}
                />
                <Label htmlFor="comments">Enable comments</Label>
              </div>
            </div>
          </Card>
        </div>

        {/* Places Selection */}
        <div className="col-span-7">
          <SelectablePlacesPanel onPlacesSelected={handlePlacesSelected} />
        </div>
      </div>
    </div>
  );
};
