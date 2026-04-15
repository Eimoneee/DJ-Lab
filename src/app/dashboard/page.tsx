import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all data in parallel
  const [modulesRes, lessonsRes, progressRes, practiceRes, tracksRes] =
    await Promise.all([
      supabase.from("modules").select("*").order("order_index"),
      supabase
        .from("lessons")
        .select("id, module_id, title, order_index")
        .order("order_index"),
      supabase
        .from("user_lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true),
      supabase
        .from("practice_logs")
        .select("id, duration_minutes, date")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(7),
      supabase
        .from("track_analyses")
        .select("id")
        .eq("user_id", user.id),
    ]);

  const modules = modulesRes.data ?? [];
  const lessons = lessonsRes.data ?? [];
  const completedLessonIds = new Set(
    progressRes.data?.map((p) => p.lesson_id) ?? []
  );
  const recentPractice = practiceRes.data ?? [];
  const totalPracticeMinutes = recentPractice.reduce(
    (sum, log) => sum + log.duration_minutes,
    0
  );
  const tracksAnalyzed = tracksRes.data?.length ?? 0;
  const totalLessons = lessons.length;
  const completedLessons = completedLessonIds.size;

  // Determine current lesson, last completed, and next up
  const moduleOrder = modules.map((m) => m.id);
  const orderedLessons = moduleOrder.flatMap((modId) =>
    lessons
      .filter((l) => l.module_id === modId)
      .sort((a, b) => a.order_index - b.order_index)
  );

  const nextLesson = orderedLessons.find(
    (l) => !completedLessonIds.has(l.id)
  );

  const completedLessonsOrdered = orderedLessons.filter((l) =>
    completedLessonIds.has(l.id)
  );
  const lastCompleted =
    completedLessonsOrdered.length > 0
      ? completedLessonsOrdered[completedLessonsOrdered.length - 1]
      : null;

  const nextLessonIdx = nextLesson
    ? orderedLessons.indexOf(nextLesson)
    : -1;
  const upcomingLesson =
    nextLessonIdx >= 0 && nextLessonIdx + 1 < orderedLessons.length
      ? orderedLessons[nextLessonIdx + 1]
      : null;

  const getModuleForLesson = (lessonModuleId: string) =>
    modules.find((m) => m.id === lessonModuleId);

  // Per-module progress for phase unlocking
  const moduleProgress = modules.map((mod) => {
    const modLessons = lessons.filter((l) => l.module_id === mod.id);
    const completed = modLessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;
    const total = modLessons.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { ...mod, completed, total, pct };
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Welcome back. Keep pushing forward.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">
              {completedLessons}
            </p>
            <p className="mt-1 text-xs text-gray-400">Lessons Done</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">{totalLessons}</p>
            <p className="mt-1 text-xs text-gray-400">Total Lessons</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">
              {totalPracticeMinutes}
            </p>
            <p className="mt-1 text-xs text-gray-400">Min This Week</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-brand-400">
              {tracksAnalyzed}
            </p>
            <p className="mt-1 text-xs text-gray-400">Tracks Analyzed</p>
          </div>
        </div>

        {/* Current / Next / Last lesson cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {nextLesson ? (
            <Link
              href={`/curriculum/${nextLesson.module_id}/${nextLesson.id}`}
              className="card group border-brand-500/30 transition-colors hover:border-brand-500/60"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-brand-400">
                Current Lesson
              </p>
              <h3 className="mt-2 font-medium text-white group-hover:text-brand-400">
                {nextLesson.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {getModuleForLesson(nextLesson.module_id)?.icon}{" "}
                {getModuleForLesson(nextLesson.module_id)?.title}
              </p>
            </Link>
          ) : (
            <div className="card border-green-500/30">
              <p className="text-xs font-medium uppercase tracking-wider text-green-400">
                All Done!
              </p>
              <h3 className="mt-2 font-medium text-white">
                Curriculum Complete
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Keep practicing and analyzing tracks
              </p>
            </div>
          )}

          {lastCompleted ? (
            <Link
              href={`/curriculum/${lastCompleted.module_id}/${lastCompleted.id}`}
              className="card group transition-colors hover:border-gray-600"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Last Completed
              </p>
              <h3 className="mt-2 font-medium text-gray-300 group-hover:text-white">
                {lastCompleted.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {getModuleForLesson(lastCompleted.module_id)?.icon}{" "}
                {getModuleForLesson(lastCompleted.module_id)?.title}
              </p>
            </Link>
          ) : (
            <div className="card">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Last Completed
              </p>
              <h3 className="mt-2 font-medium text-gray-500">Nothing yet</h3>
              <p className="mt-1 text-xs text-gray-600">
                Start your first lesson!
              </p>
            </div>
          )}

          {upcomingLesson ? (
            <Link
              href={`/curriculum/${upcomingLesson.module_id}/${upcomingLesson.id}`}
              className="card group transition-colors hover:border-gray-600"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Up Next
              </p>
              <h3 className="mt-2 font-medium text-gray-300 group-hover:text-white">
                {upcomingLesson.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {getModuleForLesson(upcomingLesson.module_id)?.icon}{" "}
                {getModuleForLesson(upcomingLesson.module_id)?.title}
              </p>
            </Link>
          ) : (
            <div className="card">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Up Next
              </p>
              <h3 className="mt-2 font-medium text-gray-500">
                {nextLesson
                  ? "Last lesson in progress"
                  : "You're all caught up"}
              </h3>
            </div>
          )}
        </div>

        {/* Phase progress */}
        <div className="card">
          <h2 className="mb-4 text-sm font-medium text-gray-300">
            Phase Progress
          </h2>
          <div className="space-y-4">
            {moduleProgress.map((mod, idx) => {
              const prevModule = idx > 0 ? moduleProgress[idx - 1] : null;
              const isUnlocked = !prevModule || prevModule.pct >= 80;
              return (
                <div
                  key={mod.id}
                  className={!isUnlocked ? "opacity-50" : ""}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{mod.icon}</span>
                      <span className="text-sm font-medium text-gray-200">
                        {mod.title}
                      </span>
                      {!isUnlocked && (
                        <span className="shrink-0 rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                          🔒 Locked
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {mod.completed}/{mod.total}
                    </span>
                  </div>
                  <ProgressBar
                    value={mod.completed}
                    max={mod.total}
                    className="mt-1"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/curriculum"
            className="card group flex items-center gap-4 transition-colors hover:border-brand-500/50"
          >
            <span className="text-3xl">📚</span>
            <div>
              <p className="font-medium text-white group-hover:text-brand-400">
                Continue Learning
              </p>
              <p className="text-xs text-gray-400">
                Pick up where you left off
              </p>
            </div>
          </Link>
          <Link
            href="/practice"
            className="card group flex items-center gap-4 transition-colors hover:border-brand-500/50"
          >
            <span className="text-3xl">🎧</span>
            <div>
              <p className="font-medium text-white group-hover:text-brand-400">
                Log Practice
              </p>
              <p className="text-xs text-gray-400">Record a session</p>
            </div>
          </Link>
          <Link
            href="/lab"
            className="card group flex items-center gap-4 transition-colors hover:border-brand-500/50"
          >
            <span className="text-3xl">🔬</span>
            <div>
              <p className="font-medium text-white group-hover:text-brand-400">
                Analyze a Track
              </p>
              <p className="text-xs text-gray-400">
                Reverse-engineer a reference
              </p>
            </div>
          </Link>
        </div>

        {/* Recent practice */}
        {recentPractice.length > 0 && (
          <div className="card">
            <h2 className="mb-3 text-sm font-medium text-gray-300">
              Recent Practice
            </h2>
            <div className="space-y-2">
              {recentPractice.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2 text-sm"
                >
                  <span className="text-gray-300">{log.date}</span>
                  <span className="text-brand-400">
                    {log.duration_minutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
