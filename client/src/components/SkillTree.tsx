import { motion } from "framer-motion";
import { Lock, Zap, Flame, Target, Shield, Swords, Eye, Heart, Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Skill, UserSkill } from "@shared/schema";

interface SkillTreeProps {
  skills: Skill[];
  userSkills: UserSkill[];
  userLevel: number;
  onUnlockSkill?: (skillId: string) => void;
}

const skillIcons: Record<string, typeof Zap> = {
  focus: Brain,
  consistency: Flame,
  precision: Target,
  endurance: Shield,
  power: Swords,
  insight: Eye,
  vitality: Heart,
  mastery: Sparkles,
};

const categoryColors: Record<string, string> = {
  offense: "from-destructive/20 to-orange-500/20 border-destructive/30",
  defense: "from-primary/20 to-cyan-500/20 border-primary/30",
  utility: "from-accent/20 to-purple-500/20 border-accent/30",
  mastery: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
};

export function SkillTree({ skills, userSkills, userLevel, onUnlockSkill }: SkillTreeProps) {
  const unlockedSkillIds = new Set(userSkills.map(us => us.skillId));

  const isSkillUnlocked = (skillId: string) => unlockedSkillIds.has(skillId);
  
  const canUnlockSkill = (skill: Skill) => {
    if (isSkillUnlocked(skill.id)) return false;
    if (userLevel < skill.requiredLevel) return false;
    if (skill.prerequisiteSkillId && !isSkillUnlocked(skill.prerequisiteSkillId)) return false;
    return true;
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "utility";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Skill Tree
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Unlock powerful abilities as you level up
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categorySkills.map((skill) => {
                const isUnlocked = isSkillUnlocked(skill.id);
                const canUnlock = canUnlockSkill(skill);
                const Icon = skillIcons[skill.icon || "mastery"] || Sparkles;

                return (
                  <Tooltip key={skill.id}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={canUnlock ? { scale: 1.02 } : {}}
                        whileTap={canUnlock ? { scale: 0.98 } : {}}
                      >
                        <button
                          onClick={() => canUnlock && onUnlockSkill?.(skill.id)}
                          disabled={!canUnlock}
                          className={`w-full p-4 rounded-md border-2 transition-all text-left ${
                            isUnlocked
                              ? `bg-gradient-to-br ${categoryColors[category] || categoryColors.utility}`
                              : canUnlock
                              ? "border-dashed border-muted-foreground/50 hover:border-primary"
                              : "border-muted opacity-50"
                          }`}
                          data-testid={`skill-node-${skill.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-md ${
                              isUnlocked 
                                ? "bg-background/50" 
                                : "bg-muted"
                            }`}>
                              {isUnlocked ? (
                                <Icon className="w-5 h-5 text-primary" />
                              ) : (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold text-sm ${
                                isUnlocked ? "" : "text-muted-foreground"
                              }`}>
                                {skill.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {skill.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {skill.xpMultiplier && skill.xpMultiplier > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    <Zap className="w-3 h-3 mr-1" />
                                    +{skill.xpMultiplier}% XP
                                  </Badge>
                                )}
                                {skill.streakBonus && skill.streakBonus > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    <Flame className="w-3 h-3 mr-1" />
                                    +{skill.streakBonus} Streak
                                  </Badge>
                                )}
                                {!isUnlocked && (
                                  <Badge variant="secondary" className="text-xs">
                                    Lv. {skill.requiredLevel}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isUnlocked ? (
                        <p>Skill unlocked!</p>
                      ) : canUnlock ? (
                        <p>Click to unlock</p>
                      ) : userLevel < skill.requiredLevel ? (
                        <p>Requires Level {skill.requiredLevel}</p>
                      ) : skill.prerequisiteSkillId ? (
                        <p>Requires prerequisite skill</p>
                      ) : (
                        <p>Cannot unlock yet</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Skills will be unlocked as you progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
