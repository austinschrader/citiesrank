import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const TrendingTopics = () => (
  <div className="space-y-4 mb-8">
    {[
      {
        title: "New Restaurant Row in Chelsea",
        excerpt: "Five new Michelin-starred restaurants opened...",
        engagement: "2.3k discussions",
      },
      {
        title: "Central Park Summer Events",
        excerpt: "Complete guide to free concerts and movies...",
        engagement: "1.8k interested",
      },
      {
        title: "Subway Line L Updates",
        excerpt: "Major improvements coming to L train service...",
        engagement: "956 discussions",
      },
    ].map((topic, i) => (
      <Card
        key={i}
        className="group cursor-pointer hover:shadow-md transition-all"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold mb-1 group-hover:text-primary">
                {topic.title}
              </h3>
              <p className="text-sm text-muted-foreground">{topic.excerpt}</p>
            </div>
            <Badge variant="secondary">{topic.engagement}</Badge>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
