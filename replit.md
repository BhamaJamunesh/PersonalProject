# Hunter's Gate - Productivity RPG Application

## Overview

Hunter's Gate is a gamified productivity application that transforms daily tasks into an RPG-style quest system. Users complete quests to earn XP, level up through hunter ranks (E → D → C → B → A → S → SS), unlock skills, earn achievements, and track their progress through an anime-inspired interface. The application combines the motivational aspects of gaming with practical task management, featuring a dark theme with neon accents reminiscent of hunter anime HUDs (Solo Leveling style).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing
- Custom build script (`script/build.ts`) that bundles both client and server for production deployment

**UI Component System:**
- Shadcn/ui component library (New York style variant) for consistent, accessible UI primitives
- Radix UI primitives for headless, accessible components (dialogs, dropdowns, popovers, etc.)
- Tailwind CSS for utility-first styling with custom design tokens
- Framer Motion for animations and transitions (quest completions, XP gains, level-ups)
- Custom CSS variables for theming with semi-dark background (#0a0e1a to #141829) and neon accent colors (electric blue #00d4ff, cyber purple #a855f7)

**Typography:**
- Google Fonts integration: Orbitron/Rajdhani for display (futuristic headers), Inter for body text, JetBrains Mono for stats/XP numbers
- Font hierarchy defined in design guidelines for consistent visual rhythm

**State Management:**
- TanStack Query (React Query) for server state management, caching, and automatic refetching
- Custom query client with credential-based authentication and configurable 401 handling
- Local component state with React hooks for UI-specific state

**Key Component Architecture:**
- **HunterHUD**: Persistent user profile display showing level, XP progress, rank badge, and streak
- **QuestCard**: Individual task cards with rarity-based styling (common/rare/epic/legendary) and XP rewards
- **MissionPanel**: Grouped quest containers with progress tracking and boss objectives
- **DailyHunts**: Time-limited daily/weekly challenges with reset timers
- **SkillTree**: Prerequisite-based skill unlock system with category grouping
- **AchievementGallery**: Badge collection display with unlock tracking
- **SystemNotification**: Toast-style notifications for quest completions, level-ups, and achievements

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js for RESTful API endpoints
- TypeScript for type safety across client-server boundary
- HTTP server created with Node's built-in `http` module to support potential WebSocket upgrades

**Authentication:**
- Replit Auth integration using OpenID Connect (OIDC) flow
- Passport.js strategy for session-based authentication
- Session management with PostgreSQL-backed session store (`connect-pg-simple`)
- Cookie-based sessions with 1-week TTL, httpOnly and secure flags

**API Design:**
- RESTful endpoints following resource-based routing (`/api/quests`, `/api/missions`, etc.)
- Consistent request/response patterns with JSON payloads
- Error handling with appropriate HTTP status codes
- Request logging middleware tracking method, path, status, and duration

**Business Logic Layer:**
- Storage abstraction (`server/storage.ts`) providing interface for all data operations
- Gamification logic:
  - XP calculation based on quest rarity (common: 15, rare: 35, epic: 75, legendary: 150)
  - Level progression: 100 XP per level
  - Rank advancement tied to specific level thresholds (E→D at level 5, D→C at 10, etc.)
  - Streak tracking with daily activity logging
  - Skill unlock validation (level requirements + prerequisites)

### Data Storage

**Database:**
- PostgreSQL as the primary relational database
- Drizzle ORM for type-safe database queries and schema management
- Connection pooling via `pg` library for efficient database connections

**Schema Design:**
- **users**: Core user profile with XP, level, rank, streaks, and Replit auth data
- **quests**: Individual tasks with title, description, rarity, XP rewards, status, due dates, and mission associations
- **missions**: Grouped quest collections with difficulty ratings, progress tracking, and deadlines
- **dailyHunts**: Time-limited challenges (daily/weekly) with separate XP rewards and completion tracking
- **skills**: Unlockable abilities with categories (offense/defense/utility/mastery), level requirements, and prerequisite chains
- **userSkills**: Junction table tracking which skills each user has unlocked
- **achievements**: Predefined badges with categories, rarity, and unlock requirements
- **userAchievements**: User achievement progress and unlock timestamps
- **activityLog**: Historical record of user actions (quest completions, XP gains) for analytics
- **sessions**: Secure session storage for authentication (managed by connect-pg-simple)

**Data Relationships:**
- One-to-many: User → Quests, User → Missions, User → Daily Hunts
- Many-to-many: Users ↔ Skills (via userSkills), Users ↔ Achievements (via userAchievements)
- One-to-many: Mission → Quests (quests can be grouped under missions)
- Self-referential: Skills → Skills (prerequisite relationships)

### External Dependencies

**Authentication & Session Management:**
- **Replit Auth**: OpenID Connect provider for user authentication
- **Passport.js**: Authentication middleware with OIDC strategy
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **openid-client**: OIDC client library for token management

**Database & ORM:**
- **PostgreSQL**: Primary database (provisioned via DATABASE_URL environment variable)
- **Drizzle ORM**: Type-safe query builder with Zod integration
- **pg**: PostgreSQL client library with connection pooling

**UI Component Libraries:**
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives (20+ component packages)
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Framer Motion**: Animation library for smooth transitions and micro-interactions
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management with Zod validation via @hookform/resolvers

**Utilities:**
- **date-fns**: Date manipulation and formatting (progress tracking, deadlines)
- **zod**: Schema validation for forms and API requests
- **clsx & tailwind-merge**: Utility for conditional class name composition
- **nanoid**: Unique ID generation

**Charts & Analytics:**
- **Recharts**: Chart library for analytics visualizations (XP over time, quest completion rates)

**Development Tools:**
- **Vite Plugins**: Runtime error overlay, cartographer (Replit integration), dev banner
- **ESBuild**: Server-side bundling for production builds
- **TypeScript**: Type checking across entire codebase

**Environment Requirements:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Secret key for session encryption (required)
- `REPL_ID`: Replit workspace identifier (for OIDC)
- `ISSUER_URL`: OIDC issuer URL (defaults to Replit's OIDC endpoint)