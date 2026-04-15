import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import Link from "next/link";

export default async function LabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tracks } = await supabase
    .from("track_analyses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Reverse-Engineering Lab
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Break down reference tracks to understand what makes them work
            </p>
          </div>
          <Link href="/lab/new" className="btn-primary">
            + New Analysis
          </Link>
        </div>

        {(tracks ?? []).length === 0 ? (
          <div className="card text-center text-gray-400">
            <p className="text-lg">🔬</p>
            <p className="mt-2">No tracks analyzed yet.</p>
            <p className="text-sm">
              Start by picking a house or tech house track you love.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {(tracks ?? []).map((track) => (
              <Link
                key={track.id}
                href={`/lab/${track.id}`}
                className="card group transition-colors hover:border-brand-500/50"
              >
                <h3 className="font-medium text-white group-hover:text-brand-400">
                  {track.track_name}
                </h3>
                <p className="text-sm text-gray-400">{track.artist}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {track.bpm && (
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                      {track.bpm} BPM
                    </span>
                  )}
                  {track.key && (
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                      {track.key}
                    </span>
                  )}
                  {track.genre && (
                    <span className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs text-brand-400">
                      {track.genre}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
