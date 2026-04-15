# DJ Lab — Project Index (Single Source of Truth)

> **Last updated:** April 2026
> **Purpose:** One place to find every link, file, and resource in the DJ Lab project. If you're looking for something, start here.

---

## Project Links

| Resource | Link | Why it matters |
|---|---|---|
| **GitHub repo** | [github.com/Eimoneee/DJ-Lab](https://github.com/Eimoneee/DJ-Lab) | Where all the code lives. Every change goes through here. |
| **Deployment (Vercel)** | **MISSING** — not yet deployed | The app needs to be deployed to Vercel so you can use it from any device. See [How to Deploy](#how-to-deploy) below. |
| **Supabase project** | [tumsjgsruqvnfwleidwv.supabase.co](https://tumsjgsruqvnfwleidwv.supabase.co) | The database and auth system. All user data, lessons, practice logs, and track analyses live here. |
| **Supabase dashboard** | [supabase.com/dashboard](https://supabase.com/dashboard) → select your project | Where you manage the database, view tables, run SQL, and check auth users. Log in with the account that created the project. |

### Admin URLs

| Admin area | Link | What you do here |
|---|---|---|
| Supabase Table Editor | Supabase dashboard → Table Editor | View and manually edit data in the database (users, lessons, practice logs, etc.) |
| Supabase SQL Editor | Supabase dashboard → SQL Editor | Run migrations and seed data. This is where you paste SQL files. |
| Supabase Auth | Supabase dashboard → Authentication | See registered users, reset passwords, configure email settings. |
| Supabase API Settings | Supabase dashboard → Settings → API | Find your project URL and publishable key (needed for `.env.local` and Vercel). |
| GitHub Issues | [github.com/Eimoneee/DJ-Lab/issues](https://github.com/Eimoneee/DJ-Lab/issues) | Track bugs, feature requests, and curriculum changes. Uses structured templates. |
| GitHub Pull Requests | [github.com/Eimoneee/DJ-Lab/pulls](https://github.com/Eimoneee/DJ-Lab/pulls) | Review and merge code changes. |
| Vercel dashboard | **MISSING** — set up after first deploy | Where you'd manage the live deployment, check build logs, and set environment variables. |

---

## Environment Variables

These are the credentials the app needs to connect to Supabase. They go in `.env.local` locally and in Vercel's project settings for production.

| Variable | Value location | Why it matters |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Tells the app where the database is. Without it, nothing loads. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API → `anon` / `public` key | Lets the app talk to Supabase. This is safe to expose in the browser — Row Level Security protects the data. |

The example file is at [`.env.local.example`](https://github.com/Eimoneee/DJ-Lab/blob/main/.env.local.example). Copy it to `.env.local` and fill in the values.

---

## Main Folder Map

```
DJ-Lab/
├── src/                          # All application code
│   ├── app/                      # Pages — folder name = URL path
│   │   ├── login/                # /login — sign in / sign up
│   │   ├── dashboard/            # /dashboard — progress overview + stats
│   │   ├── curriculum/           # /curriculum — module list
│   │   │   └── [moduleId]/       # /curriculum/:id — lessons in a module
│   │   │       └── [lessonId]/   # /curriculum/:id/:id — single lesson + exercises
│   │   ├── practice/             # /practice — practice log (list + form)
│   │   ├── lab/                  # /lab — reverse-engineering lab (track list)
│   │   │   └── [trackId]/        # /lab/:id — single track study (detail + edit)
│   │   ├── artists/              # /artists — artist sound maps (list)
│   │   │   ├── compare/          # /artists/compare — side-by-side taxonomy
│   │   │   └── [artistId]/       # /artists/:id — single artist (detail + edit)
│   │   └── auth/callback/        # /auth/callback — handles email confirmation
│   ├── components/               # Reusable UI pieces shared across pages
│   ├── data/                     # Content files (curriculum, artist taxonomy)
│   ├── lib/                      # Utilities (Supabase clients, bar-math, tests)
│   └── types/                    # TypeScript type definitions
├── docs/                         # All documentation
├── supabase/migrations/          # Database schema (SQL files, run in order)
├── .github/ISSUE_TEMPLATE/       # Issue templates for GitHub
├── .env.local.example            # Template for environment variables
├── package.json                  # Dependencies and npm scripts
└── tailwind.config.ts            # Tailwind CSS configuration (dark theme)
```

**Why this matters:** If you need to find or change something, the folder name tells you where to look. Pages are in `src/app/`, shared UI is in `src/components/`, content data is in `src/data/`, and all documentation is in `docs/`.

---

## Important Files and What Each One Does

### Configuration Files

| File | What it does | Why it matters |
|---|---|---|
| [`package.json`](https://github.com/Eimoneee/DJ-Lab/blob/main/package.json) | Lists all dependencies and defines npm scripts (`dev`, `build`, `validate`, etc.) | This is the control panel for running the app. All commands start here. |
| [`.env.local.example`](https://github.com/Eimoneee/DJ-Lab/blob/main/.env.local.example) | Template for environment variables | Copy this to `.env.local` and add your Supabase credentials. Without it, the app can't connect to the database. |
| [`tailwind.config.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/tailwind.config.ts) | Defines the dark theme, brand colors, and typography plugin | Controls how the entire app looks. The dark color scheme and accent colors are defined here. |
| [`src/middleware.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/middleware.ts) | Auth middleware — runs on every page load | Protects all routes. If you're not logged in, you get redirected to `/login`. This is the gatekeeper. |
| [`jest.config.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/jest.config.ts) | Test runner configuration | Tells Jest how to find and run the 57 tests. |

### Content & Seed Data

| File | What it does | Why it matters |
|---|---|---|
| [`src/data/seed-curriculum.json`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/data/seed-curriculum.json) | All 39 lessons across 4 phases, with markdown content and exercises | **This is the curriculum.** Edit this file to add, change, or remove lessons. No code changes needed. |
| [`src/data/seed.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/data/seed.ts) | Converts the curriculum JSON into SQL insert statements | Run `npm run seed:sql` to generate the SQL, then paste it into Supabase SQL Editor to load the curriculum. |
| [`src/data/artist-taxonomy.json`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/data/artist-taxonomy.json) | All 20 artist profiles with taxonomy ratings, notes, genre tags, and summaries | Reference data for the artist taxonomy system. Not auto-imported — you enter artists through the app UI. |

### Database Schema (Migrations)

| File | What it does | Why it matters |
|---|---|---|
| [`supabase/migrations/00001_initial_schema.sql`](https://github.com/Eimoneee/DJ-Lab/blob/main/supabase/migrations/00001_initial_schema.sql) | Creates all core tables: profiles, modules, lessons, exercises, user progress, practice logs, track analyses, artist sound maps. Sets up Row Level Security. | **Run this first.** Without it, the database is empty and nothing works. |
| [`supabase/migrations/00002_expand_track_and_artist.sql`](https://github.com/Eimoneee/DJ-Lab/blob/main/supabase/migrations/00002_expand_track_and_artist.sql) | Adds 17 detailed analysis fields to track studies and production/mixing traits to artist sound maps. | **Run this second.** Adds the detailed track study and artist trait fields. |
| [`supabase/migrations/00003_add_artist_taxonomy.sql`](https://github.com/Eimoneee/DJ-Lab/blob/main/supabase/migrations/00003_add_artist_taxonomy.sql) | Adds taxonomy (JSONB) and summary columns to artist sound maps. | **Run this third.** Enables the 7-dimension artist classification and comparison features. |

### Supabase Client Helpers

| File | What it does | Why it matters |
|---|---|---|
| [`src/lib/supabase/client.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/lib/supabase/client.ts) | Creates a Supabase client for browser-side code (client components) | Used by interactive forms and buttons that talk to the database from the browser. |
| [`src/lib/supabase/server.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/lib/supabase/server.ts) | Creates a Supabase client for server-side code (server components) | Used by pages that load data before sending HTML to the browser. Most pages use this. |
| [`src/lib/supabase/middleware.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/lib/supabase/middleware.ts) | Creates a Supabase client for the auth middleware | Keeps user sessions alive and checks login status on every page load. |

### Utility Libraries

| File | What it does | Why it matters |
|---|---|---|
| [`src/lib/bar-math.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/lib/bar-math.ts) | BPM/bar calculations: converts bars to seconds, formats time, parses arrangement timelines | Powers the visual arrangement timeline on track study pages. All math assumes 4/4 time (correct for house/tech house). |

### Shared UI Components

| File | What it does | Why it matters |
|---|---|---|
| [`src/components/AppShell.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/components/AppShell.tsx) | Main layout wrapper (sidebar + content area) | Every page is wrapped in this. Controls the overall page structure. |
| [`src/components/Navbar.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/components/Navbar.tsx) | Desktop sidebar + mobile bottom navigation bar | The navigation menu. Shows links to Dashboard, Curriculum, Practice, Lab, Artists, and Sign Out. |
| [`src/components/ProgressBar.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/components/ProgressBar.tsx) | Reusable progress bar with percentage | Used on the dashboard to show per-phase completion. |
| [`src/components/MarkdownContent.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/components/MarkdownContent.tsx) | Renders markdown text as styled HTML | Used on lesson pages to display the lesson content (written in markdown). |
| [`src/components/ArrangementTimeline.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/components/ArrangementTimeline.tsx) | Visual arrangement timeline with color-coded bars | Parses arrangement text, computes real-time durations from BPM, and displays proportional colored blocks per section. |

### Type Definitions

| File | What it does | Why it matters |
|---|---|---|
| [`src/types/database.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/types/database.ts) | TypeScript types for all database tables (Row, Insert, Update) | Keeps the code type-safe. Update this whenever you add or change a database column. |
| [`src/types/taxonomy.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/types/taxonomy.ts) | Types for the 7-dimension taxonomy system + dimension constants | Defines the shape of taxonomy data and the list of dimensions with their labels and scales. |

### Key Page Files

| File | Route | What it does |
|---|---|---|
| [`src/app/login/page.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/login/page.tsx) | `/login` | Sign in and sign up form |
| [`src/app/dashboard/page.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/dashboard/page.tsx) | `/dashboard` | Progress overview, stats, current/next lesson |
| [`src/app/curriculum/page.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/curriculum/page.tsx) | `/curriculum` | Module list with phase progress bars |
| [`src/app/practice/page.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/practice/page.tsx) | `/practice` | Practice log with stats + session history |
| [`src/app/lab/page.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/lab/page.tsx) | `/lab` | Track analysis list |
| [`src/app/artists/page.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/artists/page.tsx) | `/artists` | Artist sound map list |
| [`src/app/artists/compare/CompareClient.tsx`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/artists/compare/CompareClient.tsx) | `/artists/compare` | Side-by-side artist taxonomy comparison |
| [`src/app/auth/callback/route.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/app/auth/callback/route.ts) | `/auth/callback` | Handles email confirmation redirects from Supabase |

---

## Key Documentation

| Document | Link | What it covers | Why it matters |
|---|---|---|---|
| **README** | [`README.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/README.md) | Quick start, features, project structure, database schema, deployment | Start here if you're setting up the project for the first time. |
| **Product Spec** | [`docs/product-spec.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/product-spec.md) | Full product specification — goals, users, features, tech stack | The original blueprint for what was built and why. |
| **Curriculum Map** | [`docs/curriculum-map.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/curriculum-map.md) | All 39 lessons across 4 phases, with descriptions | A human-readable overview of the entire curriculum. |
| **Database Schema** | [`docs/database-schema.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/database-schema.md) | Table definitions, columns, and RLS policies | Explains what data is stored and how it's protected. |
| **Artist Taxonomy** | [`docs/artist-taxonomy.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/artist-taxonomy.md) | All 20 artist profiles with sonic ratings and notes | A human-readable reference for the artist classification system. Editable without code. |
| **Module Documentation** | [`docs/modules.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/modules.md) | Technical docs for every major module (auth, curriculum, lab, etc.) | Explains how each part of the app works under the hood. |
| **Debugging Playbook** | [`docs/debugging-playbook.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/debugging-playbook.md) | Common issues and how to fix them | When something breaks, check here first. |
| **Prompt Library** | [`docs/prompt-library.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/prompt-library.md) | Ready-to-use prompts for AI assistants | Copy-paste these into ChatGPT, Devin, or Cursor to make changes without coding. |
| **Contributing Guide** | [`CONTRIBUTING.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/CONTRIBUTING.md) | How to make changes (add lessons, edit pages, change styles) | Step-by-step instructions for a solo non-technical owner. |
| **Changelog** | [`CHANGELOG.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/CHANGELOG.md) | Version history (what changed and when) | Track what was added or fixed over time. |
| **Final Handoff** | [`docs/final-handoff.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/final-handoff.md) | Complete project handoff for non-technical owner | The "if I disappear tomorrow" guide — how to run, deploy, edit, and maintain the project solo. |
| **Architecture Map** | [`docs/architecture-map.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/architecture-map.md) | Frontend/backend overview, auth flow, database ER diagram, content system, deployment architecture, all dependencies with rationale | A complete technical map of how the app is built — essential for any developer picking up the project. |
| **Roadmap & Next Steps** | [`docs/roadmap-next-steps.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/roadmap-next-steps.md) | Prioritized list of improvements (must-fix, should-improve, nice-to-have) with difficulty estimates and ready-to-use Devin prompts | Your guide for continuing to improve DJ Lab in future sessions. |

---

## Issue Templates

These are structured forms on GitHub that make it easy to file bugs, request features, or propose curriculum changes — even without technical knowledge.

| Template | Link | When to use it |
|---|---|---|
| **Bug Report** | [`bug-report.yml`](https://github.com/Eimoneee/DJ-Lab/blob/main/.github/ISSUE_TEMPLATE/bug-report.yml) | Something is broken or not working as expected |
| **Feature Request** | [`feature-request.yml`](https://github.com/Eimoneee/DJ-Lab/blob/main/.github/ISSUE_TEMPLATE/feature-request.yml) | You want to add something new to the app |
| **Curriculum Change** | [`curriculum-change.yml`](https://github.com/Eimoneee/DJ-Lab/blob/main/.github/ISSUE_TEMPLATE/curriculum-change.yml) | You want to add, edit, or remove a lesson or exercise |

**How to use:** Go to [github.com/Eimoneee/DJ-Lab/issues/new/choose](https://github.com/Eimoneee/DJ-Lab/issues/new/choose), pick a template, and fill in the form.

---

## Tests

The project has 57 automated tests that verify the app's core logic works correctly. Run them with `npm test` or `npm run validate` (which also checks lint and types).

| Test File | Link | What it tests | Test count |
|---|---|---|---|
| **Bar-math tests** | [`src/lib/__tests__/bar-math.test.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/lib/__tests__/bar-math.test.ts) | BPM/bar calculations, time formatting, arrangement timeline parsing, duration aggregation | 22 tests |
| **Progress tests** | [`src/lib/__tests__/progress.test.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/lib/__tests__/progress.test.ts) | Progression logic (phase unlocking at 80%), progress bar math, seed data structure validation | 24 tests |
| **Save logic tests** | [`src/lib/__tests__/save-logic.test.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/lib/__tests__/save-logic.test.ts) | Error handling for lesson completion and practice log saves, prevents silent save failures | 11 tests |

**Why tests matter:** They catch bugs before they reach production. If you (or an AI) make a change and a test fails, something broke that needs to be fixed before deploying.

**CI/CD pipeline:** **MISSING** — there is no automated test runner on GitHub. Tests only run when you manually run `npm run validate` locally. Setting up GitHub Actions to run tests automatically on every push is a recommended next step.

---

## Seed Content

| Content | File | Format | How to use |
|---|---|---|---|
| **Curriculum** (39 lessons, 39 exercises) | [`src/data/seed-curriculum.json`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/data/seed-curriculum.json) | JSON with markdown inside `content_md` fields | Run `npm run seed:sql` to convert to SQL, then paste into Supabase SQL Editor |
| **Seed SQL generator** | [`src/data/seed.ts`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/data/seed.ts) | TypeScript script | Reads the JSON and outputs SQL insert statements |
| **Artist taxonomy** (20 artists) | [`src/data/artist-taxonomy.json`](https://github.com/Eimoneee/DJ-Lab/blob/main/src/data/artist-taxonomy.json) | JSON | Reference data — enter artists through the app UI or use as a copy-paste reference |
| **Artist taxonomy tables** | [`docs/artist-taxonomy.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/artist-taxonomy.md) | Markdown tables | Human-readable version of the same artist data, easy to edit and print |

---

## What's Missing (Explicitly Called Out)

These resources do not exist yet. Each one includes what it would be and why you might want it.

| Missing resource | What it would be | Why it matters | Priority |
|---|---|---|---|
| **Live deployment URL** | A Vercel URL like `dj-lab.vercel.app` | Without this, the app only runs on your local machine. Deploy to Vercel to use it from any device. | **High** |
| **Vercel dashboard** | Admin panel at `vercel.com/dashboard` for managing the deployment | Where you'd check build status, set environment variables for production, and manage the domain. | **High** (created automatically when you deploy) |
| **CI/CD pipeline** | A `.github/workflows/ci.yml` file that runs `npm run validate` on every push | Catches broken code automatically before it can be merged. Currently tests only run when you remember to run them locally. | **Medium** |
| ~~Architecture / design docs~~ | ~~Created~~ → [`docs/architecture-map.md`](https://github.com/Eimoneee/DJ-Lab/blob/main/docs/architecture-map.md) | Now available — full technical architecture with diagrams. | **Done** |
| **Backup strategy** | A scheduled export of Supabase data | If Supabase goes down or you accidentally delete data, you'd have a backup. Supabase has point-in-time recovery on paid plans. | **Low** |
| **Custom domain** | A domain like `djlab.yourdomain.com` | Makes the URL professional and easy to remember. Configure in Vercel after deploying. | **Low** |
| **Error monitoring** | A service like Sentry that reports runtime errors | Tells you when something breaks in production, even if no one reports it. | **Low** |

---

## How to Deploy

The app is not deployed yet. Here's how to do it:

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New" → "Project"
3. Import the `DJ-Lab` repository from GitHub
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → your Supabase publishable key
5. Click "Deploy"
6. Vercel will give you a public URL — **update this document with that URL once deployed**

---

## Quick Reference

```
# Start the app locally
npm run dev

# Check everything works (lint + types + 57 tests)
npm run validate

# Generate curriculum seed SQL
npm run seed:sql

# Production build
npm run build
```

---

*This is the single source of truth for the DJ Lab project. When you add new resources, deploy the app, or create new documentation, update this file so everything stays in one place.*
