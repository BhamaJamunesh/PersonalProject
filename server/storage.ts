import {
  users,
  quests,
  missions,
  dailyHunts,
  skills,
  userSkills,
  achievements,
  userAchievements,
  activityLog,
  type User,
  type UpsertUser,
  type Quest,
  type InsertQuest,
  type Mission,
  type InsertMission,
  type DailyHunt,
  type InsertDailyHunt,
  type Skill,
  type UserSkill,
  type Achievement,
  type UserAchievement,
  type ActivityLog,
  XP_PER_LEVEL,
  RANK_LEVELS,
  type HunterRank,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateProfile(userId: string, profile: { hunterName: string; hunterClass: string }): Promise<User>;
  updateUserXp(userId: string, xpGained: number): Promise<User>;
  updateUserStreak(userId: string): Promise<User>;

  getQuests(userId: string): Promise<Quest[]>;
  getQuest(id: string): Promise<Quest | undefined>;
  createQuest(quest: InsertQuest): Promise<Quest>;
  updateQuest(id: string, quest: Partial<Quest>): Promise<Quest | undefined>;
  completeQuest(id: string): Promise<Quest | undefined>;
  deleteQuest(id: string): Promise<void>;

  getMissions(userId: string): Promise<Mission[]>;
  getMission(id: string): Promise<Mission | undefined>;
  getMissionWithQuests(id: string): Promise<{ mission: Mission; quests: Quest[] } | undefined>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: string, mission: Partial<Mission>): Promise<Mission | undefined>;
  completeMission(id: string): Promise<Mission | undefined>;
  deleteMission(id: string): Promise<void>;

  getDailyHunts(userId: string): Promise<DailyHunt[]>;
  createDailyHunt(hunt: InsertDailyHunt): Promise<DailyHunt>;
  completeDailyHunt(id: string): Promise<DailyHunt | undefined>;
  resetDailyHunts(userId: string, isWeekly: boolean): Promise<void>;

  getSkills(): Promise<Skill[]>;
  getUserSkills(userId: string): Promise<UserSkill[]>;
  unlockSkill(userId: string, skillId: string): Promise<UserSkill>;

  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;

  getActivityLog(userId: string, limit?: number): Promise<ActivityLog[]>;
  getActivityLogByDateRange(userId: string, startDate: Date, endDate: Date): Promise<ActivityLog[]>;
  logActivity(userId: string, action: string, xpGained: number, details?: any): Promise<ActivityLog>;
}

