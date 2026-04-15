# DJ Lab

A private step-by-step learning platform for beginner DJs and music producers, focused on house and tech house. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

---

## Quick Start

```bash
git clone https://github.com/Eimoneee/DJ-Lab.git
cd DJ-Lab
npm install
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local (see "Environment Variables" below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

---

## Features

| Feature | Description | Route |
|---|---|---|
| **Dashboard** | Current lesson, progress bars, stats at a glance | `/dashboard` |
| **Curriculum** | 4-phase structured learning (39 lessons, 39 exercises) | `/curriculum` |
| **Practice Log** | Log sessions with BPM, transition type, notes, mistakes | `/practice` |
| **Reverse-Engineering Lab** | 17-field track analysis (drums, bass, groove, arrangement, FX, etc.) | `/lab` |
| **Artist Sound Maps** | Document recurring production & mixing traits per artist | `/artists` |
| **Artist Taxonomy** | 7-dimension sonic classification with side-by-side comparison | `/artists/compare` |
| **Auth** | Email/password login via Supabase with route protection | `/login` |

### Curriculum Phases

1. **DJ Fundamentals** — counting bars, phrasing, beatmatching, cueing, gain staging, EQ, transitions
2. **House & Tech House Mixing** — loops, bass swaps, energy management, track selection
3. **Production Basics** — DAW intro, drums, groove, kick/bass, arrangement, sampling, compression
4. **Reverse Engineering** — track analysis methodology, artist study, building a reference library

### Artist Taxonomy Dimensions

Each artist is rated 1–5 on seven sonic dimensions:

| Dimension | Scale |
|---|---|
| Groove | Straight → Heavy swing |
| Percussion Density | Sparse → Dense |
| Low-End | Light → Heavy |
| Arrangement | Minimal → Complex |
| Tension Style | Subtle → Dramatic |
| Vocal Usage | None → Prominent |
| Energy Profile | Deep → Peak-time |

20 artists profiled: ChaseWest, Michael Bibi, PAWSA, Void, Zulan, Prospa, Luke Dean, OMAR+, Bontan, Adam Ten, Mita Gami, Odd Mob, Rafael, Brunello, Yamagucci, Keinemusik, Giaggi, KinAhau, Djibouti, Alex Yav.

---

## Environment Variables

Create `.env.local` from the example file:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon / public key |

---

## Database Setup

Run all three migrations **in order** in the Supabase SQL Editor:

1. `supabase/migrations/00001_initial_schema.sql` — Core tables, RLS policies, curriculum seeding trigger
2. `supabase/migrations/00002_expand_track_and_artist.sql` — Expanded track analysis & artist sound map fields
3. `supabase/migrations/00003_add_artist_taxonomy.sql` — Taxonomy JSONB + summary columns on artist_sound_maps

Then seed the curriculum:

```bash
npm run seed:sql
```

Run the generated `supabase/seed.sql` in the SQL Editor.

---

## NPM Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run build` | Production build (TypeScript + Next.js) |
| `npm start` | Start production server (run `build` first) |
| `npm run lint` | ESLint check across the project |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run typecheck` | TypeScript type checking without emitting |
| `npm run validate` | Run lint + typecheck + tests in sequence |
| `npm run seed:sql` | Generate seed SQL from curriculum JSON |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with AppShell
│   ├── page.tsx                # Home redirect
│   ├── login/                  # Auth login page
│   ├── dashboard/              # Dashboard with progress overview
│   ├── curriculum/             # Module → Lesson → Exercise pages
│   │   ├── page.tsx            # Module list
│   │   ├── [moduleId]/         # Lessons in a module
│   │   └── [moduleId]/[lessonId]/ # Lesson detail with exercises
│   ├── practice/               # Practice log (list + form)
│   ├── lab/                    # Reverse-engineering lab
│   │   ├── page.tsx            # Track list
│   │   ├── new/                # New track analysis form
│   │   ├── [trackId]/          # Track detail (read-only)
│   │   └── [trackId]/edit/     # Track edit form
│   └── artists/                # Artist sound maps
│       ├── page.tsx            # Artist list + Compare button
│       ├── new/                # New artist form
│       ├── compare/            # Side-by-side taxonomy comparison
│       ├── [artistId]/         # Artist detail with taxonomy
│       └── [artistId]/edit/    # Artist edit form
├── components/                 # Shared UI components
│   ├── AppShell.tsx            # Layout wrapper (sidebar + main)
│   ├── Navbar.tsx              # Desktop sidebar + mobile bottom bar
│   ├── ProgressBar.tsx         # Reusable progress bar
│   └── MarkdownContent.tsx     # Markdown renderer for lessons
├── data/                       # Seed and reference data
│   ├── seed-curriculum.json    # 39 lessons across 4 phases
│   ├── seed.ts                 # SQL generator from curriculum JSON
│   └── artist-taxonomy.json    # 20 artist taxonomy profiles
├── lib/
│   ├── supabase/               # Supabase client helpers
│   │   ├── client.ts           # Browser client (client components)
│   │   ├── server.ts           # Server client (server components, actions)
│   │   └── middleware.ts       # Middleware client (auth checks)
│   └── __tests__/              # Unit tests (Jest)
│       └── progress.test.ts    # Progression logic + seed data tests
├── types/
│   ├── database.ts             # Supabase database types (Row/Insert/Update)
│   └── taxonomy.ts             # Taxonomy dimension types + constants
└── middleware.ts               # Auth middleware (protects all routes except /login)
docs/
├── product-spec.md             # Product specification
├── curriculum-map.md           # Full curriculum outline (all 39 lessons)
├── database-schema.md          # Database table definitions + RLS policies
├── artist-taxonomy.md          # All 20 artist profiles with ratings (editable)
├── modules.md                  # Module-by-module documentation
├── debugging-playbook.md       # Common issues and how to fix them
└── prompt-library.md           # Prompts for extending DJ Lab with AI assistants
supabase/
└── migrations/
    ├── 00001_initial_schema.sql
    ├── 00002_expand_track_and_artist.sql
    └── 00003_add_artist_taxonomy.sql
.github/
└── ISSUE_TEMPLATE/
    ├── feature-request.yml
    ├── bug-report.yml
    └── curriculum-change.yml
```

