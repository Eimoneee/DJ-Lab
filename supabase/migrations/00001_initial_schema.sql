-- DJ Lab Initial Schema
-- Run this in your Supabase SQL editor to set up the database

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Modules
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'fundamentals',
  order_index integer not null default 0,
  icon text not null default '📚',
  created_at timestamptz default now() not null
);

alter table public.modules enable row level security;

create policy "Modules are viewable by authenticated users"
  on public.modules for select
  to authenticated
  using (true);

-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text not null default '',
  content_md text not null default '',
  order_index integer not null default 0,
  created_at timestamptz default now() not null
);

alter table public.lessons enable row level security;

create policy "Lessons are viewable by authenticated users"
  on public.lessons for select
  to authenticated
  using (true);

-- Exercises
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  description text not null default '',
  order_index integer not null default 0,
  created_at timestamptz default now() not null
);

alter table public.exercises enable row level security;

create policy "Exercises are viewable by authenticated users"
  on public.exercises for select
  to authenticated
  using (true);

-- User Lesson Progress
create table if not exists public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, lesson_id)
);

alter table public.user_lesson_progress enable row level security;

create policy "Users can view own lesson progress"
  on public.user_lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own lesson progress"
  on public.user_lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own lesson progress"
  on public.user_lesson_progress for update
  using (auth.uid() = user_id);

-- User Exercise Progress
create table if not exists public.user_exercise_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, exercise_id)
);

alter table public.user_exercise_progress enable row level security;

create policy "Users can view own exercise progress"
  on public.user_exercise_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own exercise progress"
  on public.user_exercise_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own exercise progress"
  on public.user_exercise_progress for update
  using (auth.uid() = user_id);

-- Practice Logs
create table if not exists public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  duration_minutes integer not null default 0,
  bpm integer,
  transition_type text,
  notes text,
  mistakes text,
  created_at timestamptz default now() not null
);

alter table public.practice_logs enable row level security;

create policy "Users can view own practice logs"
  on public.practice_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own practice logs"
  on public.practice_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own practice logs"
  on public.practice_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own practice logs"
  on public.practice_logs for delete
  using (auth.uid() = user_id);

-- Track Analyses
create table if not exists public.track_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_name text not null,
  artist text not null,
  bpm integer,
  key text,
  genre text,
  structure text,
  sound_design text,
  mixing_notes text,
  what_works text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.track_analyses enable row level security;

create policy "Users can view own track analyses"
  on public.track_analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own track analyses"
  on public.track_analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own track analyses"
  on public.track_analyses for update
  using (auth.uid() = user_id);

create policy "Users can delete own track analyses"
  on public.track_analyses for delete
  using (auth.uid() = user_id);

-- Artist Sound Maps
create table if not exists public.artist_sound_maps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  genre_tags text[] default '{}',
  signature_sounds text,
  key_tracks text,
  production_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.artist_sound_maps enable row level security;

create policy "Users can view own artist sound maps"
  on public.artist_sound_maps for select
  using (auth.uid() = user_id);

create policy "Users can insert own artist sound maps"
  on public.artist_sound_maps for insert
  with check (auth.uid() = user_id);

create policy "Users can update own artist sound maps"
  on public.artist_sound_maps for update
  using (auth.uid() = user_id);

create policy "Users can delete own artist sound maps"
  on public.artist_sound_maps for delete
  using (auth.uid() = user_id);
