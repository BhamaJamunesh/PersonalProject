import { motion } from "framer-motion";
import { Sword, Zap, Target, Trophy, Flame, ChevronRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background animated-gradient overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <header className="relative z-10 flex items-center justify-between p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center glow-border-cyan">
            <Sword className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">HUNTER'S GATE</h1>
          </div>
        </div>
        
        <a href="/api/login">
          <Button variant="outline" className="gap-2" data-testid="button-login">
            Enter the Gate
            <ChevronRight className="w-4 h-4" />
          </Button>
        </a>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Level Up Your Life
            </Badge>
            
            <h2 className="font-display text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Rise Through the
              <span className="block text-primary glow-text-subtle">Hunter Ranks</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Transform your daily tasks into epic quests. Earn XP, unlock powerful skills, 
              and become an S-Rank Hunter. Your productivity journey awaits.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/api/login">
                <Button size="lg" className="gap-2 font-display" data-testid="button-start-hunting">
                  <Sword className="w-5 h-5" />
                  Start Hunting
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-border">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-primary">7</p>
                <p className="text-xs text-muted-foreground">Hunter Ranks</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-accent">4</p>
                <p className="text-xs text-muted-foreground">Quest Rarities</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-yellow-500">∞</p>
                <p className="text-xs text-muted-foreground">Possibilities</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full" />
            
            <div className="relative space-y-4">
              <Card className="p-4 border-2 border-primary rarity-rare">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                    <Sword className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Complete Project Documentation</h4>
                      <Badge className="bg-primary/20 text-primary text-xs">Rare</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Mission: Q4 Deliverables</p>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">+35 XP</Badge>
                </div>
              </Card>

              <Card className="p-4 border-2 border-accent rarity-epic">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-accent/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Launch MVP Feature</h4>
                      <Badge className="bg-accent/20 text-accent text-xs">Epic</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Boss Objective</p>
                  </div>
                  <Badge variant="outline" className="text-accent border-accent">+75 XP</Badge>
                </div>
              </Card>

              <Card className="p-4 border-2 border-yellow-500 rarity-legendary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">7-Day Streak Achieved!</h4>
                      <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Legendary</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Achievement Unlocked</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">+150 XP</Badge>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 lg:mt-32"
        >
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4">
              Your Hunter Arsenal
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to dominate your productivity
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={Sword}
              title="Quest System"
              description="Turn tasks into quests with rarity tiers and XP rewards"
              color="text-primary"
            />
            <FeatureCard
              icon={Target}
              title="Mission Builder"
              description="Group quests into missions with boss objectives"
              color="text-accent"
            />
            <FeatureCard
              icon={Flame}
              title="Daily Hunts"
              description="Complete daily challenges for streak bonuses"
              color="text-orange-500"
            />
            <FeatureCard
              icon={Trophy}
              title="Achievements"
              description="Unlock badges and climb the hunter ranks"
              color="text-yellow-500"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <Card className="inline-block p-8 border-2 border-primary/30 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              {["E", "D", "C", "B", "A", "S", "SS"].map((rank, i) => (
                <motion.div
                  key={rank}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`w-10 h-10 rounded-md border-2 flex items-center justify-center font-display font-bold ${
                    i === 6 ? "border-yellow-400 text-yellow-400 glow-border-gold" :
                    i === 5 ? "border-yellow-500 text-yellow-500" :
                    i === 4 ? "border-pink-500 text-pink-500" :
                    i === 3 ? "border-accent text-accent" :
                    i === 2 ? "border-primary text-primary" :
                    i === 1 ? "border-green-500 text-green-500" :
                    "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {rank}
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground">
              Which rank will you achieve?
            </p>
          </Card>
        </motion.div>
      </main>

      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground">
        <p>Ready to begin your hunt?</p>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color 
}: { 
  icon: typeof Sword; 
  title: string; 
  description: string; 
  color: string; 
}) {
  return (
    <Card className="p-6 border border-border hover:border-muted-foreground/50 transition-all group">
      <div className={`w-12 h-12 rounded-md bg-muted flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-display font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
