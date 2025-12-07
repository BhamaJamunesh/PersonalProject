import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Check, Star, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import type { DailyHunt } from "@shared/schema";
import { getTimeUntilReset } from "@/lib/gameUtils";

interface DailyHuntsProps {
  dailyHunts: DailyHunt[];
  weeklyHunts: DailyHunt[];
  onCompleteHunt: (huntId: string) => void;
  isCompleting?: boolean;
}

export function DailyHunts({ dailyHunts, weeklyHunts, onCompleteHunt, isCompleting }: DailyHuntsProps) {
  const completedDaily = dailyHunts.filter(h => h.isCompleted).length;
  const completedWeekly = weeklyHunts.filter(h => h.isCompleted).length;
  const dailyProgress = dailyHunts.length > 0 ? (completedDaily / dailyHunts.length) * 100 : 0;
  const weeklyProgress = weeklyHunts.length > 0 ? (completedWeekly / weeklyHunts.length) * 100 : 0;
  const allDailyComplete = dailyHunts.length > 0 && completedDaily === dailyHunts.length;
  const allWeeklyComplete = weeklyHunts.length > 0 && completedWeekly === weeklyHunts.length;

  return (
    <div className="space-y-4">
      <Card className="border-2 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Daily Hunts
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeUntilReset(false)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{completedDaily}/{dailyHunts.length}</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
          </div>

          <AnimatePresence>
            {allDailyComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-3 rounded-md bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-display font-semibold text-yellow-500">Daily Clear Bonus!</p>
                    <p className="text-xs text-muted-foreground">+50 XP awarded</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        <CardContent className="space-y-2">
          {dailyHunts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No daily hunts available</p>
          ) : (
            dailyHunts.map((hunt) => (
              <HuntItem 
                key={hunt.id} 
                hunt={hunt} 
                onComplete={onCompleteHunt}
                isCompleting={isCompleting}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Weekly Hunts
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeUntilReset(true)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{completedWeekly}/{weeklyHunts.length}</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>

          <AnimatePresence>
            {allWeeklyComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-3 rounded-md bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-display font-semibold text-primary">Weekly Clear Bonus!</p>
                    <p className="text-xs text-muted-foreground">+200 XP awarded</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        <CardContent className="space-y-2">
          {weeklyHunts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No weekly hunts available</p>
          ) : (
            weeklyHunts.map((hunt) => (
              <HuntItem 
                key={hunt.id} 
                hunt={hunt} 
                onComplete={onCompleteHunt}
                isCompleting={isCompleting}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function HuntItem({ 
  hunt, 
  onComplete, 
  isCompleting 
}: { 
  hunt: DailyHunt; 
  onComplete: (id: string) => void;
  isCompleting?: boolean;
}) {
  return (
    <motion.div
      layout
      className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
        hunt.isCompleted 
          ? "bg-muted/30 border-muted opacity-60" 
          : "bg-card border-border hover:border-muted-foreground/50"
      }`}
      data-testid={`hunt-item-${hunt.id}`}
    >
      <Checkbox
        checked={hunt.isCompleted}
        disabled={hunt.isCompleted || isCompleting}
        onCheckedChange={() => onComplete(hunt.id)}
        className="w-5 h-5"
        data-testid={`checkbox-hunt-${hunt.id}`}
      />
      
      <span className={`flex-1 text-sm ${hunt.isCompleted ? "line-through text-muted-foreground" : ""}`}>
        {hunt.title}
      </span>
      
      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
        +{hunt.xpReward} XP
      </Badge>

      {hunt.isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
}
