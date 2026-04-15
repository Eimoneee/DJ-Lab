"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface LessonActionsProps {
  type: "lesson" | "exercise";
  id: string;
  userId: string;
  completed: boolean;
}

export default function LessonActions({
  type,
  id,
  userId,
  completed,
}: LessonActionsProps) {
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(completed);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      let result: { error: { message: string } | null };

      if (type === "lesson") {
        if (!isDone) {
          result = await supabase.from("user_lesson_progress").upsert(
            {
              user_id: userId,
              lesson_id: id,
              completed: true,
              completed_at: now,
            },
            { onConflict: "user_id,lesson_id" }
          );
        } else {
          result = await supabase
            .from("user_lesson_progress")
            .update({ completed: false, completed_at: null })
            .eq("user_id", userId)
            .eq("lesson_id", id);
        }
      } else {
        if (!isDone) {
          result = await supabase.from("user_exercise_progress").upsert(
            {
              user_id: userId,
              exercise_id: id,
              completed: true,
              completed_at: now,
            },
            { onConflict: "user_id,exercise_id" }
          );
        } else {
          result = await supabase
            .from("user_exercise_progress")
            .update({ completed: false, completed_at: null })
            .eq("user_id", userId)
            .eq("exercise_id", id);
        }
      }

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setIsDone(!isDone);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (type === "exercise") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          disabled={loading}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
            isDone
              ? "border-brand-500 bg-brand-600 text-white"
              : error
                ? "border-red-500"
                : "border-gray-600 hover:border-brand-500"
          }`}
          title={error ?? undefined}
        >
          {isDone && <span className="text-xs">✓</span>}
        </button>
        {error && (
          <span className="text-xs text-red-400" title={error}>!</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        disabled={loading}
        className={isDone ? "btn-secondary" : "btn-primary"}
      >
        {loading ? "..." : isDone ? "Undo" : "Mark Complete"}
      </button>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
