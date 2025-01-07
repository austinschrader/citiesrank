import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, FolderPlus, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLists } from "@/features/lists/context/ListsContext";
import { ExpandedList } from "@/features/lists/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { pb } from "@/lib/pocketbase";

interface SaveCollectionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
}

export const SaveCollectionsDialog: React.FC<SaveCollectionsDialogProps> = ({
  isOpen,
  onClose,
  placeId,
}) => {
  const { lists, getUserLists, createList, addPlaceToList, isLoading: listsLoading } = useLists();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userLists, setUserLists] = useState<ExpandedList[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Fetch user's lists and check which ones contain the place
  useEffect(() => {
    if (isOpen && user && !initialLoadDone) {
      const loadData = async () => {
        try {
          const lists = await getUserLists();
          setUserLists(lists);

          // Find which lists contain this place
          const containingLists = await pb.collection('list_places').getList(1, 50, {
            filter: `place = "${placeId}"`,
            $autoCancel: false
          });

          const listIds = containingLists.items.map(item => item.list);
          setSelectedCollections(listIds);
          setInitialLoadDone(true);
        } catch (error) {
          console.error('Error loading lists:', error);
        }
      };

      loadData();
    }
  }, [isOpen, user, getUserLists, placeId, initialLoadDone]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setInitialLoadDone(false);
      setIsCreatingNew(false);
      setNewCollectionName("");
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save places to collections.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      // If creating a new collection
      if (isCreatingNew && newCollectionName.trim()) {
        const newList = await createList({
          title: newCollectionName.trim(),
          places: [placeId],
        });
        toast({
          title: "Collection created",
          description: `Created "${newCollectionName}" and added place.`,
        });
        onClose();
        return;
      }

      // Add to existing collections
      await Promise.all(
        selectedCollections.map((listId) =>
          addPlaceToList(listId, { id: placeId } as any)
        )
      );

      toast({
        title: "Place saved",
        description: `Added to ${selectedCollections.length} collection${
          selectedCollections.length === 1 ? "" : "s"
        }.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save place to collection(s).",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCollectionName.trim()) {
                    handleSave();
                  }
                }}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCreatingNew(false);
                  setNewCollectionName("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsCreatingNew(true)}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create New Collection
            </Button>
          )}

          {/* Existing Collections */}
          {listsLoading || !initialLoadDone ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : userLists.length > 0 ? (
            <div className="space-y-2">
              {userLists.map((list) => (
                <button
                  key={list.id}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors",
                    selectedCollections.includes(list.id) && "bg-accent"
                  )}
                  onClick={() => toggleCollection(list.id)}
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium">{list.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {list.place_count || 0} places
                    </div>
                  </div>
                  {selectedCollections.includes(list.id) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No collections yet
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              disabled={
                isSaving ||
                (!isCreatingNew && selectedCollections.length === 0) ||
                (isCreatingNew && !newCollectionName.trim())
              }
              onClick={handleSave}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
