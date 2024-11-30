import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TopExperiences() {
  const experiences = [
    {
      title: "Louvre Museum",
      rating: 4.8,
      reviews: "125k",
      category: "Arts & Culture",
    },
    {
      title: "Eiffel Tower",
      rating: 4.9,
      reviews: "200k",
      category: "Landmarks",
    },
    {
      title: "Seine River Cruise",
      rating: 4.7,
      reviews: "85k",
      category: "Activities",
    },
    {
      title: "Notre-Dame Cathedral",
      rating: 4.8,
      reviews: "150k",
      category: "Historic Sites",
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Top Experiences</h3>
      <div className="space-y-3">
        {experiences.map((exp) => (
          <Card key={exp.title} className="group cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-primary">
                    {exp.title}
                  </h4>
                  <Badge variant="secondary">{exp.category}</Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-primary" />
                    <span>{exp.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {exp.reviews} reviews
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
