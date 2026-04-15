import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import Link from "next/link";

export default async function ArtistsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: artists } = await supabase
    .from("artist_sound_maps")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Artist Sound Maps
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Study the sounds and techniques of artists you admire
            </p>
          </div>
          <Link href="/artists/new" className="btn-primary">
            + New Artist
          </Link>
        </div>

        {(artists ?? []).length === 0 ? (
          <div className="card text-center text-gray-400">
            <p className="text-lg">🎵</p>
            <p className="mt-2">No artists mapped yet.</p>
            <p className="text-sm">
              Start with a house or tech house artist you want to learn from.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {(artists ?? []).map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="card group transition-colors hover:border-brand-500/50"
              >
                <h3 className="font-medium text-white group-hover:text-brand-400">
                  {artist.name}
                </h3>
                {artist.genre_tags && artist.genre_tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {artist.genre_tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs text-brand-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {artist.signature_sounds && (
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {artist.signature_sounds}
                  </p>
                )}
                {/* Show trait summary badges */}
                {(artist.drum_patterns || artist.bass_style || artist.mixing_traits || artist.fx_techniques) && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {artist.drum_patterns && (
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">Drums</span>
                    )}
                    {artist.bass_style && (
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">Bass</span>
                    )}
                    {artist.mixing_traits && (
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">Mix</span>
                    )}
                    {artist.fx_techniques && (
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">FX</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
