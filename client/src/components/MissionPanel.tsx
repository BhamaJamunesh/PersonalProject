import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ChevronDown, ChevronUp, Clock, Skull, Trophy, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { QuestCard } from "./QuestCard";
import type { Mission, Quest } from "@shared/schema";
import { format } from "date-fns";

interface MissionPanelProps {
  mission: Mission;
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
  isCompleting?: boolean;
}

export function MissionPanel({ mission, quests, onCompleteQuest, isCompleting }: MissionPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const completedQuests = quests.filter(q => q.status === "completed").length;
  const progress = quests.length > 0 ? (completedQuests / quests.length) * 100 : 0;
  const isMissionComplete = mission.status === "completed";
  const bossQuest = quests.find(q => q.isBossObjective);
  const regularQuests = quests.filter(q => !q.isBossObjective);

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Skull
        key={i}
        className={`w-3 h-3 ${i < difficulty ? "text-destructive" : "text-muted-foreground/30"}`}
      />
    ));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card 
        className={`border-2 transition-all ${
          isMissionComplete 
            ? "border-primary/50 bg-primary/5" 
            : "border-border"
        }`}
        data-testid={`card-mission-${mission.id}`}
      >
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <div className="flex items-start justify-between gap-2 cursor-pointer group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Target className={`w-5 h-5 ${isMissionComplete ? "text-primary" : "text-muted-foreground"}`} />
                    <CardTitle className="font-display text-lg" data-testid={`text-mission-title-${mission.id}`}>
                      {mission.title}
                    </CardTitle>
                    {isMissionComplete && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        Cleared
                      </Badge>
                    )}
                  </div>
                  
                  {mission.description && (
                    <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      {getDifficultyStars(mission.difficulty)}
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {mission.totalXpReward} XP
                    </Badge>

                    {mission.deadline && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(mission.deadline), "MMM d")}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </CollapsibleTrigger>

            <div className="space-y-1 pt-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mission Progress</span>
                <span>{completedQuests}/{quests.length} quests</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {regularQuests.length > 0 && (
                <div className="space-y-2">
                  {regularQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={onCompleteQuest}
                      isCompleting={isCompleting}
                    />
                  ))}
                </div>
              )}

              {bossQuest && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
                    <span className="text-xs font-display text-destructive uppercase tracking-wider">Boss Objective</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-destructive/50 via-transparent to-transparent" />
                  </div>
                  <QuestCard
                    quest={bossQuest}
                    onComplete={onCompleteQuest}
                    isCompleting={isCompleting}
                  />
                </div>
              )}

              {quests.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No quests in this mission yet
                </p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
