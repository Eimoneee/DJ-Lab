export interface TaxonomyDimension {
  rating: number;
  notes: string;
}

export interface ArtistTaxonomy {
  groove: TaxonomyDimension;
  percussion_density: TaxonomyDimension;
  low_end: TaxonomyDimension;
  arrangement: TaxonomyDimension;
  tension: TaxonomyDimension;
  vocal_usage: TaxonomyDimension;
  energy_profile: TaxonomyDimension;
}

export const TAXONOMY_DIMENSIONS: {
  key: keyof ArtistTaxonomy;
  label: string;
  low: string;
  high: string;
}[] = [
  { key: "groove", label: "Groove", low: "Straight", high: "Heavy swing" },
  { key: "percussion_density", label: "Percussion Density", low: "Sparse", high: "Dense" },
  { key: "low_end", label: "Low-End", low: "Light", high: "Heavy" },
  { key: "arrangement", label: "Arrangement", low: "Minimal", high: "Complex" },
  { key: "tension", label: "Tension Style", low: "Subtle", high: "Dramatic" },
  { key: "vocal_usage", label: "Vocal Usage", low: "None", high: "Prominent" },
  { key: "energy_profile", label: "Energy Profile", low: "Deep", high: "Peak-time" },
];
