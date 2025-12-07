import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, Plus, Filter } from "lucide-react";
import { HunterHUD } from "@/components/HunterHUD";
import { QuestCard } from "@/components/QuestCard";
import { QuestCreator } from "@/components/QuestCreator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/components/SystemNotification";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Quest, User, QuestRarity } from "@shared/schema";
import { XP_BY_RARITY } from "@/lib/gameUtils";

interface HomeProps {
  user: User;
}

export default function Home({ user }: HomeProps) {
  const { toast } = useToast();
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const { data: quests = [], isLoading } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const createQuestMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string; rarity: QuestRarity; dueDate?: Date }) => {
      return apiRequest("POST", "/api/quests", {
        ...data,
        xpReward: XP_BY_RARITY[data.rarity],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      showNotification({
        type: "quest_complete",
        title: "Quest Created!",
        message: "New quest added to your log",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quest",
        variant: "destructive",
      });
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      return apiRequest("POST", `/api/quests/${questId}/complete`, {});
    },
    onSuccess: (_, questId) => {
      const quest = quests.find(q => q.id === questId);
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      if (quest) {
        showNotification({
          type: "quest_complete",
          title: "Quest Completed!",
          message: quest.title,
          xp: quest.xpReward,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete quest",
        variant: "destructive",
      });
    },
  });

  const filteredQuests = quests.filter(quest => {
    if (filter === "active") return quest.status === "active";
    if (filter === "completed") return quest.status === "completed";
    return true;
  });

  const standaloneQuests = filteredQuests.filter(q => !q.missionId);
  const activeCount = quests.filter(q => q.status === "active").length;
  const completedCount = quests.filter(q => q.status === "completed").length;

  return (
    <div className="space-y-6">
      <HunterHUD user={user} />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Sword className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold">Active Quests</h2>
          <Badge variant="outline">{activeCount} active</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden">
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-none"
              data-testid="filter-all"
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("active")}
              className="rounded-none border-x border-border"
              data-testid="filter-active"
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("completed")}
              className="rounded-none"
              data-testid="filter-completed"
            >
              Done
            </Button>
          </div>
          
          <QuestCreator
            onCreateQuest={(data) => createQuestMutation.mutate(data)}
            isCreating={createQuestMutation.isPending}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : standaloneQuests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Sword className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">No Quests Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first quest to begin your hunt
          </p>
          <QuestCreator
            onCreateQuest={(data) => createQuestMutation.mutate(data)}
            isCreating={createQuestMutation.isPending}
          />
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {standaloneQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={(id) => completeQuestMutation.mutate(id)}
                isCompleting={completeQuestMutation.isPending}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
