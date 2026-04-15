# DJ Lab Architecture Map

> A complete technical and plain-English guide to how DJ Lab is built, how the pieces connect, and why each choice was made.

---

## Table of Contents

1. [Frontend Overview](#1-frontend-overview)
2. [Backend Overview](#2-backend-overview)
3. [Auth Flow](#3-auth-flow)
4. [Database Schema Overview](#4-database-schema-overview)
5. [Content System Overview](#5-content-system-overview)
6. [How Lessons Are Loaded](#6-how-lessons-are-loaded)
7. [How Progress Is Saved](#7-how-progress-is-saved)
8. [How Artist Sound Maps Are Stored](#8-how-artist-sound-maps-are-stored)
9. [How Reverse-Engineering Pages Are Structured](#9-how-reverse-engineering-pages-are-structured)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Dependencies and Why They Are Used](#11-dependencies-and-why-they-are-used)

---

## 1. Frontend Overview

**Plain English:** The frontend is everything the user sees and clicks on — the pages, buttons, forms, and navigation. It runs in the browser.

### Framework

DJ Lab uses **Next.js 14** with the **App Router**. Next.js is a React framework that can render pages on the server before sending them to the browser. This means pages load faster because the data is already filled in when the page arrives.

### Rendering Strategy

Almost every page is a **Server Component** — the page code runs on the server, fetches data from Supabase, and sends finished HTML to the browser. This is faster and more secure because database credentials never reach the browser.

Only a few interactive pieces are **Client Components** (marked with `"use client"` at the top of the file):

| Client Component | Why it needs to run in the browser |
|---|---|
| `LessonActions.tsx` | Toggles lesson/exercise completion with a button click |
| `PracticeForm.tsx` | Form with live state (typing, submitting) |
| `PracticeList.tsx` | Delete button with confirmation |
| `TrackForm.tsx` | Large form with many fields and save/error handling |
| `ArtistForm.tsx` | Large form with taxonomy rating buttons |
| `CompareClient.tsx` | Interactive artist selection and comparison |
| `ArrangementTimeline.tsx` | Visual timeline that parses text into color-coded bars |
| `MarkdownContent.tsx` | Renders markdown text to styled HTML |
| `Navbar.tsx` | Active-link highlighting and sign-out button |
| `LoginPage` | Form with email/password state and error messages |

### Layout Structure

```
┌──────────────────────────────────────────┐
│  RootLayout (src/app/layout.tsx)         │
│  - Sets dark theme (class="dark")       │
│  - Loads Inter font                      │
│  - Wraps everything in <html>/<body>     │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  AppShell (src/components/)        │  │
│  │  ┌──────┐ ┌─────────────────────┐ │  │
│  │  │Navbar│ │  Page Content        │ │  │
│  │  │(side)│ │  (max-w-5xl center)  │ │  │
│  │  │      │ │                      │ │  │
│  │  │ 🏠   │ │  Dashboard, Curric., │ │  │
│  │  │ 📚   │ │  Practice, Lab,     │ │  │
│  │  │ 🎧   │ │  Artists pages       │ │  │
│  │  │ 🔬   │ │                      │ │  │
│  │  │ 🎵   │ │                      │ │  │
│  │  └──────┘ └─────────────────────┘ │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

Desktop: Sidebar on the left (fixed, 14rem wide)
Mobile:  Bottom tab bar + hamburger for sign-out
```

### Routing (App Router)

Every folder inside `src/app/` becomes a URL route. Here is the full route map:

```
/                          → Redirects to /dashboard
/login                     → Email/password sign-in or sign-up
/auth/callback             → Handles email confirmation redirect from Supabase
/dashboard                 → Stats, current lesson, progress bars, quick actions
/curriculum                → List of all 4 phases with progress bars
/curriculum/[moduleId]     → Lessons within a phase
/curriculum/[moduleId]/[lessonId] → Single lesson with markdown content + exercises
/practice                  → Practice log: stats, new entry form, session history
/lab                       → List of all track analyses
/lab/new                   → Create a new track analysis
/lab/[trackId]             → Read-only view of a track study
/lab/[trackId]/edit        → Edit an existing track analysis
/artists                   → List of all artist sound maps
/artists/new               → Create a new artist profile
/artists/[artistId]        → Read-only view of an artist sound map
/artists/[artistId]/edit   → Edit an existing artist profile
/artists/compare           → Side-by-side artist taxonomy comparison
```

### Styling

- **Tailwind CSS** for all styling — no custom CSS files (except `globals.css` for base resets)
- **Dark theme** by default (`<html class="dark">`, `bg-gray-950` background)
- **Custom brand color** palette (sky blue tones) defined in `tailwind.config.ts`
- **`@tailwindcss/typography`** plugin for rendering markdown content with proper styling
- Responsive: mobile-first with `sm:` and `md:` breakpoints

---

## 2. Backend Overview

**Plain English:** DJ Lab does not have a separate backend server. Instead, it talks directly to Supabase — a hosted database and authentication service. The Next.js server handles page rendering, and Supabase handles data storage and user accounts.

### Architecture Pattern: Serverless

```
┌─────────────┐       ┌──────────────────┐       ┌──────────────┐
│   Browser    │──────▶│  Next.js Server  │──────▶│   Supabase   │
│  (React UI)  │       │  (Server Comps)  │       │  (PostgreSQL │
│              │◀──────│                  │◀──────│   + Auth)    │
└─────────────┘       └──────────────────┘       └──────────────┘
       │                                                 ▲
       │              (Client Components)                │
       └─────────────────────────────────────────────────┘
              Direct browser-to-Supabase for mutations
```

**How it works:**

1. **Page loads (reads):** The Next.js server renders the page, fetches data from Supabase using a server-side client, and sends finished HTML to the browser. The browser never sees the raw database queries.

2. **User actions (writes):** When a user clicks "Mark Complete" or submits a form, the browser-side JavaScript talks directly to Supabase using the browser client. Supabase's Row Level Security (RLS) policies ensure users can only access their own data.

### Supabase Clients

Three separate Supabase client configurations, each for a different context:

| File | Used By | Purpose |
|---|---|---|
| `src/lib/supabase/server.ts` | Server Components (page.tsx files) | Reads data during server-side rendering. Uses cookies for auth. |
| `src/lib/supabase/client.ts` | Client Components ("use client" files) | Writes data from the browser (form submits, button clicks). |
| `src/lib/supabase/middleware.ts` | Next.js middleware | Refreshes auth session on every request. Redirects unauthenticated users to /login. |

### No Custom API Routes

DJ Lab has no `/api/` routes. All data operations go directly through the Supabase JavaScript client. The only route handler is `/auth/callback/route.ts`, which handles the OAuth/email-confirmation redirect from Supabase.

---

## 3. Auth Flow

**Plain English:** Authentication means verifying who a user is. DJ Lab uses email and password to sign in. Supabase manages the user accounts, passwords, and sessions (staying logged in).

### Sign-Up Flow

```
User fills out email + password on /login
        │
        ▼
Browser calls supabase.auth.signUp()
        │
        ▼
Supabase creates account
        │
        ├── Auto-confirmed? ──▶ Session returned ──▶ Redirect to /dashboard
        │
        └── Needs email confirm? ──▶ "Check your email" message shown
                                           │
                                           ▼
                                    User clicks email link
                                           │
                                           ▼
                                    /auth/callback?code=XYZ
                                           │
                                           ▼
                                    Server exchanges code for session
                                           │
                                           ▼
                                    Validates redirect target is safe
                                    (must start with /, not //)
                                           │
                                           ▼
                                    Redirect to /dashboard
```

### Sign-In Flow

```
User fills out email + password on /login
        │
        ▼
Browser calls supabase.auth.signInWithPassword()
        │
        ├── Success ──▶ Session cookie set ──▶ Redirect to /dashboard
        │
        └── Error ──▶ Error message shown (button re-enables)
```

### Session Persistence (Middleware)

On **every page request**, the Next.js middleware (`src/middleware.ts`) runs:

1. Reads the auth cookies from the request
2. Calls `supabase.auth.getUser()` to verify the session is still valid
3. If valid: passes the request through to the page
4. If invalid: redirects to `/login`
5. Refreshes the cookie if Supabase rotated the session token

The middleware runs on all routes except static assets (images, CSS, JS files).

### Profile Auto-Creation

A PostgreSQL trigger (`handle_new_user`) fires when a new row is inserted into `auth.users`. It automatically creates a matching row in the `profiles` table. This means every signed-up user automatically has a profile without the app needing extra code.

### Security: Open Redirect Protection

The `/auth/callback` route accepts a `next` query parameter to redirect users after login. To prevent attackers from crafting malicious redirect URLs (like `next=@evil.com`), the callback validates that `next`:
- Starts with `/` (relative path)
- Does NOT start with `//` (protocol-relative URL)
- Falls back to `/dashboard` if invalid

---

## 4. Database Schema Overview

**Plain English:** The database is where all the app's data lives — user accounts, lessons, practice logs, track studies, and artist profiles. It uses PostgreSQL, a widely-used relational database, hosted on Supabase.

### Entity-Relationship Diagram

```
┌─────────────┐
│  auth.users  │  (managed by Supabase — email, password, session)
└──────┬───────┘
       │ 1:1
       ▼
┌──────────────┐
│   profiles   │  display_name, avatar_url
└──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   modules    │────▶│   lessons    │────▶│  exercises   │
│ (4 phases)   │ 1:N │ (39 total)   │ 1:N │ (39 total)   │
│              │     │              │     │              │
│ id (text PK) │     │ id (text PK) │     │ id (text PK) │
│ title        │     │ module_id FK │     │ lesson_id FK │
│ description  │     │ title        │     │ title        │
│ category     │     │ description  │     │ description  │
│ order_index  │     │ content_md   │     │ order_index  │
│ icon         │     │ order_index  │     └──────────────┘
└──────────────┘     └──────────────┘

┌─────────────────────┐     ┌─────────────────────────┐
│ user_lesson_progress│     │ user_exercise_progress   │
│                     │     │                          │
│ user_id (uuid FK)   │     │ user_id (uuid FK)        │
│ lesson_id (text FK) │     │ exercise_id (text FK)    │
│ completed (bool)    │     │ completed (bool)         │
│ completed_at        │     │ completed_at             │
│                     │     │                          │
│ UNIQUE(user_id,     │     │ UNIQUE(user_id,          │
│        lesson_id)   │     │        exercise_id)      │
└─────────────────────┘     └─────────────────────────┘

┌─────────────────────┐     ┌─────────────────────────┐
│   practice_logs     │     │   track_analyses        │
│                     │     │                          │
│ id (uuid PK)        │     │ id (uuid PK)            │
│ user_id (uuid FK)   │     │ user_id (uuid FK)       │
│ date                │     │ track_name, artist       │
│ duration_minutes    │     │ bpm, key, genre, subgenre│
│ bpm                 │     │ energy_rating (1-10)     │
│ transition_type     │     │ drums_analysis           │
│ notes, mistakes     │     │ bassline_analysis        │
└─────────────────────┘     │ groove_swing_notes       │
                            │ arrangement_timeline     │
┌─────────────────────┐     │ tension_release          │
│  artist_sound_maps  │     │ fx_notes                 │
│                     │     │ study_loop_ideas         │
│ id (uuid PK)        │     │ distinctive_elements     │
│ user_id (uuid FK)   │     │ curriculum_connections   │
│ name                │     └─────────────────────────┘
│ genre_tags (text[]) │
│ signature_sounds    │
│ drum_patterns       │
│ bass_style          │
│ mixing_traits       │
│ fx_techniques       │
│ taxonomy (jsonb)    │
│ summary             │
└─────────────────────┘
```

### Key Design Decisions

| Decision | Why |
|---|---|
| Content table IDs are `text`, not `uuid` | Curriculum seed data uses human-readable IDs like `mod-phase1` and `les-1-01`. Using `text` lets the seed data define its own IDs without needing UUID generation. |
| User-generated table IDs are `uuid` | Practice logs, track analyses, and artist maps are created by users at runtime. UUIDs are auto-generated with `gen_random_uuid()`. |
| `taxonomy` column is `jsonb` | Artist taxonomy ratings have a flexible structure (7 dimensions, each with rating + notes). JSONB stores this as a single column without needing 14+ extra columns. |
| `genre_tags` is `text[]` | PostgreSQL arrays let artists have multiple genre tags without a separate join table. |

### Row Level Security (RLS)

Every table has RLS enabled. The policies follow a simple pattern:

- **Content tables** (modules, lessons, exercises): Any authenticated user can **read**. No user can write (content is seeded via SQL).
- **User data tables** (progress, practice logs, tracks, artists): Users can only **read, insert, update, and delete their own rows**. The policy checks `auth.uid() = user_id` on every operation.

This means even if someone tried to craft a malicious API call, the database itself would reject access to another user's data.

### Migrations

Three migration files, run in order:

1. **`00001_initial_schema.sql`** — Creates all tables, RLS policies, and the auto-profile trigger
2. **`00002_expand_track_and_artist.sql`** — Adds detailed analysis fields to `track_analyses` and production/mixing trait columns to `artist_sound_maps`
3. **`00003_add_artist_taxonomy.sql`** — Adds the `taxonomy` (JSONB) and `summary` columns to `artist_sound_maps`

---

## 5. Content System Overview

**Plain English:** "Content" means the lesson text, exercises, and curriculum structure. This is the educational material the user learns from. It is not stored in files that the app reads at runtime — it lives in the database.

### Content Lifecycle

```
seed-curriculum.json  ──▶  seed.ts  ──▶  SQL INSERT statements  ──▶  Supabase database
     (source)            (generator)        (paste into SQL           (where the app
                                             Editor)                  reads from)
```

1. **Source of truth:** `src/data/seed-curriculum.json` — a large JSON file containing all 4 modules, 39 lessons (with full markdown content), and 39 exercises.

2. **SQL generator:** `src/data/seed.ts` — a TypeScript script that reads the JSON and outputs SQL `INSERT` statements. Run it with `npm run seed:sql`.

3. **Database:** The generated SQL is pasted into the Supabase SQL Editor. Once inserted, the app reads directly from the database tables.

### Lesson Content Format

Each lesson's `content_md` field contains markdown text. This is rendered in the browser by the `MarkdownContent` component using `react-markdown` and styled with the Tailwind Typography plugin.

Example lesson content structure in the JSON:
```json
{
  "id": "les-1-01",
  "module_id": "mod-phase1",
  "title": "Counting Bars",
  "description": "Learn to count bars in 4/4 time",
  "content_md": "## What is a Bar?\n\nA **bar** (also called a measure) is...",
  "order_index": 1
}
```

### Artist Taxonomy Data

Separately, `src/data/artist-taxonomy.json` contains pre-built profiles for 20 artists with their 7-dimension sonic ratings. This data is reference material — users create their own artist profiles through the app's UI, and can optionally import this data via SQL.

---

## 6. How Lessons Are Loaded

**Plain English:** When you open a lesson, the server fetches the lesson text, its exercises, and your progress from the database — all at the same time to be fast — then builds the page and sends it to your browser.

### Step-by-Step Flow

```
1. User clicks a lesson link
   URL: /curriculum/mod-phase1/les-1-01
              │
              ▼
2. Next.js middleware checks auth
   - Reads session cookie
   - Calls supabase.auth.getUser()
   - If not logged in → redirect to /login
              │
              ▼
3. Server Component runs (LessonPage)
   - Creates server-side Supabase client
   - Fires 5 queries IN PARALLEL (Promise.all):
     a) Lesson row (by lessonId)
     b) Module row (by moduleId, for breadcrumb)
     c) Exercises for this lesson
     d) User's lesson progress (completed or not)
     e) User's exercise progress (which exercises are done)
              │
              ▼
4. Server builds the HTML
   - Renders lesson markdown via MarkdownContent
   - Shows exercise checkboxes (checked if completed)
   - Shows "Mark Complete" button (or "Undo" if already done)
              │
              ▼
5. HTML sent to browser
   - Static content is immediately visible
   - Client Components (LessonActions) hydrate for interactivity
```

### Performance: Parallel Queries

The lesson page needs 5 pieces of data, but none of them depend on each other. Instead of fetching them one-by-one (which would add up the network wait times), they all fire simultaneously with `Promise.all`. This cuts page load time significantly.

The same pattern is used on the curriculum list page (3 parallel queries) and the module page (3 parallel queries).

---

## 7. How Progress Is Saved

**Plain English:** When you click "Mark Complete" on a lesson or check off an exercise, the app saves that to the database immediately. If the save fails, you see an error message and the button goes back to its original state.

### Lesson Completion Flow

```
User clicks "Mark Complete"
        │
        ▼
LessonActions (Client Component) runs:
  1. Sets loading state (button shows "...")
  2. Clears any previous error
  3. Creates browser-side Supabase client
  4. Calls supabase.from("user_lesson_progress").upsert(...)
     - upsert = insert if new, update if exists
     - onConflict: "user_id,lesson_id" (unique constraint)
        │
        ├── Success (no error in result)
        │     │
        │     ▼
        │   Updates local state (isDone = true)
        │   Calls router.refresh() to revalidate server data
        │
        └── Failure (error in result OR catch block)
              │
              ▼
            Shows error message in red text
            Button re-enables (never gets stuck in loading)
            Local state is NOT changed (stays at previous value)
```

### Undo Flow

The same button toggles. If a lesson is already complete, clicking "Undo" calls `.update({ completed: false })` instead of `.upsert(...)`. Same error-handling pattern.

### Exercise Completion

Identical logic to lessons, but writes to `user_exercise_progress` and uses `exercise_id` instead of `lesson_id`. Exercise checkboxes are rendered inline next to each exercise.

### Phase Unlocking

The dashboard calculates phase unlock status at render time (not stored in the database):

```
For each module:
  completed = count of lessons with completed=true for this module
  total = count of lessons in this module
  pct = (completed / total) * 100

Phase N is unlocked if Phase N-1 has pct >= 80
Phase 1 is always unlocked
```

This is a display-only check — it doesn't prevent users from accessing locked phases via direct URL. It's a soft guide, not a hard gate.

---

## 8. How Artist Sound Maps Are Stored

**Plain English:** An artist sound map is a profile of a DJ/producer's recurring style traits. It stores their name, genre tags, production patterns, mixing habits, and a structured "taxonomy" rating across 7 sonic dimensions.

### Data Model

Each artist sound map is a single row in `artist_sound_maps` with these groups of fields:

**Identity:**
- `name` — Artist name (required)
- `genre_tags` — Array of genre labels like `["Tech House", "Minimal"]`
- `signature_sounds` — Free text describing their recognizable sounds
- `key_tracks` — Notable tracks to reference
- `reference_artists` — Similar or influenced-by artists

**Production Traits:**
- `drum_patterns` — How they approach drums
- `bass_style` — Bass sound and patterns
- `sample_palette` — Types of samples they use
- `arrangement_tendencies` — How they structure tracks
- `energy_flow` — How energy moves through their sets/tracks
- `production_notes` — General production observations

**Mixing Traits:**
- `mixing_traits` — How they mix (EQ, transitions, layering)
- `fx_techniques` — Effects usage patterns

**Taxonomy (JSONB):**

The `taxonomy` column stores a structured JSON object with 7 dimensions:

```json
{
  "groove": { "rating": 4, "notes": "Heavy swing, often shuffled hats" },
  "percussion_density": { "rating": 3, "notes": "Mid-density, focused grooves" },
  "low_end": { "rating": 4, "notes": "Deep sub-bass, rolling basslines" },
  "arrangement": { "rating": 3, "notes": "Standard house structure" },
  "tension": { "rating": 2, "notes": "Subtle tension, groove-driven" },
  "vocal_usage": { "rating": 1, "notes": "Mostly instrumental" },
  "energy_profile": { "rating": 3, "notes": "Mid-energy, floor-ready" }
}
```

Each dimension has a `rating` (1–5 scale) and free-text `notes`. The scale labels are defined in `src/types/taxonomy.ts`:

| Dimension | 1 (Low) | 5 (High) |
|---|---|---|
| Groove | Straight | Heavy swing |
| Percussion Density | Sparse | Dense |
| Low-End | Light | Heavy |
| Arrangement | Minimal | Complex |
| Tension Style | Subtle | Dramatic |
| Vocal Usage | None | Prominent |
| Energy Profile | Deep | Peak-time |

### Comparison Feature

The `/artists/compare` page lets users select 2–6 artists and view their taxonomy ratings side-by-side with color-coded bars per dimension. This is a client-side operation — it fetches all the user's artists from Supabase and does the filtering/display in the browser.

---

## 9. How Reverse-Engineering Pages Are Structured

**Plain English:** Reverse-engineering means taking apart a finished track to understand how it was made. Each track study page lets you record detailed observations about a track's drums, bass, arrangement, effects, and more.

### Data Model

A track analysis (`track_analyses` table) has 17 fields organized into 6 sections:

**1. Basic Info:**
- `track_name`, `artist` (required)
- `bpm`, `key`, `genre`, `subgenre`
- `energy_rating` (1–10 scale)

**2. Sound Analysis:**
- `drums_analysis` — Kick, hats, claps, percussion patterns
- `bassline_analysis` — Bass sound and movement
- `groove_swing_notes` — Swing, shuffle, groove feel

**3. Arrangement:**
- `arrangement_timeline` — Free-text timeline parsed into visual blocks (see below)

**4. Dynamics:**
- `tension_release` — How tension builds and releases
- `fx_notes` — Effects usage (reverb, delay, risers, etc.)

**5. Study Notes:**
- `reference_notes` — General observations
- `study_loop_ideas` — What to recreate in a practice loop
- `distinctive_elements` — What makes this track unique

**6. Connections:**
- `curriculum_connections` — Links back to curriculum lessons

### Arrangement Timeline Visualization

The `arrangement_timeline` field stores free-form text like:

```
Intro (16 bars): kicks + hats only
Build (8 bars): bass enters, filter sweep
Drop (32 bars): full groove, all elements
Breakdown (16 bars): pads, vocal chop
Drop 2 (32 bars): full groove + new percussion
Outro (16 bars): elements strip away
```

The `ArrangementTimeline` component (`src/components/ArrangementTimeline.tsx`) parses this text and renders:

1. **Color-coded proportional bar** — Each section gets a colored block sized proportionally to its bar count
2. **Computed real-time durations** — Using the track's BPM and bar-math (`bars * 4 beats * 60 / BPM = seconds`)
3. **Total track duration** — Sum of all sections
4. **Section detail list** — Name, bar count, computed time, and description for each section

The bar-math utilities live in `src/lib/bar-math.ts` and assume 4/4 time (standard for house music).

### Page Structure

```
/lab                 → List page (cards with track name, artist, BPM, energy badge)
/lab/new             → TrackForm in create mode (empty form)
/lab/[trackId]       → Read-only detail view with all 6 sections + arrangement timeline
/lab/[trackId]/edit  → TrackForm in edit mode (pre-filled with existing data)
```

---

## 10. Deployment Architecture

**Plain English:** Deployment means putting the app on the internet so it can be accessed from any device. DJ Lab is designed to run on Vercel (a hosting platform) with Supabase as the database.

### Target Architecture

```
┌─────────────────────────────────┐
│          Vercel (CDN)            │
│                                  │
│  ┌────────────────────────────┐  │
│  │  Next.js Application       │  │
│  │                            │  │
│  │  - Server Components       │  │
│  │  - Static assets (CSS/JS)  │  │
│  │  - Middleware (auth check)  │  │
│  │  - Auth callback route     │  │
│  └─────────────┬──────────────┘  │
└────────────────┼─────────────────┘
                 │ HTTPS
                 ▼
┌────────────────────────────────┐
│        Supabase Cloud          │
│                                │
│  ┌──────────┐  ┌────────────┐  │
│  │ Auth     │  │ PostgreSQL │  │
│  │ Service  │  │ Database   │  │
│  │          │  │            │  │
│  │ - Users  │  │ - Tables   │  │
│  │ - JWT    │  │ - RLS      │  │
│  │ - Email  │  │ - Triggers │  │
│  └──────────┘  └────────────┘  │
└────────────────────────────────┘
```

### Environment Variables

Two environment variables are required for any deployment:

| Variable | What it is | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The public (anon) key for Supabase | Supabase Dashboard → Settings → API |

Both are prefixed with `NEXT_PUBLIC_` because they need to be available in both server and browser contexts. The anon key is safe to expose publicly — it only grants access that RLS policies allow.

### Deployment Steps

1. **Database:** Run the 3 migration SQL files in the Supabase SQL Editor (in order)
2. **Seed data:** Run `npm run seed:sql`, copy the output, paste into the SQL Editor
3. **Vercel:** Connect the GitHub repo to Vercel, set the two environment variables, deploy
4. **Supabase Auth:** Add the Vercel deployment URL to Supabase Auth → URL Configuration → Redirect URLs

### What is NOT currently deployed

- The app has **not yet been deployed to Vercel** (labeled as missing in project-index.md)
- No CI/CD pipeline is configured — builds and tests are run locally
- No custom domain is set up
- No error monitoring (e.g., Sentry) is configured

---

## 11. Dependencies and Why They Are Used

### Production Dependencies

| Package | Version | Why it's used |
|---|---|---|
| `next` | 14.2.21 | Core framework — server-side rendering, file-based routing, middleware, API routes. Chosen for its balance of performance and developer experience. |
| `react` | ^18.3.1 | UI library — components, state management, rendering. Required by Next.js. |
| `react-dom` | ^18.3.1 | React's browser rendering layer. Required by React. |
| `@supabase/supabase-js` | ^2.47.10 | JavaScript client for talking to Supabase (database queries, auth operations). This is the main way the app reads and writes data. |
| `@supabase/ssr` | ^0.5.2 | Server-side rendering helpers for Supabase auth. Handles cookie-based sessions in Next.js middleware and Server Components. Without this, auth wouldn't persist across page loads. |
| `@tailwindcss/typography` | ^0.5.19 | Adds the `prose` CSS classes that style raw HTML from markdown rendering. Without this, lesson content would appear as unstyled plain text. |
| `react-markdown` | ^9.0.1 | Converts markdown strings to React components. Used by `MarkdownContent` to render lesson `content_md` fields. Chosen because it's lightweight and works with React out of the box. |

### Development Dependencies

| Package | Version | Why it's used |
|---|---|---|
| `typescript` | ^5.7.2 | Type checking — catches bugs at compile time. All source code is TypeScript. |
| `tailwindcss` | ^3.4.16 | Utility-first CSS framework. All styling is done with Tailwind classes in JSX. No separate CSS files needed. |
| `postcss` | ^8.4.49 | CSS processing pipeline. Required by Tailwind CSS to transform utility classes into real CSS. |
| `autoprefixer` | ^10.4.20 | Adds browser vendor prefixes to CSS automatically. Ensures styles work across different browsers. |
| `eslint` | ^8.57.1 | Code quality linter. Catches common JavaScript/TypeScript mistakes. |
| `eslint-config-next` | 14.2.21 | ESLint rules specific to Next.js (accessibility, performance, correct usage of Next.js features). |
| `jest` | ^29.7.0 | Test runner. Executes the 57 unit tests for bar-math, progress logic, and save logic. |
| `jest-environment-jsdom` | ^29.7.0 | Simulates a browser environment for tests that need DOM APIs. |
| `ts-jest` | ^29.2.5 | Lets Jest run TypeScript files directly without a separate build step. |
| `@testing-library/jest-dom` | ^6.6.3 | Extra Jest matchers for DOM assertions (e.g., `toBeInTheDocument`). |
| `@testing-library/react` | ^16.1.0 | Utilities for testing React components by simulating user interactions. |
| `@types/node` | ^20.17.10 | TypeScript type definitions for Node.js built-in modules. |
| `@types/react` | ^18.3.12 | TypeScript type definitions for React. |
| `@types/react-dom` | ^18.3.1 | TypeScript type definitions for React DOM. |

### Dependency Philosophy

- **Minimal footprint:** Only 7 production dependencies. No state management library (React state is sufficient), no ORM (Supabase client is enough), no UI component library (Tailwind handles styling).
- **Standard choices:** Every dependency is widely used and well-maintained. No niche or experimental packages.
- **No lock-in:** Supabase is the only external service. The PostgreSQL schema and RLS policies would work with any Supabase-compatible setup.

---

## Appendix: File Index for Developers

For a quick reference of every file in the project and what it does, see [`/docs/project-index.md`](./project-index.md).

For instructions on how to edit content, add features, and debug issues, see [`/docs/final-handoff.md`](./final-handoff.md).

For non-technical owners, see [`/docs/non-technical-owner-guide.md`](./non-technical-owner-guide.md).
