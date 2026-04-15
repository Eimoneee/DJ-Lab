import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-200">{value}</dd>
    </div>
  );
}

export default async function ArtistDetailPage({
  params,
}: {
  params: { artistId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: artist } = await supabase
    .from("artist_sound_maps")
    .select("*")
    .eq("id", params.artistId)
    .eq("user_id", user.id)
    .single();

  if (!artist) notFound();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/artists" className="text-sm text-gray-400 hover:text-gray-200">
            ← Back to Artists
          </Link>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{artist.name}</h1>
              {artist.genre_tags && artist.genre_tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {artist.genre_tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-600/20 px-2.5 py-0.5 text-xs text-brand-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link href={`/artists/${artist.id}/edit`} className="btn-primary shrink-0">
              Edit
            </Link>
          </div>
        </div>

        {/* Identity */}
        {(artist.signature_sounds || artist.key_tracks || artist.reference_artists) && (
          <Section title="Identity">
            <div className="space-y-4">
              <Field label="Signature Sounds" value={artist.signature_sounds} />
              <Field label="Key Tracks" value={artist.key_tracks} />
              <Field label="Similar / Influenced By" value={artist.reference_artists} />
            </div>
          </Section>
        )}

        {/* Recurring Production Traits */}
        {(artist.drum_patterns || artist.bass_style || artist.sample_palette || artist.arrangement_tendencies || artist.energy_flow || artist.production_notes) && (
          <Section title="Recurring Production Traits">
            <div className="space-y-4">
              <Field label="Drum Patterns" value={artist.drum_patterns} />
              <Field label="Bass Style" value={artist.bass_style} />
              <Field label="Sample Palette" value={artist.sample_palette} />
              <Field label="Arrangement Tendencies" value={artist.arrangement_tendencies} />
              <Field label="Energy Flow" value={artist.energy_flow} />
              <Field label="General Production Notes" value={artist.production_notes} />
            </div>
          </Section>
        )}

        {/* Recurring Mixing Traits */}
        {(artist.mixing_traits || artist.fx_techniques) && (
          <Section title="Recurring Mixing Traits">
            <div className="space-y-4">
              <Field label="Mixing Style" value={artist.mixing_traits} />
              <Field label="FX Techniques" value={artist.fx_techniques} />
            </div>
          </Section>
        )}

        <p className="text-xs text-gray-600">
          Last updated: {new Date(artist.updated_at).toLocaleDateString()}
        </p>
      </div>
    </AppShell>
  );
}
