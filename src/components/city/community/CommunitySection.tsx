import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunitySection() {
  return (
    <div>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {[
            {
              title: "Best time to visit the Louvre?",
              author: "Maria S.",
              type: "Question",
              content: "Planning my first visit to the Louvre. When's the best time to avoid crowds?",
              votes: 34,
              responses: 12,
              tags: ["museums", "planning"],
            },
            {
              title: "Hidden Gem Alert: Secret Garden",
              author: "Lucas P.",
              type: "Local Tip",
              content: "Just discovered this amazing hidden garden behind Musée Carnavalet. Perfect spot for a quiet afternoon.",
              votes: 89,
              responses: 15,
              tags: ["hidden-gems", "parks"],
            },
            // More community posts would continue...
          ].map((post) => (
            <Card key={post.title} className="group">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </Button>
                    <span className="text-sm font-medium">{post.votes}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge>{post.type}</Badge>
                      <span className="text-sm text-muted-foreground">by {post.author}</span>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {post.responses} responses
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-medium">4,523</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Local Experts</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Posts this Week</span>
                  <span className="font-medium">234</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                        <h4 className="font-semibold group-hover:text-primary">{contributor.name}</h4>
                        <div className="flex items-center gap-2">
                          {contributor.local && (
                            <Badge variant="secondary" className="text-xs">
                              Local Expert
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">{contributor.posts} posts</span>
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
      </div>
    </div>
  );
}
