import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import PracticeForm from "./PracticeForm";
import PracticeList from "./PracticeList";

export default async function PracticePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: logs } = await supabase
    .from("practice_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const totalMinutes = (logs ?? []).reduce(
    (sum, l) => sum + l.duration_minutes,
    0
  );
  const totalSessions = (logs ?? []).length;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Practice Log</h1>
          <p className="mt-1 text-sm text-gray-400">
            Track your DJ practice sessions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">
              {totalSessions}
            </p>
            <p className="mt-1 text-xs text-gray-400">Total Sessions</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">
              {totalMinutes}
            </p>
            <p className="mt-1 text-xs text-gray-400">Total Minutes</p>
          </div>
          <div className="card text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-brand-400">
              {Math.round(totalMinutes / 60)}
            </p>
            <p className="mt-1 text-xs text-gray-400">Total Hours</p>
          </div>
        </div>

        {/* New entry form */}
        <PracticeForm userId={user.id} />

        {/* Log list */}
        <PracticeList logs={logs ?? []} />
      </div>
    </AppShell>
  );
}
