import { motion } from "framer-motion";
import { Trophy, Lock, Star, Flame, Target, Zap, Crown, Shield, Swords } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Achievement, UserAchievement, QuestRarity } from "@shared/schema";
import { getRarityBadgeClass } from "@/lib/gameUtils";
import { format } from "date-fns";

interface AchievementGalleryProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
}

const achievementIcons: Record<string, typeof Trophy> = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  target: Target,
  zap: Zap,
  crown: Crown,
  shield: Shield,
  swords: Swords,
};

export function AchievementGallery({ achievements, userAchievements }: AchievementGalleryProps) {
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
  
  const getUnlockDate = (achievementId: string) => {
    const ua = userAchievements.find(ua => ua.achievementId === achievementId);
    return ua?.unlockedAt;
  };

  const unlockedCount = achievements.filter(a => unlockedIds.has(a.id)).length;

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <Badge variant="outline">
            {unlockedCount}/{achievements.length}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Earn badges for your accomplishments
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const unlockDate = getUnlockDate(achievement.id);
            const Icon = achievementIcons[achievement.icon || "trophy"] || Trophy;

            return (
              <Tooltip key={achievement.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`relative p-4 rounded-md border-2 text-center transition-all ${
                      isUnlocked
                        ? `bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 ${
                            achievement.rarity === "legendary" ? "glow-border-gold" : ""
                          }`
                        : "bg-muted/30 border-muted opacity-60"
                    }`}
                    data-testid={`achievement-${achievement.id}`}
                  >
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isUnlocked 
                        ? "bg-yellow-500/20" 
                        : "bg-muted"
                    }`}>
                      {isUnlocked ? (
                        <Icon className="w-6 h-6 text-yellow-500" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <h4 className={`font-semibold text-sm mb-1 ${
                      isUnlocked ? "" : "text-muted-foreground"
                    }`}>
                      {isUnlocked ? achievement.name : "???"}
                    </h4>
                    
                    <Badge 
                      className={`text-xs ${getRarityBadgeClass(achievement.rarity as QuestRarity)}`}
                    >
                      {achievement.rarity}
                    </Badge>

                    {isUnlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center"
                      >
                        <Star className="w-3 h-3 text-yellow-900" />
                      </motion.div>
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {unlockDate && (
                      <p className="text-xs text-primary">
                        Unlocked: {format(new Date(unlockDate), "MMM d, yyyy")}
                      </p>
                    )}
                    {!isUnlocked && (
                      <p className="text-xs text-muted-foreground italic">
                        Complete specific objectives to unlock
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Achievements will appear as you progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
