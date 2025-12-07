import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Sword, Star, Sparkles, Crown, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { QuestRarity } from "@shared/schema";
import { XP_BY_RARITY } from "@/lib/gameUtils";
import { format } from "date-fns";

const questSchema = z.object({
  title: z.string().min(1, "Quest title is required").max(100),
  description: z.string().max(500).optional(),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  dueDate: z.date().optional(),
});

type QuestFormData = z.infer<typeof questSchema>;

interface QuestCreatorProps {
  onCreateQuest: (data: QuestFormData) => void;
  isCreating?: boolean;
}

const rarityOptions: { value: QuestRarity; label: string; icon: typeof Star; color: string }[] = [
  { value: "common", label: "Common", icon: Star, color: "text-muted-foreground border-muted-foreground/50" },
  { value: "rare", label: "Rare", icon: Sword, color: "text-primary border-primary" },
  { value: "epic", label: "Epic", icon: Sparkles, color: "text-accent border-accent" },
  { value: "legendary", label: "Legendary", icon: Crown, color: "text-yellow-500 border-yellow-500" },
];

export function QuestCreator({ onCreateQuest, isCreating }: QuestCreatorProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: {
      title: "",
      description: "",
      rarity: "common",
    },
  });

  const selectedRarity = form.watch("rarity");

  const onSubmit = (data: QuestFormData) => {
    onCreateQuest(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-create-quest">
          <Plus className="w-4 h-4" />
          New Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Sword className="w-5 h-5 text-primary" />
            Create New Quest
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quest Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter quest objective..."
                      {...field}
                      data-testid="input-quest-title"
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
                      placeholder="Quest details..."
                      className="resize-none"
                      {...field}
                      data-testid="input-quest-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rarity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quest Rarity</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {rarityOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = field.value === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`flex items-center gap-2 p-3 rounded-md border-2 transition-all ${
                            isSelected
                              ? `${option.color} bg-${option.value === "common" ? "muted" : option.value === "rare" ? "primary" : option.value === "epic" ? "accent" : "yellow-500"}/10`
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                          data-testid={`button-rarity-${option.value}`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? option.color.split(" ")[0] : "text-muted-foreground"}`} />
                          <div className="text-left">
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground">+{XP_BY_RARITY[option.value]} XP</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          data-testid="button-due-date"
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
                data-testid="button-cancel-quest"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} data-testid="button-submit-quest">
                {isCreating ? "Creating..." : "Create Quest"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
