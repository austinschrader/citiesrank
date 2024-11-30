import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";


export const AddPlacePage = () => {
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Add a Place</h1>
        <p className="text-muted-foreground">Share a new destination with the community.</p>
      </div>

      <Card className="p-6">
        <form className="space-y-8">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Place Name</Label>
                <Input id="name" placeholder="e.g. Porto" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="e.g. Portugal" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Tell us about this place..." className="min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                <button>Coastal</button>
                <button>Historic</button>
                <button>Cultural</button>
                <button>+ Add Category</button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Drop photos here or click to upload</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button>Cancel</button>
            <button>Submit Place</button>
          </div>
        </form>
      </Card>
    </div>
  );
};
