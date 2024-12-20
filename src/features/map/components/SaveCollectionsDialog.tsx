import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { Check, FolderPlus } from "lucide-react";
import React, { useState } from "react";

interface Collection {
  id: string;
  name: string;
  imageUrl: string;
  placeCount: number;
}

interface SaveCollectionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
}

const christmasMarketImage = getImageUrl("strasbourg-france-1", "thumbnail");
const italyImage = getImageUrl("portofino-italy-3", "thumbnail");
const germanyImage = getImageUrl("trier-germany-1", "thumbnail");
const franceImage = getImageUrl("strasbourg-france-1", "thumbnail");

// Mock data for collections
const mockCollections: Collection[] = [
  {
    id: "1",
    name: "Christmas Markets 2024",
    imageUrl: christmasMarketImage,
    placeCount: 12,
  },
  {
    id: "2",
    name: "German Castles",
    imageUrl: germanyImage,
    placeCount: 8,
  },
  {
    id: "3",
    name: "Mediterranean Summer",
    imageUrl: italyImage,
    placeCount: 15,
  },
  {
    id: "4",
    name: "Hidden Gems",
    imageUrl: franceImage,
    placeCount: 23,
  },
];

export const SaveCollectionsDialog: React.FC<SaveCollectionsDialogProps> = ({
  isOpen,
  onClose,
  placeId,
}) => {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const createNewCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName,
      imageUrl: "/api/placeholder/400/400",
      placeCount: 1,
    };

    setCollections((prev) => [newCollection, ...prev]);
    setSelectedCollections((prev) => [...prev, newCollection.id]);
    setNewCollectionName("");
    setIsCreatingNew(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-background/95 backdrop-blur-sm">
        <div className="p-6 space-y-6">
          <DialogTitle className="text-xl font-semibold">
            Save to Collection
          </DialogTitle>

          {/* New Collection Input */}
          {isCreatingNew ? (
            <div className="flex items-center gap-2">
              <Input
                autoFocus
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createNewCollection()}
                className="flex-1"
              />
              <Button size="sm" onClick={createNewCollection}>
                Create
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 h-12"
              onClick={() => setIsCreatingNew(true)}
            >
              <FolderPlus className="w-4 h-4" />
              Create New Collection
            </Button>
          )}

          {/* Collections Grid */}
          <div className="grid grid-cols-2 gap-3">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => toggleCollection(collection.id)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-xl border-2",
                  "transition-all duration-200",
                  selectedCollections.includes(collection.id)
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-primary/50"
                )}
              >
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {collection.name}
                  </p>
                  <p className="text-xs text-white/70">
                    {collection.placeCount} places
                  </p>
                </div>
                <div
                  className={cn(
                    "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center",
                    "transition-all duration-200",
                    selectedCollections.includes(collection.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/50 text-white/70"
                  )}
                >
                  <Check className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t p-4 flex justify-end gap-2 bg-muted/50">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose} disabled={selectedCollections.length === 0}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
