// src/layouts/Header.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton } from "@/features/auth/components/SignInButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Bookmark, Globe, LogOut, Search, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const navItems = [{ label: "Home", icon: Globe, to: "/" }];

  const SearchBar = () => (
    <div className="relative w-full max-w-md">
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Changed from container/px-4 to match PlacesLayout */}
        <div className="mx-8 2xl:mx-16">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo section */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/favicon.svg"
                  alt="CitiesRank Logo"
                  className="w-9 h-9"
                />
                <span className="font-bold text-xl hidden sm:inline">
                  CitiesRank
                </span>
                <span className="font-bold text-xl sm:hidden">WL</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button variant="ghost" size="lg" className="gap-2">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* User menu section */}
            <div className="flex items-center gap-3">
              <Dialog open={isSearchActive} onOpenChange={setIsSearchActive}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-11 w-11"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="top-4 gap-0 p-0">
                  <DialogHeader className="px-4 pt-5 pb-4">
                    <DialogTitle>Search</DialogTitle>
                    <DialogDescription>
                      Find places, lists, and more
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-4 pb-4">
                    <SearchBar />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="hidden md:block">
                <SearchBar />
              </div>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-11 w-11 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name ?? ""} />
                        <AvatarFallback>
                          {user.name?.[0] ?? user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <UserCircle className="mr-2 h-5 w-5" />
                          View Profile
                          <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/favorites"
                          className="flex items-center cursor-pointer"
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          Favorites
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
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

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background md:hidden z-50">
        <nav className="container h-full">
          <div className="grid h-full grid-cols-4 items-stretch">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-center"
              >
                <div className="flex flex-col items-center justify-center gap-1 px-2 py-1">
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};
