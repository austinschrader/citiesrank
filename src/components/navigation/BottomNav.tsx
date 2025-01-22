import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Globe2, ScrollText, Sparkles, Star } from "lucide-react";

const navItems = [
  {
    label: "Explore",
    icon: Globe2,
    to: "/",
  },
  {
    label: "Lists",
    icon: ScrollText,
    to: "/lists",
  },
  {
    label: "Live",
    icon: Sparkles,
    to: "/feed",
  },
  {
    label: "Quests",
    icon: Star,
    to: "/quests",
  },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <nav className="bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full",
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
