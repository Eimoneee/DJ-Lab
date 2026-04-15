/**
 * Seed script for DJ Lab curriculum data.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' src/data/seed.ts
 *
 * Or run the SQL version directly in Supabase SQL editor.
 *
 * This script generates SQL INSERT statements from the seed JSON.
 * Copy the output and paste it into the Supabase SQL editor.
 */

import seedData from "./seed-curriculum.json";

function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}

function generateSQL(): string {
  const lines: string[] = [];

  lines.push("-- DJ Lab Seed Data");
  lines.push("-- Generated from seed-curriculum.json");
  lines.push("-- Paste this into the Supabase SQL editor after running the migration\n");

  // Modules
  lines.push("-- Modules");
  for (const mod of seedData.modules) {
    lines.push(
      `INSERT INTO public.modules (id, title, description, category, order_index, icon) VALUES ('${mod.id}', '${escapeSQL(mod.title)}', '${escapeSQL(mod.description)}', '${escapeSQL(mod.category)}', ${mod.order_index}, '${escapeSQL(mod.icon)}') ON CONFLICT (id) DO NOTHING;`
    );
  }

  lines.push("\n-- Lessons");
  for (const les of seedData.lessons) {
    lines.push(
      `INSERT INTO public.lessons (id, module_id, title, description, content_md, order_index) VALUES ('${les.id}', '${les.module_id}', '${escapeSQL(les.title)}', '${escapeSQL(les.description)}', '${escapeSQL(les.content_md)}', ${les.order_index}) ON CONFLICT (id) DO NOTHING;`
    );
  }

  lines.push("\n-- Exercises");
  for (const ex of seedData.exercises) {
    lines.push(
      `INSERT INTO public.exercises (id, lesson_id, title, description, order_index) VALUES ('${ex.id}', '${ex.lesson_id}', '${escapeSQL(ex.title)}', '${escapeSQL(ex.description)}', ${ex.order_index}) ON CONFLICT (id) DO NOTHING;`
    );
  }

  return lines.join("\n");
}

console.log(generateSQL());
