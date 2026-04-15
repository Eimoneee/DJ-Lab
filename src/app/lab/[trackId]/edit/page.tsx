import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import TrackForm from "../../TrackForm";

export default async function EditTrackPage({
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
      <TrackForm userId={user.id} existing={track} />
    </AppShell>
  );
}
