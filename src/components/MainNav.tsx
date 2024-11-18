import { Link, useLocation } from "react-router-dom";
import { Heart, List, Users, BookText, PlusCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainNavProps {
  className?: string;
}

export const MainNav = ({ className }: MainNavProps) => {
  const location = useLocation();

  const routes = [
    {
      href: "/",
      label: "Places",
      icon: MapPin,
      active: location.pathname === "/" || location.pathname === "/places",
    },
    {
      href: "/lists",
      label: "Lists",
      icon: List,
      active: location.pathname === "/lists",
    },
    {
      href: "/members",
      label: "Members",
      icon: Users,
      active: location.pathname === "/members",
    },
    {
      href: "/journal",
      label: "Journal",
      icon: BookText,
      active: location.pathname === "/journal",
    },
    {
      href: "/saved",
      label: "Saved",
      icon: Heart,
      active: location.pathname === "/saved",
      mobileOnly: true,
    },
  ];

  return (
    <nav className={cn("flex items-center", className)}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes
          .filter((route) => !route.mobileOnly)
          .map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-primary" : "text-muted-foreground",
                "flex items-center gap-1.5"
              )}>
              <route.icon className="h-4 w-4 md:hidden" />
              <span>{route.label}</span>
            </Link>
          ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full">
        <div className="flex justify-around items-center">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn("flex flex-col items-center gap-1 py-1 px-3", route.active ? "text-primary" : "text-muted-foreground")}>
              <route.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Add Button Component
MainNav.AddButton = function AddButton() {
  return (
    <Link to="/add">
      <Button size="sm" className="gap-1.5">
        <PlusCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Add Place</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </Link>
  );
};
