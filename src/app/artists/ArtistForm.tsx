"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Database } from "@/types/database";

type ArtistSoundMap = Database["public"]["Tables"]["artist_sound_maps"]["Row"];

interface ArtistFormProps {
  userId: string;
  existing?: ArtistSoundMap;
}

export default function ArtistForm({ userId, existing }: ArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    genre_tags: existing?.genre_tags?.join(", ") ?? "",
    signature_sounds: existing?.signature_sounds ?? "",
    key_tracks: existing?.key_tracks ?? "",
    production_notes: existing?.production_notes ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
    };

    if (existing) {
      await supabase
        .from("artist_sound_maps")
        .update({
          name: payload.name,
          genre_tags: payload.genre_tags,
          signature_sounds: payload.signature_sounds,
          key_tracks: payload.key_tracks,
          production_notes: payload.production_notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      router.push(`/artists/${existing.id}`);
    } else {
      const { data } = await supabase
        .from("artist_sound_maps")
        .insert({
          user_id: userId,
          name: payload.name,
          genre_tags: payload.genre_tags,
          signature_sounds: payload.signature_sounds,
          key_tracks: payload.key_tracks,
          production_notes: payload.production_notes,
        })
        .select("id")
        .single();
      if (data) {
        router.push(`/artists/${data.id}`);
      }
    }

    router.refresh();
    setLoading(false);
  };

  const set = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/artists"
          className="text-sm text-gray-400 hover:text-gray-200"
        >
          ← Back to Artists
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          {existing ? "Edit Artist" : "New Artist Sound Map"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card space-y-4">
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
              placeholder="What makes this artist recognizable? Describe their sound signature..."
            />
          </div>
          <div>
            <label htmlFor="key_tracks" className="label">Key Tracks</label>
            <textarea
              id="key_tracks"
              value={form.key_tracks}
              onChange={(e) => set("key_tracks", e.target.value)}
              className="input min-h-[100px]"
              placeholder="List their most notable/instructive tracks..."
            />
          </div>
          <div>
            <label htmlFor="production_notes" className="label">
              Production Notes
            </label>
            <textarea
              id="production_notes"
              value={form.production_notes}
              onChange={(e) => set("production_notes", e.target.value)}
              className="input min-h-[100px]"
              placeholder="Production techniques, gear, plugins, workflow observations..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : existing ? "Update" : "Save Artist"}
          </button>
          <Link href="/artists" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
