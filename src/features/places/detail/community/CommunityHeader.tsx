import { Button } from "@/components/ui/button";

export const CommunityHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <div>
      <h2 className="text-2xl font-semibold">Community Insights</h2>
      <p className="text-muted-foreground">Join the conversation about Paris</p>
    </div>
    <Button variant="default" className="sm:w-auto">
      Ask a Question
    </Button>
  </div>
);
