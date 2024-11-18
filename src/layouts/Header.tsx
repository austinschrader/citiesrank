import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/MainNav";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto">
        {/* Upper Navigation */}
        <div className="h-14 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="European Gems Logo" className="w-8 h-8" />
            <span className="font-bold text-xl hidden sm:inline">TravelGems</span>
            <span className="font-bold text-xl sm:hidden">Gems</span>
          </a>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search cities & places..." className="pl-8 w-full" />
            </div>
          </div>

          {/* Desktop Add Button */}
          <div className="hidden md:block">
            <MainNav.AddButton />
          </div>
        </div>

        {/* Navigation - Desktop in header, Mobile below */}
        <div className="hidden md:block">
          <MainNav className="h-14" />
        </div>
      </div>

      {/* Mobile Navigation - Fixed at bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <MainNav className="container h-16" />
      </div>
    </header>
  );
};
