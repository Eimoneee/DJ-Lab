"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type PracticeLog = Database["public"]["Tables"]["practice_logs"]["Row"];

export default function PracticeList({ logs }: { logs: PracticeLog[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this practice log?")) return;
    const supabase = createClient();
    await supabase.from("practice_logs").delete().eq("id", id);
    router.refresh();
  };

  if (logs.length === 0) {
    return (
      <div className="card text-center text-gray-400">
        <p>No practice sessions logged yet. Start practicing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">History</h2>
      {logs.map((log) => (
        <div key={log.id} className="card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-white">
                  {log.date}
                </span>
                <span className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs font-medium text-brand-400">
                  {log.duration_minutes} min
                </span>
                {log.bpm && (
                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                    {log.bpm} BPM
                  </span>
                )}
                {log.transition_type && (
                  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                    {log.transition_type}
                  </span>
                )}
              </div>
              {log.notes && (
                <p className="mt-2 text-sm text-gray-300">{log.notes}</p>
              )}
              {log.mistakes && (
                <p className="mt-1 text-sm text-red-400/80">
                  ⚠ {log.mistakes}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(log.id)}
              className="ml-2 flex-shrink-0 text-xs text-gray-600 hover:text-red-400"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
