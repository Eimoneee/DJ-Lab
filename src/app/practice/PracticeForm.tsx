"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TRANSITION_TYPES = [
  "Cut",
  "Fade",
  "EQ Blend",
  "Filter Sweep",
  "Bass Swap",
  "Loop Blend",
  "Echo Out",
  "Other",
];

export default function PracticeForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    duration_minutes: 30,
    bpm: 125,
    transition_type: "EQ Blend",
    notes: "",
    mistakes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("practice_logs").insert({
      user_id: userId,
      ...form,
    });

    if (!error) {
      setForm({
        date: new Date().toISOString().split("T")[0],
        duration_minutes: 30,
        bpm: 125,
        transition_type: "EQ Blend",
        notes: "",
        mistakes: "",
      });
      setOpen(false);
      router.refresh();
    }

    setLoading(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        + Log Practice Session
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-white">New Practice Session</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="label">Date</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="label">Duration (minutes)</label>
          <input
            id="duration"
            type="number"
            value={form.duration_minutes}
            onChange={(e) =>
              setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })
            }
            className="input"
            min={1}
            required
          />
        </div>
        <div>
          <label htmlFor="bpm" className="label">BPM Practiced</label>
          <input
            id="bpm"
            type="number"
            value={form.bpm}
            onChange={(e) =>
              setForm({ ...form, bpm: parseInt(e.target.value) || 0 })
            }
            className="input"
            min={60}
            max={200}
          />
        </div>
        <div>
          <label htmlFor="transition" className="label">Transition Type</label>
          <select
            id="transition"
            value={form.transition_type}
            onChange={(e) =>
              setForm({ ...form, transition_type: e.target.value })
            }
            className="input"
          >
            {TRANSITION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="input min-h-[80px]"
          placeholder="What did you work on?"
        />
      </div>

      <div>
        <label htmlFor="mistakes" className="label">Mistakes / Areas to Improve</label>
        <textarea
          id="mistakes"
          value={form.mistakes}
          onChange={(e) => setForm({ ...form, mistakes: e.target.value })}
          className="input min-h-[80px]"
          placeholder="What went wrong? What needs more work?"
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : "Save Session"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
