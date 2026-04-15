import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";

export default async function CurriculumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .order("order_index");

  // Fetch lessons and progress for each module
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id")
    .order("order_index");

  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  const completedLessonIds = new Set(
    progress?.map((p) => p.lesson_id) ?? []
  );

  const moduleStats = (modules ?? []).map((mod) => {
    const moduleLessons = (lessons ?? []).filter(
      (l) => l.module_id === mod.id
    );
    const completed = moduleLessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;
    return {
      ...mod,
      totalLessons: moduleLessons.length,
      completedLessons: completed,
    };
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Curriculum</h1>
          <p className="mt-1 text-sm text-gray-400">
            Structured learning path for house &amp; tech house DJing
          </p>
        </div>

        <div className="space-y-4">
          {moduleStats.map((mod) => (
            <Link
              key={mod.id}
              href={`/curriculum/${mod.id}`}
              className="card group block transition-colors hover:border-brand-500/50"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{mod.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-white group-hover:text-brand-400">
                    {mod.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {mod.description}
                  </p>
                  <ProgressBar
                    value={mod.completedLessons}
                    max={mod.totalLessons}
                    className="mt-3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {mod.completedLessons} / {mod.totalLessons} lessons
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {moduleStats.length === 0 && (
            <div className="card text-center text-gray-400">
              <p>No modules yet. Run the seed script to add content.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
