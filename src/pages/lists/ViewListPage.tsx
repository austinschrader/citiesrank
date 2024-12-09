import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/config/appConfig";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PlaceCard } from "@/features/lists/components/PlaceCard";
import { PlaceDetails } from "@/features/lists/components/PlaceDetails";
import { Tags } from "@/features/lists/components/Tags";
import { CommentsSection } from "@/features/lists/view/components/CommentsSection";
import { ListHero } from "@/features/lists/view/components/ListHero";
import { ListStatistics } from "@/features/lists/view/components/ListStatistics";
import { RelatedLists } from "@/features/lists/view/components/RelatedLists";
import { useToast } from "@/hooks/use-toast";
import { getPlaceImage } from "@/lib/cloudinary";
import { createSlug } from "@/lib/imageUtils";
import {
  CitiesResponse,
  ListsResponse,
  UsersResponse,
} from "@/lib/types/pocketbase-types";
import { Loader2, Trash2 } from "lucide-react";
import PocketBase from "pocketbase";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

interface ExpandedListResponse extends ListsResponse {
  expand?: {
    places?: CitiesResponse[];
    author?: UsersResponse;
    relatedLists?: ListsResponse[];
  };
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      <p className="text-muted-foreground">Loading list...</p>
    </div>
  </div>
);

export const ViewListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<ExpandedListResponse | null>(null);
  const [activePlace, setActivePlace] = useState<CitiesResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const loadList = async () => {
      if (!id || isLoadingRef.current) return;

      const requestId = Math.random().toString(36).substring(7);
      currentRequestIdRef.current = requestId;
      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const record = await pb
          .collection("lists")
          .getOne<ExpandedListResponse>(id, {
            expand: "places,author,relatedLists",
            $autoCancel: false,
          });

        if (currentRequestIdRef.current === requestId) {
          setData(record);
          if (record.expand?.places?.[0]) {
            setActivePlace(record.expand.places[0]);
          }
        }
      } catch (error) {
        console.error("Error loading list:", error);
        if (currentRequestIdRef.current === requestId) {
          toast({
            title: "Error loading list",
            description: "Failed to load the list. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (currentRequestIdRef.current === requestId) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    };

    loadList();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!id || isDeleting) return;

    setIsDeleting(true);
    try {
      await pb.collection("lists").delete(id);

      toast({
        title: "List Deleted",
        description: "Your list has been successfully deleted.",
      });

      navigate("/lists");
    } catch (error) {
      console.error("Error deleting list:", error);
      toast({
        title: "Error",
        description: "Failed to delete list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data || !activePlace) {
    return null;
  }

  const citySlug = createSlug(activePlace.name);
  const countrySlug = createSlug(activePlace.country);
  const coverImage = activePlace.imageUrl
    ? getPlaceImage(activePlace.imageUrl, "large")
    : getPlaceImage(`${citySlug}-${countrySlug}-1`, "large");
  const isAuthor = user?.id === data.author;

  return (
    <div className="min-h-screen bg-background">
      <ListHero list={data} />

      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Places to Visit</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              View Map
            </Button>
            <Button variant="outline" size="sm">
              Download PDF
            </Button>
            {isAuthor && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{data.title}" and remove it
                      from our servers. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete List"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4">
              {data.expand?.places?.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isActive={activePlace.id === place.id}
                  onClick={() => setActivePlace(place)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <ListStatistics
              views={data.views}
              likes={data.likes}
              saves={data.saves}
              shares={data.shares}
            />
            <PlaceDetails place={activePlace} />
            <Tags tags={data.tags || []} />
            {data.expand?.relatedLists && (
              <RelatedLists lists={data.expand.relatedLists} />
            )}
          </div>
        </div>
      </div>
      <CommentsSection />
    </div>
  );
};

export default ViewListPage;
