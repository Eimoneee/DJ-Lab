-- Expand track_analyses with detailed study fields
alter table public.track_analyses
  add column if not exists subgenre text,
  add column if not exists energy_rating integer,
  add column if not exists reference_notes text,
  add column if not exists drums_analysis text,
  add column if not exists bassline_analysis text,
  add column if not exists groove_swing_notes text,
  add column if not exists arrangement_timeline text,
  add column if not exists tension_release text,
  add column if not exists fx_notes text,
  add column if not exists study_loop_ideas text,
  add column if not exists distinctive_elements text,
  add column if not exists curriculum_connections text;

-- Rename old columns to better names (keep backward compat by not dropping)
-- structure -> arrangement_timeline (new column above)
-- sound_design -> kept as-is (still useful as general notes)
-- mixing_notes -> kept as-is
-- what_works -> distinctive_elements (new column above)

-- Expand artist_sound_maps with recurring production/mixing traits
alter table public.artist_sound_maps
  add column if not exists mixing_traits text,
  add column if not exists drum_patterns text,
  add column if not exists bass_style text,
  add column if not exists arrangement_tendencies text,
  add column if not exists fx_techniques text,
  add column if not exists energy_flow text,
  add column if not exists sample_palette text,
  add column if not exists reference_artists text;
