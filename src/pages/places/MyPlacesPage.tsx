import { PlaceUpload } from "@/components/place-upload/PlaceUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCities } from "@/features/places/context/CitiesContext";
import { useToast } from "@/hooks/use-toast";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import {
  Edit2,
  Eye,
  ImageIcon,
  Loader2,
  MapPin,
  MoreVertical,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddPlaceDialog } from "@/components/place-upload/AddPlaceDialog";

export function MyPlacesPage() {
  const { user } = useAuth();
  const { cities } = useCities();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingPlace, setEditingPlace] = useState<CitiesResponse | null>(null);

  // Filter places created by the current user
  const myPlaces = cities.filter((city) => city.userId === user?.id);

  const handleDelete = useCallback(
    async (place: CitiesResponse) => {
      try {
        setIsLoading(true);
        // Add your delete logic here
        toast({
          title: "Place deleted",
          description: "Your place has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete place. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleEdit = useCallback(async (place: CitiesResponse) => {
    setEditingPlace(place);
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="rounded-full bg-muted p-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Sign in to view your places
        </h2>
        <p className="text-muted-foreground">
          Create an account to start adding and managing your own places.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Places</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your uploaded places
          </p>
        </div>
        <AddPlaceDialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Place
          </Button>
        </AddPlaceDialog>
      </div>

      {myPlaces.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No places yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start by adding your first place. You can upload photos and add
                details about interesting locations.
              </p>
            </div>
            <AddPlaceDialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="mt-2 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Place
              </Button>
            </AddPlaceDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPlaces.map((place) => (
            <Card
              key={place.id}
              className="group overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_auto,h_480,w_640/v1/${place.imageUrl}`}
                  alt={place.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-semibold truncate">{place.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {place.country || "No location"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {place.averageRating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <CardFooter className="p-3 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    navigate(`/places/${place.type}/${place.slug}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEdit(place)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(place)}
                      className="text-destructive gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPlace} onOpenChange={() => setEditingPlace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Place</DialogTitle>
            <DialogDescription>
              Make changes to your place. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingPlace?.name}
                onChange={(e) =>
                  setEditingPlace(
                    (prev) => prev && { ...prev, name: e.target.value }
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingPlace?.description}
                onChange={(e) =>
                  setEditingPlace(
                    (prev) => prev && { ...prev, description: e.target.value }
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlace(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
