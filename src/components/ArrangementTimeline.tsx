"use client";

import {
  parseArrangementTimeline,
  barsToTimeString,
  totalBars,
  totalDuration,
  formatTime,
  type TimelineSection,
} from "@/lib/bar-math";

/** Deterministic color per section index. */
const SECTION_COLORS = [
  "bg-brand-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-indigo-500",
];

function sectionColor(index: number): string {
  return SECTION_COLORS[index % SECTION_COLORS.length];
}

interface ArrangementTimelineProps {
  /** Raw arrangement_timeline text from the database */
  text: string;
  /** Track BPM — used to compute real-time durations */
  bpm: number | null;
}

export default function ArrangementTimeline({
  text,
  bpm,
}: ArrangementTimelineProps) {
  const sections = parseArrangementTimeline(text);

  if (sections.length === 0) return null;

  const total = totalBars(sections);
  const hasBars = total > 0;
  const effectiveBpm = bpm && bpm > 0 ? bpm : null;

  return (
    <div className="space-y-4">
      {/* Visual bar — only if we have bar counts */}
      {hasBars && (
        <div>
          <div className="flex h-8 w-full overflow-hidden rounded-lg">
            {sections.map((section, i) =>
              section.bars > 0 ? (
                <div
                  key={i}
                  className={`${sectionColor(i)} flex items-center justify-center text-[10px] font-semibold text-white/90 transition-all`}
                  style={{ width: `${(section.bars / total) * 100}%` }}
                  title={`${section.name}: ${section.bars} bars${effectiveBpm ? ` (${barsToTimeString(section.bars, effectiveBpm)})` : ""}`}
                >
                  {section.bars >= total * 0.08 ? section.name : ""}
                </div>
              ) : null
            )}
          </div>

          {/* Summary line */}
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>{total} bars total</span>
            {effectiveBpm && (
              <span>
                ~{formatTime(totalDuration(sections, effectiveBpm))} at{" "}
                {effectiveBpm} BPM
              </span>
            )}
          </div>
        </div>
      )}

      {/* Section detail list */}
      <div className="space-y-2">
        {sections.map((section, i) => (
          <SectionRow
            key={i}
            section={section}
            index={i}
            bpm={effectiveBpm}
          />
        ))}
      </div>
    </div>
  );
}

function SectionRow({
  section,
  index,
  bpm,
}: {
  section: TimelineSection;
  index: number;
  bpm: number | null;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Color dot */}
      <div
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${sectionColor(index)}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium text-white">
            {section.name}
          </span>
          {section.bars > 0 && (
            <span className="text-xs text-gray-400">
              {section.bars} bars
              {bpm ? ` (${barsToTimeString(section.bars, bpm)})` : ""}
            </span>
          )}
        </div>
        {section.description && (
          <p className="mt-0.5 text-xs text-gray-500">{section.description}</p>
        )}
      </div>
    </div>
  );
}
