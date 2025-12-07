import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { NotificationProvider } from "@/components/SystemNotification";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Missions from "@/pages/Missions";
import DailyHuntsPage from "@/pages/DailyHuntsPage";
import SkillsPage from "@/pages/Skills";
import AchievementsPage from "@/pages/Achievements";
import AnalyticsPage from "@/pages/Analytics";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-md bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
            <span className="font-display text-2xl text-primary">H</span>
          </div>
          <p className="text-muted-foreground">Loading your hunter data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Landing />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <NotificationProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full bg-background">
          <AppSidebar user={user} />
          <SidebarInset className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center gap-2 p-4 border-b border-border shrink-0">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="flex-1" />
            </header>
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="max-w-4xl mx-auto">
                <Switch>
                  <Route path="/" component={() => <Home user={user} />} />
                  <Route path="/missions" component={Missions} />
                  <Route path="/daily" component={DailyHuntsPage} />
                  <Route path="/skills" component={() => <SkillsPage user={user} />} />
                  <Route path="/achievements" component={AchievementsPage} />
                  <Route path="/analytics" component={AnalyticsPage} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthenticatedRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
