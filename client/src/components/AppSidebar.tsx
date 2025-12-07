import { Link, useLocation } from "wouter";
import { 
  Sword, 
  Target, 
  Flame, 
  Sparkles, 
  Trophy, 
  Activity, 
  LogOut,
  User,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@shared/schema";
import { getRankColor } from "@/lib/gameUtils";

interface AppSidebarProps {
  user: UserType;
}

const mainNavItems = [
  { title: "Quests", url: "/", icon: Sword },
  { title: "Missions", url: "/missions", icon: Target },
  { title: "Daily Hunts", url: "/daily", icon: Flame },
];

const progressItems = [
  { title: "Skill Tree", url: "/skills", icon: Sparkles },
  { title: "Achievements", url: "/achievements", icon: Trophy },
  { title: "Analytics", url: "/analytics", icon: Activity },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
            <Sword className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">HUNTER'S</h1>
            <p className="text-xs text-primary font-display">GATE</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-display text-xs uppercase tracking-wider">
            Mission Control
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-display text-xs uppercase tracking-wider">
            Hunter Progress
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {progressItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent/50">
          <Avatar className="h-10 w-10 border border-primary/30">
            <AvatarImage src={user.profileImageUrl || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary font-display">
              {(user.hunterName || user.firstName || "H")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.hunterName || user.firstName || "Hunter"}
            </p>
            <div className="flex items-center gap-1">
              <Badge 
                variant="outline" 
                className={`text-xs ${getRankColor(user.rank as any)} border-current`}
              >
                {user.rank}-Rank
              </Badge>
              <span className="text-xs text-muted-foreground">Lv.{user.level}</span>
            </div>
          </div>
        </div>
        
        <a 
          href="/api/logout"
          className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
