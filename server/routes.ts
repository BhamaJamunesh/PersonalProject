import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertQuestSchema,
  insertMissionSchema,
  insertDailyHuntSchema,
  updateProfileSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/auth/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = updateProfileSchema.parse(req.body);
      const user = await storage.updateProfile(userId, parsed);
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/quests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questList = await storage.getQuests(userId);
      res.json(questList);
    } catch (error) {
      console.error("Error fetching quests:", error);
      res.status(500).json({ message: "Failed to fetch quests" });
    }
  });

  app.get("/api/quests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const quest = await storage.getQuest(req.params.id);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }
      res.json(quest);
    } catch (error) {
      console.error("Error fetching quest:", error);
      res.status(500).json({ message: "Failed to fetch quest" });
    }
  });

  app.post("/api/quests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertQuestSchema.parse({ ...req.body, userId });
      const quest = await storage.createQuest(parsed);
      await storage.logActivity(userId, "quest_created", 0, { questId: quest.id, title: quest.title });
      res.status(201).json(quest);
    } catch (error) {
      console.error("Error creating quest:", error);
      res.status(400).json({ message: "Failed to create quest" });
    }
  });

  app.patch("/api/quests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const quest = await storage.updateQuest(req.params.id, req.body);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }
      res.json(quest);
    } catch (error) {
      console.error("Error updating quest:", error);
      res.status(400).json({ message: "Failed to update quest" });
    }
  });

  app.post("/api/quests/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const quest = await storage.completeQuest(req.params.id);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }
      
      const updatedUser = await storage.updateUserXp(userId, quest.xpReward);
      await storage.updateUserStreak(userId);
      await storage.logActivity(userId, "quest_completed", quest.xpReward, {
        questId: quest.id,
        title: quest.title,
        rarity: quest.rarity,
      });

      if (quest.missionId) {
        const missionData = await storage.getMissionWithQuests(quest.missionId);
        if (missionData) {
          const allComplete = missionData.quests.every((q) => q.status === "completed");
          if (allComplete) {
            await storage.completeMission(quest.missionId);
            await storage.logActivity(userId, "mission_completed", missionData.mission.totalXpReward, {
              missionId: missionData.mission.id,
              title: missionData.mission.title,
            });
          }
        }
      }

      res.json({ quest, user: updatedUser });
    } catch (error) {
      console.error("Error completing quest:", error);
      res.status(400).json({ message: "Failed to complete quest" });
    }
  });

  app.delete("/api/quests/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteQuest(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting quest:", error);
      res.status(400).json({ message: "Failed to delete quest" });
    }
  });

  app.get("/api/missions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const missionList = await storage.getMissions(userId);
      res.json(missionList);
    } catch (error) {
      console.error("Error fetching missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  app.get("/api/missions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const data = await storage.getMissionWithQuests(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching mission:", error);
      res.status(500).json({ message: "Failed to fetch mission" });
    }
  });

  app.post("/api/missions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertMissionSchema.parse({ ...req.body, userId });
      const mission = await storage.createMission(parsed);
      await storage.logActivity(userId, "mission_created", 0, { missionId: mission.id, title: mission.title });
      res.status(201).json(mission);
    } catch (error) {
      console.error("Error creating mission:", error);
      res.status(400).json({ message: "Failed to create mission" });
    }
  });

  app.patch("/api/missions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const mission = await storage.updateMission(req.params.id, req.body);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.json(mission);
    } catch (error) {
      console.error("Error updating mission:", error);
      res.status(400).json({ message: "Failed to update mission" });
    }
  });

  app.delete("/api/missions/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteMission(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting mission:", error);
      res.status(400).json({ message: "Failed to delete mission" });
    }
  });

  app.get("/api/daily-hunts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hunts = await storage.getDailyHunts(userId);
      res.json(hunts);
    } catch (error) {
      console.error("Error fetching daily hunts:", error);
      res.status(500).json({ message: "Failed to fetch daily hunts" });
    }
  });

  app.post("/api/daily-hunts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertDailyHuntSchema.parse({ ...req.body, userId });
      const hunt = await storage.createDailyHunt(parsed);
      res.status(201).json(hunt);
    } catch (error) {
      console.error("Error creating daily hunt:", error);
      res.status(400).json({ message: "Failed to create daily hunt" });
    }
  });

  app.post("/api/daily-hunts/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hunt = await storage.completeDailyHunt(req.params.id);
      if (!hunt) {
        return res.status(404).json({ message: "Daily hunt not found" });
      }
      
      const updatedUser = await storage.updateUserXp(userId, hunt.xpReward);
      await storage.updateUserStreak(userId);
      await storage.logActivity(userId, hunt.isWeekly ? "weekly_hunt_completed" : "daily_hunt_completed", hunt.xpReward, {
        huntId: hunt.id,
        title: hunt.title,
      });

      res.json({ hunt, user: updatedUser });
    } catch (error) {
      console.error("Error completing daily hunt:", error);
      res.status(400).json({ message: "Failed to complete daily hunt" });
    }
  });

  app.get("/api/skills", isAuthenticated, async (req: any, res) => {
    try {
      const skillList = await storage.getSkills();
      res.json(skillList);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.get("/api/user-skills", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userSkillList = await storage.getUserSkills(userId);
      res.json(userSkillList);
    } catch (error) {
      console.error("Error fetching user skills:", error);
      res.status(500).json({ message: "Failed to fetch user skills" });
    }
  });

  app.post("/api/skills/:id/unlock", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userSkill = await storage.unlockSkill(userId, req.params.id);
      await storage.logActivity(userId, "skill_unlocked", 0, { skillId: req.params.id });
      res.status(201).json(userSkill);
    } catch (error) {
      console.error("Error unlocking skill:", error);
      res.status(400).json({ message: "Failed to unlock skill" });
    }
  });

  app.get("/api/achievements", isAuthenticated, async (req: any, res) => {
    try {
      const achievementList = await storage.getAchievements();
      res.json(achievementList);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievementList = await storage.getUserAchievements(userId);
      res.json(userAchievementList);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.get("/api/activity-log", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getActivityLog(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity log:", error);
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });

  app.get("/api/activity-log/range", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      const logs = await storage.getActivityLogByDateRange(userId, startDate, endDate);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity log:", error);
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });

  return httpServer;
}
