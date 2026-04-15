import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import MarkdownContent from "@/components/MarkdownContent";
import Link from "next/link";
import LessonActions from "./LessonActions";

export default async function LessonPage({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: lesson }, { data: module }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("id", params.lessonId)
      .single(),
    supabase
      .from("modules")
      .select("title, icon")
      .eq("id", params.moduleId)
      .single(),
  ]);

  if (!lesson || !module) notFound();

  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("lesson_id", params.lessonId)
    .order("order_index");

  const { data: lessonProgress } = await supabase
    .from("user_lesson_progress")
    .select("completed")
    .eq("user_id", user.id)
    .eq("lesson_id", params.lessonId)
    .maybeSingle();

  const { data: exerciseProgress } = await supabase
    .from("user_exercise_progress")
    .select("exercise_id, completed")
    .eq("user_id", user.id);

  const completedExerciseIds = new Set(
    exerciseProgress
      ?.filter((p) => p.completed)
      .map((p) => p.exercise_id) ?? []
  );

  const isLessonCompleted = lessonProgress?.completed ?? false;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link
            href={`/curriculum/${params.moduleId}`}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            ← {module.icon} {module.title}
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white">
            {lesson.title}
          </h1>
          <p className="mt-1 text-sm text-gray-400">{lesson.description}</p>
        </div>

        {/* Lesson content */}
        <div className="card">
          <MarkdownContent content={lesson.content_md} />
        </div>

        {/* Exercises */}
        {(exercises ?? []).length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Exercises</h2>
            {(exercises ?? []).map((exercise) => {
              const isDone = completedExerciseIds.has(exercise.id);
              return (
                <div
                  key={exercise.id}
                  className="card flex items-start gap-3"
                >
                  <LessonActions
                    type="exercise"
                    id={exercise.id}
                    userId={user.id}
                    completed={isDone}
                  />
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${isDone ? "text-gray-500 line-through" : "text-white"}`}
                    >
                      {exercise.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {exercise.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mark lesson complete */}
        <div className="card flex items-center justify-between">
          <div>
            <p className="font-medium text-white">
              {isLessonCompleted ? "Lesson completed!" : "Done with this lesson?"}
            </p>
            <p className="text-sm text-gray-400">
              {isLessonCompleted
                ? "Great work. Keep it up."
                : "Mark it complete to track your progress."}
            </p>
          </div>
          <LessonActions
            type="lesson"
            id={params.lessonId}
            userId={user.id}
            completed={isLessonCompleted}
          />
        </div>
      </div>
    </AppShell>
  );
}
