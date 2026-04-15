import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import ArtistForm from "../../ArtistForm";

export default async function EditArtistPage({
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
      <ArtistForm userId={user.id} existing={artist} />
    </AppShell>
  );
}
