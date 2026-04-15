"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Database } from "@/types/database";

type TrackAnalysis = Database["public"]["Tables"]["track_analyses"]["Row"];

interface TrackFormProps {
  userId: string;
  existing?: TrackAnalysis;
}

const ENERGY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function TrackForm({ userId, existing }: TrackFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    track_name: existing?.track_name ?? "",
    artist: existing?.artist ?? "",
    bpm: existing?.bpm ?? 125,
    key: existing?.key ?? "",
    genre: existing?.genre ?? "Tech House",
    subgenre: existing?.subgenre ?? "",
    energy_rating: existing?.energy_rating ?? 5,
    reference_notes: existing?.reference_notes ?? "",
    drums_analysis: existing?.drums_analysis ?? "",
    bassline_analysis: existing?.bassline_analysis ?? "",
    groove_swing_notes: existing?.groove_swing_notes ?? "",
    arrangement_timeline: existing?.arrangement_timeline ?? "",
    tension_release: existing?.tension_release ?? "",
    fx_notes: existing?.fx_notes ?? "",
    study_loop_ideas: existing?.study_loop_ideas ?? "",
    distinctive_elements: existing?.distinctive_elements ?? "",
    curriculum_connections: existing?.curriculum_connections ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const payload = {
      track_name: form.track_name,
      artist: form.artist,
      bpm: form.bpm,
      key: form.key,
      genre: form.genre,
      subgenre: form.subgenre,
      energy_rating: form.energy_rating,
      reference_notes: form.reference_notes,
      drums_analysis: form.drums_analysis,
      bassline_analysis: form.bassline_analysis,
      groove_swing_notes: form.groove_swing_notes,
      arrangement_timeline: form.arrangement_timeline,
      tension_release: form.tension_release,
      fx_notes: form.fx_notes,
      study_loop_ideas: form.study_loop_ideas,
      distinctive_elements: form.distinctive_elements,
      curriculum_connections: form.curriculum_connections,
    };

    if (existing) {
      await supabase
        .from("track_analyses")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      router.push(`/lab/${existing.id}`);
    } else {
      const { data } = await supabase
        .from("track_analyses")
        .insert({ ...payload, user_id: userId })
        .select("id")
        .single();
      if (data) {
        router.push(`/lab/${data.id}`);
      }
    }

    router.refresh();
    setLoading(false);
  };

  const set = (key: string, value: string | number) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <Link href={existing ? `/lab/${existing.id}` : "/lab"} className="text-sm text-gray-400 hover:text-gray-200">
          ← {existing ? "Back to Track" : "Back to Lab"}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          {existing ? "Edit Track Study" : "New Track Study"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Track Info */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Track Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="track_name" className="label">Track Name</label>
              <input
                id="track_name"
                value={form.track_name}
                onChange={(e) => set("track_name", e.target.value)}
                className="input"
                required
                placeholder="e.g. Cola"
              />
            </div>
            <div>
              <label htmlFor="artist" className="label">Artist</label>
              <input
                id="artist"
                value={form.artist}
                onChange={(e) => set("artist", e.target.value)}
                className="input"
                required
                placeholder="e.g. CamelPhat & Elderbrook"
              />
            </div>
            <div>
              <label htmlFor="bpm" className="label">BPM</label>
              <input
                id="bpm"
                type="number"
                value={form.bpm}
                onChange={(e) => set("bpm", parseInt(e.target.value) || 0)}
                className="input"
                min={60}
                max={200}
              />
            </div>
            <div>
              <label htmlFor="key" className="label">Key</label>
              <input
                id="key"
                value={form.key}
                onChange={(e) => set("key", e.target.value)}
                className="input"
                placeholder="e.g. Am, F#m"
              />
            </div>
            <div>
              <label htmlFor="genre" className="label">Genre</label>
              <input
                id="genre"
                value={form.genre}
                onChange={(e) => set("genre", e.target.value)}
                className="input"
                placeholder="e.g. Tech House"
              />
            </div>
            <div>
              <label htmlFor="subgenre" className="label">Subgenre</label>
              <input
                id="subgenre"
                value={form.subgenre}
                onChange={(e) => set("subgenre", e.target.value)}
                className="input"
                placeholder="e.g. Minimal Tech, Bass House"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Energy Rating</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Low</span>
                <div className="flex gap-1">
                  {ENERGY_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => set("energy_rating", level)}
                      className={`h-8 w-8 rounded text-xs font-medium transition-colors ${
                        form.energy_rating >= level
                          ? "bg-brand-600 text-white"
                          : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reference Notes */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Reference Notes
          </h2>
          <div>
            <label htmlFor="reference_notes" className="label">
              General Notes
            </label>
            <textarea
              id="reference_notes"
              value={form.reference_notes}
              onChange={(e) => set("reference_notes", e.target.value)}
              className="input min-h-[80px]"
              placeholder="Why did you pick this track? What do you want to learn from it?"
            />
          </div>
        </div>

        {/* Sound Analysis */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Sound Analysis
          </h2>
          <div>
            <label htmlFor="drums_analysis" className="label">
              Drums Analysis
            </label>
            <textarea
              id="drums_analysis"
              value={form.drums_analysis}
              onChange={(e) => set("drums_analysis", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Kick character (punchy/deep/clicky), hat patterns, clap/snare placement, percussion layers, fills..."
            />
          </div>
          <div>
            <label htmlFor="bassline_analysis" className="label">
              Bassline Analysis
            </label>
            <textarea
              id="bassline_analysis"
              value={form.bassline_analysis}
              onChange={(e) => set("bassline_analysis", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Bass type (sub, reese, acid), pattern, movement, relationship to kick..."
            />
          </div>
          <div>
            <label htmlFor="groove_swing_notes" className="label">
              Groove / Swing Notes
            </label>
            <textarea
              id="groove_swing_notes"
              value={form.groove_swing_notes}
              onChange={(e) => set("groove_swing_notes", e.target.value)}
              className="input min-h-[80px]"
              placeholder="Shuffle amount, off-grid elements, what creates the groove feel..."
            />
          </div>
        </div>

        {/* Arrangement & Structure */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Arrangement & Structure
          </h2>
          <div>
            <label htmlFor="arrangement_timeline" className="label">
              Arrangement Timeline (in bars)
            </label>
            <textarea
              id="arrangement_timeline"
              value={form.arrangement_timeline}
              onChange={(e) => set("arrangement_timeline", e.target.value)}
              className="input min-h-[120px]"
              placeholder={"Intro (16 bars): kicks + hats only\nBuild (8 bars): bass enters, filter opens\nDrop (16 bars): full groove, vocal chop\nBreakdown (16 bars): stripped back, tension build\nDrop 2 (16 bars): full energy, new percussion\nOutro (16 bars): elements removed gradually"}
            />
          </div>
          <div>
            <label htmlFor="tension_release" className="label">
              Tension / Release Notes
            </label>
            <textarea
              id="tension_release"
              value={form.tension_release}
              onChange={(e) => set("tension_release", e.target.value)}
              className="input min-h-[100px]"
              placeholder="How does the track build tension? Risers, filter sweeps, percussion rolls, silence before drops..."
            />
          </div>
        </div>

        {/* FX & Mixing */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            FX & Production
          </h2>
          <div>
            <label htmlFor="fx_notes" className="label">
              FX Notes
            </label>
            <textarea
              id="fx_notes"
              value={form.fx_notes}
              onChange={(e) => set("fx_notes", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Reverb sends, delay throws, filter automation, sidechain pumping, risers, impacts..."
            />
          </div>
        </div>

        {/* Study & Learning */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Study & Learning
          </h2>
          <div>
            <label htmlFor="study_loop_ideas" className="label">
              What to Recreate in a Study Loop
            </label>
            <textarea
              id="study_loop_ideas"
              value={form.study_loop_ideas}
              onChange={(e) => set("study_loop_ideas", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Try recreating: the drum pattern, the bass movement, the main groove loop, the breakdown build..."
            />
          </div>
          <div>
            <label htmlFor="distinctive_elements" className="label">
              What Makes This Track Distinctive
            </label>
            <textarea
              id="distinctive_elements"
              value={form.distinctive_elements}
              onChange={(e) => set("distinctive_elements", e.target.value)}
              className="input min-h-[100px]"
              placeholder="The vocal chop hook, the bass groove pattern, the stripped-back arrangement, the tension build technique..."
            />
          </div>
          <div>
            <label htmlFor="curriculum_connections" className="label">
              Curriculum Connections
            </label>
            <textarea
              id="curriculum_connections"
              value={form.curriculum_connections}
              onChange={(e) => set("curriculum_connections", e.target.value)}
              className="input min-h-[80px]"
              placeholder="Which lessons does this connect to? e.g. Phase 1: Phrasing, Phase 2: Bass Swaps, Phase 3: Kick/Bass Relationship..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : existing ? "Update" : "Save Track Study"}
          </button>
          <Link href={existing ? `/lab/${existing.id}` : "/lab"} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
