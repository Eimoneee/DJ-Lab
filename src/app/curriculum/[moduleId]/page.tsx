import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Link from "next/link";

export default async function ModulePage({
  params,
}: {
  params: { moduleId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("id", params.moduleId)
    .single();

  if (!module) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", params.moduleId)
    .order("order_index");

  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  const completedLessonIds = new Set(
    progress?.map((p) => p.lesson_id) ?? []
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link
            href="/curriculum"
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            ← Back to Curriculum
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl">{module.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{module.title}</h1>
              <p className="text-sm text-gray-400">{module.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {(lessons ?? []).map((lesson, idx) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/curriculum/${params.moduleId}/${lesson.id}`}
                className="card group flex items-center gap-4 transition-colors hover:border-brand-500/50"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    isCompleted
                      ? "bg-brand-600 text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white group-hover:text-brand-400">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-400">{lesson.description}</p>
                </div>
              </Link>
            );
          })}

          {(lessons ?? []).length === 0 && (
            <div className="card text-center text-gray-400">
              <p>No lessons in this module yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
