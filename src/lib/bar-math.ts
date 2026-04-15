/**
 * BPM / bar-to-time utilities for the reverse-engineering lab.
 *
 * House music is 4/4 time — 4 beats per bar.
 * seconds_per_bar = (beatsPerBar / bpm) * 60
 */

export interface TimelineSection {
  /** Section name, e.g. "Intro", "Drop", "Breakdown" */
  name: string;
  /** Number of bars in this section */
  bars: number;
  /** Optional description of what happens in this section */
  description: string;
}

// ── Core math ───────────────────────────────────────────────────────

const BEATS_PER_BAR = 4; // 4/4 time

/** Convert a bar count + BPM to seconds. Returns 0 for invalid inputs. */
export function barsToSeconds(bars: number, bpm: number): number {
  if (bars <= 0 || bpm <= 0) return 0;
  return (bars * BEATS_PER_BAR * 60) / bpm;
}

/** Format seconds as "m:ss" (e.g. 30 → "0:30", 90 → "1:30"). */
export function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Shorthand: bars + BPM → formatted time string. */
export function barsToTimeString(bars: number, bpm: number): string {
  return formatTime(barsToSeconds(bars, bpm));
}

// ── Timeline parser ─────────────────────────────────────────────────

/**
 * Parse a free-form arrangement timeline string into structured sections.
 *
 * Accepted formats (one section per line):
 *   "Intro (16 bars): kicks + hats only"
 *   "Intro (16 bars) - kicks + hats only"
 *   "Intro - 16 bars: kicks + hats only"
 *   "Intro 16 bars"
 *   "16 bars: Intro"
 *
 * The parser is lenient — lines that don't contain a bar count are
 * returned with bars = 0 so nothing is silently dropped.
 */
export function parseArrangementTimeline(text: string): TimelineSection[] {
  if (!text || !text.trim()) return [];

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((line) => {
    // Try to extract bar count — look for patterns like "16 bars", "(16 bars)", "16-bar"
    const barMatch = line.match(/\(?\s*(\d+)\s*[-–]?\s*bars?\s*\)?/i);
    const bars = barMatch ? parseInt(barMatch[1], 10) : 0;

    // Remove the bar count portion to get the rest
    const withoutBars = barMatch
      ? line.replace(barMatch[0], "").trim()
      : line;

    // Split remaining text on ":" or " - " to get name vs description
    const separatorMatch = withoutBars.match(/^([^:–-]+?)\s*[:–-]\s*(.+)$/);

    let name: string;
    let description: string;

    if (separatorMatch) {
      name = separatorMatch[1].trim();
      description = separatorMatch[2].trim();
    } else {
      name = withoutBars || `Section`;
      description = "";
    }

    // Clean up stray punctuation from name
    name = name.replace(/^[:\-–\s]+|[:\-–\s]+$/g, "").trim();
    if (!name) name = "Section";

    return { name, bars, description };
  });
}

// ── Aggregate helpers ───────────────────────────────────────────────

/** Sum all bars across sections. */
export function totalBars(sections: TimelineSection[]): number {
  return sections.reduce((sum, s) => sum + s.bars, 0);
}

/** Total track duration in seconds from parsed sections + BPM. */
export function totalDuration(sections: TimelineSection[], bpm: number): number {
  return barsToSeconds(totalBars(sections), bpm);
}
