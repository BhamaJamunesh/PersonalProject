# Hunter-Level-Up Productivity App - Design Guidelines

## Design Approach
**Reference-Based:** Inspired by anime UI systems (Solo Leveling, hunter anime HUDs) combined with modern productivity tools like Linear and Notion. Focus on dramatic, game-like interfaces with practical functionality.

## Visual Theme & Color Direction
- **Base:** Semi-dark theme (#0a0e1a to #141829 range) with strategic dark overlays
- **Neon Accents:** Electric blue (#00d4ff), cyber purple (#a855f7), neon cyan (#22d3ee)
- **Rank-Based Theming:** Each rank (E→D→C→B→A→S→SS) subtly shifts accent colors
- **Glow Effects:** Liberal use of neon glows, halos, and luminescent borders on interactive elements

## Typography
- **Primary Font:** Orbitron or Rajdhani (futuristic, tech-inspired) via Google Fonts
- **Secondary Font:** Inter for body text and descriptions
- **Hierarchy:**
  - H1 (Page titles/Rank): text-4xl to text-5xl, font-bold, glowing text effects
  - H2 (Mission/Quest headers): text-2xl to text-3xl, font-semibold
  - H3 (Section headers): text-xl, font-medium, uppercase tracking-wide
  - Body: text-sm to text-base
  - Stats/XP numbers: Monospace font (JetBrains Mono), glowing colored text

## Layout System
- **Spacing:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- **Grid:** Primarily dashboard-style layouts with card-based sections
- **Max-width:** max-w-7xl for main content areas
- **Padding:** p-6 to p-8 for cards, p-4 for compact elements

## Core Components

### Quest Cards
- Bordered cards with rarity-based styling (Common: gray border, Rare: blue glow, Epic: purple glow, Legendary: gold glow)
- Header with quest name + rarity badge
- XP reward display with icon
- Progress indicator (if applicable)
- Checkbox/complete button with satisfying animation
- Floating above background with subtle shadow and glow

### Mission Panels
- Larger card containing grouped quest cards
- Timeline visualization with connecting lines
- "Boss Objective" highlighted with dramatic styling (larger, different border, icon)
- Overall mission progress ring/bar at top
- Difficulty indicator with stars/skulls

### Hunter Profile HUD
- Always-visible stats bar showing: Current Level, XP bar (animated), Rank badge, Active streak
- Floating in top-right or as sidebar panel
- Animated XP filling with particle effects on gains
- Rank badge with pulsing glow effect

### Daily/Weekly Hunt Checklist
- Compact list view with quick-check interactions
- Reset timer countdown displayed prominently
- "Daily Clear Bonus" banner appears when all complete
- Streak counter with flame/lightning icon

### Skill Tree Interface
- Node-based layout with connection lines
- Locked nodes appear dimmed/grayscale
- Active nodes glow with rank color
- Tooltip on hover showing perk details and unlock requirements
- Perk cards show stat improvements clearly

### Mission Logs / Analytics
- Timeline view with completed missions/quests listed chronologically
- Animated bar/line charts with glowing data points
- Stats cards displaying: Success rate %, Total XP earned, Current streak, Mission clearance %
- Filter options for date ranges

### Achievement Gallery
- Grid of badge cards (3-4 columns on desktop)
- Unlocked badges show full-color with glow
- Locked badges appear as silhouettes with "???" and unlock hints
- Achievement name + description + unlock date

### System Notifications
- Floating toast popups appearing from top-right
- Semi-transparent dark background with neon border
- Icon + message + XP/reward display
- Smooth slide-in animation, auto-dismiss after 3-4 seconds
- Different notification types: Quest complete, Level up, Rank promotion, Achievement unlocked

## Animations & Effects
- **XP Gains:** Numbers float up and fade out with particle trails
- **Level Up:** Screen flash + glowing ring expansion + confetti/particle burst
- **Quest Complete:** Checkbox transforms into checkmark with glow pulse
- **Rank Up:** Full-screen overlay with new rank badge animation and title reveal
- **Progress Bars:** Smooth fill animations with glowing leading edge
- **Hover States:** Subtle lift (transform: translateY(-2px)) + increased glow intensity
- **Page Transitions:** Fade with slight blur effect

## Iconography
- Use Heroicons for standard UI elements
- Custom quest icons: Sword, shield, scroll, gem, skull (for boss), star (for achievements)
- Rarity indicators: Star outlines (Common: 1, Rare: 2, Epic: 3, Legendary: 4)
- Status icons: Lightning bolt (streak), trophy (achievement), flame (daily bonus)

## Images
No hero image required. This is a dashboard application focused on interactive panels and HUD elements. Background should feature subtle animated gradient or particle field effect for depth.

## Key Interactions
- Quest creation modal: Full-screen overlay with form, rarity selector with visual previews
- Mission builder: Drag-and-drop quest cards into mission container
- Skill tree nodes: Click to unlock (if eligible) with satisfying unlock animation
- Achievement cards: Click for detailed view with unlock criteria and rarity tier

## Responsive Behavior
- Desktop: Multi-column dashboard layout (2-3 columns)
- Tablet: 2-column with collapsible sidebar
- Mobile: Single column, stack all elements, fixed bottom nav with quick actions

This design creates an immersive hunter experience where every interaction feels rewarding and progress is always visible through dramatic, game-inspired visual feedback.