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

export default function TrackForm({ userId, existing }: TrackFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    track_name: existing?.track_name ?? "",
    artist: existing?.artist ?? "",
    bpm: existing?.bpm ?? 125,
    key: existing?.key ?? "",
    genre: existing?.genre ?? "Tech House",
    structure: existing?.structure ?? "",
    sound_design: existing?.sound_design ?? "",
    mixing_notes: existing?.mixing_notes ?? "",
    what_works: existing?.what_works ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    if (existing) {
      await supabase
        .from("track_analyses")
        .update({
          track_name: form.track_name,
          artist: form.artist,
          bpm: form.bpm,
          key: form.key,
          genre: form.genre,
          structure: form.structure,
          sound_design: form.sound_design,
          mixing_notes: form.mixing_notes,
          what_works: form.what_works,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      router.push(`/lab/${existing.id}`);
    } else {
      const { data } = await supabase
        .from("track_analyses")
        .insert({
          user_id: userId,
          track_name: form.track_name,
          artist: form.artist,
          bpm: form.bpm,
          key: form.key,
          genre: form.genre,
          structure: form.structure,
          sound_design: form.sound_design,
          mixing_notes: form.mixing_notes,
          what_works: form.what_works,
        })
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
        <Link href="/lab" className="text-sm text-gray-400 hover:text-gray-200">
          ← Back to Lab
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          {existing ? "Edit Track Analysis" : "New Track Analysis"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card space-y-4">
          <h2 className="text-sm font-medium text-gray-300">Track Info</h2>
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
            <div className="sm:col-span-2">
              <label htmlFor="genre" className="label">Genre</label>
              <input
                id="genre"
                value={form.genre}
                onChange={(e) => set("genre", e.target.value)}
                className="input"
                placeholder="e.g. Tech House, Deep House"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-medium text-gray-300">Analysis</h2>
          <div>
            <label htmlFor="structure" className="label">
              Structure Breakdown
            </label>
            <textarea
              id="structure"
              value={form.structure}
              onChange={(e) => set("structure", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Intro (16 bars) → Build (8 bars) → Drop (16 bars) → Breakdown..."
            />
          </div>
          <div>
            <label htmlFor="sound_design" className="label">
              Sound Design Notes
            </label>
            <textarea
              id="sound_design"
              value={form.sound_design}
              onChange={(e) => set("sound_design", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Bass type, synth layers, percussion elements, samples..."
            />
          </div>
          <div>
            <label htmlFor="mixing_notes" className="label">
              Mixing / FX Notes
            </label>
            <textarea
              id="mixing_notes"
              value={form.mixing_notes}
              onChange={(e) => set("mixing_notes", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Reverb on vocals, filter automation, sidechain pumping..."
            />
          </div>
          <div>
            <label htmlFor="what_works" className="label">
              What Makes It Work?
            </label>
            <textarea
              id="what_works"
              value={form.what_works}
              onChange={(e) => set("what_works", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Why is this track effective? What can you learn from it?"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : existing ? "Update" : "Save Analysis"}
          </button>
          <Link href="/lab" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