---

## Database Schema

| Table | Purpose | RLS |
|---|---|---|
| `profiles` | User profile (display name, avatar) | Own row only |
| `modules` | Curriculum phases (4 total) | All authenticated |
| `lessons` | Individual lessons with markdown content | All authenticated |
| `exercises` | Practical exercises linked to lessons | All authenticated |
| `user_lesson_progress` | Tracks lesson completion per user | Own rows only |
| `user_exercise_progress` | Tracks exercise completion per user | Own rows only |
| `practice_logs` | Practice session entries | Own rows only |
| `track_analyses` | Reverse-engineering track breakdowns | Own rows only |
| `artist_sound_maps` | Artist technique docs + taxonomy (JSONB) | Own rows only |

Full schema details: [docs/database-schema.md](docs/database-schema.md)

---

## Progression Logic

- **Lessons** are completed by clicking "Mark as Complete" on the lesson page
- **Exercises** are completed individually within each lesson
- **Phases unlock** when the previous phase reaches 80%+ completion
- The **dashboard** shows: current lesson, last completed, what's next, and per-phase progress bars

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

---

## Documentation Index

| Document | What it covers |
|---|---|
| [docs/product-spec.md](docs/product-spec.md) | Full product specification |
| [docs/curriculum-map.md](docs/curriculum-map.md) | All 39 lessons across 4 phases |
| [docs/database-schema.md](docs/database-schema.md) | Table definitions + RLS policies |
| [docs/artist-taxonomy.md](docs/artist-taxonomy.md) | 20 artist profiles with sonic ratings |
| [docs/modules.md](docs/modules.md) | Module-by-module technical documentation |
| [docs/debugging-playbook.md](docs/debugging-playbook.md) | Common issues and how to fix them |
| [docs/prompt-library.md](docs/prompt-library.md) | Prompts for extending DJ Lab |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to make changes (solo owner guide) |
| [CHANGELOG.md](CHANGELOG.md) | Version history and what changed |

---

## License

Private project — not for redistribution.
