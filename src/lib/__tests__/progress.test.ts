/**
 * Tests for progression logic utilities
 */

describe("Progression Logic", () => {
  // Helper that mirrors the dashboard's phase unlock logic
  function isPhaseUnlocked(
    moduleProgress: { pct: number }[],
    phaseIndex: number
  ): boolean {
    if (phaseIndex === 0) return true;
    const prevModule = moduleProgress[phaseIndex - 1];
    return prevModule.pct >= 80;
  }

  // Helper that mirrors the dashboard's "next lesson" logic
  function getNextLesson(
    orderedLessons: { id: string; title: string }[],
    completedIds: Set<string>
  ) {
    return orderedLessons.find((l) => !completedIds.has(l.id)) ?? null;
  }

  describe("isPhaseUnlocked", () => {
    it("should always unlock Phase 1", () => {
      const progress = [
        { pct: 0 },
        { pct: 0 },
        { pct: 0 },
        { pct: 0 },
      ];
      expect(isPhaseUnlocked(progress, 0)).toBe(true);
    });

    it("should lock Phase 2 when Phase 1 is below 80%", () => {
      const progress = [
        { pct: 70 },
        { pct: 0 },
        { pct: 0 },
        { pct: 0 },
      ];
      expect(isPhaseUnlocked(progress, 1)).toBe(false);
    });

    it("should unlock Phase 2 when Phase 1 is at 80%", () => {
      const progress = [
        { pct: 80 },
        { pct: 0 },
        { pct: 0 },
        { pct: 0 },
      ];
      expect(isPhaseUnlocked(progress, 1)).toBe(true);
    });

    it("should unlock Phase 2 when Phase 1 is at 100%", () => {
      const progress = [
        { pct: 100 },
        { pct: 0 },
        { pct: 0 },
        { pct: 0 },
      ];
      expect(isPhaseUnlocked(progress, 1)).toBe(true);
    });

    it("should lock Phase 3 when Phase 2 is below 80%", () => {
      const progress = [
        { pct: 100 },
        { pct: 50 },
        { pct: 0 },
        { pct: 0 },
      ];
      expect(isPhaseUnlocked(progress, 2)).toBe(false);
    });

    it("should unlock all phases when all previous are complete", () => {
      const progress = [
        { pct: 100 },
        { pct: 100 },
        { pct: 100 },
        { pct: 0 },
      ];
      expect(isPhaseUnlocked(progress, 0)).toBe(true);
      expect(isPhaseUnlocked(progress, 1)).toBe(true);
      expect(isPhaseUnlocked(progress, 2)).toBe(true);
      expect(isPhaseUnlocked(progress, 3)).toBe(true);
    });
  });

  describe("getNextLesson", () => {
    const lessons = [
      { id: "les-1", title: "Lesson 1" },
      { id: "les-2", title: "Lesson 2" },
      { id: "les-3", title: "Lesson 3" },
    ];

    it("should return first lesson when none completed", () => {
      const completed = new Set<string>();
      expect(getNextLesson(lessons, completed)).toEqual({
        id: "les-1",
        title: "Lesson 1",
      });
    });

    it("should return next uncompleted lesson", () => {
      const completed = new Set(["les-1"]);
      expect(getNextLesson(lessons, completed)).toEqual({
        id: "les-2",
        title: "Lesson 2",
      });
    });

    it("should skip completed lessons", () => {
      const completed = new Set(["les-1", "les-2"]);
      expect(getNextLesson(lessons, completed)).toEqual({
        id: "les-3",
        title: "Lesson 3",
      });
    });

    it("should return null when all completed", () => {
      const completed = new Set(["les-1", "les-2", "les-3"]);
      expect(getNextLesson(lessons, completed)).toBeNull();
    });
  });
});

describe("ProgressBar calculation", () => {
  function calcPct(value: number, max: number): number {
    return max > 0 ? Math.round((value / max) * 100) : 0;
  }

  it("should return 0 when max is 0", () => {
    expect(calcPct(0, 0)).toBe(0);
  });

  it("should return 0 when value is 0", () => {
    expect(calcPct(0, 10)).toBe(0);
  });

  it("should return 100 when value equals max", () => {
    expect(calcPct(10, 10)).toBe(100);
  });

  it("should round correctly", () => {
    expect(calcPct(1, 3)).toBe(33);
    expect(calcPct(2, 3)).toBe(67);
  });
});

describe("Seed data structure", () => {
  const seedData = require("../../data/seed-curriculum.json"); // eslint-disable-line

  it("should have 4 modules", () => {
    expect(seedData.modules).toHaveLength(4);
  });

  it("should have modules in correct order", () => {
    const orders = seedData.modules.map(
      (m: { order_index: number }) => m.order_index
    );
    expect(orders).toEqual([1, 2, 3, 4]);
  });

  it("should have lessons for every module", () => {
    for (const mod of seedData.modules) {
      const moduleLessons = seedData.lessons.filter(
        (l: { module_id: string }) => l.module_id === mod.id
      );
      expect(moduleLessons.length).toBeGreaterThan(0);
    }
  });

  it("should have exercises for every lesson", () => {
    for (const lesson of seedData.lessons) {
      const lessonExercises = seedData.exercises.filter(
        (e: { lesson_id: string }) => e.lesson_id === lesson.id
      );
      expect(lessonExercises.length).toBeGreaterThan(0);
    }
  });

  it("should have unique IDs for all entities", () => {
    const allIds = [
      ...seedData.modules.map((m: { id: string }) => m.id),
      ...seedData.lessons.map((l: { id: string }) => l.id),
      ...seedData.exercises.map((e: { id: string }) => e.id),
    ];
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it("every lesson should have content_md with objective and explanation", () => {
    for (const lesson of seedData.lessons) {
      expect(lesson.content_md).toContain("## Objective");
      expect(lesson.content_md).toContain("## Explanation");
      expect(lesson.content_md).toContain("## Common Mistakes");
      expect(lesson.content_md).toContain("## Success Checklist");
    }
  });

  it("Phase 1 should have 11 lessons", () => {
    const phase1Lessons = seedData.lessons.filter(
      (l: { module_id: string }) => l.module_id === "mod-phase1"
    );
    expect(phase1Lessons).toHaveLength(11);
  });

  it("Phase 2 should have 10 lessons", () => {
    const phase2Lessons = seedData.lessons.filter(
      (l: { module_id: string }) => l.module_id === "mod-phase2"
    );
    expect(phase2Lessons).toHaveLength(10);
  });

  it("Phase 3 should have 12 lessons", () => {
    const phase3Lessons = seedData.lessons.filter(
      (l: { module_id: string }) => l.module_id === "mod-phase3"
    );
    expect(phase3Lessons).toHaveLength(12);
  });

  it("Phase 4 should have 6 lessons", () => {
    const phase4Lessons = seedData.lessons.filter(
      (l: { module_id: string }) => l.module_id === "mod-phase4"
    );
    expect(phase4Lessons).toHaveLength(6);
  });
});
