"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Database } from "@/types/database";
import type { ArtistTaxonomy, TaxonomyDimension } from "@/types/taxonomy";
import { TAXONOMY_DIMENSIONS } from "@/types/taxonomy";

type ArtistSoundMap = Database["public"]["Tables"]["artist_sound_maps"]["Row"];

interface ArtistFormProps {
  userId: string;
  existing?: ArtistSoundMap;
}

export default function ArtistForm({ userId, existing }: ArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    genre_tags: existing?.genre_tags?.join(", ") ?? "",
    signature_sounds: existing?.signature_sounds ?? "",
    key_tracks: existing?.key_tracks ?? "",
    production_notes: existing?.production_notes ?? "",
    mixing_traits: existing?.mixing_traits ?? "",
    drum_patterns: existing?.drum_patterns ?? "",
    bass_style: existing?.bass_style ?? "",
    arrangement_tendencies: existing?.arrangement_tendencies ?? "",
    fx_techniques: existing?.fx_techniques ?? "",
    energy_flow: existing?.energy_flow ?? "",
    sample_palette: existing?.sample_palette ?? "",
    reference_artists: existing?.reference_artists ?? "",
    summary: existing?.summary ?? "",
  });

  const existingTax = existing?.taxonomy as ArtistTaxonomy | null;
  const defaultDim: TaxonomyDimension = { rating: 3, notes: "" };
  const [taxonomy, setTaxonomy] = useState<ArtistTaxonomy>({
    groove: existingTax?.groove ?? { ...defaultDim },
    percussion_density: existingTax?.percussion_density ?? { ...defaultDim },
    low_end: existingTax?.low_end ?? { ...defaultDim },
    arrangement: existingTax?.arrangement ?? { ...defaultDim },
    tension: existingTax?.tension ?? { ...defaultDim },
    vocal_usage: existingTax?.vocal_usage ?? { ...defaultDim },
    energy_profile: existingTax?.energy_profile ?? { ...defaultDim },
  });
  const [showTaxonomy, setShowTaxonomy] = useState(!!existingTax);

  const setDimRating = (key: keyof ArtistTaxonomy, rating: number) => {
    setTaxonomy((prev) => ({
      ...prev,
      [key]: { ...prev[key], rating },
    }));
  };

  const setDimNotes = (key: keyof ArtistTaxonomy, notes: string) => {
    setTaxonomy((prev) => ({
      ...prev,
      [key]: { ...prev[key], notes },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const payload = {
        name: form.name,
        genre_tags: form.genre_tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        signature_sounds: form.signature_sounds,
        key_tracks: form.key_tracks,
        production_notes: form.production_notes,
        mixing_traits: form.mixing_traits,
        drum_patterns: form.drum_patterns,
        bass_style: form.bass_style,
        arrangement_tendencies: form.arrangement_tendencies,
        fx_techniques: form.fx_techniques,
        energy_flow: form.energy_flow,
        sample_palette: form.sample_palette,
        reference_artists: form.reference_artists,
        summary: form.summary,
        taxonomy: showTaxonomy ? taxonomy : null,
      };

      if (existing) {
        const { error: dbError } = await supabase
          .from("artist_sound_maps")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (dbError) throw new Error(dbError.message);
        router.push(`/artists/${existing.id}`);
      } else {
        const { data, error: dbError } = await supabase
          .from("artist_sound_maps")
          .insert({ ...payload, user_id: userId })
          .select("id")
          .single();
        if (dbError) throw new Error(dbError.message);
        if (data) {
          router.push(`/artists/${data.id}`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save artist");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={existing ? `/artists/${existing.id}` : "/artists"}
          className="text-sm text-gray-400 hover:text-gray-200"
        >
          ← {existing ? "Back to Artist" : "Back to Artists"}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          {existing ? "Edit Artist" : "New Artist Sound Map"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {/* Identity */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Identity
          </h2>
          <div>
            <label htmlFor="name" className="label">Artist Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
              required
              placeholder="e.g. Fisher"
            />
          </div>
          <div>
            <label htmlFor="genre_tags" className="label">
              Genre Tags (comma-separated)
            </label>
            <input
              id="genre_tags"
              value={form.genre_tags}
              onChange={(e) => set("genre_tags", e.target.value)}
              className="input"
              placeholder="e.g. Tech House, House, Bass House"
            />
          </div>
          <div>
            <label htmlFor="signature_sounds" className="label">
              Signature Sounds
            </label>
            <textarea
              id="signature_sounds"
              value={form.signature_sounds}
              onChange={(e) => set("signature_sounds", e.target.value)}
              className="input min-h-[100px]"
              placeholder="What recurring sonic elements make this artist instantly recognizable?"
            />
          </div>
          <div>
            <label htmlFor="key_tracks" className="label">
              Key Tracks (for reference, not copying)
            </label>
            <textarea
              id="key_tracks"
              value={form.key_tracks}
              onChange={(e) => set("key_tracks", e.target.value)}
              className="input min-h-[80px]"
              placeholder="Notable tracks that best represent their style..."
            />
          </div>
          <div>
            <label htmlFor="reference_artists" className="label">
              Similar / Influenced By
            </label>
            <textarea
              id="reference_artists"
              value={form.reference_artists}
              onChange={(e) => set("reference_artists", e.target.value)}
              className="input min-h-[60px]"
              placeholder="Other artists with a similar sound or who influenced this artist..."
            />
          </div>
          <div>
            <label htmlFor="summary" className="label">
              One-Line Summary
            </label>
            <input
              id="summary"
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              className="input"
              placeholder="e.g. Dark, percussion-heavy tech house with hypnotic grooves"
            />
          </div>
        </div>

        {/* Sonic Taxonomy */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Sonic Taxonomy
            </h2>
            <button
              type="button"
              onClick={() => setShowTaxonomy(!showTaxonomy)}
              className="text-xs text-brand-400 hover:text-brand-300"
            >
              {showTaxonomy ? "Hide" : "Add taxonomy ratings"}
            </button>
          </div>
          {showTaxonomy && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">
                Rate each sonic dimension from 1–5. These ratings enable side-by-side artist comparison.
              </p>
              {TAXONOMY_DIMENSIONS.map((dim) => (
                <div key={dim.key}>
                  <label className="label">
                    {dim.label}
                    <span className="ml-2 font-normal text-gray-600">
                      ({dim.low} → {dim.high})
                    </span>
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDimRating(dim.key, level)}
                          className={`h-8 w-8 rounded text-xs font-medium transition-colors ${
                            taxonomy[dim.key].rating >= level
                              ? "bg-brand-600 text-white"
                              : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={taxonomy[dim.key].notes}
                    onChange={(e) => setDimNotes(dim.key, e.target.value)}
                    className="input min-h-[60px]"
                    placeholder={`Notes on ${dim.label.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recurring Production Traits (detailed notes) */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Recurring Production Traits
          </h2>
          <div>
            <label htmlFor="drum_patterns" className="label">
              Drum Patterns
            </label>
            <textarea
              id="drum_patterns"
              value={form.drum_patterns}
              onChange={(e) => set("drum_patterns", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Recurring kick style, hat patterns, percussion choices, groove tendencies..."
            />
          </div>
          <div>
            <label htmlFor="bass_style" className="label">
              Bass Style
            </label>
            <textarea
              id="bass_style"
              value={form.bass_style}
              onChange={(e) => set("bass_style", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Typical bass types, movement patterns, sub behavior, how bass relates to kick..."
            />
          </div>
          <div>
            <label htmlFor="sample_palette" className="label">
              Sample Palette
            </label>
            <textarea
              id="sample_palette"
              value={form.sample_palette}
              onChange={(e) => set("sample_palette", e.target.value)}
              className="input min-h-[80px]"
              placeholder="Vocal chops, stabs, risers, textures, sample sources they tend to use..."
            />
          </div>
          <div>
            <label htmlFor="arrangement_tendencies" className="label">
              Arrangement Tendencies
            </label>
            <textarea
              id="arrangement_tendencies"
              value={form.arrangement_tendencies}
              onChange={(e) => set("arrangement_tendencies", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Typical song structure, breakdown style, build patterns, drop approach..."
            />
          </div>
          <div>
            <label htmlFor="energy_flow" className="label">
              Energy Flow
            </label>
            <textarea
              id="energy_flow"
              value={form.energy_flow}
              onChange={(e) => set("energy_flow", e.target.value)}
              className="input min-h-[80px]"
              placeholder="How do they manage energy across a track? Build-drop patterns, intensity curves..."
            />
          </div>
          <div>
            <label htmlFor="production_notes" className="label">
              General Production Notes
            </label>
            <textarea
              id="production_notes"
              value={form.production_notes}
              onChange={(e) => set("production_notes", e.target.value)}
              className="input min-h-[100px]"
              placeholder="DAW, plugins, production workflow, sound design techniques..."
            />
          </div>
        </div>

        {/* Recurring Mixing Traits */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Recurring Mixing Traits
          </h2>
          <div>
            <label htmlFor="mixing_traits" className="label">
              Mixing Style
            </label>
            <textarea
              id="mixing_traits"
              value={form.mixing_traits}
              onChange={(e) => set("mixing_traits", e.target.value)}
              className="input min-h-[100px]"
              placeholder="EQ tendencies, stereo width, compression style, loudness approach, low-end treatment..."
            />
          </div>
          <div>
            <label htmlFor="fx_techniques" className="label">
              FX Techniques
            </label>
            <textarea
              id="fx_techniques"
              value={form.fx_techniques}
              onChange={(e) => set("fx_techniques", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Reverb style, delay usage, filter automation, sidechain approach, creative FX..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : existing ? "Update" : "Save Artist"}
          </button>
          <Link href={existing ? `/artists/${existing.id}` : "/artists"} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
