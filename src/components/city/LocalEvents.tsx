import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const LocalEvents = () => (
  <ScrollArea className="h-[400px]">
    <div className="space-y-4 pr-4">
      {[
        {
          title: "Shakespeare in the Park",
          date: "Tonight, 7:30 PM",
          location: "Central Park",
          category: "Arts",
          attendees: 234,
        },
        {
          title: "Food Truck Festival",
          date: "Tomorrow, 12-8 PM",
          location: "Bryant Park",
          category: "Food",
          attendees: 1567,
        },
        {
          title: "Tech Meetup",
          date: "Wed, 6:30 PM",
          location: "WeWork SoHo",
          category: "Networking",
          attendees: 89,
        },
      ].map((event, i) => (
        <Card key={i} className="group cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 group-hover:text-primary">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
              </div>
              <Badge variant="secondary">{event.attendees} going</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </ScrollArea>
);
