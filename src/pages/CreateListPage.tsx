import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TemplateCard } from "@/components/createList/TemplateCard";
import { PopularListCard } from "@/components/createList/PopularListCard";
import { ListHeader } from "@/components/createList/ListHeader";
import { PlaceSearchCard } from "@/components/createList/PlaceSearchCard";
import { PlaceCard } from "@/components/createList/PlaceCard";
import { PreviewCard } from "@/components/createList/PreviewCard";
import { LIST_TEMPLATES, POPULAR_LISTS } from "@/components/createList/templates";
import type { Template, PopularList, Place } from "@/components/createList/types";

export function CreateListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");

  useEffect(() => {
    if (title || places.length > 0) {
      setAutoSaveStatus("saving...");
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, places]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.placeholderTitle);
    toast({
      title: "Template Selected",
      description: "We've started you off with some suggestions. Add your own places!",
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
    setPlaces([...places, place]);
    setIsSearching(false);
  };

  const handleRemovePlace = (id: string) => {
    setPlaces(places.filter((place) => place.id !== id));
  };

  if (!selectedTemplate) {
    return (
      <div className="container max-w-screen-xl py-8 px-4 mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Create Your Perfect List</h1>
          <p className="text-muted-foreground">Start with a template or remix someone else's list to make it your own</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Start Fresh</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {LIST_TEMPLATES.map((template) => (
                <TemplateCard key={template.id} template={template} onClick={handleTemplateSelect} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Or Remix a Popular List</h2>
            <div className="space-y-4">
              {POPULAR_LISTS.map((list) => (
                <PopularListCard key={list.id} list={list} onRemix={handleForkList} />
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
        onDone={() => navigate(`/lists/1`)}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Places</h2>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsSearching(true)}>
              <Plus className="h-4 w-4" />
              Add Place
            </Button>
          </div>

          {isSearching ? (
            <PlaceSearchCard onAddPlace={handleAddPlace} onClose={() => setIsSearching(false)} />
          ) : places.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Start adding places to your list</p>
            </div>
          ) : (
            <div className="space-y-2">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} onRemove={handleRemovePlace} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="font-semibold">Preview</h2>
          <PreviewCard template={selectedTemplate} userName={user?.name} userAvatar={user?.avatar} />
        </div>
      </div>
    </div>
  );
}
