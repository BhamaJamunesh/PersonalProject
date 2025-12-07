import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Star, TrendingUp, Flame, X } from "lucide-react";
import { useState, useEffect, createContext, useContext, useCallback } from "react";

export type NotificationType = "quest_complete" | "level_up" | "rank_up" | "achievement" | "streak" | "bonus";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  xp?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}

const notificationIcons: Record<NotificationType, typeof Zap> = {
  quest_complete: Zap,
  level_up: TrendingUp,
  rank_up: Star,
  achievement: Trophy,
  streak: Flame,
  bonus: Star,
};

const notificationColors: Record<NotificationType, string> = {
  quest_complete: "border-primary bg-primary/10",
  level_up: "border-yellow-500 bg-yellow-500/10",
  rank_up: "border-accent bg-accent/10",
  achievement: "border-yellow-500 bg-yellow-500/10",
  streak: "border-orange-500 bg-orange-500/10",
  bonus: "border-green-500 bg-green-500/10",
};

const iconColors: Record<NotificationType, string> = {
  quest_complete: "text-primary",
  level_up: "text-yellow-500",
  rank_up: "text-accent",
  achievement: "text-yellow-500",
  streak: "text-orange-500",
  bonus: "text-green-500",
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

function NotificationItem({ 
  notification, 
  onClose 
}: { 
  notification: Notification; 
  onClose: () => void; 
}) {
  const Icon = notificationIcons[notification.type];
  const colorClass = notificationColors[notification.type];
  const iconColor = iconColors[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`pointer-events-auto relative flex items-center gap-3 p-4 rounded-md border-2 backdrop-blur-sm min-w-72 max-w-sm ${colorClass}`}
      data-testid={`notification-${notification.type}`}
    >
      <div className={`w-10 h-10 rounded-full bg-background/50 flex items-center justify-center ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-sm">{notification.title}</h4>
        <p className="text-xs text-muted-foreground">{notification.message}</p>
      </div>

      {notification.xp && (
        <div className="font-display font-bold text-primary glow-text-subtle">
          +{notification.xp} XP
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-current origin-left opacity-30"
      />
    </motion.div>
  );
}
