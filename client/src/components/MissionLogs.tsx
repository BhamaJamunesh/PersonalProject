import { motion } from "framer-motion";
import { Activity, TrendingUp, Target, Zap, Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { ActivityLog, Quest, Mission } from "@shared/schema";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

interface MissionLogsProps {
  activityLogs: ActivityLog[];
  quests: Quest[];
  missions: Mission[];
}

export function MissionLogs({ activityLogs, quests, missions }: MissionLogsProps) {
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const dailyXpData = last7Days.map(day => {
    const dayStart = startOfDay(day);
    const dayLogs = activityLogs.filter(log => {
      const logDate = new Date(log.createdAt!);
      return startOfDay(logDate).getTime() === dayStart.getTime();
    });
    const totalXp = dayLogs.reduce((sum, log) => sum + (log.xpGained || 0), 0);
    return {
      date: format(day, "EEE"),
      xp: totalXp,
    };
  });

  const completedQuests = quests.filter(q => q.status === "completed").length;
  const totalQuests = quests.length;
  const successRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  const completedMissions = missions.filter(m => m.status === "completed").length;
  const totalMissions = missions.length;
  const missionClearance = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

  const totalXpEarned = activityLogs.reduce((sum, log) => sum + (log.xpGained || 0), 0);

  const recentActivity = activityLogs
    .slice(0, 10)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Zap}
          label="Total XP"
          value={totalXpEarned.toLocaleString()}
          color="text-primary"
        />
        <StatCard
          icon={CheckCircle}
          label="Success Rate"
          value={`${successRate}%`}
          color="text-green-500"
        />
        <StatCard
          icon={Target}
          label="Mission Clear"
          value={`${missionClearance}%`}
          color="text-accent"
        />
        <StatCard
          icon={Activity}
          label="Activities"
          value={activityLogs.length.toString()}
          color="text-yellow-500"
        />
      </div>

      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            XP Progress (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyXpData}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(215, 20%, 55%)"
                  tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(215, 20%, 55%)"
                  tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 10%)",
                    border: "1px solid hsl(217, 33%, 17%)",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "hsl(210, 40%, 98%)" }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="hsl(199, 89%, 48%)"
                  strokeWidth={2}
                  fill="url(#xpGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.createdAt!), "MMM d, h:mm a")}
                    </p>
                  </div>
                  {log.xpGained && log.xpGained > 0 && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                      +{log.xpGained} XP
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: typeof Zap; 
  label: string; 
  value: string; 
  color: string; 
}) {
  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="font-display text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
