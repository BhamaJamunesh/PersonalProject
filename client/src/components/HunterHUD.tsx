import { motion } from "framer-motion";
import { Zap, Flame, Trophy, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { User } from "@shared/schema";
import { getRankColor, calculateXpProgress, formatNumber } from "@/lib/gameUtils";

interface HunterHUDProps {
  user: User;
}

export function HunterHUD({ user }: HunterHUDProps) {
  const xpProgress = calculateXpProgress(user.currentXp);
  const xpToNext = 100 - (user.currentXp % 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-visible"
    >
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-md p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-primary">
              <AvatarImage src={user.profileImageUrl || undefined} alt={user.hunterName || "Hunter"} />
              <AvatarFallback className="bg-primary/20 text-primary font-display text-lg">
                {(user.hunterName || user.firstName || "H")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-md bg-card border-2 ${getRankColor(user.rank as any)} border-current flex items-center justify-center`}>
              <span className="font-display text-xs font-bold">{user.rank}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-lg font-semibold truncate" data-testid="text-hunter-name">
                {user.hunterName || user.firstName || "Hunter"}
              </h3>
              <span className={`font-display text-sm font-bold ${getRankColor(user.rank as any)}`}>
                {user.rank}-Rank
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Lv.</span>
              <span className="font-display text-lg font-bold text-primary" data-testid="text-level">
                {user.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">XP</span>
                <span className="font-mono text-primary">
                  {user.currentXp % 100} / 100
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{
                    boxShadow: "0 0 10px hsl(var(--primary))",
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {xpToNext} XP to next level
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Zap className="w-4 h-4" />
            </div>
            <p className="font-mono text-lg font-bold" data-testid="text-total-xp">
              {formatNumber(user.totalXp)}
            </p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <p className="font-mono text-lg font-bold" data-testid="text-streak">
              {user.currentStreak}
            </p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="font-mono text-lg font-bold" data-testid="text-longest-streak">
              {user.longestStreak}
            </p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
