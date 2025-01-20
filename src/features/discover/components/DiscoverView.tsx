import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Compass,
  Crown,
  Flag,
  Globe2,
  Navigation,
  Sparkles,
  Trophy,
} from "lucide-react";
import { QuestCard } from "./QuestCard";
import { DiscoveryCard } from "./DiscoveryCard";

const achievements = [
  {
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
    title: "Explorer Elite",
    description: "Visited 50+ locations",
    color: "bg-yellow-50",
  },
  {
    icon: <Globe2 className="w-5 h-5 text-blue-500" />,
    title: "World Traveler",
    description: "5 countries visited",
    color: "bg-blue-50",
  },
  {
    icon: <Flag className="w-5 h-5 text-green-500" />,
    title: "Local Guide",
    description: "100+ reviews posted",
    color: "bg-green-50",
  },
];

const leaderboard = [
  { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", points: 2500 },
  { name: "Mike Johnson", avatar: "/avatars/mike.jpg", points: 2350 },
  { name: "Alex Lee", avatar: "/avatars/alex.jpg", points: 2200 },
];

export const DiscoverView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 shadow-xl mb-8"
          >
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">
              Discover Your Next Adventure
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Your World Awaits
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Join a global community of explorers. Share experiences, discover
            hidden gems, and collect achievements as you explore the world
            around you.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Card className="p-4 text-center bg-white/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-600">1.2M+</div>
              <div className="text-sm text-gray-500">Places Explored</div>
            </Card>
            <Card className="p-4 text-center bg-white/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-pink-600">500K+</div>
              <div className="text-sm text-gray-500">Active Explorers</div>
            </Card>
            <Card className="p-4 text-center bg-white/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-indigo-600">2.5M+</div>
              <div className="text-sm text-gray-500">Shared Experiences</div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left Column - Featured Content */}
          <div className="space-y-8">
            {/* Active Quests */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Active Quests</h2>
                  <p className="text-gray-500">
                    Complete quests to earn rewards
                  </p>
                </div>
                <Button className="gap-2">
                  <Navigation className="w-4 h-4" />
                  View All
                </Button>
              </div>

              <div className="grid gap-4">
                <QuestCard
                  icon={<Globe2 className="w-6 h-6 text-blue-500" />}
                  title="World Explorer"
                  description="Visit 3 new countries"
                  progress={66}
                  reward="250 XP"
                  deadline="5 days left"
                />
                <QuestCard
                  icon={<Flag className="w-6 h-6 text-green-500" />}
                  title="Local Master"
                  description="Review 5 local businesses"
                  progress={40}
                  reward="100 XP"
                  deadline="2 days left"
                />
              </div>
            </section>

            {/* Recent Discoveries */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Recent Discoveries</h2>
                  <p className="text-gray-500">
                    Latest finds from the community
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Compass className="w-4 h-4" />
                  Explore More
                </Button>
              </div>

              <div className="grid gap-6">
                <DiscoveryCard
                  image="/path/to/image.jpg"
                  title="Hidden Garden Cafe"
                  location="Portland, Oregon"
                  description="A charming spot tucked away in the Pearl District..."
                  tags={["food", "cozy", "local-favorite"]}
                  user={{
                    name: "Sarah Chen",
                    avatar: "/path/to/avatar.jpg",
                    badge: "Local Expert",
                  }}
                />
              </div>
            </section>
          </div>

          {/* Right Column - User Progress */}
          <div className="space-y-8">
            {/* User Level */}
            <Card className="p-6 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-4 ring-purple-500/20">
                    <AvatarImage src="/path/to/avatar.jpg" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-white">
                    15
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">World Explorer</h3>
                  <p className="text-sm text-gray-500">Level 15</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level 16</span>
                  <span>2,450 / 3,000 XP</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="font-semibold">84</div>
                  <div className="text-sm text-gray-500">Places</div>
                </div>
                <div className="p-3 rounded-lg bg-pink-50">
                  <div className="font-semibold">31</div>
                  <div className="text-sm text-gray-500">Reviews</div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6 bg-white/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", achievement.color)}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-gray-500">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-6 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Local Leaders</h3>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Crown className="w-4 h-4" />
                  Full Rankings
                </Button>
              </div>

              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="font-bold text-lg text-gray-400 w-6">
                      #{index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        {user.points} pts
                      </div>
                    </div>
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
