# Changelog

All notable changes to DJ Lab are documented here.

Format: each version lists what was Added, Changed, or Fixed.

---

## [0.3.0] — 2026-04-15

### Added
- **Artist Taxonomy System** — 7-dimension sonic classification (groove, percussion density, low-end, arrangement, tension, vocal usage, energy profile) rated 1–5
- **20 artist profiles** — ChaseWest, Michael Bibi, PAWSA, Void, Zulan, Prospa, Luke Dean, OMAR+, Bontan, Adam Ten, Mita Gami, Odd Mob, Rafael, Brunello, Yamagucci, Keinemusik, Giaggi, KinAhau, Djibouti, Alex Yav
- **Side-by-side comparison UI** at `/artists/compare` — select 2–6 artists, color-coded rating bars, detail cards
- **Taxonomy editing** in artist form — interactive 1–5 rating buttons + notes per dimension
- **Taxonomy display** on artist detail pages — visual rating bars with notes
- Editable reference files: `src/data/artist-taxonomy.json` and `docs/artist-taxonomy.md`
- Database migration `00003_add_artist_taxonomy.sql` — adds `taxonomy` (JSONB) and `summary` (text) to artist_sound_maps

## [0.2.0] — 2026-04-15

### Added
- **Expanded Track Study Pages** — 17 analysis fields across 6 sections: BPM, genre/subgenre, energy rating (1–10), drums analysis, bassline analysis, groove/swing notes, arrangement timeline, tension/release, FX notes, study loop ideas, distinctive elements, curriculum connections
- **Expanded Artist Sound Maps** — 3 sections: Identity (signature sounds, key tracks, similar artists), Production Traits (drum patterns, bass style, sample palette, arrangement tendencies, energy flow), Mixing Traits (mixing style, FX techniques)
- Read-only detail views with Edit buttons for both tracks and artists
- Energy rating badge and subgenre display on lab list page
- Trait summary badges (Drums, Bass, Mix, FX) on artist list page
- Database migration `00002_expand_track_and_artist.sql` — new columns for both tables

## [0.1.0] — 2026-04-15

### Added
- **Initial release** of DJ Lab
- Next.js 14 + TypeScript + Tailwind CSS scaffold with dark theme
- Supabase Auth (email/password) with middleware route protection
- **4-phase curriculum** with 39 lessons and 39 exercises:
  - Phase 1: DJ Fundamentals (11 lessons)
  - Phase 2: House & Tech House Mixing (10 lessons)
  - Phase 3: Production Basics (12 lessons)
  - Phase 4: Reverse Engineering (6 lessons)
- **Dashboard** — current lesson, progress bars, completion stats
- **Practice Log** — date, BPM, transition type, notes, mistakes
- **Reverse-Engineering Lab** — track analysis templates
- **Artist Sound Maps** — artist technique documentation
- Progression logic: phases unlock at 80%+ completion
- PostgreSQL schema with Row Level Security (RLS)
- 24 Jest tests (progression logic, progress bar math, seed data validation)
- Product spec, curriculum map, database schema docs
- Vercel-ready deployment configuration
