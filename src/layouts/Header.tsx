import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, Globe, BookOpen, Map, Heart, Users, Settings, LogIn, BellDot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { label: "Places", icon: Globe, to: "/" },
    { label: "Lists", icon: Map, to: "/lists" },
    { label: "Members", icon: Users, to: "/members" },
    { label: "Journal", icon: BookOpen, to: "/journal" },
    { label: "Saved", icon: Heart, to: "/saved", mobileOnly: true },
  ];

  const SearchBar = () => (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search cities, regions, or experiences..."
        className="pl-9 pr-4 h-10 w-full bg-muted/40 focus:bg-background"
      />
      {searchQuery && (
        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 mx-auto">
          {/* Main header row */}
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo section */}
            <div className="flex items-center gap-6">
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="flex flex-col gap-2">
                      {navItems.map(({ label, icon: Icon, to }) => (
                        <Link key={to} to={to}>
                          <Button variant="ghost" className="justify-start gap-2 w-full">
                            <Icon className="h-4 w-4" />
                            {label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="/favicon.svg" alt="WanderLog Logo" className="w-8 h-8" />
                <span className="font-bold text-xl hidden sm:inline">WanderLog</span>
                <span className="font-bold text-xl sm:hidden">WL</span>
              </Link>
            </div>

            {/* Center section - Navigation (desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ label, icon: Icon, to }) => (
                <Link key={to} to={to}>
                  <Button variant="ghost" className="gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Right section - Actions */}
            <div className="flex items-center gap-2">
              {/* Search trigger for mobile */}
              <Dialog open={isSearchActive} onOpenChange={setIsSearchActive}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="top-4 gap-0 p-0">
                  <DialogHeader className="px-4 pt-4 pb-2">
                    <DialogTitle>Search Destinations</DialogTitle>
                    <DialogDescription>Discover cities, regions, and experiences</DialogDescription>
                  </DialogHeader>
                  <div className="px-4 pb-4">
                    <SearchBar />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Desktop search bar */}
              <div className="hidden md:block">
                <SearchBar />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <BellDot className="h-5 w-5" />
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign in</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <nav className="container h-16">
          <div className="grid h-full grid-cols-4">
            {navItems.map(({ label, icon: Icon, to }) => (
              <Link key={to} to={to} className="h-full">
                <Button variant="ghost" className="h-full w-full rounded-none flex flex-col gap-1 items-center justify-center">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
