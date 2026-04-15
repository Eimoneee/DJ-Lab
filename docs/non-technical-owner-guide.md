# DJ Lab — Owner Guide (No Coding Required)

This guide is written for someone who does not code. It explains how to use and manage DJ Lab in plain English.

---

## What This App Does

DJ Lab is your personal learning platform for DJing and music production. Think of it like a private online course that you built for yourself.

It has five main sections:

1. **Curriculum** — A step-by-step course with 39 lessons organized into 4 phases (DJ basics, house mixing, production, and reverse engineering). Each lesson has an explanation, exercises, and a "Mark as Complete" button so you can track your progress.

2. **Practice Log** — A journal where you record your practice sessions. You log the date, how long you practiced, what BPM (tempo) you worked at, what transition type you practiced, and any notes or mistakes.

3. **Reverse-Engineering Lab** — A workspace for studying reference tracks in detail. You break down a track's drums, bassline, arrangement, energy, effects, and more — like taking apart a song to see how it works.

4. **Artist Sound Maps** — Pages where you document what makes each artist's sound unique. Their drum patterns, bass style, mixing techniques, and so on. You can also compare artists side by side.

5. **Dashboard** — Your home screen. Shows which lesson you're on, how far along you are in each phase, how many minutes you've practiced this week, and how many tracks you've studied.

---

## How to Log In

1. Go to the app's URL in your web browser (this is the address where the app is hosted — if running locally, it's `http://localhost:3000`)
2. You'll see a login screen with two fields: **Email** and **Password**
3. Type your email and password, then click **Sign In**
4. If you don't have an account yet, click **Sign Up** instead. Enter your email and a password, then click **Sign Up**
5. You'll be taken to your Dashboard

If you forget your password, you'll need to reset it through Supabase (the service that handles accounts). Ask a developer or AI assistant for help with this.

---

## How to Add a New Lesson

Lessons are stored in a file called `seed-curriculum.json`. This is a structured text file — not code — that holds all your lesson content. Here's how to add a new one:

### Option A: Ask an AI assistant (easiest)

Copy and paste this into ChatGPT, Claude, Devin, or any AI coding tool:

> "Open the file `src/data/seed-curriculum.json` in the DJ Lab repo. Add a new lesson to Phase 2 (House & Tech House Mixing) with the title 'Filter Sweep Transitions'. The objective is to learn how to use high-pass and low-pass filter sweeps to create smooth transitions. Add one exercise: 'Practice a 32-bar filter sweep transition between two tracks at 126 BPM.' Place it after the existing lessons in Phase 2."

The AI will make the change for you. Then it will run a command (`npm run seed:sql`) to turn the file into database-ready instructions, which you paste into Supabase (explained below).

### Option B: Edit the file yourself on GitHub

