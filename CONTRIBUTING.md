# Contributing to DJ Lab

This is a solo-owner project. These notes are for **you** (the owner) to reference when making changes — whether directly, through GitHub, or by asking an AI assistant.

---

## How the Project is Organized

```
src/app/        → Pages and routes (Next.js App Router)
src/components/ → Shared UI components (Navbar, ProgressBar, etc.)
src/data/       → Seed data and reference files (curriculum JSON, taxonomy JSON)
src/lib/        → Utilities (Supabase clients, helper functions)
src/types/      → TypeScript type definitions
docs/           → Human-readable documentation
supabase/       → Database migrations (SQL files)
```

---

## Making Changes

### Adding a new lesson

1. Open `src/data/seed-curriculum.json`
2. Find the module you want to add to (e.g., `"DJ Fundamentals"`)
3. Add a new lesson object inside the `lessons` array — follow the existing format:
   ```json
   {
     "title": "Your Lesson Title",
     "description": "One-line summary",
     "content_md": "## Objective\n\nWhat the student will learn...\n\n## Explanation\n\n...",
     "order_index": 12,
     "exercises": [
       {
         "title": "Exercise Title",
         "description": "What to practice",
         "order_index": 1
       }
     ]
   }
   ```
4. Regenerate the seed SQL: `npm run seed:sql`
5. Run the new SQL in your Supabase SQL Editor

### Adding a new artist to the taxonomy

1. Open `src/data/artist-taxonomy.json`
2. Add a new entry to the `artists` array — follow the existing format
3. Also update `docs/artist-taxonomy.md` with the same data in table format
4. The comparison UI at `/artists/compare` will pick up the new data automatically once you create the artist in the app

### Editing an existing page

1. Find the page in `src/app/` — the folder name matches the URL path
2. Edit the `page.tsx` file (server component) or the companion client component
3. Run `npm run validate` to make sure nothing broke

### Adding a new database column

1. Create a new migration file: `supabase/migrations/00004_your_change.sql`
2. Write your `ALTER TABLE` statement
3. Update `src/types/database.ts` to add the new column to the Row/Insert/Update types
4. Run the migration in Supabase SQL Editor
5. Update `docs/database-schema.md` to document the change

### Changing styles

The project uses Tailwind CSS with a dark theme. Key design tokens:
- Background: `bg-gray-950` (darkest), `bg-gray-900` (cards), `bg-gray-800` (borders/hovers)
- Brand color: `brand-400` through `brand-600` (accent, buttons, active states)
- Text: `text-white` (headings), `text-gray-300` (body), `text-gray-400` (secondary)

---

## Before You Commit

Run these checks to make sure everything works:

```bash
# Quick validation (lint + types + tests)
npm run validate

# Or run individually:
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm test              # Jest tests (24 tests)
npm run build         # Full production build
```

If any check fails, fix the issue before committing.

---

## Commit Message Format

Use clear, descriptive messages. Prefix with a category:

```
feat: add new lesson on EQ techniques
fix: correct progress bar calculation for Phase 2
docs: update curriculum map with new lessons
data: add Bicep to artist taxonomy
style: adjust mobile nav spacing
```

---

## Working with AI Assistants

When asking an AI (like Devin) to make changes:

1. **Be specific** — "Add a lesson about filter sweeps to Phase 2" is better than "update the curriculum"
2. **Reference the docs** — Point the AI to `docs/product-spec.md` or `docs/modules.md` for context
3. **Use issue templates** — File a GitHub issue first, then reference it in your request
4. **Review the PR** — Always look at the changes before merging. Leave comments on the PR if you want adjustments
5. **Check the validation** — Make sure `npm run validate` passes before merging

See [docs/prompt-library.md](docs/prompt-library.md) for ready-to-use prompts.

---

## Common Workflows

### "I want to add content but not touch code"

Edit these files directly — they're designed to be human-editable:
- `src/data/seed-curriculum.json` — lesson content
- `src/data/artist-taxonomy.json` — artist profiles
- `docs/artist-taxonomy.md` — artist reference tables

### "I want to change how a page looks"

1. Find the page in `src/app/`
2. Edit the JSX and Tailwind classes
3. Run `npm run dev` to preview
4. Run `npm run validate` before committing

### "I want to add a completely new feature"

1. File a GitHub issue using the Feature Request template
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make changes
4. Run `npm run validate`
5. Push and create a PR

---

## Getting Help

- Check [docs/debugging-playbook.md](docs/debugging-playbook.md) for common issues
- Check [docs/prompt-library.md](docs/prompt-library.md) for AI-ready prompts
- File a GitHub issue if you're stuck
