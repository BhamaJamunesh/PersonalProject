import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sword, Star, Clock, Sparkles, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Quest, QuestRarity } from "@shared/schema";
import { getRarityColor, getRarityBadgeClass, getRarityGlowClass, XP_BY_RARITY } from "@/lib/gameUtils";
import { format } from "date-fns";

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: string) => void;
  isCompleting?: boolean;
}

const rarityIcons: Record<QuestRarity, typeof Star> = {
  common: Star,
  rare: Sword,
  epic: Sparkles,
  legendary: Crown,
};

export function QuestCard({ quest, onComplete, isCompleting }: QuestCardProps) {
  const [showXpGain, setShowXpGain] = useState(false);
  const isCompleted = quest.status === "completed";
  const RarityIcon = rarityIcons[quest.rarity as QuestRarity];

  const handleComplete = () => {
    if (onComplete && !isCompleted && !isCompleting) {
      setShowXpGain(true);
      onComplete(quest.id);
      setTimeout(() => setShowXpGain(false), 1500);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative p-4 border-2 transition-all duration-300 ${
          isCompleted 
            ? "border-muted bg-muted/30 opacity-60" 
            : `${getRarityColor(quest.rarity as QuestRarity)} ${getRarityGlowClass(quest.rarity as QuestRarity)}`
        }`}
        data-testid={`card-quest-${quest.id}`}
      >
        <AnimatePresence>
          {showXpGain && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 0, y: -60 }}
              className="absolute top-0 right-4 font-display font-bold text-primary glow-text-subtle"
            >
              +{quest.xpReward} XP
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox
              checked={isCompleted}
              disabled={isCompleted || isCompleting}
              onCheckedChange={handleComplete}
              className={`w-5 h-5 rounded-md border-2 ${
                isCompleted 
                  ? "bg-primary border-primary" 
                  : "border-muted-foreground/50"
              }`}
              data-testid={`checkbox-quest-${quest.id}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 
                className={`font-semibold ${isCompleted ? "line-through text-muted-foreground" : ""}`}
                data-testid={`text-quest-title-${quest.id}`}
              >
                {quest.title}
              </h4>
              {quest.isBossObjective && (
                <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
                  BOSS
                </Badge>
              )}
            </div>

            {quest.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {quest.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${getRarityBadgeClass(quest.rarity as QuestRarity)} text-xs`}>
                <RarityIcon className="w-3 h-3 mr-1" />
                {quest.rarity.charAt(0).toUpperCase() + quest.rarity.slice(1)}
              </Badge>

              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                +{quest.xpReward} XP
              </Badge>

              {quest.dueDate && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {format(new Date(quest.dueDate), "MMM d")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2"
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center check-animation">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
