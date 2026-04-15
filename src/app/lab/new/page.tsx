import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import TrackForm from "../TrackForm";

export default async function NewTrackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <AppShell>
      <TrackForm userId={user.id} />
    </AppShell>
  );
}
