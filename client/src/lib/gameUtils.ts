import type { HunterRank, QuestRarity } from "@shared/schema";

export const XP_PER_LEVEL = 100;

export const RANK_LEVELS: Record<HunterRank, number> = {
  E: 1,
  D: 5,
  C: 10,
  B: 20,
  A: 35,
  S: 50,
  SS: 75,
};

export const XP_BY_RARITY: Record<QuestRarity, number> = {
  common: 15,
  rare: 35,
  epic: 75,
  legendary: 150,
};

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function calculateXpForNextLevel(currentXp: number): number {
  return XP_PER_LEVEL - (currentXp % XP_PER_LEVEL);
}

export function calculateXpProgress(currentXp: number): number {
  return (currentXp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
}

export function getRankFromLevel(level: number): HunterRank {
  if (level >= 75) return "SS";
  if (level >= 50) return "S";
  if (level >= 35) return "A";
  if (level >= 20) return "B";
  if (level >= 10) return "C";
  if (level >= 5) return "D";
  return "E";
}

export function getRankColor(rank: HunterRank): string {
  const colors: Record<HunterRank, string> = {
    E: "text-muted-foreground",
    D: "text-green-500",
    C: "text-primary",
    B: "text-accent",
    A: "text-pink-500",
    S: "text-yellow-500",
    SS: "text-yellow-400",
  };
  return colors[rank];
}

export function getRarityColor(rarity: QuestRarity): string {
  const colors: Record<QuestRarity, string> = {
    common: "border-muted-foreground/50",
    rare: "border-primary rarity-rare",
    epic: "border-accent rarity-epic",
    legendary: "border-yellow-500 rarity-legendary",
  };
  return colors[rarity];
}

export function getRarityBadgeClass(rarity: QuestRarity): string {
  const classes: Record<QuestRarity, string> = {
    common: "bg-muted text-muted-foreground",
    rare: "bg-primary/20 text-primary border border-primary/30",
    epic: "bg-accent/20 text-accent border border-accent/30",
    legendary: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
  };
  return classes[rarity];
}

export function getRarityGlowClass(rarity: QuestRarity): string {
  const classes: Record<QuestRarity, string> = {
    common: "",
    rare: "glow-border-cyan",
    epic: "glow-border-purple",
    legendary: "glow-border-gold",
  };
  return classes[rarity];
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function getTimeUntilReset(isWeekly: boolean): string {
  const now = new Date();
  const resetDate = new Date();
  
  if (isWeekly) {
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    resetDate.setDate(now.getDate() + daysUntilMonday);
    resetDate.setHours(0, 0, 0, 0);
  } else {
    resetDate.setDate(now.getDate() + 1);
    resetDate.setHours(0, 0, 0, 0);
  }
  
  const diff = resetDate.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}
