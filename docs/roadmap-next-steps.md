# DJ Lab — Roadmap & Next Steps

> **Audience:** Non-technical solo owner continuing the project in future sessions
> **Last updated:** April 2026
> **How to use this doc:** Pick items from Priority 1 first. For each item, copy the "Prompt for Devin" into a new Devin session (or any AI coding assistant) and point it at this repo.

---

## Priority 1: Must-Fix Now

These are blockers or risks that should be resolved before using the app regularly.

---

### 1.1 Deploy to Vercel

| | |
|---|---|
| **Why it matters** | The app only runs on your computer right now. Without deploying, you can't use it from your phone, another device, or share it with anyone. This is the single biggest gap. |
| **Category** | Engineering |
| **Estimated difficulty** | Easy (10–15 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Deploy this Next.js app to Vercel. The Supabase project URL is in .env.local.
After deploying, add the Vercel URL to Supabase Auth → URL Configuration → Redirect URLs.
Then update docs/project-index.md to replace the "MISSING" deployment link with the real URL.
```

---

### 1.2 Test End-to-End Against Live Supabase

| | |
|---|---|
| **Why it matters** | All the code was written from analysis — it has never been tested against a real running database. There could be issues with auth, data saving, or queries that only show up with real data. Until this is done, you can't be confident the app works. |
| **Category** | Engineering |
| **Estimated difficulty** | Easy–Medium (30–60 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Run the app locally against the live Supabase instance. Test these flows end-to-end:
1. Sign up a new user
2. Sign in with that user
3. Seed the curriculum (npm run seed:sql → paste into Supabase SQL Editor)
4. Complete a lesson and verify it persists after page refresh
5. Log a practice session and verify it appears in the dashboard "Min This Week" stat
6. Create a track analysis with an arrangement timeline and verify the visual timeline renders
7. Create an artist sound map with taxonomy ratings and verify the comparison page works
8. Sign out and verify redirect to login

Record yourself testing and report any bugs found.
The Supabase credentials are in .env.local.
```

---

### 1.3 Set Up CI/CD (GitHub Actions)

| | |
|---|---|
| **Why it matters** | Right now, the only way to check if code is broken is to run `npm run validate` on your computer. If you or an AI assistant pushes broken code, there's no safety net. CI runs the checks automatically on every push so broken code never reaches the live app. |
| **Category** | Engineering |
| **Estimated difficulty** | Easy (15–20 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Set up a GitHub Actions CI pipeline that runs on every push and pull request.
It should run: npm ci, npm run lint, npm run typecheck, npm test.
Use Node.js 18. Put the workflow file at .github/workflows/ci.yml.
Make sure the workflow passes on the current codebase.
```

---

### 1.4 Fix the "Architecture Docs Missing" Label in Project Index

| | |
|---|---|
| **Why it matters** | The project index (`docs/project-index.md`) still labels architecture docs as "MISSING" even though `docs/architecture-map.md` was just created. This is a small inaccuracy that could confuse someone reading the project index as their starting point. |
| **Category** | Content |
| **Estimated difficulty** | Trivial (2 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

In docs/project-index.md, the "Architecture / Design Docs" row says "MISSING".
Update it to link to docs/architecture-map.md with a description of what it covers.
Also add docs/roadmap-next-steps.md to the documentation table.
```

---

## Priority 2: Should Improve Soon

These make the app significantly more useful but aren't blocking basic functionality.

---

### 2.1 Audio/Video Embeds in Track Studies

| | |
|---|---|
| **Why it matters** | When you're reverse-engineering a track, you need to listen to it while writing notes. Right now you have to switch between the app and Spotify/SoundCloud/YouTube manually. Embedding a player directly on the track study page would make the workflow much smoother. |
| **Category** | Product + Engineering |
| **Estimated difficulty** | Medium (1–2 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add an optional "reference_url" field to track analyses (track_analyses table).
On the track study detail page (/lab/[trackId]), if a URL is provided:
- If it's a Spotify link, embed the Spotify player iframe
- If it's a SoundCloud link, embed the SoundCloud player iframe
- If it's a YouTube link, embed the YouTube player iframe
- Otherwise, show a clickable link

Add the field to the track form (TrackForm.tsx) as an optional text input.
Create a new migration file (00004_add_reference_url.sql) for the database change.
Update src/types/database.ts with the new column.
```

---

### 2.2 Search and Filter Across Content

| | |
|---|---|
| **Why it matters** | As you add more tracks, artists, and practice logs, it gets harder to find specific items. A simple search bar on the lab, artists, and practice pages would save time scrolling through long lists. |
| **Category** | Product + Engineering |
| **Estimated difficulty** | Medium (1–2 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add a search/filter bar to these pages:
- /lab — filter by track name, artist, genre, or BPM range
- /artists — filter by name or genre tags
- /practice — filter by date range or transition type

Use client-side filtering (no new database queries needed). Add a text input at the
top of each list that filters results as the user types. Keep it simple — a single
search box that matches against the most useful fields.
```

---

### 2.3 Practice Analytics / Charts

| | |
|---|---|
| **Why it matters** | You log practice sessions but can't see trends over time. A simple chart showing hours per week, BPM progression, or most-practiced transitions would help you see if you're improving and where to focus. |
| **Category** | Product + Design |
| **Estimated difficulty** | Medium (2–3 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add a "Practice Stats" section to the practice page (/practice) that shows:
1. A bar chart of total practice minutes per week (last 8 weeks)
2. A line showing average BPM practiced per week
3. A breakdown of transition types practiced (pie or bar chart)

Use a lightweight charting library (recharts or chart.js). Keep the charts simple and
readable on mobile. Only use data from the practice_logs table — no new queries needed
beyond what the page already fetches. Show a "Not enough data" message if fewer than
3 sessions exist.
```

---

### 2.4 Curriculum Admin UI

| | |
|---|---|
| **Why it matters** | Right now, adding or editing lessons requires editing a JSON file, running a script, and pasting SQL into the Supabase editor. A simple admin interface would let you edit lesson content directly in the app — much easier for a non-technical owner. |
| **Category** | Product + Engineering |
| **Estimated difficulty** | Hard (4–6 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Build a simple curriculum editor at /curriculum/admin (protected, only accessible
to the app owner). It should:
1. List all modules and their lessons in order
2. Click a lesson to edit: title, description, content (markdown), exercises
3. Add a new lesson to a module
4. Reorder lessons within a module (drag-and-drop or up/down arrows)
5. Preview the markdown content before saving

Store changes directly in the database (modules, lessons, exercises tables).
You'll need to relax the RLS policies on content tables to allow inserts/updates
from an admin user — add an "is_admin" column to profiles or use a Supabase
service role key for admin operations. Keep it simple and explain the security
trade-offs.
```

---

### 2.5 Mobile PWA (Progressive Web App)

| | |
|---|---|
| **Why it matters** | The app is mobile-friendly in the browser, but adding a web app manifest would let you "install" it on your phone's home screen. It would open full-screen (no browser bar), feel like a real app, and be available even with spotty internet for cached pages. |
| **Category** | Engineering |
| **Estimated difficulty** | Easy (30–45 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Make this app installable as a PWA (Progressive Web App):
1. Add a web app manifest (manifest.json) with app name "DJ Lab", dark theme,
   and a simple icon (generate a basic one from the 🎛️ emoji or a simple SVG)
2. Add a basic service worker for offline caching of static assets
3. Add the manifest link to the root layout
4. Test that "Add to Home Screen" works on mobile Chrome

Keep it minimal — just the manifest, icon, and basic caching. Don't add
offline-first data sync.
```

---

### 2.6 Typed Supabase Client (Auto-Generated)

| | |
|---|---|
| **Why it matters** | Right now, the TypeScript types for database tables are maintained by hand in `src/types/database.ts`. If someone adds a column to the database but forgets to update the types, the app won't catch the mismatch until runtime. Auto-generating types from the live schema eliminates this risk. |
| **Category** | Engineering |
| **Estimated difficulty** | Easy–Medium (20–30 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Set up auto-generated Supabase types:
1. Install the Supabase CLI (npx supabase)
2. Run "supabase gen types typescript" against the live project to generate types
3. Replace src/types/database.ts with the generated output
4. Update the Supabase client files to use the generated Database type
5. Add an npm script "types:generate" that regenerates the types
6. Make sure npm run validate still passes

The Supabase project URL and credentials are in .env.local.
```

---

## Priority 3: Nice-to-Have Later

These are good ideas that would make DJ Lab more powerful but aren't urgent.

---

### 3.1 Export Practice Data (CSV/PDF)

| | |
|---|---|
| **Why it matters** | If you want to review your progress offline, share it with a mentor, or keep a backup, you can't currently get your data out of the app. A simple export button would give you a CSV or PDF of your practice history. |
| **Category** | Product + Engineering |
| **Estimated difficulty** | Easy–Medium (1–2 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add an "Export" button to the practice page that downloads all practice logs as a CSV file.
Include columns: date, duration_minutes, bpm, transition_type, notes, mistakes.
Also add an "Export" button to the lab page that exports all track analyses as CSV.
Use client-side CSV generation (no server-side API needed).
```

---

### 3.2 Spaced Repetition / Review Reminders

| | |
|---|---|
| **Why it matters** | Learning sticks better when you revisit material at increasing intervals. A simple "time to review" indicator on the dashboard would remind you which lessons you haven't practiced recently, helping you retain what you've learned. |
| **Category** | Product + Engineering |
| **Estimated difficulty** | Medium (2–3 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add a "Review Suggestions" section to the dashboard that shows lessons you should revisit.
Use a simple algorithm: if a lesson was completed more than 7 days ago and hasn't been
practiced since, suggest reviewing it. Sort by oldest-completed first. Show up to 5
suggestions with the lesson title and how many days since completion.

Use the existing user_lesson_progress table (completed_at timestamp). No new database
tables needed.
```

---

### 3.3 Weekly Practice Goals

| | |
|---|---|
| **Why it matters** | Having a target motivates consistent practice. A goal like "practice 3 hours this week" with a progress bar on the dashboard gives you something concrete to aim for and a sense of accomplishment when you hit it. |
| **Category** | Product + Design |
| **Estimated difficulty** | Medium (1–2 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add a weekly practice goal feature:
1. Add a "weekly_goal_minutes" column to the profiles table (default 120)
2. On the dashboard, show a progress bar: "X of Y minutes this week" using the
   existing "Min This Week" calculation
3. Add a small "Set Goal" button that lets the user change their weekly target
4. Show a congratulations message when the goal is met

Keep it simple — one number (minutes per week), one progress bar, one edit button.
```

---

### 3.4 Playlist Builder from Track Analyses

| | |
|---|---|
| **Why it matters** | Once you have 20+ track studies in the lab, you could organize them into practice playlists — sorted by BPM for beatmatching practice, or by energy level for learning energy management. This turns your study notes into a practical tool. |
| **Category** | Product + Engineering |
| **Estimated difficulty** | Medium–Hard (3–4 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Build a playlist builder at /lab/playlists:
1. Create a "playlists" table (id, user_id, name, description, created_at)
2. Create a "playlist_tracks" table (playlist_id, track_analysis_id, position)
3. UI to create a playlist, add tracks from your analyses, and reorder them
4. Show BPM flow (ascending/descending), energy arc, and genre breakdown
5. "Auto-sort by BPM" and "Auto-sort by energy" buttons

Add RLS policies (user can only see their own playlists). Create migration 00005.
```

---

### 3.5 Dark/Light Theme Toggle

| | |
|---|---|
| **Why it matters** | The app is dark-themed only. Some people prefer light themes, especially during daytime. A toggle would make the app more comfortable to use in different lighting conditions. |
| **Category** | Design + Engineering |
| **Estimated difficulty** | Medium (2–3 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add a dark/light theme toggle to the navbar:
1. Add a theme toggle button (sun/moon icon) to the sidebar and mobile nav
2. Store the preference in localStorage
3. Apply the theme using Tailwind's dark mode (class strategy, already configured)
4. Create light-mode equivalents for the main background, card, and text colors
5. Default to dark mode, respect system preference if no manual choice

Make sure all pages look good in both themes. The brand colors should work in both.
```

---

### 3.6 Multi-User Support with Admin Role

| | |
|---|---|
| **Why it matters** | Right now the app supports multiple users (each sees only their own data), but there's no concept of an "admin" who can manage curriculum content or see all users. If you ever want to use DJ Lab with students or friends, you'd need basic role management. |
| **Category** | Product + Engineering |
| **Estimated difficulty** | Hard (4–6 hours) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Add basic admin role support:
1. Add a "role" column to the profiles table (default: "learner", options: "learner", "admin")
2. Create an admin dashboard at /admin showing: total users, lessons completed across
   all users, most-practiced transition types, most-analyzed tracks
3. Let admins view (but not edit) any user's progress
4. Protect admin routes with middleware that checks the role
5. Make the first registered user automatically an admin (or set it manually in Supabase)

Keep it read-only for now — admin can view but not modify other users' data.
```

---

### 3.7 Error Monitoring (Sentry)

| | |
|---|---|
| **Why it matters** | If something breaks in the deployed app, you won't know unless a user tells you. Error monitoring sends you an alert when errors happen, with details about what went wrong. This is standard practice for any production app. |
| **Category** | Engineering |
| **Estimated difficulty** | Easy (20–30 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Set up Sentry error monitoring:
1. Install @sentry/nextjs
2. Configure it with the Sentry DSN (I'll provide the DSN)
3. Add error boundaries to catch and report client-side errors
4. Add server-side error reporting for API routes and server components
5. Test by triggering a deliberate error and verifying it appears in Sentry

You'll need a Sentry account — guide me through creating a free project if I don't have one.
```

---

### 3.8 Backup Strategy for Supabase Data

| | |
|---|---|
| **Why it matters** | If the Supabase database is accidentally deleted or corrupted, all user data (progress, practice logs, track analyses, artist profiles) would be lost. A simple backup strategy protects against this. Supabase Pro plan includes automatic backups, but the free tier does not. |
| **Category** | Engineering |
| **Estimated difficulty** | Easy–Medium (30–60 minutes) |

**Prompt for Devin:**
```
Look at this repo: github.com/Eimoneee/DJ-Lab

Create a backup script that exports all user data from Supabase to JSON files:
1. Export all tables (practice_logs, track_analyses, artist_sound_maps,
   user_lesson_progress, user_exercise_progress) as JSON
2. Save to a /backups/ folder (gitignored)
3. Add an npm script "backup" that runs the export
4. Document the restore process in docs/debugging-playbook.md

The script should use the Supabase service role key (not the anon key) to read all data.
I'll provide the service role key when you need it.
```

---

## Quick Reference: What's Already Done

Before starting any roadmap item, remember what's already built and working:

| Feature | Status |
|---|---|
| App scaffold (Next.js 14 + Tailwind + dark theme) | Done |
| Auth (login/signup/logout/middleware) | Done |
| Curriculum (4 phases, 39 lessons, 39 exercises) | Done |
| Progress tracking (lesson/exercise completion, phase unlocking) | Done |
| Practice logging (CRUD with stats) | Done |
| Reverse-engineering lab (17-field track analysis + visual timeline) | Done |
| Artist sound maps (production traits, mixing traits) | Done |
| Artist taxonomy (7 dimensions, 20 artists, comparison UI) | Done |
| Dashboard (stats, progress bars, current/next lesson) | Done |
| Database schema + RLS policies (3 migrations) | Done |
| Tests (57 passing) | Done |
| Documentation (12 docs, 3 issue templates) | Done |
| **Live deployment** | **Not done** |
| **End-to-end testing against live database** | **Not done** |
| **CI/CD pipeline** | **Not done** |

---

## Tips for Working with Devin on This Project

1. **Always point Devin at the repo:** Start every prompt with `Look at this repo: github.com/Eimoneee/DJ-Lab`
2. **Ask Devin to run `npm run validate` before committing:** This catches lint errors, type errors, and test failures
3. **Ask for a recording when testing UI changes:** Devin can record itself walking through the app to prove changes work
4. **One task per session works best:** Each prompt above is scoped to a single feature. Don't combine multiple roadmap items into one session
5. **Review the PR before merging:** Devin will create a pull request. Read the description, check the changed files, and merge when you're satisfied
6. **Check `docs/debugging-playbook.md` if something breaks:** It has solutions for the most common issues
