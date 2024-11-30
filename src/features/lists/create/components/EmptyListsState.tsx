import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, MapPin, ListChecks, Share2, Globe, Compass, Camera, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyListsStateProps {
  showCreateButton?: boolean;
}

export const EmptyListsState: React.FC<EmptyListsStateProps> = ({ showCreateButton = true }) => {
  const inspirationalTemplates = [
    {
      icon: Compass,
      title: "Weekend Getaways",
      description: "Perfect 48-hour escapes",
    },
    {
      icon: Camera,
      title: "Photo Spots",
      description: "Instagram-worthy locations",
    },
    {
      icon: Sparkles,
      title: "Hidden Gems",
      description: "Off the beaten path",
    },
  ];

  return (
    <div className="flex flex-col items-center text-center py-16 px-4 max-w-3xl mx-auto">
      {/* Main Empty State */}
      <div className="mb-12 space-y-4">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <ListChecks className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">Create Your First List</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Start curating your perfect travel collections. Share hidden gems, plan future trips, or keep track of your favorite places.
        </p>
        {showCreateButton && (
          <Button asChild size="lg" className="mt-6">
            <Link to="/create-list" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First List
            </Link>
          </Button>
        )}
      </div>

      {/* Quick Start Templates */}
      <div className="w-full space-y-6">
        <h4 className="text-lg font-semibold">Quick Start Templates</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {inspirationalTemplates.map((template) => (
            <Link to="/create-list" key={template.title}>
              <Card className="group cursor-pointer transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                      <template.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-left">
                      <h5 className="font-medium group-hover:text-primary transition-colors">{template.title}</h5>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-16 w-full">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <h5 className="font-medium">Save Places</h5>
            <p className="text-sm text-muted-foreground">Bookmark your favorite spots and organize them into themed collections</p>
          </div>
          <div className="space-y-2">
            <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
              <Share2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h5 className="font-medium">Share with Friends</h5>
            <p className="text-sm text-muted-foreground">Create guides and share your travel experiences with others</p>
          </div>
          <div className="space-y-2">
            <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
              <Globe className="h-6 w-6 text-muted-foreground" />
            </div>
            <h5 className="font-medium">Get Inspired</h5>
            <p className="text-sm text-muted-foreground">Discover new destinations from our community of travelers</p>
          </div>
        </div>
      </div>

      {/* Help Link */}
      <div className="mt-12">
        <Button variant="link" asChild>
          <Link to="/help/lists" className="text-muted-foreground hover:text-primary">
            Learn more about creating and managing lists
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const EmptyListsTab = () => (
  <div className="space-y-6">
    <EmptyListsState />
  </div>
);
