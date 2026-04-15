# Module Documentation

Technical documentation for every major module in DJ Lab. Use this to understand how each part works before making changes.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Dashboard](#dashboard)
3. [Curriculum](#curriculum)
4. [Practice Log](#practice-log)
5. [Reverse-Engineering Lab](#reverse-engineering-lab)
6. [Artist Sound Maps](#artist-sound-maps)
7. [Artist Taxonomy & Comparison](#artist-taxonomy--comparison)
8. [Shared Components](#shared-components)
9. [Database Layer](#database-layer)
10. [Seed Data](#seed-data)

---

## Authentication

**Files:**
- `src/app/login/page.tsx` — Login page with email/password form
- `src/middleware.ts` — Route protection middleware
- `src/lib/supabase/client.ts` — Browser-side Supabase client
- `src/lib/supabase/server.ts` — Server-side Supabase client
- `src/lib/supabase/middleware.ts` — Middleware Supabase client
- `src/app/auth/callback/route.ts` — Auth callback handler

**How it works:**
- Supabase Auth handles email/password registration and login
- The middleware (`src/middleware.ts`) runs on every request and checks for a valid session
- Unauthenticated users are redirected to `/login`
- The `/login` page and `/auth/callback` route are public (no auth required)
- Three Supabase client variants exist for different contexts: browser components, server components, and middleware

**Key patterns:**
- `createClient()` from `client.ts` for client components (`"use client"`)
- `createClient()` from `server.ts` for server components and server actions
- `createClient()` from `middleware.ts` for the auth middleware

---

## Dashboard

**Files:**
- `src/app/dashboard/page.tsx` — Dashboard page (server component)

**How it works:**
- Fetches all modules, lessons, and user progress from Supabase in parallel
- Calculates per-phase completion percentages
- Shows: current lesson (first incomplete), last completed lesson, next lesson
- Displays progress bars for each curriculum phase
- Links to resume the current lesson

**Data flow:**
1. Server component queries Supabase for modules, lessons, exercises, and user progress
2. Calculates completion stats in-memory
3. Renders progress bars and lesson cards

---

## Curriculum

**Files:**
- `src/app/curriculum/page.tsx` — Module list page
- `src/app/curriculum/[moduleId]/page.tsx` — Lesson list for a module
- `src/app/curriculum/[moduleId]/[lessonId]/page.tsx` — Lesson detail with exercises
- `src/app/curriculum/[moduleId]/[lessonId]/LessonActions.tsx` — Client component for mark-as-complete buttons

**How it works:**
- Module list shows all 4 phases with completion percentages
- Phase unlocking: Phase N+1 requires 80%+ completion of Phase N (logic in `src/lib/__tests__/progress.test.ts`)
- Lesson detail renders markdown content using `MarkdownContent` component
- Exercises are listed below the lesson with individual completion toggles
- `LessonActions` is a client component that handles the Supabase upsert for completion tracking

**Progression logic:**
- `isPhaseUnlocked(phaseIndex, completionByPhase)` — returns `true` if phase is accessible
- `getNextLesson(lessons, completedIds)` — returns the first incomplete lesson
- Both are tested in `src/lib/__tests__/progress.test.ts`

---

## Practice Log

**Files:**
- `src/app/practice/page.tsx` — Practice log page (list + form)
- `src/app/practice/PracticeList.tsx` — Client component for the practice entry list
- `src/app/practice/PracticeForm.tsx` — Client component for the new entry form

**How it works:**
- Server component fetches existing practice logs from Supabase
- `PracticeList` displays entries sorted by date (newest first)
- `PracticeForm` handles creating new entries with fields: date, BPM, transition type, notes, mistakes
- Transition types: Cut, Fade, EQ Blend, Filter Sweep, Bass Swap, Loop

**Data:**
- Table: `practice_logs`
- RLS: Users can only see/edit their own entries

---

## Reverse-Engineering Lab

**Files:**
- `src/app/lab/page.tsx` — Track list page
- `src/app/lab/new/page.tsx` — New track analysis (wraps TrackForm)
- `src/app/lab/[trackId]/page.tsx` — Track detail (read-only, 17 fields across 6 sections)
- `src/app/lab/[trackId]/edit/page.tsx` — Edit track (wraps TrackForm)
- `src/app/lab/TrackForm.tsx` — Client component for track analysis form

**How it works:**
- List page shows all analyzed tracks with energy rating badge and subgenre
- Detail page displays all 17 analysis fields in read-only mode with an Edit button
- TrackForm handles both create and edit modes
- Energy rating uses a 1–10 visual selector (interactive buttons)

**17 analysis fields (grouped in 6 sections):**
1. **Basics:** track name, artist, BPM, genre, subgenre, energy rating (1–10)
2. **Sound:** reference notes, drums analysis, bassline analysis, groove/swing notes
3. **Structure:** arrangement timeline (in bars), tension/release notes, FX notes
4. **Study:** what to recreate in a study loop, what makes the track distinctive
5. **Connections:** curriculum lesson connections
6. **Legacy:** structure, sound design, mixing notes, what works (from v0.1 schema)

**Data:**
- Table: `track_analyses`
- RLS: Users can only see/edit their own entries

---

## Artist Sound Maps

**Files:**
- `src/app/artists/page.tsx` — Artist list page (with Compare button)
- `src/app/artists/new/page.tsx` — New artist (wraps ArtistForm)
- `src/app/artists/[artistId]/page.tsx` — Artist detail (read-only, traits + taxonomy)
- `src/app/artists/[artistId]/edit/page.tsx` — Edit artist (wraps ArtistForm)
- `src/app/artists/ArtistForm.tsx` — Client component for artist form

**How it works:**
- List page shows all artists with trait summary badges (Drums, Bass, Mix, FX)
- Detail page shows 3 sections: Identity, Production Traits, Mixing Traits
- Detail page also shows Sonic Taxonomy section if taxonomy data exists
- ArtistForm handles both create and edit, including taxonomy rating inputs

**Artist form sections:**
1. **Identity:** name, genre tags, signature sounds, key tracks, similar artists, influenced by
2. **Production Traits:** drum patterns, bass style, sample palette, arrangement tendencies, energy flow, production notes
3. **Mixing Traits:** mixing style, FX techniques
4. **Sonic Taxonomy:** 7 dimensions with 1–5 rating buttons and notes (toggle-able)

**Data:**
- Table: `artist_sound_maps`
- Key columns: `name`, `genre_tags` (text[]), `taxonomy` (JSONB), `summary` (text), plus many text fields for traits
- RLS: Users can only see/edit their own entries

---

## Artist Taxonomy & Comparison

**Files:**
- `src/app/artists/compare/page.tsx` — Comparison page (server component, fetches artists)
- `src/app/artists/compare/CompareClient.tsx` — Client component for comparison UI
- `src/types/taxonomy.ts` — TypeScript types and dimension constants
- `src/data/artist-taxonomy.json` — Seed data for 20 artist profiles

**How it works:**
- Server component fetches all artists with taxonomy data from Supabase
- `CompareClient` lets users select 2–6 artists to compare
- Displays color-coded rating bars per dimension (7 dimensions)
- Expandable detail cards show notes for each dimension
- Responsive grid: 1–3 columns based on how many artists are selected

**Taxonomy schema (JSONB):**
```typescript
{
  groove:              { rating: 1-5, notes: string },
  percussion_density:  { rating: 1-5, notes: string },
  low_end:             { rating: 1-5, notes: string },
  arrangement:         { rating: 1-5, notes: string },
  tension:             { rating: 1-5, notes: string },
  vocal_usage:         { rating: 1-5, notes: string },
  energy_profile:      { rating: 1-5, notes: string }
}
```

**Dimension constants** are in `TAXONOMY_DIMENSIONS` (exported from `src/types/taxonomy.ts`) — this is the single source of truth for dimension keys, labels, and scale descriptions.

---

## Shared Components

**Files:**
- `src/components/AppShell.tsx` — Layout wrapper (sidebar + main content area)
- `src/components/Navbar.tsx` — Navigation (desktop sidebar + mobile bottom bar)
- `src/components/ProgressBar.tsx` — Reusable progress bar with percentage
- `src/components/MarkdownContent.tsx` — Markdown renderer for lesson content

**AppShell:** Wraps all authenticated pages. Renders the Navbar and a max-width content area with responsive padding.

**Navbar:** Two layouts:
- Desktop: Fixed left sidebar (256px) with nav links and sign-out button
- Mobile: Fixed bottom bar with nav icons + "More" menu for sign-out

**ProgressBar:** Takes `value` and `max` props, renders a colored bar with percentage text.

**MarkdownContent:** Renders markdown strings as HTML using `react-markdown`. Used for lesson content.

---

## Database Layer

**Files:**
- `src/types/database.ts` — TypeScript types matching the Supabase schema (Row, Insert, Update per table)
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server Supabase client (uses cookies)
- `src/lib/supabase/middleware.ts` — Middleware Supabase client
- `supabase/migrations/` — SQL migration files

**Pattern:** Each page creates a Supabase client and queries directly. There is no ORM or data access layer — queries are inline in page components.

**Migrations:**
1. `00001_initial_schema.sql` — All base tables, RLS policies, auto-profile trigger
2. `00002_expand_track_and_artist.sql` — Added columns for expanded track analysis and artist sound maps
3. `00003_add_artist_taxonomy.sql` — Added `taxonomy` (JSONB) and `summary` (text) to artist_sound_maps

**Adding a new migration:** Create `supabase/migrations/0000N_description.sql`, write your SQL, run it in Supabase SQL Editor, and update `src/types/database.ts`.

---

## Seed Data

**Files:**
- `src/data/seed-curriculum.json` — All 39 lessons and 39 exercises across 4 phases
- `src/data/seed.ts` — Script that converts the JSON to SQL INSERT statements
- `src/data/artist-taxonomy.json` — 20 artist profiles with taxonomy ratings

**Curriculum seed format:**
```json
{
  "modules": [
    {
      "title": "Phase Name",
      "description": "...",
      "category": "...",
      "order_index": 1,
      "icon": "emoji",
      "lessons": [
        {
          "title": "Lesson Title",
          "description": "...",
          "content_md": "## Objective\n\n...",
          "order_index": 1,
          "exercises": [{ "title": "...", "description": "...", "order_index": 1 }]
        }
      ]
    }
  ]
}
```

**To regenerate seed SQL:** `npm run seed:sql` (outputs to `supabase/seed.sql`)

**Artist taxonomy seed** is reference-only — it's not auto-imported into the database. Artists must be created through the app UI and taxonomy data filled in manually (or via a custom insert script).
