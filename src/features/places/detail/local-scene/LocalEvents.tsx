import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingUp, Users, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: string;
  attendees: number;
  organizer: string;
  description: string;
}

interface LocalEventsProps {
  events?: Event[];
}

export const LocalEvents: React.FC<LocalEventsProps> = () => (
  <ScrollArea className="h-[600px] pr-4">
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {[
              {
                title: "Jazz in the Gardens",
                date: "Tonight, 8:00 PM",
                location: "Luxembourg Gardens",
                category: "Music",
                price: "Free",
                attendees: 342,
              },
              {
                title: "French Wine Tasting",
                date: "Tomorrow, 6:30 PM",
                location: "Le Marais",
                category: "Food & Drink",
                price: "€45",
                attendees: 28,
              },
              {
                title: "Impressionist Art Workshop",
                date: "Saturday, 2:00 PM",
                location: "Montmartre",
                category: "Arts",
                price: "€35",
                attendees: 15,
              },
            ].map((event) => (
              <Card key={event.title} className="group cursor-pointer">
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
                        <span>•</span>
                        <span>{event.price}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">{event.category}</Badge>
                        <Badge variant="outline">{event.attendees} attending</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Local Recommendations</h2>
          <div className="space-y-4">
            {[
              {
                title: "Hidden Art Gallery",
                author: "Marie D.",
                type: "Culture",
                content: "Don't miss this intimate gallery in the 11th. Amazing rotating exhibitions of local artists.",
                votes: 45,
                responses: 12,
              },
              {
                title: "Best Croissants in Paris",
                author: "Jean-Pierre L.",
                type: "Food",
                content: "This tiny bakery in Montmartre opens at 6am. Get there early - they sell out by 9am!",
                votes: 89,
                responses: 23,
              },
              {
                title: "Secret Rooftop View",
                author: "Sophie M.",
                type: "Photography",
                content: "Skip the crowds at Sacré-Cœur and head to this hidden rooftop cafe instead.",
                votes: 67,
                responses: 15,
              },
            ].map((rec) => (
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
                        <span className="text-sm text-muted-foreground">by {rec.author}</span>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary">{rec.title}</h3>
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
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Local Meetups</h3>
          <div className="space-y-3">
            {[
              {
                title: "Paris Photography Walk",
                date: "Every Saturday",
                members: 156,
                nextEvent: "This Saturday",
              },
              {
                title: "Language Exchange",
                date: "Weekly",
                members: 423,
                nextEvent: "Tuesday",
              },
              {
                title: "Expat Social Club",
                date: "Monthly",
                members: 892,
                nextEvent: "Next Friday",
              },
            ].map((meetup) => (
              <Card key={meetup.title} className="group cursor-pointer">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 group-hover:text-primary">{meetup.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{meetup.members} members</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">Next: {meetup.nextEvent}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Popular Topics</h3>
          <div className="space-y-3">
            {[
              { tag: "Photography Spots", count: "2.3k posts" },
              { tag: "Food & Dining", count: "4.1k posts" },
              { tag: "Transportation", count: "1.8k posts" },
              { tag: "Accommodations", count: "2.7k posts" },
              { tag: "Shopping", count: "1.5k posts" },
            ].map((topic) => (
              <Button key={topic.tag} variant="outline" className="w-full justify-between">
                <span>{topic.tag}</span>
                <Badge variant="secondary">{topic.count}</Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ScrollArea>
);
