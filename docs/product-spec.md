# DJ Lab — Product Specification

## Overview

DJ Lab is a private, mobile-friendly web application designed for a beginner learning DJing and music production from scratch, with a focus on **house** and **tech house** genres. It provides structured curriculum, practice tracking, and tools for studying reference tracks and artist techniques.

## Target User

- Solo, non-technical user
- Beginner DJ / music producer
- Needs a clean, minimal interface that works well on mobile
- Wants to track learning progress and practice sessions

## Core Features

### 1. Authentication & User Management

- Email/password login via Supabase Auth
- Protected routes — all app content requires login
- Single-user focus (no social features needed initially)

### 2. Dashboard

- Overview of learning progress (modules completed, streak, recent practice)
- Quick links to resume curriculum, log practice, or open the reverse-engineering lab
- Clean, minimal layout with key stats at a glance

### 3. Curriculum Modules

- Structured learning path organized into **modules** → **lessons** → **exercises**
- Module categories: DJ Fundamentals, Beatmatching, Mixing Techniques, Music Theory for DJs, Track Selection, Live Performance
- Each lesson contains:
  - Title, description, and content (markdown)
  - Embedded exercises or tasks
  - Completion tracking (mark as done)
- Progress bar per module and overall
- Content stored in structured JSON for easy admin updates

### 4. Practice Log

- Log practice sessions with:
  - Date
  - Duration (minutes)
  - BPM practiced
  - Transition type (e.g., cut, fade, EQ blend, filter sweep)
  - Notes (free text)
  - Mistakes / areas to improve
- View history as a sortable list
- Stats summary (total hours, sessions this week, most practiced BPM range)

### 5. Reverse-Engineering Lab

- Templates for analyzing reference tracks:
  - Track name, artist, BPM, key
  - Structure breakdown (intro, build, drop, breakdown, outro)
  - Sound design notes (bass type, synth layers, percussion elements)
  - Mixing / FX notes
  - What makes it work (subjective analysis)
- Save and revisit analyzed tracks

### 6. Artist Sound Maps

- Pages dedicated to studying specific artists
- Fields: artist name, genre tags, signature sounds, key tracks, production notes
- Ability to add and edit artist entries
- Links to related reverse-engineered tracks

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Framework  | Next.js 14 (App Router)        |
| Language   | TypeScript                     |
| Styling    | Tailwind CSS                   |
| Auth       | Supabase Auth                  |
| Database   | Supabase (PostgreSQL)          |
| Deployment | Vercel-ready                   |
| Content    | Structured JSON + Markdown     |

## Database Schema (High Level)

### Tables

- **profiles** — extends Supabase auth.users with display name, avatar
- **modules** — curriculum modules (order, title, description, category)
- **lessons** — lessons within modules (order, title, content_md, module_id)
- **exercises** — exercises within lessons (order, title, description, lesson_id)
- **user_lesson_progress** — tracks lesson completion per user
- **user_exercise_progress** — tracks exercise completion per user
- **practice_logs** — practice session entries
- **track_analyses** — reverse-engineered track data
- **artist_sound_maps** — artist study pages

## Content Strategy

- Initial seed data covers beginner DJ fundamentals (Module 1)
- Content stored as structured JSON seed files that can be loaded into Supabase
- Markdown used for rich lesson content
- Admin updates content by editing seed files and re-running migration

## Design Principles

- **Mobile-first** — responsive, touch-friendly
- **Minimal** — no clutter, focused on learning
- **Dark theme** — fits the DJ/music production aesthetic
- **Progressive** — features unlock as user progresses (future enhancement)

## Pages

| Route                        | Description                        |
| ---------------------------- | ---------------------------------- |
| `/login`                     | Auth page                          |
| `/dashboard`                 | Main overview                      |
| `/curriculum`                | Module list                        |
| `/curriculum/[moduleId]`     | Lessons in a module                |
| `/curriculum/[moduleId]/[lessonId]` | Lesson detail with exercises |
| `/practice`                  | Practice log list + new entry form |
| `/lab`                       | Reverse-engineering lab            |
| `/lab/[trackId]`             | Track analysis detail              |
| `/lab/new`                   | New track analysis                 |
| `/artists`                   | Artist sound map list              |
| `/artists/[artistId]`        | Artist detail page                 |
| `/artists/new`               | New artist entry                   |

## Non-Goals (v1)

- No multi-user / social features
- No audio playback or waveform visualization
- No AI-generated recommendations
- No payment or subscription system
