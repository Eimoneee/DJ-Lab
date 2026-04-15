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

function EnergyBar({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Energy</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <div
            key={level}
            className={`h-3 w-3 rounded-sm ${
              rating >= level ? "bg-brand-500" : "bg-gray-800"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-300">{rating}/10</span>
    </div>
  );
}

export default async function TrackDetailPage({
  params,
}: {
  params: { trackId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: track } = await supabase
    .from("track_analyses")
    .select("*")
    .eq("id", params.trackId)
    .eq("user_id", user.id)
    .single();

  if (!track) notFound();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/lab" className="text-sm text-gray-400 hover:text-gray-200">
            ← Back to Lab
          </Link>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{track.track_name}</h1>
              <p className="text-gray-400">{track.artist}</p>
            </div>
            <Link href={`/lab/${track.id}/edit`} className="btn-primary shrink-0">
              Edit
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {track.bpm && (
              <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300">
                {track.bpm} BPM
              </span>
            )}
            {track.key && (
              <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300">
                Key: {track.key}
              </span>
            )}
            {track.genre && (
              <span className="rounded-full bg-brand-600/20 px-2.5 py-0.5 text-xs text-brand-400">
                {track.genre}
              </span>
            )}
            {track.subgenre && (
              <span className="rounded-full bg-brand-600/10 px-2.5 py-0.5 text-xs text-brand-300">
                {track.subgenre}
              </span>
            )}
          </div>
          <div className="mt-3">
            <EnergyBar rating={track.energy_rating} />
          </div>
        </div>

        {/* Reference Notes */}
        {track.reference_notes && (
          <Section title="Reference Notes">
            <Field label="General Notes" value={track.reference_notes} />
          </Section>
        )}

        {/* Sound Analysis */}
        {(track.drums_analysis || track.bassline_analysis || track.groove_swing_notes) && (
          <Section title="Sound Analysis">
            <div className="space-y-4">
              <Field label="Drums Analysis" value={track.drums_analysis} />
              <Field label="Bassline Analysis" value={track.bassline_analysis} />
              <Field label="Groove / Swing Notes" value={track.groove_swing_notes} />
            </div>
          </Section>
        )}

        {/* Arrangement & Structure */}
        {(track.arrangement_timeline || track.tension_release) && (
          <Section title="Arrangement & Structure">
            <div className="space-y-4">
              <Field label="Arrangement Timeline (in bars)" value={track.arrangement_timeline} />
              <Field label="Tension / Release Notes" value={track.tension_release} />
            </div>
          </Section>
        )}

        {/* FX & Production */}
        {track.fx_notes && (
          <Section title="FX & Production">
            <Field label="FX Notes" value={track.fx_notes} />
          </Section>
        )}

        {/* Study & Learning */}
        {(track.study_loop_ideas || track.distinctive_elements || track.curriculum_connections) && (
          <Section title="Study & Learning">
            <div className="space-y-4">
              <Field label="What to Recreate in a Study Loop" value={track.study_loop_ideas} />
              <Field label="What Makes This Track Distinctive" value={track.distinctive_elements} />
              <Field label="Curriculum Connections" value={track.curriculum_connections} />
            </div>
          </Section>
        )}

        {/* Legacy fields - show if populated */}
        {(track.structure || track.sound_design || track.mixing_notes || track.what_works) && (
          <Section title="Additional Notes">
            <div className="space-y-4">
              <Field label="Structure Breakdown" value={track.structure} />
              <Field label="Sound Design Notes" value={track.sound_design} />
              <Field label="Mixing Notes" value={track.mixing_notes} />
              <Field label="What Makes It Work" value={track.what_works} />
            </div>
          </Section>
        )}

        <p className="text-xs text-gray-600">
          Last updated: {new Date(track.updated_at).toLocaleDateString()}
        </p>
      </div>
    </AppShell>
  );
}
