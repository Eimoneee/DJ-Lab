-- Add taxonomy JSONB column to artist_sound_maps for structured sonic tendency ratings
alter table public.artist_sound_maps
  add column if not exists taxonomy jsonb,
  add column if not exists summary text;

-- Add a check constraint to validate taxonomy rating values (1-5)
-- Note: This validates at the DB level that ratings are within range
comment on column public.artist_sound_maps.taxonomy is
  'Structured sonic tendency ratings. Schema: { dimension: { rating: 1-5, notes: string } }. Dimensions: groove, percussion_density, low_end, arrangement, tension, vocal_usage, energy_profile.';
