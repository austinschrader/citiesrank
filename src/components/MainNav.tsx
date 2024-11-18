import React from "react";
import { Heart, List, Users, BookText, PlusCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MainNav = ({ className }: { className?: string }) => {
  // In a real app, this would come from your router/auth state
  const currentPath = window.location.pathname;
  const isLoggedIn = true; // This would come from your auth context

  const routes = [
    {
      href: "/",
      label: "Places",
      icon: MapPin,
      active: currentPath === "/places",
    },
    {
      href: "/lists",
      label: "Lists",
      icon: List,
      active: currentPath === "/lists",
    },
    {
      href: "/members",
      label: "Members",
      icon: Users,
      active: currentPath === "/members",
    },
    {
      href: "/journal",
      label: "Journal",
      icon: BookText,
      active: currentPath === "/journal",
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
            "flex items-center gap-1.5"
          )}>
          <route.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{route.label}</span>
        </a>
      ))}

      {isLoggedIn && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5">
            <Heart className="h-4 w-4" />
            Saved
          </Button>
          <Button size="sm" className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Place</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      )}
    </nav>
  );
};