function calculateRank(level: number): HunterRank {
  const ranks: HunterRank[] = ["SS", "S", "A", "B", "C", "D", "E"];
  for (const rank of ranks) {
    if (level >= RANK_LEVELS[rank]) {
      return rank;
    }
  }
  return "E";
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateProfile(userId: string, profile: { hunterName: string; hunterClass: string }): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({
        hunterName: profile.hunterName,
        hunterClass: profile.hunterClass,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async updateUserXp(userId: string, xpGained: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    let newCurrentXp = user.currentXp + xpGained;
    let newTotalXp = user.totalXp + xpGained;
    let newLevel = user.level;

    while (newCurrentXp >= XP_PER_LEVEL) {
      newCurrentXp -= XP_PER_LEVEL;
      newLevel++;
    }

    const newRank = calculateRank(newLevel);

    const [updated] = await db
      .update(users)
      .set({
        currentXp: newCurrentXp,
        totalXp: newTotalXp,
        level: newLevel,
        rank: newRank,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return updated;
  }

  async updateUserStreak(userId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    let newStreak = user.currentStreak;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastActive || lastActive.getTime() < yesterday.getTime()) {
      newStreak = 1;
    } else if (lastActive.getTime() === yesterday.getTime()) {
      newStreak++;
    }

    const [updated] = await db
      .update(users)
      .set({
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        lastActiveDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return updated;
  }

  async getQuests(userId: string): Promise<Quest[]> {
    return db.select().from(quests).where(eq(quests.userId, userId)).orderBy(desc(quests.createdAt));
  }

  async getQuest(id: string): Promise<Quest | undefined> {
    const [quest] = await db.select().from(quests).where(eq(quests.id, id));
    return quest;
  }

  async createQuest(quest: InsertQuest): Promise<Quest> {
    const [created] = await db.insert(quests).values(quest).returning();
    return created;
  }

  async updateQuest(id: string, quest: Partial<Quest>): Promise<Quest | undefined> {
    const [updated] = await db.update(quests).set(quest).where(eq(quests.id, id)).returning();
    return updated;
  }

  async completeQuest(id: string): Promise<Quest | undefined> {
    const [updated] = await db
      .update(quests)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(quests.id, id))
      .returning();
    return updated;
  }

  async deleteQuest(id: string): Promise<void> {
    await db.delete(quests).where(eq(quests.id, id));
  }

  async getMissions(userId: string): Promise<Mission[]> {
    return db.select().from(missions).where(eq(missions.userId, userId)).orderBy(desc(missions.createdAt));
  }

  async getMission(id: string): Promise<Mission | undefined> {
    const [mission] = await db.select().from(missions).where(eq(missions.id, id));
    return mission;
  }

  async getMissionWithQuests(id: string): Promise<{ mission: Mission; quests: Quest[] } | undefined> {
    const mission = await this.getMission(id);
    if (!mission) return undefined;

    const missionQuests = await db.select().from(quests).where(eq(quests.missionId, id));
    return { mission, quests: missionQuests };
  }

  async createMission(mission: InsertMission): Promise<Mission> {
    const [created] = await db.insert(missions).values(mission).returning();
    return created;
  }

  async updateMission(id: string, mission: Partial<Mission>): Promise<Mission | undefined> {
    const [updated] = await db.update(missions).set(mission).where(eq(missions.id, id)).returning();
    return updated;
  }

  async completeMission(id: string): Promise<Mission | undefined> {
    const [updated] = await db
      .update(missions)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(missions.id, id))
      .returning();
    return updated;
  }

  async deleteMission(id: string): Promise<void> {
    await db.delete(quests).where(eq(quests.missionId, id));
    await db.delete(missions).where(eq(missions.id, id));
  }

  async getDailyHunts(userId: string): Promise<DailyHunt[]> {
    return db.select().from(dailyHunts).where(eq(dailyHunts.userId, userId));
  }

  async createDailyHunt(hunt: InsertDailyHunt): Promise<DailyHunt> {
    const [created] = await db.insert(dailyHunts).values(hunt).returning();
    return created;
  }

  async completeDailyHunt(id: string): Promise<DailyHunt | undefined> {
    const [updated] = await db
      .update(dailyHunts)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(eq(dailyHunts.id, id))
      .returning();
    return updated;
  }

  async resetDailyHunts(userId: string, isWeekly: boolean): Promise<void> {
    await db
      .delete(dailyHunts)
      .where(and(eq(dailyHunts.userId, userId), eq(dailyHunts.isWeekly, isWeekly)));
  }

  async getSkills(): Promise<Skill[]> {
    return db.select().from(skills);
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    return db.select().from(userSkills).where(eq(userSkills.userId, userId));
  }

  async unlockSkill(userId: string, skillId: string): Promise<UserSkill> {
    const [created] = await db
      .insert(userSkills)
      .values({ userId, skillId })
      .returning();
    return created;
  }

  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [created] = await db
      .insert(userAchievements)
      .values({ userId, achievementId })
      .returning();
    return created;
  }

  async getActivityLog(userId: string, limit = 50): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLog)
      .where(eq(activityLog.userId, userId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }

  async getActivityLogByDateRange(userId: string, startDate: Date, endDate: Date): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLog)
      .where(
        and(
          eq(activityLog.userId, userId),
          gte(activityLog.createdAt, startDate),
          lte(activityLog.createdAt, endDate)
        )
      )
      .orderBy(desc(activityLog.createdAt));
  }

  async logActivity(userId: string, action: string, xpGained: number, details?: any): Promise<ActivityLog> {
    const [created] = await db
      .insert(activityLog)
      .values({ userId, action, xpGained, details })
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
