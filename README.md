# DJ Lab

A step-by-step learning platform for beginner DJs and music producers, focused on house and tech house genres. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User Authentication** — Email/password login with Supabase Auth
- **Curriculum Modules** — 4-phase structured curriculum (39 lessons, 39 exercises)
  - Phase 1: DJ Fundamentals (counting bars, beatmatching, EQ, transitions)
  - Phase 2: House & Tech House Mixing (bass swaps, loops, energy management)
  - Phase 3: Production Fundamentals (DAW, drums, arrangement, compression)
  - Phase 4: Reverse Engineering & Artist Study (track analysis, sound maps)
- **Progress Tracking** — Lesson and exercise completion with phase unlocking (80%+ to advance)
- **Practice Log** — Log sessions with date, BPM, transition type, notes, and mistakes
- **Reverse-Engineering Lab** — Analyze tracks: structure, sound design, mixing notes
- **Artist Sound Maps** — Document artist techniques, signature sounds, and key tracks
- **Dashboard** — Current lesson, completed lessons, next up, phase progress bars

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark theme)
- **Auth & Database:** Supabase (PostgreSQL with Row Level Security)
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel-ready

## Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project (free tier works)

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/Eimoneee/DJ-Lab.git
cd DJ-Lab
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file:
   - Copy the contents of `supabase/migrations/00001_initial_schema.sql`
   - Paste and run it in the SQL Editor
3. Seed the curriculum data:
   - Copy the contents of `supabase/seed.sql` (generated from the seed script), or
   - Use the seed script: `npx ts-node --compiler-options '{"module":"commonjs"}' src/data/seed.ts > supabase/seed.sql`
   - Run the generated SQL in the Supabase SQL Editor

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project: **Settings → API**

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account to get started.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |

## Project Structure

```
src/
├── app/
│   ├── login/            # Auth pages
│   ├── dashboard/        # Dashboard with progress overview
│   ├── curriculum/       # Module → Lesson → Exercise pages
│   ├── practice/         # Practice log
│   ├── lab/              # Track analysis (reverse-engineering)
│   └── artists/          # Artist sound maps
├── components/           # Shared UI components
├── data/                 # Seed data (curriculum JSON)
├── lib/
│   ├── supabase/         # Supabase client helpers (server, client, middleware)
│   └── __tests__/        # Unit tests
├── types/                # TypeScript type definitions
└── middleware.ts          # Auth middleware for protected routes
docs/
├── product-spec.md       # Product specification
└── curriculum-map.md     # Full curriculum outline
supabase/
└── migrations/           # Database schema (SQL)
```

## Database Schema

- **modules** — Curriculum phases (4 total)
- **lessons** — Individual lessons with markdown content
- **exercises** — Practical exercises linked to lessons
- **user_lesson_progress** — Tracks lesson completion per user
- **user_exercise_progress** — Tracks exercise completion per user
- **practice_logs** — Practice session entries
- **track_analyses** — Reverse-engineering track breakdowns
- **artist_sound_maps** — Artist technique documentation

All user data is protected by Row Level Security (RLS) — users can only access their own data.

## Progression Logic

- Lessons are completed by clicking "Mark as Complete" on the lesson page
- Exercises are completed individually within each lesson
- Phases unlock when the previous phase reaches 80%+ completion
- The dashboard shows: current lesson, last completed, what's next, and per-phase progress bars

## Deployment

This app is ready to deploy on Vercel:

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

## License

Private project — not for redistribution.
