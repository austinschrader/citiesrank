import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHeader } from "@/context/HeaderContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Compass,
  Globe2,
  MapPin,
  Medal,
  Mountain,
  Route,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

const QuestCard = ({ quest }: { quest: any }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden">
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{quest.title}</CardTitle>
            <CardDescription>{quest.description}</CardDescription>
          </div>
          <div
            className={cn(
              "p-2 rounded-lg",
              quest.difficulty === "easy"
                ? "bg-green-100 text-green-700"
                : quest.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {quest.difficulty}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>{quest.progress}%</span>
          </div>
          <Progress value={quest.progress} className="h-2" />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">{quest.points} points</span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Start Quest
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const LeaderboardCard = ({ user, rank }: { user: any; rank: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: rank * 0.1 }}
    className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50"
  >
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
      {rank + 1}
    </div>
    <div className="flex-1">
      <div className="font-medium">{user.name}</div>
      <div className="text-sm text-gray-500">{user.points} points</div>
    </div>
    <Medal className="w-5 h-5 text-yellow-500" />
  </motion.div>
);

const AchievementCard = ({ achievement }: { achievement: any }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
  >
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        {achievement.icon}
      </div>
      <div>
        <h3 className="font-medium">{achievement.title}</h3>
        <p className="text-sm text-gray-500">{achievement.description}</p>
      </div>
    </div>
  </motion.div>
);

export const DiscoverPage = () => {
  const { setMode } = useHeader();
  const [activeTab, setActiveTab] = useState("quests");

  useEffect(() => {
    setMode("discover");
  }, [setMode]);

  const quests = [
    {
      title: "Urban Explorer",
      description: "Visit 5 historical landmarks in your city",
      difficulty: "easy",
      progress: 60,
      points: 100,
    },
    {
      title: "Hidden Gems Hunter",
      description: "Discover 3 local cafes with 4.5+ rating",
      difficulty: "medium",
      progress: 30,
      points: 150,
    },
    {
      title: "Culture Seeker",
      description: "Check in at 3 museums or art galleries",
      difficulty: "medium",
      progress: 0,
      points: 200,
    },
  ];

  const leaderboard = [
    { name: "Sarah K.", points: 2500 },
    { name: "Mike R.", points: 2350 },
    { name: "Alex M.", points: 2200 },
    { name: "Jessica L.", points: 2100 },
    { name: "Chris P.", points: 2000 },
  ];

  const achievements = [
    {
      title: "Globetrotter",
      description: "Visited 10 different countries",
      icon: <Globe2 className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Mountain Climber",
      description: "Checked in at 5 mountain peaks",
      icon: <Mountain className="w-6 h-6 text-green-500" />,
    },
    {
      title: "City Slicker",
      description: "Explored 20 urban locations",
      icon: <MapPin className="w-6 h-6 text-purple-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-4"
          >
            <Compass className="w-12 h-12 text-purple-600" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Discover Your World
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Embark on exciting quests, earn achievements, and compete with
            fellow explorers in this real-world adventure game.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {["quests", "leaderboard", "achievements"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "capitalize",
                activeTab === tab &&
                  "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              )}
            >
              {tab === "quests" && <Route className="w-4 h-4 mr-2" />}
              {tab === "leaderboard" && <Trophy className="w-4 h-4 mr-2" />}
              {tab === "achievements" && <Award className="w-4 h-4 mr-2" />}
              {tab}
            </Button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeTab === "quests" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quests.map((quest, index) => (
                  <QuestCard key={index} quest={quest} />
                ))}
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Top Explorers</h2>
                  <p className="text-gray-500">
                    This week's most active adventurers
                  </p>
                </div>
                {leaderboard.map((user, index) => (
                  <LeaderboardCard key={index} user={user} rank={index} />
                ))}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement, index) => (
                  <AchievementCard key={index} achievement={achievement} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
