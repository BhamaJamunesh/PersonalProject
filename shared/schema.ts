import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Hunter classes
export const hunterClasses = ["Fighter", "Mage", "Assassin", "Healer", "Tank", "Ranger"] as const;
export type HunterClass = typeof hunterClasses[number];

// Users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  hunterName: varchar("hunter_name"),
  hunterClass: varchar("hunter_class").default("Fighter"),
  level: integer("level").default(1).notNull(),
  currentXp: integer("current_xp").default(0).notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
  rank: varchar("rank").default("E").notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quest rarity and status enums
export const questRarities = ["common", "rare", "epic", "legendary"] as const;
export const questStatuses = ["active", "completed", "failed"] as const;

// Quests table
export const quests = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  rarity: varchar("rarity").default("common").notNull(),
  xpReward: integer("xp_reward").default(10).notNull(),
  status: varchar("status").default("active").notNull(),
  missionId: varchar("mission_id"),
  isBossObjective: boolean("is_boss_objective").default(false),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Missions table (groups of quests)
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: integer("difficulty").default(1).notNull(),
  status: varchar("status").default("active").notNull(),
  totalXpReward: integer("total_xp_reward").default(0).notNull(),
  deadline: timestamp("deadline"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily/Weekly Hunts
export const dailyHunts = pgTable("daily_hunts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false),
  isWeekly: boolean("is_weekly").default(false),
  xpReward: integer("xp_reward").default(15).notNull(),
  resetDate: timestamp("reset_date").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skills in the skill tree
export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  category: varchar("category").notNull(),
  xpMultiplier: integer("xp_multiplier").default(0),
  streakBonus: integer("streak_bonus").default(0),
  requiredLevel: integer("required_level").default(1).notNull(),
  prerequisiteSkillId: varchar("prerequisite_skill_id"),
});

// User's unlocked skills
export const userSkills = pgTable("user_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skillId: varchar("skill_id").notNull().references(() => skills.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  rarity: varchar("rarity").default("common").notNull(),
  requirement: jsonb("requirement"),
});

// User's unlocked achievements
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Activity log for analytics
export const activityLog = pgTable("activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(),
  xpGained: integer("xp_gained").default(0),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quests: many(quests),
  missions: many(missions),
  dailyHunts: many(dailyHunts),
  userSkills: many(userSkills),
  userAchievements: many(userAchievements),
  activityLog: many(activityLog),
}));

export const questsRelations = relations(quests, ({ one }) => ({
  user: one(users, { fields: [quests.userId], references: [users.id] }),
  mission: one(missions, { fields: [quests.missionId], references: [missions.id] }),
}));

export const missionsRelations = relations(missions, ({ one, many }) => ({
  user: one(users, { fields: [missions.userId], references: [users.id] }),
  quests: many(quests),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const updateProfileSchema = z.object({
  hunterName: z.string().min(1).max(30),
  hunterClass: z.enum(hunterClasses),
});
export const insertQuestSchema = createInsertSchema(quests).omit({ id: true, createdAt: true });
export const insertMissionSchema = createInsertSchema(missions).omit({ id: true, createdAt: true });
export const insertDailyHuntSchema = createInsertSchema(dailyHunts).omit({ id: true, createdAt: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type DailyHunt = typeof dailyHunts.$inferSelect;
export type InsertDailyHunt = z.infer<typeof insertDailyHuntSchema>;
export type Skill = typeof skills.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type ActivityLog = typeof activityLog.$inferSelect;

// Helper types
export type QuestRarity = typeof questRarities[number];
export type HunterRank = "E" | "D" | "C" | "B" | "A" | "S" | "SS";

// XP requirements per level
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

// XP rewards by rarity
export const XP_BY_RARITY: Record<QuestRarity, number> = {
  common: 15,
  rare: 35,
  epic: 75,
  legendary: 150,
};
