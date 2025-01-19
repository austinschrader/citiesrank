import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLists } from "@/features/lists/context/ListsContext";
import { ExpandedList } from "@/features/lists/types";
import { useToast } from "@/hooks/use-toast";
import { pb } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface SaveCollectionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
}

const ITEMS_PER_PAGE = 5;

export const SaveCollectionsDialog: React.FC<SaveCollectionsDialogProps> = ({
  isOpen,
  onClose,
  placeId,
}) => {
  const {
    lists,
    getUserLists,
    createList,
    addPlaceToList,
    isLoading: listsLoading,
  } = useLists();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userLists, setUserLists] = useState<ExpandedList[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user's lists and check which ones contain the place
  useEffect(() => {
    if (isOpen && user && !initialLoadDone) {
      const loadData = async () => {
        try {
          const lists = await getUserLists();
          setUserLists(lists);

          // Find which lists contain this place
          const containingLists = await pb
            .collection("list_places")
            .getList(1, 50, {
              filter: `place = "${placeId}"`,
              $autoCancel: false,
            });

          const listIds = containingLists.items.map((item) => item.list);
          setSelectedCollections(listIds);
          setInitialLoadDone(true);
        } catch (error) {
          console.error("Error loading lists:", error);
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
      setCurrentPage(1);
      setSearchQuery("");
    }
  }, [isOpen]);

  // Reset pagination and search when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filter and paginate lists
  const filteredLists = useMemo(() => {
    return userLists.filter((list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userLists, searchQuery]);

  const totalPages = Math.ceil(filteredLists.length / ITEMS_PER_PAGE);
  const paginatedLists = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLists.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLists, currentPage]);

  const handleNextPage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateNewList = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newCollectionName.trim()) return;

    try {
      setIsSaving(true);
      const newList = await createList({
        title: newCollectionName.trim(),
        places: [placeId],
      });

      // Add new list to userLists and select it
      setUserLists((prev) => [...prev, newList]);
      setSelectedCollections((prev) => [...prev, newList.id]);

      toast({
        title: "Collection created",
        description: `Created "${newCollectionName}" and added place.`,
      });

      // Reset new collection state
      setIsCreatingNew(false);
      setNewCollectionName("");
    } catch (error) {
      console.error("Error creating list:", error);
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

      // Get current list_places records
      const currentRecords = await pb.collection("list_places").getFullList({
        filter: `place = "${placeId}"`,
        $autoCancel: false,
      });

      // Delete records that are no longer selected
      const deletePromises = currentRecords
        .filter((record) => !selectedCollections.includes(record.list))
        .map((record) => pb.collection("list_places").delete(record.id));

      // Add to newly selected collections
      const currentListIds = currentRecords.map((record) => record.list);
      const addPromises = selectedCollections
        .filter((listId) => !currentListIds.includes(listId))
        .map((listId) => addPlaceToList(listId, { id: placeId } as any));

      await Promise.all([...deletePromises, ...addPromises]);

      const message =
        selectedCollections.length === 0
          ? "Removed from all collections"
          : `Added to ${selectedCollections.length} collection${
              selectedCollections.length === 1 ? "" : "s"
            }`;

      toast({
        title: "Changes saved",
        description: message,
      });
      onClose();
    } catch (error) {
      console.error("Error saving place:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCollection = (e: React.MouseEvent, listId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCollections((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md p-0 gap-0 bg-background/95 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle>Save to Collection</DialogTitle>
            <DialogDescription>
              Add this place to your collections or create a new one.
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              onClick={(e) => e.stopPropagation()}
              className="pl-9"
            />
          </div>

          {/* New Collection Input */}
          {isCreatingNew ? (
            <form
              onSubmit={handleCreateNewList}
              className="flex items-center gap-2"
            >
              <Input
                autoFocus
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                type="submit"
                disabled={!newCollectionName.trim() || isSaving}
                onClick={handleCreateNewList}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreatingNew(false);
                  setNewCollectionName("");
                }}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
                setIsCreatingNew(true);
              }}
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
          ) : paginatedLists.length > 0 ? (
            <>
              <div className="space-y-2">
                {paginatedLists.map((list) => (
                  <button
                    key={list.id}
                    type="button"
                    onClick={(e) => toggleCollection(e, list.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors",
                      selectedCollections.includes(list.id) && "bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border border-border flex items-center justify-center transition-colors",
                        selectedCollections.includes(list.id) &&
                          "bg-primary border-primary"
                      )}
                    >
                      {selectedCollections.includes(list.id) && (
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      )}
                    </div>
                    <span className="flex-1 text-left">{list.title}</span>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : searchQuery ? (
            <div className="text-center py-8 text-muted-foreground">
              No collections found matching "{searchQuery}"
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No collections yet
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-2 border-t p-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
