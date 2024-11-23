import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CommunityHeader = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold">Community Insights</h2>
      <p className="text-muted-foreground">Join the conversation about Paris</p>
    </div>
    <Button className="gap-2">
      <MessageCircle className="h-4 w-4" />
      Ask a Question
    </Button>
  </div>
);
