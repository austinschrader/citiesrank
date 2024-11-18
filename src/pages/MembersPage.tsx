import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const MembersPage = () => {
  return (
    <div className="container max-w-screen-2xl py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Members</h1>
          <p className="text-muted-foreground">Discover and connect with fellow travelers.</p>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members" className="pl-8" />
            </div>

            <div className="space-y-1">
              <button className="w-full justify-start">Popular Members</button>
              <button className="w-full justify-start">Recent Joiners</button>
              <button className="w-full justify-start">Most Active</button>
            </div>
          </div>
        </div>

        <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Member cards would go here */}
          <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
          <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
          <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};
