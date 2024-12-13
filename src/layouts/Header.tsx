// src/layouts/Header.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Bookmark, Globe, LogOut, UserCircle, Map, Compass, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const navItems = [
    { label: "Explore", icon: Compass, to: "/explore" },
    { label: "Rankings", icon: Globe, to: "/rankings" },
    { label: "Travel Guides", icon: Map, to: "/guides" },
    { label: "Community", icon: Users, to: "/community" },
  ];

  return (
    <header className="sticky top-0 z-[9999] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-0">
        <div className="h-16 flex items-center px-4">
          {/* Logo section */}
          <div className="flex-none">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity">
              CitiesRank
            </Link>
          </div>

          {/* Right-aligned content */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button variant="ghost" size="sm" className="text-sm font-semibold text-gray-900 hover:bg-gray-100">
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* User menu section */}
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
                <DropdownMenuContent className="w-64 z-[9999]" align="end">
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
              <Button className="bg-primary text-white hover:bg-primary/90">
                Join/Sign up
              </Button>
            )}
          </div>
        </div>
      </div>

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
    </header>
  );
};