1. Go to your GitHub repo: [github.com/Eimoneee/DJ-Lab](https://github.com/Eimoneee/DJ-Lab)
2. Navigate to `src/data/seed-curriculum.json`
3. Click the pencil icon (edit) in the top right
4. Find the phase you want to add to (look for `"title": "House & Tech House Mixing"` or whichever phase)
5. Inside its `"lessons"` list, add a new block following the same pattern as the existing lessons. Each lesson looks like this:

```
{
  "title": "Your Lesson Title",
  "description": "A one-line summary of what this lesson teaches",
  "content_md": "## Objective\n\nWhat the student will learn.\n\n## Explanation\n\nThe actual lesson content goes here.",
  "order_index": 12,
  "exercises": [
    {
      "title": "Exercise Name",
      "description": "What to practice",
      "order_index": 1
    }
  ]
}
```

6. After saving, you'll need to load this into the database. Run `npm run seed:sql` on your computer (or ask an AI to do it), then paste the result into the **Supabase SQL Editor** (Supabase is where your database lives — log in at [supabase.com/dashboard](https://supabase.com/dashboard), select your project, and click "SQL Editor").

**Glossary:**
- **JSON** — A structured text format that organizes data with curly braces `{}` and square brackets `[]`. It looks technical but it's just organized text.
- **Supabase SQL Editor** — A text box on the Supabase website where you paste instructions that update the database. Think of it like sending a command to your filing cabinet.
- **`order_index`** — A number that controls the order lessons appear. Higher numbers appear later.

---

## How to Change Lesson Text

### Option A: Ask an AI assistant

> "Open `src/data/seed-curriculum.json` in the DJ Lab repo. Find the lesson called 'Counting Bars and Phrasing' and change the explanation to include a note about counting in groups of 8 bars for house music."

### Option B: Edit on GitHub

1. Go to `src/data/seed-curriculum.json` on GitHub
2. Click the pencil icon to edit
3. Find the lesson by searching for its title (use Ctrl+F or Cmd+F to search)
4. Change the text inside `"content_md"` — this is the lesson body
5. Save and commit (GitHub will ask you to describe what you changed — just write something like "Updated lesson text")
6. Re-run the seed process: `npm run seed:sql`, paste into Supabase SQL Editor

**Note:** The `\n` in the lesson text means "new line" — it's how line breaks are written inside JSON. If you're editing directly, keep those `\n` markers where you want line breaks.

---

## How to Add a New Artist Profile

This one is done entirely through the app — no file editing needed.

1. Log in to DJ Lab
2. Click **Artists** in the sidebar (or bottom menu on mobile)
3. Click the **New Artist** button
4. Fill in the fields:
   - **Name** — The artist's name
   - **Genre Tags** — Comma-separated tags like `tech house, minimal`
   - **Signature Sounds** — What makes them recognizable (e.g., "rolling basslines, tight percussion")
   - **Key Tracks** — Their best-known tracks
   - **Similar Artists** and **Influenced By** — Who they sound like, who inspired them
   - **Production Traits** — Drum patterns, bass style, sample palette, arrangement tendencies, energy flow
   - **Mixing Traits** — Mixing style, FX techniques
   - **Sonic Taxonomy** — Rate the artist 1–5 on seven dimensions (groove, percussion density, low-end, arrangement, tension, vocal usage, energy profile). These ratings power the comparison feature.
5. Click **Save**

The artist will now appear in your artist list and can be selected for side-by-side comparison at `/artists/compare`.

---

## How to Add a New Reverse-Engineering Study

Also done through the app.

1. Log in to DJ Lab
2. Click **Lab** in the sidebar
3. Click **New Track**
4. Fill in the fields — there are six sections:
   - **Basic Info** — Track title, artist name, BPM (the song's tempo — a number like 124 or 128), genre, subgenre, energy rating (1–10)
   - **Sound Analysis** — Drums (describe the drum pattern), bassline (describe the bass sound and movement), groove/swing notes
   - **Structure** — Arrangement timeline (describe the track's structure in bars, like "Intro (16 bars): kicks + hats only"), tension/release notes, FX notes
   - **Study Notes** — What to recreate in a practice study loop, what makes the track distinctive
   - **Connections** — Which curriculum lessons this track relates to
   - **Reference** — General notes
5. Click **Save**

**Tip for the Arrangement Timeline:** If you write bar counts in parentheses — like `Intro (16 bars): kicks only` — the app will automatically create a visual timeline with colored blocks showing how long each section is, calculated from the track's BPM.

**Glossary:**
- **BPM** — Beats Per Minute. How fast the song is. House music is typically 120–130 BPM.
- **Bars** — A group of 4 beats in house music. A "16-bar intro" means the intro lasts 16 groups of 4 beats.
- **Arrangement** — The structure of a song (intro, breakdown, drop, outro, etc.)

---

## How to Review Learner Progress

Since this is a single-user app, you're reviewing your own progress.

1. **Dashboard** — Go to `/dashboard` (click "Dashboard" in the sidebar). You'll see:
   - Which lesson you're currently on
   - The last lesson you completed
   - What's coming next
   - A progress bar for each phase (DJ Fundamentals, House Mixing, Production, Reverse Engineering)
   - Stats: total lessons done, total available, minutes practiced this week, tracks analyzed

2. **Curriculum page** — Go to `/curriculum`. Each phase shows a progress bar with a percentage. Click into a phase to see individual lessons — completed ones are marked.

3. **Practice log** — Go to `/practice`. See your total hours practiced, total sessions, and a list of all your logged practice sessions with dates and details.

---

## What Not to Touch (Unless Necessary)

These files and settings keep the app working. Changing them without understanding what they do can break things.

| Don't touch this | What it is | Why it matters |
|---|---|---|
| `src/middleware.ts` | The security guard that checks if you're logged in | If you break this, either everyone can see everything or no one can log in |
| `src/lib/supabase/` folder | The files that connect the app to the database | If these break, no data loads and nothing saves |
| `supabase/migrations/` folder | The files that set up the database structure | These are meant to be run once, in order. Don't edit them after they've been applied. |
| `.env.local` | Your private credentials for connecting to Supabase | If you delete this or share the "secret" key (not the "publishable" one), the app stops working or your data could be exposed |
| `package.json` | The list of software the app depends on | Removing or changing entries here can break the entire app |
| `tailwind.config.ts` | The style/design settings | Changing this affects how every page looks |
| The `main` branch on GitHub | The primary version of the code | Never push changes directly to `main`. Always use a separate branch and create a pull request (or let an AI handle this for you). |

**Rule of thumb:** If you're not sure what a file does, don't change it. Ask an AI assistant or developer first.

---

## What to Do If the Site Breaks

### Step 1: Don't panic

The app code is safely stored on GitHub. Even if the live site goes down, nothing is permanently lost.

### Step 2: Check the basics

| Check this | How | What it means |
|---|---|---|
| Is the site loading at all? | Visit the URL in your browser | If you see a blank page or error, the hosting service (Vercel) might be down |
| Can you log in? | Try signing in | If login fails, the Supabase service might have an issue |
| Is data showing up? | Check if the dashboard, lessons, or practice log have content | If pages load but are empty, the database connection might be broken |

### Step 3: Try these fixes (in order)

1. **Refresh the page** — Sometimes a simple refresh fixes temporary glitches
2. **Clear your browser's saved data for this site** — In your browser, go to Settings → Privacy → Clear browsing data → select cookies and cached files for this site only
3. **Check Supabase** — Log in at [supabase.com/dashboard](https://supabase.com/dashboard). If your project shows a warning or error banner, that's the problem. Supabase's free tier can pause after inactivity — you may need to "unpause" your project.
4. **Check Vercel** (if deployed) — Log in at [vercel.com](https://vercel.com). Look for red error indicators on your project. Click into the latest deployment to see if the build failed.

### Step 4: If none of that works

Copy and paste this into ChatGPT, Claude, or Devin:

> "My DJ Lab app at [your URL] is broken. Here's what I see: [describe the problem]. The repo is at github.com/Eimoneee/DJ-Lab. Please look at docs/debugging-playbook.md and help me figure out what's wrong."

Or file a bug report on GitHub: go to [github.com/Eimoneee/DJ-Lab/issues/new/choose](https://github.com/Eimoneee/DJ-Lab/issues/new/choose) and pick "Bug Report".

---

## How to Send This Project to a Future Developer

If you ever hire a developer (freelancer, agency, or AI coding service), here's exactly what to share with them:

### The essentials (send all of these)

1. **The code repository:**
   > "The code is at github.com/Eimoneee/DJ-Lab. Add yourself as a collaborator so you can see and edit the code."
   
   To add them: GitHub repo → Settings → Collaborators → Add people → enter their GitHub username.

2. **The documentation:**
   > "Start by reading the README.md. Then look at docs/project-index.md — it links to every file, resource, and document in the project. docs/final-handoff.md has a complete status summary and known issues."

3. **The database:**
   > "The database is on Supabase. I'll add you to the Supabase project so you can see the tables and data."
   
   To add them: Supabase dashboard → your project → Settings → Team → Invite member.

4. **The deployment** (if deployed):
   > "The app is hosted on Vercel. I'll add you to the Vercel project."
   
   To add them: Vercel dashboard → your project → Settings → Members → Add.

### What to tell them

Here's a message you can copy and send:

> "This is a Next.js 14 app with TypeScript, Tailwind CSS, and Supabase. The repo is at github.com/Eimoneee/DJ-Lab.
> 
> Start with the README for setup instructions. The docs/ folder has everything you need:
> - `docs/project-index.md` — links to every file and resource
> - `docs/final-handoff.md` — full project status, known bugs, and recommended next steps  
> - `docs/modules.md` — technical docs for each module
> - `docs/debugging-playbook.md` — common issues and fixes
> - `CONTRIBUTING.md` — how to make changes
> 
> Run `npm run validate` before pushing any changes — it checks for errors.
> 
> The database schema is in `supabase/migrations/` (3 files, run in order). Curriculum content is in `src/data/seed-curriculum.json`.
> 
> Let me know if you have questions."

### What NOT to share publicly

- Your Supabase **service role key** (labeled "secret" in Supabase → Settings → API). The "publishable" key is fine to share — it's designed to be public.
- Your `.env.local` file. Give the developer the `.env.local.example` template and tell them to add their own credentials, or share the values privately (not in a public GitHub issue or chat).

---

## Glossary

Terms you might encounter while managing the project:

| Term | What it means |
|---|---|
| **Repository (repo)** | The folder where all the code lives, hosted on GitHub. Like a shared drive for code. |
| **Branch** | A separate copy of the code where changes are made safely before being added to the main version. |
| **Pull Request (PR)** | A proposal to merge changes from a branch into the main code. You review it before approving. |
| **Commit** | A saved snapshot of changes. Like pressing "save" but with a description of what changed. |
| **Deploy** | Publishing the app so it's accessible on the internet (via Vercel). |
| **Supabase** | The service that stores your data (database) and handles user accounts (auth). |
| **Vercel** | The service that hosts your app on the internet. |
| **Migration** | A SQL file that sets up or changes the database structure. Run in order, once. |
| **Seed data** | Pre-written content (like the 39 lessons) that gets loaded into the database. |
| **Environment variables** | Private settings (like your Supabase password) stored in a file called `.env.local`. |
| **BPM** | Beats Per Minute — how fast a song is. House music: 120–130 BPM. |
| **Bars** | Groups of 4 beats in 4/4 time (all house/tech house). 16 bars = 64 beats. |
| **RLS (Row Level Security)** | A database rule that makes sure each user can only see their own data. |
| **JSON** | A text format for organizing data with curly braces and square brackets. |
| **Markdown** | A simple way to format text (headings, bold, lists) without HTML. Used in lesson content. |
| **npm** | A tool that manages the app's software dependencies. You run commands like `npm run dev` in a terminal. |
| **Terminal** | A text-based window where you type commands to control your computer. On Mac: Terminal app. On Windows: Command Prompt or PowerShell. |

---

*This guide was written so you can manage DJ Lab without writing any code. For anything not covered here, paste your question into an AI assistant along with a link to the repo and it can help you.*
