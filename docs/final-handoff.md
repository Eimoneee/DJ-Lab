# DJ Lab — Final Project Handoff

> **Audience:** Non-technical solo owner
> **Date:** April 2026
> **Repo:** [github.com/Eimoneee/DJ-Lab](https://github.com/Eimoneee/DJ-Lab)

---

## What Was Built

DJ Lab is a private web app for learning DJing and music production from scratch, focused on house and tech house. It is a step-by-step learning platform with:

- A structured curriculum (39 lessons across 4 phases)
- Practice session logging
- A reverse-engineering lab for studying reference tracks
- Artist sound maps with a 7-dimension sonic taxonomy
- Side-by-side artist comparison
- User login and per-user progress tracking

**Tech stack:** Next.js 14 (React), TypeScript, Tailwind CSS, Supabase (database + auth). Deployable to Vercel.

---

## Current App Status

| Area | Status |
|---|---|
| Core app scaffold | Done |
| Auth (login/signup/logout) | Done |
| Curriculum (4 phases, 39 lessons, 39 exercises) | Done |
| Practice logging (CRUD) | Done |
| Reverse-engineering lab (17-field track analysis) | Done |
| Visual arrangement timeline (BPM/bar math) | Done |
| Artist sound maps (production + mixing traits) | Done |
| Artist taxonomy (7 dimensions, 20 artists profiled) | Done |
| Side-by-side artist comparison UI | Done |
| Dashboard with progress tracking | Done |
| Database schema + Row Level Security | Done |
| Tests (57 passing) | Done |
| Documentation suite | Done |
| Deployment config (Vercel-ready) | Done |
| **Live deployment** | **Not yet deployed** |
| **End-to-end testing against live Supabase** | **Not yet done** |

**Build status:** `npm run build` passes. `npm run validate` (lint + typecheck + 57 tests) passes.

---

## Main Features Completed

### 1. Curriculum System
- 4 phases: DJ Fundamentals → House/Tech House Mixing → Production Basics → Reverse Engineering
- 39 lessons, each with: title, objective, explanation (markdown), exercises, common mistakes, success checklist
- Phases unlock when the previous phase reaches 80%+ completion
- Lesson content stored as structured JSON (`src/data/seed-curriculum.json`)

### 2. Practice Log
- Log sessions with: date, duration (minutes), BPM practiced, transition type, notes, mistakes
- View history, delete entries
- Dashboard shows "Min This Week" (filtered by actual calendar week, Monday–Sunday)

### 3. Reverse-Engineering Lab
- Create track analyses with 17 fields across 6 sections:
  - **Basic info:** BPM, genre, subgenre, energy rating (1–10)
  - **Sound:** drums analysis, bassline analysis, groove/swing notes
  - **Structure:** arrangement timeline (with visual bar display), tension/release, FX notes
  - **Study:** what to recreate, what's distinctive, curriculum connections
- Visual arrangement timeline: enter text like `Intro (16 bars): kicks only` and get color-coded proportional bars with computed real-time durations

### 4. Artist Sound Maps
- Document recurring production traits: drum patterns, bass style, sample palette, arrangement tendencies, energy flow
- Document mixing traits: mixing style, FX techniques
- Identity section: signature sounds, key tracks, similar/influenced-by artists

### 5. Artist Taxonomy
- 7-dimension sonic classification (groove, percussion density, low-end, arrangement, tension, vocal usage, energy profile)
- Each dimension rated 1–5 with notes
- 20 artists profiled with seed data
- Side-by-side comparison UI at `/artists/compare`

### 6. Auth & Security
- Email/password login via Supabase Auth
- Middleware protects all routes except `/login`
- Row Level Security (RLS) on all database tables — each user can only see their own data
- Open redirect protection on auth callback

### 7. Dashboard
- Shows: current lesson, last completed, next up
- Per-phase progress bars with percentage
- Stats: lessons done, total lessons, minutes this week, tracks analyzed

---

## Incomplete Items / Backlog

These features were not built but would be natural next steps:

| Item | Description | Priority |
|---|---|---|
| Audio playback | Play reference tracks directly in the lab (Spotify/SoundCloud embed or file upload) | Medium |
| Email confirmation flow | Currently relies on Supabase's default — no custom confirmation email template | Low |
| Curriculum admin UI | Add/edit/reorder lessons through the app instead of editing JSON | Medium |
| Search/filter | Search across tracks, artists, lessons | Medium |
| Export practice data | CSV/PDF export of practice history | Low |
| Mobile app | Native mobile wrapper (PWA or React Native) | Low |
| Multiple users | The app supports multiple users via RLS, but there's no admin role or shared content | Low |
| CI/CD pipeline | No GitHub Actions — all checks are local only (`npm run validate`) | Medium |
| Supabase typed client | Database types are manually maintained, not auto-generated from schema | Low |
| Taxonomy auto-import | The `artist-taxonomy.json` seed file isn't auto-imported — you paste it into the app manually | Low |

---

## Known Bugs or Risks

| Issue | Severity | Details |
|---|---|---|
| Not tested against live Supabase | Medium | All code was written from analysis. Auth, saves, and queries have not been verified end-to-end against a running Supabase instance. |
| `formatTime` edge case | Low | If a bar-to-seconds calculation produces exactly 59.5 seconds, it could display as `0:60` instead of `1:00`. Unlikely with typical house BPMs. |
| Bar-math assumes 4/4 time | Low | All calculations use 4 beats per bar. Correct for house/tech house, wrong for other time signatures. Appropriate for this app's scope. |
| Supabase clients are untyped | Low | Insert/update payloads are not type-checked at compile time. A typo in a column name wouldn't be caught until runtime. |
| No runtime validation on taxonomy JSONB | Low | The taxonomy field accepts any JSON. A direct API call could insert malformed data. The app UI prevents this, but the database doesn't enforce it. |
| Weekly query uses Monday UTC | Low | "Min This Week" defines the week as Monday 00:00 UTC to Sunday 23:59 UTC. Users in far-west timezones might see a slightly different week boundary. |
| Open redirect validation is basic | Low | Checks that redirect paths start with `/` and not `//`. Does not cover URL-encoded edge cases. Sufficient for this app. |

---

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or later
- A [Supabase](https://supabase.com/) project (free tier is fine)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Eimoneee/DJ-Lab.git
cd DJ-Lab

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Supabase credentials (see "Environment Variables" below)

# 4. Run database migrations (in Supabase SQL Editor, in order)
#    supabase/migrations/00001_initial_schema.sql
#    supabase/migrations/00002_expand_track_and_artist.sql
#    supabase/migrations/00003_add_artist_taxonomy.sql

# 5. Seed the curriculum
npm run seed:sql
# Copy the output from supabase/seed.sql and run it in Supabase SQL Editor

# 6. Start the dev server
npm run dev
# Open http://localhost:3000 and create an account
```

### Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server (auto-reloads on changes) |
| `npm run build` | Production build |
| `npm run validate` | Run lint + typecheck + tests |
| `npm test` | Run the 57 Jest tests |
| `npm run seed:sql` | Regenerate seed SQL from curriculum JSON |

---

## How to Deploy

### Vercel (recommended)

1. Push the repo to GitHub (it's already there)
2. Go to [vercel.com](https://vercel.com) and import the `DJ-Lab` repository
3. Add these environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — your Supabase anon/publishable key
4. Click Deploy
5. Vercel will build and give you a public URL

### After deploying

- Make sure your Supabase project allows requests from the Vercel domain (Supabase → Settings → API → "Additional Redirect URLs" if needed)
- The database migrations and seed data still need to be run in Supabase SQL Editor (this is a one-time setup)

---

## Required Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase dashboard → Settings → API → `anon` / `public` key |

These are the **only** environment variables the app needs. They are safe to expose in the browser (they are public/anon keys — RLS protects the data).

---

## Where Content Lives

| Content | File / Location | Format |
|---|---|---|
| Lesson content (curriculum) | `src/data/seed-curriculum.json` | JSON with markdown inside |
| Artist taxonomy profiles | `src/data/artist-taxonomy.json` | JSON |
| Artist taxonomy reference | `docs/artist-taxonomy.md` | Markdown tables |
| Curriculum map overview | `docs/curriculum-map.md` | Markdown |
| Product spec | `docs/product-spec.md` | Markdown |
| Database schema docs | `docs/database-schema.md` | Markdown |
| Debugging help | `docs/debugging-playbook.md` | Markdown |
| AI prompts for changes | `docs/prompt-library.md` | Markdown |
| Module documentation | `docs/modules.md` | Markdown |

**Key principle:** Curriculum lessons and artist taxonomy data are stored as **editable JSON files** in the repo. You change them in the file, regenerate the seed SQL, and paste it into Supabase. No code changes needed to update content.

---

## Where Database Schema Lives

The database is hosted on **Supabase** (PostgreSQL). The schema is defined by three migration files, run in order:

| Migration | What it creates |
|---|---|
| `supabase/migrations/00001_initial_schema.sql` | Core tables: profiles, modules, lessons, exercises, user progress, practice logs, track analyses, artist sound maps. All RLS policies. Auto-profile trigger. |
| `supabase/migrations/00002_expand_track_and_artist.sql` | Adds 17 expanded fields to track_analyses (drums, bassline, groove, FX, etc.) and production/mixing trait fields to artist_sound_maps. |
| `supabase/migrations/00003_add_artist_taxonomy.sql` | Adds `taxonomy` (JSONB) and `summary` (text) columns to artist_sound_maps. |

**To view or modify the live database:** Go to your Supabase project → Table Editor.

**To add a new column or table:** Create a new migration file (e.g., `00004_your_change.sql`), run it in Supabase SQL Editor, and update `src/types/database.ts`.

---

## How Auth Works

1. **Login page** (`/login`): User enters email + password. Supabase handles the authentication.
2. **Signup**: Same page, toggle to "Sign Up". Supabase creates the account. If auto-confirm is enabled in your Supabase project, the user goes straight to the dashboard. Otherwise, they get a confirmation email.
3. **Session management**: Supabase stores the session in browser cookies. The middleware (`src/middleware.ts`) refreshes the session on every request.
4. **Route protection**: The middleware runs on every page load. If the user is not logged in, they are redirected to `/login`. The only unprotected route is `/login` itself.
5. **Auth callback** (`/auth/callback`): Handles the email confirmation redirect from Supabase. Includes open-redirect protection.
6. **Logout**: The Navbar has a "Sign Out" link that calls Supabase's sign-out and redirects to `/login`.

**Row Level Security (RLS):** Every database table has policies that ensure:
- Curriculum content (modules, lessons, exercises) is readable by any logged-in user
- User-specific data (progress, practice logs, track analyses, artist maps) is only accessible by the user who created it

---

## How Progress Tracking Works

1. **Lesson completion**: On each lesson page, there's a "Mark as Complete" button. Clicking it inserts a row into `user_lesson_progress`. Clicking again ("Undo") deletes the row.
2. **Exercise completion**: Each exercise has a checkbox. State is stored in `user_exercise_progress`.
3. **Phase unlocking**: The dashboard computes completion percentage per module. A phase (module) unlocks when the previous phase reaches 80%+ completion. Phase 1 (DJ Fundamentals) is always unlocked.
4. **Dashboard stats**: Shows total lessons completed, total available, minutes practiced this week (Monday–Sunday UTC), and tracks analyzed.

**Data flow:** Button click → Supabase insert/delete → UI updates only after database confirms success → Page refresh shows persisted state.

---

## How to Edit Curriculum Content

You do **not** need to touch any code to edit lesson content.

### To edit an existing lesson:
1. Open `src/data/seed-curriculum.json`
2. Find the lesson you want to edit
3. Change the `title`, `description`, `content_md` (markdown), or `exercises`
4. Run `npm run seed:sql` to regenerate the SQL
5. Run the generated `supabase/seed.sql` in your Supabase SQL Editor

### To add a new lesson:
1. Open `src/data/seed-curriculum.json`
2. Find the module you want to add to
3. Add a new lesson object (follow the format of existing lessons):
   ```json
   {
     "title": "Your Lesson Title",
     "description": "One-line summary",
     "content_md": "## Objective\n\nWhat to learn...\n\n## Explanation\n\n...",
     "order_index": 12,
     "exercises": [
       { "title": "Exercise Name", "description": "What to do", "order_index": 1 }
     ]
   }
   ```
4. Run `npm run seed:sql` and paste the result into Supabase SQL Editor

### To add a new phase/module:
1. Add a new module object to the top level of `seed-curriculum.json`
2. Give it a unique `id` (e.g., `mod-phase5`), a `title`, `description`, and `order_index`
3. Add lessons inside it
4. Regenerate and re-run the seed SQL

---

## How to Edit Artist Sound Maps

### Through the app:
1. Go to `/artists` in the app
2. Click on an artist → click "Edit"
3. Fill in the fields (production traits, mixing traits, taxonomy ratings)
4. Click "Save"

### Through the reference files:
1. Edit `src/data/artist-taxonomy.json` for structured data (taxonomy ratings, notes, genre tags)
2. Edit `docs/artist-taxonomy.md` for the human-readable reference tables
3. These files are **reference only** — they are not automatically synced to the database. You use them as a source of truth and enter the data through the app UI.

### To add a new artist:
1. Go to `/artists` → click "New Artist"
2. Fill in the name, genre tags, signature sounds, production traits, mixing traits, and taxonomy ratings
3. Save

---

## How to Add New Track Studies

1. Go to `/lab` in the app
2. Click "New Track"
3. Fill in the fields:
   - **Basic:** Track title, artist, BPM, genre, subgenre, energy rating (1–10)
   - **Sound:** Drums analysis, bassline analysis, groove/swing notes
   - **Structure:** Arrangement timeline (e.g., `Intro (16 bars): kicks + hats only`), tension/release, FX
   - **Study:** What to recreate, what's distinctive, curriculum connections
4. Save

The arrangement timeline field accepts free-form text. If you include bar counts in parentheses like `(16 bars)`, the detail page will display a visual color-coded timeline with computed durations based on the track's BPM.

---

## How to Debug Common Issues

See [docs/debugging-playbook.md](debugging-playbook.md) for the full list. Here's the quick version:

| Problem | Fix |
|---|---|
| App won't start | Run `npm install`, check `.env.local` exists with valid Supabase credentials |
| Curriculum is empty | Run `npm run seed:sql`, paste output into Supabase SQL Editor |
| Tables don't exist | Run all 3 migrations in order in Supabase SQL Editor |
| Data not saving | Check browser DevTools → Console for errors. Make sure you're logged in. |
| Progress not updating | Click "Mark as Complete" again and watch the Network tab in DevTools |
| Build fails | Run `npm run validate` locally and fix any reported errors |
| Taxonomy not showing | Edit the artist and fill in the taxonomy ratings |
| Page loads but empty | Check if you're logged in, if migrations are applied, and if the table has data |

**Quick diagnostic checklist:**
1. Is the dev server running? → `npm run dev`
2. Are env vars set? → Check `.env.local`
3. Are migrations applied? → Check Supabase Table Editor
4. Is curriculum seeded? → Check `modules` table has 4 rows
5. Are you logged in? → Check browser cookies
6. Does the build pass? → `npm run validate`

---

## Next Recommended Product Improvements

In rough priority order:

### High Priority
1. **Deploy to Vercel** — The app is ready to deploy but hasn't been deployed yet. Takes 5 minutes.
2. **Test end-to-end on live Supabase** — Create an account, complete a lesson, log practice, create track analyses. Verify everything works with real data.
3. **Add CI/CD** — Set up GitHub Actions to run `npm run validate` on every push. Catches broken code before it reaches production.

### Medium Priority
4. **Audio/video embeds in track studies** — Embed Spotify or SoundCloud players so you can listen to reference tracks while studying them.
5. **Curriculum admin UI** — Edit lessons through the app instead of editing JSON files and running SQL.
6. **Search and filter** — Search across tracks, artists, and lessons. Filter by genre, BPM range, energy level.
7. **Practice analytics** — Charts showing practice trends over time (hours per week, BPM progression, most practiced transition types).
8. **Mobile PWA** — Add a web app manifest so it can be installed on your phone's home screen.

### Lower Priority
9. **Export/import data** — Export practice logs, track analyses, and progress as CSV or PDF.
10. **Spaced repetition** — Suggest which lessons to revisit based on when you last practiced them.
11. **Goal setting** — Set weekly practice goals and track progress toward them.
12. **Playlist builder** — Build practice playlists from your track analyses (BPM-ordered, energy-flow ordered, etc.).
13. **Auto-generate typed Supabase client** — Use `supabase gen types` to auto-generate TypeScript types from the live schema.

---

## If I Disappear Tomorrow

This section is for the worst case: you're on your own and need to keep the project running, make changes, or get help.

### The app will keep running
- If deployed to Vercel, the app runs without any maintenance. Vercel hosts it for free (hobby tier) and auto-scales.
- Supabase's free tier keeps your database running. Just don't delete the project.
- There are no background jobs, cron tasks, or servers to maintain. It's a static site that talks to Supabase.

### To make content changes (no coding required)
- **Edit lessons:** Open `src/data/seed-curriculum.json` in GitHub's web editor. Change the text. Run `npm run seed:sql` locally (or ask an AI to do it) and paste the result into Supabase SQL Editor.
- **Edit artist data:** Go to the app → Artists → click an artist → Edit → Save. No code needed.
- **Add track studies:** Go to the app → Lab → New Track → fill in fields → Save. No code needed.

### To make code changes
- The entire codebase is on GitHub at `github.com/Eimoneee/DJ-Lab`
- All documentation is in the `docs/` folder
- `CONTRIBUTING.md` has step-by-step instructions for common tasks
- `docs/prompt-library.md` has ready-to-use prompts you can paste into any AI coding assistant

### To get help from an AI assistant
You can paste any of these prompts into ChatGPT, Claude, Devin, or Cursor and point them at the repo:

- *"Look at this repo: github.com/Eimoneee/DJ-Lab. I want to add a new lesson about filter sweeps to Phase 2. Follow the format in seed-curriculum.json."*
- *"Look at this repo. The app isn't loading. Check docs/debugging-playbook.md and help me figure out what's wrong."*
- *"Look at this repo. I want to deploy it to Vercel. Walk me through it step by step."*

See [docs/prompt-library.md](prompt-library.md) for more.

### To get help from a developer
Share these with any developer you hire:

1. **The repo:** `github.com/Eimoneee/DJ-Lab`
2. **The README:** Has full setup instructions
3. **The docs folder:** Has product spec, schema docs, module docs, and debugging guide
4. **The CONTRIBUTING.md:** Explains how the project is organized and how to make changes
5. **The tests:** Run `npm run validate` to verify nothing is broken

### Critical accounts / credentials
- **GitHub:** Where the code lives. You need your GitHub account to access it.
- **Supabase:** Where the database and auth live. Log in at [supabase.com](https://supabase.com) with the account that created the project. Your project URL is in `.env.local`.
- **Vercel (if deployed):** Where the app is hosted. Log in at [vercel.com](https://vercel.com).

### What NOT to do
- Don't delete the Supabase project — that's your entire database.
- Don't run migrations out of order — always go 00001 → 00002 → 00003.
- Don't push directly to `main` without checking `npm run validate` first.
- Don't share the Supabase service role key (the one labeled "secret" in Supabase settings) — only the `anon`/`publishable` key is safe to expose.

---

## File Reference

| Path | What it is |
|---|---|
| `src/app/` | All pages (routes match folder names) |
| `src/components/` | Shared UI components |
| `src/data/seed-curriculum.json` | All 39 lessons (editable) |
| `src/data/artist-taxonomy.json` | All 20 artist profiles (editable) |
| `src/lib/supabase/` | Database connection helpers |
| `src/lib/bar-math.ts` | BPM/bar calculation utilities |
| `src/types/` | TypeScript type definitions |
| `supabase/migrations/` | Database schema (3 SQL files) |
| `docs/` | All documentation |
| `.env.local` | Your Supabase credentials (not in Git) |
| `package.json` | Dependencies and npm scripts |

---

*This handoff document was generated on April 15, 2026. The app is version 0.3.0 with all features completed, 57 tests passing, and no known blockers to deployment.*
