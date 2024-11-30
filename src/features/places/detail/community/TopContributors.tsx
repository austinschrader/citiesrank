import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function TopContributors() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Top Contributors</h3>
        <div className="space-y-3">
          {[
            { name: "Sophie M.", posts: 156, local: true },
            { name: "Jean-Pierre L.", posts: 89, local: true },
            { name: "Maria S.", posts: 67, local: false },
          ].map((contributor) => (
            <Card key={contributor.name} className="group cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold group-hover:text-primary">
                      {contributor.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {contributor.local && (
                        <Badge variant="secondary" className="text-xs">
                          Local Expert
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {contributor.posts} posts
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
