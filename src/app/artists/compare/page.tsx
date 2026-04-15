import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import CompareClient from "./CompareClient";

export default async function ComparePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: artists } = await supabase
    .from("artist_sound_maps")
    .select("id, name, genre_tags, taxonomy, summary")
    .eq("user_id", user.id)
    .order("name");

  return (
    <AppShell>
      <CompareClient artists={artists ?? []} />
    </AppShell>
  );
}
