import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Share2, TrendingUp } from "lucide-react";

export function LocalRecommendations() {
  const recommendations = [
    {
      title: "Hidden Art Gallery",
      author: "Marie D.",
      type: "Culture",
      content:
        "Don't miss this intimate gallery in the 11th. Amazing rotating exhibitions of local artists.",
      votes: 45,
      responses: 12,
    },
    {
      title: "Best Croissants in Paris",
      author: "Jean-Pierre L.",
      type: "Food",
      content:
        "This tiny bakery in Montmartre opens at 6am. Get there early - they sell out by 9am!",
      votes: 89,
      responses: 23,
    },
    {
      title: "Secret Rooftop View",
      author: "Sophie M.",
      type: "Photography",
      content:
        "Skip the crowds at Sacré-Cœur and head to this hidden rooftop cafe instead.",
      votes: 67,
      responses: 15,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Local Recommendations</h2>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.title} className="group">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </Button>
                  <span className="text-sm font-medium">{rec.votes}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{rec.type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      by {rec.author}
                    </span>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{rec.content}</p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {rec.responses} responses
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
    </div>
  );
}
