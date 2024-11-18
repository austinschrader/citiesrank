import { Plus } from "lucide-react";

export const JournalPage = () => {
  return (
    <div className="container max-w-screen-2xl py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Journal</h1>
          <p className="text-muted-foreground">Share your travel stories and experiences.</p>
        </div>
        <button>
          <Plus className="mr-2 h-4 w-4" /> Write Entry
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Featured Stories</h2>
          {/* Featured journal entries would go here */}
          <div className="h-64 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
          <div className="h-64 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Latest Entries</h2>
          {/* Recent journal entries would go here */}
          <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
          <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
          <div className="h-48 rounded-lg border bg-card text-card-foreground shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};
