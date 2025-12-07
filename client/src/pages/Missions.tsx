import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Calendar, Skull } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MissionPanel } from "@/components/MissionPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/components/SystemNotification";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Mission, Quest } from "@shared/schema";
import { format } from "date-fns";

const missionSchema = z.object({
  title: z.string().min(1, "Mission title is required").max(100),
  description: z.string().max(500).optional(),
  difficulty: z.number().min(1).max(5),
  deadline: z.date().optional(),
});

type MissionFormData = z.infer<typeof missionSchema>;

export default function Missions() {
  const { toast } = useToast();
  const { showNotification } = useNotification();
  const [open, setOpen] = useState(false);

  const { data: missions = [], isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ["/api/missions"],
  });

  const { data: quests = [] } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: 1,
    },
  });

  const createMissionMutation = useMutation({
    mutationFn: async (data: MissionFormData) => {
      return apiRequest("POST", "/api/missions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/missions"] });
      form.reset();
      setOpen(false);
      showNotification({
        type: "quest_complete",
        title: "Mission Created!",
        message: "New mission added to your log",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create mission",
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
      queryClient.invalidateQueries({ queryKey: ["/api/missions"] });
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

  const activeMissions = missions.filter(m => m.status === "active");
  const completedMissions = missions.filter(m => m.status === "completed");

  const getMissionQuests = (missionId: string) => {
    return quests.filter(q => q.missionId === missionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          <h2 className="font-display text-xl font-bold">Missions</h2>
          <Badge variant="outline">{activeMissions.length} active</Badge>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-mission">
              <Plus className="w-4 h-4" />
              New Mission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Create New Mission
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMissionMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter mission objective..."
                          {...field}
                          data-testid="input-mission-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mission details..."
                          className="resize-none"
                          {...field}
                          data-testid="input-mission-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Difficulty</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Skull
                              key={i}
                              className={`w-4 h-4 ${i < field.value ? "text-destructive" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          data-testid="slider-difficulty"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deadline (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              data-testid="button-deadline"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMissionMutation.isPending}>
                    {createMissionMutation.isPending ? "Creating..." : "Create Mission"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {missionsLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-md" />
          ))}
        </div>
      ) : activeMissions.length === 0 && completedMissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">No Missions Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create a mission to group related quests together
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {activeMissions.map((mission) => (
              <MissionPanel
                key={mission.id}
                mission={mission}
                quests={getMissionQuests(mission.id)}
                onCompleteQuest={(id) => completeQuestMutation.mutate(id)}
                isCompleting={completeQuestMutation.isPending}
              />
            ))}
          </AnimatePresence>

          {completedMissions.length > 0 && (
            <>
              <div className="flex items-center gap-2 pt-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Completed ({completedMissions.length})
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <AnimatePresence mode="popLayout">
                {completedMissions.map((mission) => (
                  <MissionPanel
                    key={mission.id}
                    mission={mission}
                    quests={getMissionQuests(mission.id)}
                    onCompleteQuest={(id) => completeQuestMutation.mutate(id)}
                    isCompleting={completeQuestMutation.isPending}
                  />
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      )}
    </div>
  );
}
