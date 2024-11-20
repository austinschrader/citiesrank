import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Globe, BookOpen, Map, Heart, Users, Settings, BellDot, User, LifeBuoy, LogOut, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignInButton } from "@/components/auth/SignInButton";
import { useAuth } from "@/lib/auth/AuthContext";

export const Header = () => {
  const { user, signOut } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

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
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo section */}
            <div className="flex items-center gap-6">
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
                      {navItems.map((item) => (
                        <Link key={item.to} to={item.to}>
                          <Button variant="ghost" className="justify-start gap-2 w-full">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="/favicon.svg" alt="WanderLog Logo" className="w-8 h-8" />
                <span className="font-bold text-xl hidden sm:inline">WanderLog</span>
                <span className="font-bold text-xl sm:hidden">WL</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems
                .filter((item) => !item.mobileOnly)
                .map((item) => (
                  <Link key={item.to} to={item.to}>
                    <Button variant="ghost" className="gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
            </nav>

            {/* User menu section */}
            <div className="flex items-center gap-2">
              <Dialog open={isSearchActive} onOpenChange={setIsSearchActive}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="top-4 gap-0 p-0">
                  <DialogHeader className="px-4 pt-5 pb-4">
                    <DialogTitle>Search</DialogTitle>
                    <DialogDescription>Find places, lists, and more</DialogDescription>
                  </DialogHeader>
                  <div className="px-4 pb-4">
                    <SearchBar />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="hidden md:block">
                <SearchBar />
              </div>

              <Button variant="ghost" size="icon">
                <BellDot className="h-5 w-5" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name ?? ""} />
                        <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                          <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/saved" className="cursor-pointer">
                          <Bookmark className="mr-2 h-4 w-4" />
                          Saved Items
                          <DropdownMenuShortcut>⇧S</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <a href="https://docs.citiesrank.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                          <LifeBuoy className="mr-2 h-4 w-4" />
                          Support
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SignInButton />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <nav className="container h-16">
          <div className="grid h-full grid-cols-4">
            {navItems
              .filter((item) => !item.mobileOnly)
              .map((item) => (
                <Link key={item.to} to={item.to} className="h-full">
                  <Button variant="ghost" className="h-full w-full rounded-none flex flex-col gap-1 items-center justify-center">
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs">{item.label}</span>
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
