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
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    const now = new Date().toISOString();

    if (type === "lesson") {
      if (!isDone) {
        await supabase.from("user_lesson_progress").upsert(
          {
            user_id: userId,
            lesson_id: id,
            completed: true,
            completed_at: now,
          },
          { onConflict: "user_id,lesson_id" }
        );
      } else {
        await supabase
          .from("user_lesson_progress")
          .update({ completed: false, completed_at: null })
          .eq("user_id", userId)
          .eq("lesson_id", id);
      }
    } else {
      if (!isDone) {
        await supabase.from("user_exercise_progress").upsert(
          {
            user_id: userId,
            exercise_id: id,
            completed: true,
            completed_at: now,
          },
          { onConflict: "user_id,exercise_id" }
        );
      } else {
        await supabase
          .from("user_exercise_progress")
          .update({ completed: false, completed_at: null })
          .eq("user_id", userId)
          .eq("exercise_id", id);
      }
    }

    setIsDone(!isDone);
    setLoading(false);
    router.refresh();
  };

  if (type === "exercise") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
          isDone
            ? "border-brand-500 bg-brand-600 text-white"
            : "border-gray-600 hover:border-brand-500"
        }`}
      >
        {isDone && <span className="text-xs">✓</span>}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={isDone ? "btn-secondary" : "btn-primary"}
    >
      {loading ? "..." : isDone ? "Undo" : "Mark Complete"}
    </button>
  );
}
