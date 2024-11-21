import React, { useState } from "react";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Globe,
  Twitter,
  Instagram,
  Trophy,
  MessageCircle,
  UserPlus,
  Filter,
  ListFilter,
  GlobeIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
interface MemberProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  bio: string;
  joinDate: string;
  stats: {
    lists: number;
    followers: number;
    following: number;
    placesVisited: number;
    contributions: number;
    reviews: number;
  };
  badges: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    blog?: string;
  };
  topDestinations: string[];
  recentActivity: {
    type: "review" | "list" | "visited";
    content: string;
    date: string;
  }[];
  expertise: string[];
  verified: boolean;
}

// Mock Data
const MOCK_MEMBERS: MemberProfile[] = [
  {
    id: "1",
    name: "Elena Rodriguez",
    username: "wanderlust_elena",
    avatar: "/avatars/elena.jpg",
    location: "Barcelona, Spain",
    bio: "Full-time nomad, part-time photographer. Exploring hidden gems across Europe.",
    joinDate: "2023-01-15",
    stats: {
      lists: 45,
      followers: 12400,
      following: 892,
      placesVisited: 78,
      contributions: 234,
      reviews: 156,
    },
    badges: ["Top Contributor", "Photography Expert", "Local Guide"],
    socialLinks: {
      twitter: "@wanderlust_elena",
      instagram: "@elena.travels",
      blog: "elenaexplores.com",
    },
    topDestinations: ["Paris", "Rome", "Amsterdam"],
    recentActivity: [
      { type: "list", content: "Hidden Cafes of Barcelona", date: "2024-03-17" },
      { type: "review", content: "Sagrada Familia", date: "2024-03-15" },
    ],
    expertise: ["Street Photography", "Food & Wine", "Architecture"],
    verified: true,
  },
  {
    id: "2",
    name: "James Chen",
    username: "foodie_james",
    avatar: "/avatars/james.jpg",
    location: "Portland, OR",
    bio: "Food critic and cultural explorer. Always seeking the next great meal.",
    joinDate: "2023-05-20",
    stats: {
      lists: 67,
      followers: 8900,
      following: 445,
      placesVisited: 45,
      contributions: 567,
      reviews: 289,
    },
    badges: ["Food Expert", "Culture Buff", "Rising Star"],
    socialLinks: {
      instagram: "@pdx_foodie_james",
    },
    topDestinations: ["Tokyo", "Singapore", "Bangkok"],
    recentActivity: [
      { type: "list", content: "Best Ramen Shops in Portland", date: "2024-03-16" },
      { type: "review", content: "Hat Yai Restaurant", date: "2024-03-14" },
    ],
    expertise: ["Restaurant Reviews", "Street Food", "Culinary Tours"],
    verified: true,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    username: "family_travels",
    avatar: "/avatars/sarah.jpg",
    location: "London, UK",
    bio: "Family travel expert. Making memories with kids in tow.",
    joinDate: "2023-08-10",
    stats: {
      lists: 34,
      followers: 5600,
      following: 328,
      placesVisited: 32,
      contributions: 145,
      reviews: 89,
    },
    badges: ["Family Expert", "Budget Master"],
    socialLinks: {
      instagram: "@johnson_family_travels",
      blog: "familyadventures.blog",
    },
    topDestinations: ["Copenhagen", "Munich", "Edinburgh"],
    recentActivity: [
      { type: "list", content: "Kid-Friendly Museums in London", date: "2024-03-15" },
      { type: "visited", content: "Legoland Windsor", date: "2024-03-10" },
    ],
    expertise: ["Family Travel", "Educational Tours", "Budget Planning"],
    verified: false,
  },
];

const MemberCard = ({ member }: { member: MemberProfile }) => {
  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{member.name}</h3>
                {/* 
                TODO: fix spacing issue
                {member.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )} */}
              </div>
              <p className="text-sm text-muted-foreground">@{member.username}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span>{member.location}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Follow
          </Button>
        </div>
        <p className="text-sm">{member.bio}</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="font-semibold">{member.stats.lists}</p>
            <p className="text-xs text-muted-foreground">Lists</p>
          </div>
          <div>
            <p className="font-semibold">{member.stats.followers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{member.stats.placesVisited}</p>
            <p className="text-xs text-muted-foreground">Places</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {member.badges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          {member.socialLinks.twitter && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Twitter className="h-4 w-4" />
            </Button>
          )}
          {member.socialLinks.instagram && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Instagram className="h-4 w-4" />
            </Button>
          )}
          {member.socialLinks.blog && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export const MembersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("popular");

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
      <div className="mx-8 2xl:mx-16 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Members</h1>
            <p className="text-muted-foreground max-w-2xl">
              Connect with passionate travelers, local experts, and culture enthusiasts from around the world.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search members" className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Browse By</h3>
                <div className="space-y-1">
                  <Button
                    variant={selectedFilter === "popular" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFilter("popular")}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Popular Members
                  </Button>
                  <Button
                    variant={selectedFilter === "recent" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFilter("recent")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Recent Joiners
                  </Button>
                  <Button
                    variant={selectedFilter === "active" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFilter("active")}>
                    <Users className="h-4 w-4 mr-2" />
                    Most Active
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Filter By</h3>
                <div className="space-y-2">
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <GlobeIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger>
                      <ListFilter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Expertise</SelectItem>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="family">Family Travel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{MOCK_MEMBERS.length}</span> members
              </p>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Active</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                  <SelectItem value="contributions">Top Contributors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {MOCK_MEMBERS.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
