import { useQuery, useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { SkillTree } from "@/components/SkillTree";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/components/SystemNotification";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Skill, UserSkill, User } from "@shared/schema";

interface SkillsPageProps {
  user: User;
}

export default function SkillsPage({ user }: SkillsPageProps) {
  const { toast } = useToast();
  const { showNotification } = useNotification();

  const { data: skills = [], isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: userSkills = [], isLoading: userSkillsLoading } = useQuery<UserSkill[]>({
    queryKey: ["/api/user-skills"],
  });

  const unlockSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      return apiRequest("POST", "/api/user-skills", { skillId });
    },
    onSuccess: (_, skillId) => {
      const skill = skills.find(s => s.id === skillId);
      queryClient.invalidateQueries({ queryKey: ["/api/user-skills"] });
      
      if (skill) {
        showNotification({
          type: "achievement",
          title: "Skill Unlocked!",
          message: skill.name,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unlock skill",
        variant: "destructive",
      });
    },
  });

  const isLoading = skillsLoading || userSkillsLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="font-display text-xl font-bold">Skill Tree</h2>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-md" />
      ) : (
        <SkillTree
          skills={skills}
          userSkills={userSkills}
          userLevel={user.level}
          onUnlockSkill={(skillId) => unlockSkillMutation.mutate(skillId)}
        />
      )}
    </div>
  );
}
