import {
  barsToSeconds,
  barsToTimeString,
  formatTime,
  parseArrangementTimeline,
  totalBars,
  totalDuration,
} from "../bar-math";

// ── barsToSeconds ───────────────────────────────────────────────────

describe("barsToSeconds", () => {
  it("converts bars at 120 BPM correctly (16 bars = 32s)", () => {
    // 16 bars × 4 beats / 120 BPM × 60 = 32 seconds
    expect(barsToSeconds(16, 120)).toBe(32);
  });

  it("converts bars at 128 BPM correctly (16 bars = 30s)", () => {
    expect(barsToSeconds(16, 128)).toBe(30);
  });

  it("converts 1 bar at 60 BPM (= 4 seconds)", () => {
    expect(barsToSeconds(1, 60)).toBe(4);
  });

  it("returns 0 for zero bars", () => {
    expect(barsToSeconds(0, 128)).toBe(0);
  });

  it("returns 0 for zero BPM", () => {
    expect(barsToSeconds(16, 0)).toBe(0);
  });

  it("returns 0 for negative inputs", () => {
    expect(barsToSeconds(-4, 128)).toBe(0);
    expect(barsToSeconds(16, -10)).toBe(0);
  });
});

// ── formatTime ──────────────────────────────────────────────────────

describe("formatTime", () => {
  it("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("formats 30 seconds", () => {
    expect(formatTime(30)).toBe("0:30");
  });

  it("formats 90 seconds as 1:30", () => {
    expect(formatTime(90)).toBe("1:30");
  });

  it("formats 5 seconds with leading zero", () => {
    expect(formatTime(5)).toBe("0:05");
  });

  it("returns 0:00 for negative input", () => {
    expect(formatTime(-10)).toBe("0:00");
  });
});

// ── barsToTimeString ────────────────────────────────────────────────

describe("barsToTimeString", () => {
  it("16 bars at 128 BPM = 0:30", () => {
    expect(barsToTimeString(16, 128)).toBe("0:30");
  });

  it("32 bars at 128 BPM = 1:00", () => {
    expect(barsToTimeString(32, 128)).toBe("1:00");
  });
});

// ── parseArrangementTimeline ────────────────────────────────────────

describe("parseArrangementTimeline", () => {
  it("returns empty array for empty string", () => {
    expect(parseArrangementTimeline("")).toEqual([]);
    expect(parseArrangementTimeline("   ")).toEqual([]);
  });

  it("parses 'Name (N bars): description' format", () => {
    const result = parseArrangementTimeline(
      "Intro (16 bars): kicks + hats only"
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Intro");
    expect(result[0].bars).toBe(16);
    expect(result[0].description).toBe("kicks + hats only");
  });

  it("parses multiple lines", () => {
    const text = [
      "Intro (16 bars): kicks + hats only",
      "Build (8 bars): bass enters, filter opens",
      "Drop (16 bars): full groove, vocal chop",
      "Breakdown (16 bars): stripped back",
      "Drop 2 (16 bars): full energy",
      "Outro (16 bars): elements removed gradually",
    ].join("\n");

    const result = parseArrangementTimeline(text);
    expect(result).toHaveLength(6);
    expect(result[0]).toEqual({
      name: "Intro",
      bars: 16,
      description: "kicks + hats only",
    });
    expect(result[1]).toEqual({
      name: "Build",
      bars: 8,
      description: "bass enters, filter opens",
    });
    expect(result[4].name).toBe("Drop 2");
    expect(result[4].bars).toBe(16);
  });

  it("parses lines without bar counts (bars = 0)", () => {
    const result = parseArrangementTimeline("Some freeform note");
    expect(result).toHaveLength(1);
    expect(result[0].bars).toBe(0);
    expect(result[0].name).toBe("Some freeform note");
  });

  it("skips empty lines", () => {
    const result = parseArrangementTimeline("Intro (16 bars): test\n\nDrop (8 bars): full");
    expect(result).toHaveLength(2);
  });

  it("handles 'N bars' without parentheses", () => {
    const result = parseArrangementTimeline("Intro 16 bars: kicks only");
    expect(result).toHaveLength(1);
    expect(result[0].bars).toBe(16);
  });
});

// ── totalBars / totalDuration ───────────────────────────────────────

describe("totalBars", () => {
  it("sums all section bars", () => {
    const sections = [
      { name: "Intro", bars: 16, description: "" },
      { name: "Drop", bars: 32, description: "" },
      { name: "Outro", bars: 16, description: "" },
    ];
    expect(totalBars(sections)).toBe(64);
  });

  it("returns 0 for empty array", () => {
    expect(totalBars([])).toBe(0);
  });
});

describe("totalDuration", () => {
  it("computes total seconds from sections + BPM", () => {
    const sections = [
      { name: "Intro", bars: 16, description: "" },
      { name: "Drop", bars: 16, description: "" },
    ];
    // 32 bars at 128 BPM = 60 seconds
    expect(totalDuration(sections, 128)).toBe(60);
  });
});
