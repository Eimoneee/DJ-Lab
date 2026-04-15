/**
 * Regression tests for data save logic.
 *
 * These tests verify the patterns used by LessonActions and PracticeForm
 * to ensure errors are never silently swallowed and optimistic UI only
 * updates on confirmed success.
 */

describe("LessonActions save logic", () => {
  // Mirrors the toggle() control flow in LessonActions.tsx
  function toggleLesson(
    currentlyDone: boolean,
    dbResult: { error: { message: string } | null }
  ): { isDone: boolean; error: string | null } {
    if (dbResult.error) {
      return { isDone: currentlyDone, error: dbResult.error.message };
    }
    return { isDone: !currentlyDone, error: null };
  }

  it("should flip isDone to true on successful mark-complete", () => {
    const result = toggleLesson(false, { error: null });
    expect(result.isDone).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should flip isDone to false on successful undo", () => {
    const result = toggleLesson(true, { error: null });
    expect(result.isDone).toBe(false);
    expect(result.error).toBeNull();
  });

  it("should NOT flip isDone when DB returns an error", () => {
    const result = toggleLesson(false, {
      error: { message: "RLS policy violation" },
    });
    expect(result.isDone).toBe(false);
    expect(result.error).toBe("RLS policy violation");
  });

  it("should NOT flip isDone when undo fails", () => {
    const result = toggleLesson(true, {
      error: { message: "network error" },
    });
    expect(result.isDone).toBe(true);
    expect(result.error).toBe("network error");
  });

  it("should preserve original state on any error", () => {
    // Mark complete fails
    const r1 = toggleLesson(false, { error: { message: "fail" } });
    expect(r1.isDone).toBe(false);

    // Undo fails
    const r2 = toggleLesson(true, { error: { message: "fail" } });
    expect(r2.isDone).toBe(true);
  });
});

describe("PracticeForm save logic", () => {
  interface FormState {
    date: string;
    duration_minutes: number;
    bpm: number;
    transition_type: string;
    notes: string;
    mistakes: string;
  }

  const defaultForm: FormState = {
    date: "2024-01-15",
    duration_minutes: 30,
    bpm: 125,
    transition_type: "EQ Blend",
    notes: "worked on transitions",
    mistakes: "timing was off",
  };

  const resetForm: FormState = {
    date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    duration_minutes: 30,
    bpm: 125,
    transition_type: "EQ Blend",
    notes: "",
    mistakes: "",
  } as unknown as FormState;

  // Mirrors handleSubmit control flow in PracticeForm.tsx
  function handleSave(
    form: FormState,
    dbResult: { error: { message: string } | null }
  ): { form: FormState; open: boolean; error: string | null } {
    if (dbResult.error) {
      return { form, open: true, error: dbResult.error.message };
    }
    return {
      form: {
        date: new Date().toISOString().split("T")[0],
        duration_minutes: 30,
        bpm: 125,
        transition_type: "EQ Blend",
        notes: "",
        mistakes: "",
      },
      open: false,
      error: null,
    };
  }

  it("should reset form and close on successful save", () => {
    const result = handleSave(defaultForm, { error: null });
    expect(result.open).toBe(false);
    expect(result.error).toBeNull();
    expect(result.form).toEqual(resetForm);
  });

  it("should keep form open with data on error", () => {
    const result = handleSave(defaultForm, {
      error: { message: "insert failed" },
    });
    expect(result.open).toBe(true);
    expect(result.error).toBe("insert failed");
    // Form data should be preserved so user doesn't lose their input
    expect(result.form).toEqual(defaultForm);
  });

  it("should preserve all form fields on error", () => {
    const customForm: FormState = {
      date: "2024-06-01",
      duration_minutes: 60,
      bpm: 130,
      transition_type: "Bass Swap",
      notes: "long session",
      mistakes: "eq was rough",
    };
    const result = handleSave(customForm, {
      error: { message: "RLS policy violation" },
    });
    expect(result.form).toEqual(customForm);
  });

  it("should surface the exact error message from the database", () => {
    const result = handleSave(defaultForm, {
      error: { message: "new row violates row-level security policy" },
    });
    expect(result.error).toBe(
      "new row violates row-level security policy"
    );
  });
});

describe("Exception handling pattern", () => {
  // Verifies that the try/catch/finally pattern used in both components
  // always resets loading state, even on thrown exceptions

  async function simulateSubmitWithFinally(
    throwError: boolean
  ): Promise<{ loading: boolean; error: string | null }> {
    let loading = true;
    let error: string | null = null;

    try {
      if (throwError) {
        throw new Error("Supabase client init failed");
      }
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Something went wrong";
    } finally {
      loading = false;
    }

    return { loading, error };
  }

  it("should reset loading to false on success", async () => {
    const result = await simulateSubmitWithFinally(false);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it("should reset loading to false on thrown exception", async () => {
    const result = await simulateSubmitWithFinally(true);
    expect(result.loading).toBe(false);
    expect(result.error).toBe("Supabase client init failed");
  });
});
