import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { MissionLogs } from "@/components/MissionLogs";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityLog, Quest, Mission } from "@shared/schema";

export default function AnalyticsPage() {
  const { data: activityLogs = [], isLoading: logsLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
  });

  const { data: quests = [], isLoading: questsLoading } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: missions = [], isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ["/api/missions"],
  });

  const isLoading = logsLoading || questsLoading || missionsLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Analytics & Logs</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      ) : (
        <MissionLogs
          activityLogs={activityLogs}
          quests={quests}
          missions={missions}
        />
      )}
    </div>
  );
}
