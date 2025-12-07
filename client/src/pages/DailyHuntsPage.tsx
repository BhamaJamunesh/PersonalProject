import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Flame, Plus, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DailyHunts } from "@/components/DailyHunts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/components/SystemNotification";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { DailyHunt } from "@shared/schema";

const huntSchema = z.object({
  title: z.string().min(1, "Hunt title is required").max(100),
  isWeekly: z.boolean(),
  xpReward: z.number().min(5).max(100),
});

type HuntFormData = z.infer<typeof huntSchema>;

export default function DailyHuntsPage() {
  const { toast } = useToast();
  const { showNotification } = useNotification();
  const [open, setOpen] = useState(false);

  const { data: hunts = [], isLoading } = useQuery<DailyHunt[]>({
    queryKey: ["/api/daily-hunts"],
  });

  const form = useForm<HuntFormData>({
    resolver: zodResolver(huntSchema),
    defaultValues: {
      title: "",
      isWeekly: false,
      xpReward: 15,
    },
  });

  const createHuntMutation = useMutation({
    mutationFn: async (data: HuntFormData) => {
      const now = new Date();
      let resetDate: Date;
      if (data.isWeekly) {
        const dayOfWeek = now.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek;
        resetDate = new Date(now.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000);
      } else {
        resetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      }
      resetDate.setHours(0, 0, 0, 0);
      return apiRequest("POST", "/api/daily-hunts", { ...data, resetDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-hunts"] });
      form.reset();
      setOpen(false);
      showNotification({
        type: "quest_complete",
        title: "Hunt Created!",
        message: form.getValues("isWeekly") ? "Weekly hunt added" : "Daily hunt added",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create hunt",
        variant: "destructive",
      });
    },
  });

  const completeHuntMutation = useMutation({
    mutationFn: async (huntId: string) => {
      return apiRequest("POST", `/api/daily-hunts/${huntId}/complete`, {});
    },
    onSuccess: (_, huntId) => {
      const hunt = hunts.find(h => h.id === huntId);
      queryClient.invalidateQueries({ queryKey: ["/api/daily-hunts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      if (hunt) {
        showNotification({
          type: "streak",
          title: "Hunt Complete!",
          message: hunt.title,
          xp: hunt.xpReward,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete hunt",
        variant: "destructive",
      });
    },
  });

  const dailyHunts = hunts.filter(h => !h.isWeekly);
  const weeklyHunts = hunts.filter(h => h.isWeekly);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="font-display text-xl font-bold">Daily & Weekly Hunts</h2>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-hunt">
              <Plus className="w-4 h-4" />
              New Hunt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Create New Hunt
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createHuntMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hunt Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Morning workout, Read 30 minutes..."
                          {...field}
                          data-testid="input-hunt-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isWeekly"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border border-border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Weekly Hunt</FormLabel>
                        <FormDescription>
                          Resets every Monday instead of daily
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-weekly"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="xpReward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>XP Reward</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={5}
                          max={100}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-xp-reward"
                        />
                      </FormControl>
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
                  <Button type="submit" disabled={createHuntMutation.isPending}>
                    {createHuntMutation.isPending ? "Creating..." : "Create Hunt"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      ) : (
        <DailyHunts
          dailyHunts={dailyHunts}
          weeklyHunts={weeklyHunts}
          onCompleteHunt={(id) => completeHuntMutation.mutate(id)}
          isCompleting={completeHuntMutation.isPending}
        />
      )}

      {hunts.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground">
            Add daily or weekly hunts to build consistent habits
          </p>
        </motion.div>
      )}
    </div>
  );
}
