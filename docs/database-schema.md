# DJ Lab — Database Schema

## Overview

All tables live in Supabase (PostgreSQL). Row Level Security (RLS) is enabled on every table so users can only access their own data.

## Entity Relationship

```
auth.users (Supabase managed)
  └── profiles (1:1)
  └── user_lesson_progress (1:many)
  └── user_exercise_progress (1:many)
  └── practice_logs (1:many)
  └── track_analyses (1:many)
  └── artist_sound_maps (1:many)

modules (1:many) → lessons (1:many) → exercises
```

## Tables

### profiles

| Column       | Type      | Notes                          |
| ------------ | --------- | ------------------------------ |
| id           | uuid PK   | References auth.users.id       |
| display_name | text      | User's display name            |
| avatar_url   | text      | Optional avatar URL            |
| created_at   | timestamptz | Default now()                |
| updated_at   | timestamptz | Default now()                |

### modules

| Column      | Type        | Notes                          |
| ----------- | ----------- | ------------------------------ |
| id          | uuid PK     | Default gen_random_uuid()      |
| title       | text        | Module title                   |
| description | text        | Short description              |
| category    | text        | e.g. "fundamentals", "mixing"  |
| order_index | integer     | Display order                  |
| icon        | text        | Emoji or icon name             |
| created_at  | timestamptz | Default now()                  |

### lessons

| Column      | Type        | Notes                          |
| ----------- | ----------- | ------------------------------ |
| id          | uuid PK     | Default gen_random_uuid()      |
| module_id   | uuid FK     | References modules.id          |
| title       | text        | Lesson title                   |
| description | text        | Short summary                  |
| content_md  | text        | Markdown lesson content        |
| order_index | integer     | Display order within module    |
| created_at  | timestamptz | Default now()                  |

### exercises

| Column      | Type        | Notes                          |
| ----------- | ----------- | ------------------------------ |
| id          | uuid PK     | Default gen_random_uuid()      |
| lesson_id   | uuid FK     | References lessons.id          |
| title       | text        | Exercise title                 |
| description | text        | Instructions / what to do      |
| order_index | integer     | Display order within lesson    |
| created_at  | timestamptz | Default now()                  |

### user_lesson_progress

| Column       | Type        | Notes                          |
| ------------ | ----------- | ------------------------------ |
| id           | uuid PK     | Default gen_random_uuid()      |
| user_id      | uuid FK     | References auth.users.id       |
| lesson_id    | uuid FK     | References lessons.id          |
| completed    | boolean     | Default false                  |
| completed_at | timestamptz | Null until completed           |
| created_at   | timestamptz | Default now()                  |

Unique constraint on (user_id, lesson_id).

### user_exercise_progress

| Column       | Type        | Notes                          |
| ------------ | ----------- | ------------------------------ |
| id           | uuid PK     | Default gen_random_uuid()      |
| user_id      | uuid FK     | References auth.users.id       |
| exercise_id  | uuid FK     | References exercises.id        |
| completed    | boolean     | Default false                  |
| completed_at | timestamptz | Null until completed           |
| created_at   | timestamptz | Default now()                  |

Unique constraint on (user_id, exercise_id).

### practice_logs

| Column          | Type        | Notes                           |
| --------------- | ----------- | ------------------------------- |
| id              | uuid PK     | Default gen_random_uuid()       |
| user_id         | uuid FK     | References auth.users.id        |
| date            | date        | Practice date                   |
| duration_minutes| integer     | Session length in minutes       |
| bpm             | integer     | BPM practiced                   |
| transition_type | text        | e.g. "cut", "fade", "eq_blend"  |
| notes           | text        | Free-text notes                 |
| mistakes        | text        | Areas to improve                |
| created_at      | timestamptz | Default now()                   |

### track_analyses

| Column           | Type        | Notes                          |
| ---------------- | ----------- | ------------------------------ |
| id               | uuid PK     | Default gen_random_uuid()      |
| user_id          | uuid FK     | References auth.users.id       |
| track_name       | text        | Track title                    |
| artist           | text        | Artist name                    |
| bpm              | integer     | Track BPM                      |
| key              | text        | Musical key                    |
| genre            | text        | Genre tag                      |
| structure        | text        | Breakdown (intro, drop, etc.)  |
| sound_design     | text        | Bass, synths, percussion notes |
| mixing_notes     | text        | FX and mixing observations     |
| what_works       | text        | Subjective analysis            |
| created_at       | timestamptz | Default now()                  |
| updated_at       | timestamptz | Default now()                  |

### artist_sound_maps

| Column           | Type        | Notes                          |
| ---------------- | ----------- | ------------------------------ |
| id               | uuid PK     | Default gen_random_uuid()      |
| user_id          | uuid FK     | References auth.users.id       |
| name             | text        | Artist name                    |
| genre_tags       | text[]      | Array of genre tags            |
| signature_sounds | text        | What makes them recognizable   |
| key_tracks       | text        | Notable tracks                 |
| production_notes | text        | Production techniques          |
| created_at       | timestamptz | Default now()                  |
| updated_at       | timestamptz | Default now()                  |

## Row Level Security

All tables have RLS enabled. Policies:

- **profiles**: Users can read/update their own profile
- **modules, lessons, exercises**: Public read (all authenticated users)
- **user_lesson_progress, user_exercise_progress**: Users can CRUD their own rows
- **practice_logs**: Users can CRUD their own rows
- **track_analyses**: Users can CRUD their own rows
- **artist_sound_maps**: Users can CRUD their own rows
