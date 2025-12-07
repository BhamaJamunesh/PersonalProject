import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { AchievementGallery } from "@/components/AchievementGallery";
import { Skeleton } from "@/components/ui/skeleton";
import type { Achievement, UserAchievement } from "@shared/schema";

export default function AchievementsPage() {
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements = [], isLoading: userAchievementsLoading } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user-achievements"],
  });

  const isLoading = achievementsLoading || userAchievementsLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="font-display text-xl font-bold">Achievements</h2>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-md" />
      ) : (
        <AchievementGallery
          achievements={achievements}
          userAchievements={userAchievements}
        />
      )}
    </div>
  );
}
