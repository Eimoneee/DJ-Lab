"use client";

import { useState } from "react";
import Link from "next/link";
import type { ArtistTaxonomy } from "@/types/taxonomy";
import { TAXONOMY_DIMENSIONS } from "@/types/taxonomy";

interface ArtistRow {
  id: string;
  name: string;
  genre_tags: string[];
  taxonomy: ArtistTaxonomy | null;
  summary: string | null;
}

const COLORS = [
  "bg-brand-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
];

const TEXT_COLORS = [
  "text-brand-400",
  "text-emerald-400",
  "text-amber-400",
  "text-rose-400",
  "text-violet-400",
  "text-cyan-400",
];

function RatingBar({
  rating,
  color,
}: {
  rating: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-3 w-5 rounded-sm ${
              rating >= level ? color : "bg-gray-800"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-400">{rating}/5</span>
    </div>
  );
}

export default function CompareClient({ artists }: { artists: ArtistRow[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleArtist = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 6
          ? [...prev, id]
          : prev
    );
  };

  const selectedArtists = artists.filter((a) => selected.includes(a.id));
  const hasSelection = selectedArtists.length >= 2;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/artists" className="text-sm text-gray-400 hover:text-gray-200">
          ← Back to Artists
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Compare Artists</h1>
        <p className="mt-1 text-sm text-gray-400">
          Select 2–6 artists to compare their sonic tendencies side by side.
        </p>
      </div>

      {/* Artist selector */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Select Artists ({selected.length}/6)
        </h2>
        <div className="flex flex-wrap gap-2">
          {artists.map((artist) => {
            const idx = selected.indexOf(artist.id);
            const isSelected = idx !== -1;
            return (
              <button
                key={artist.id}
                onClick={() => toggleArtist(artist.id)}
                disabled={!artist.taxonomy}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? `${COLORS[idx % COLORS.length]} text-white`
                    : artist.taxonomy
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "cursor-not-allowed bg-gray-900 text-gray-600"
                }`}
              >
                {artist.name}
                {!artist.taxonomy && " (no taxonomy)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison view */}
      {hasSelection && (
        <>
          {/* Radar-style dimension comparison */}
          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Sonic Tendency Comparison
            </h2>

            {/* Legend */}
            <div className="mb-4 flex flex-wrap gap-3">
              {selectedArtists.map((artist, idx) => (
                <span
                  key={artist.id}
                  className={`flex items-center gap-1.5 text-sm ${TEXT_COLORS[idx % TEXT_COLORS.length]}`}
                >
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${COLORS[idx % COLORS.length]}`} />
                  {artist.name}
                </span>
              ))}
            </div>

            {/* Dimension rows */}
            <div className="space-y-4">
              {TAXONOMY_DIMENSIONS.map((dim) => (
                <div key={dim.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      {dim.label}
                    </span>
                    <span className="text-xs text-gray-600">
                      {dim.low} → {dim.high}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {selectedArtists.map((artist, idx) => {
                      const tax = artist.taxonomy;
                      const val = tax ? tax[dim.key]?.rating ?? 0 : 0;
                      return (
                        <div key={artist.id} className="flex items-center gap-2">
                          <span className={`w-20 shrink-0 truncate text-xs sm:w-28 ${TEXT_COLORS[idx % TEXT_COLORS.length]}`}>
                            {artist.name}
                          </span>
                          <RatingBar
                            rating={val}
                            color={COLORS[idx % COLORS.length]}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side-by-side detail cards */}
          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Detailed Notes
            </h2>
            <div className={`grid gap-4 ${
              selectedArtists.length <= 2
                ? "sm:grid-cols-2"
                : selectedArtists.length <= 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}>
              {selectedArtists.map((artist, idx) => (
                <div
                  key={artist.id}
                  className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${COLORS[idx % COLORS.length]}`} />
                    <Link
                      href={`/artists/${artist.id}`}
                      className={`font-medium ${TEXT_COLORS[idx % TEXT_COLORS.length]} hover:underline`}
                    >
                      {artist.name}
                    </Link>
                  </div>
                  {artist.summary && (
                    <p className="text-xs text-gray-400 italic">{artist.summary}</p>
                  )}
                  {artist.genre_tags && artist.genre_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {artist.genre_tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {artist.taxonomy && (
                    <div className="space-y-2">
                      {TAXONOMY_DIMENSIONS.map((dim) => {
                        const dimData = artist.taxonomy?.[dim.key];
                        if (!dimData?.notes) return null;
                        return (
                          <div key={dim.key}>
                            <span className="text-xs font-medium text-gray-500">
                              {dim.label} ({dimData.rating}/5)
                            </span>
                            <p className="text-xs text-gray-400">{dimData.notes}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {selected.length === 1 && (
        <div className="card text-center text-sm text-gray-500">
          Select at least one more artist to compare.
        </div>
      )}

      {selected.length === 0 && (
        <div className="card text-center text-sm text-gray-500">
          Click artists above to start comparing.
        </div>
      )}
    </div>
  );
}
