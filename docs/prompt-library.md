# Prompt Library

Ready-to-use prompts for extending DJ Lab with an AI assistant (like Devin). Copy, customize, and paste.

---

## Curriculum

### Add a new lesson

```
Add a new lesson to Phase [1/2/3/4] of the DJ Lab curriculum.

Title: [Your lesson title]
Objective: [What the student will learn]
Key concepts: [List 2-3 main ideas]

The lesson should follow the existing format in src/data/seed-curriculum.json:
- objective, explanation, exercise, common mistakes, success checklist
- Include 1-2 practical exercises

After adding, run npm run validate to check everything passes.
```

### Reorder lessons in a phase

```
Reorder the lessons in Phase [N] of the DJ Lab curriculum.

New order:
1. [Lesson title]
2. [Lesson title]
3. [Lesson title]
...

Update the order_index values in src/data/seed-curriculum.json and regenerate the seed SQL with npm run seed:sql.
```

### Expand an existing lesson

```
Expand lesson "[lesson title]" in Phase [N] of the DJ Lab curriculum.

Add more detail to the explanation section about [topic].
Add a new exercise: [exercise description].
Update the common mistakes section with: [new mistake to cover].

The lesson is in src/data/seed-curriculum.json.
```

---

## Artists & Taxonomy

### Add a new artist

```
Add [Artist Name] to the DJ Lab artist taxonomy.

Genre: [genre tags]
Known for: [brief description of their sound]

Rate them 1-5 on all 7 dimensions (groove, percussion density, low-end, arrangement, tension, vocal usage, energy profile) with notes explaining each rating.

Update both:
- src/data/artist-taxonomy.json
- docs/artist-taxonomy.md
```

### Update an artist's ratings

```
Update the taxonomy ratings for [Artist Name] in DJ Lab.

Changes:
- [dimension]: change from [old] to [new] because [reason]
- [dimension]: change from [old] to [new] because [reason]

Update both src/data/artist-taxonomy.json and docs/artist-taxonomy.md.
```

### Add a batch of artists

```
Add these artists to the DJ Lab taxonomy system:
- [Artist 1] ([genre])
- [Artist 2] ([genre])
- [Artist 3] ([genre])

For each artist, provide ratings (1-5) for all 7 sonic dimensions with notes, a summary, and genre tags.

Update both src/data/artist-taxonomy.json and docs/artist-taxonomy.md.
```

---

## Track Analysis

### Create a track analysis template

```
Create a track analysis entry for:
Track: [track name]
Artist: [artist name]
BPM: [bpm]
Genre: [genre/subgenre]

Fill in all 17 analysis fields (drums, bassline, groove, arrangement timeline, tension/release, FX, study loop ideas, distinctive elements, curriculum connections).

This is for my personal study — provide detailed notes I can reference when trying to recreate elements of this track.
```

---

## UI & Features

### Add a new page

```
Add a new page to DJ Lab at /[route-name].

Purpose: [what the page should do]
Data it needs: [what database tables or data it reads/writes]
Layout: Follow the existing dark theme pattern used in the other pages.

Add a link to this page in the Navbar component (src/components/Navbar.tsx).
```

### Modify an existing page

```
Update the [page name] page in DJ Lab (src/app/[path]/page.tsx).

Change: [describe what should change]
Keep: [describe what should stay the same]

Run npm run validate when done.
```

### Add a new database field

```
Add a new field to the [table name] table in DJ Lab.

Field name: [name]
Type: [text/integer/boolean/jsonb/etc.]
Purpose: [what this field stores]

Please:
1. Create migration 00004_[description].sql
2. Update src/types/database.ts
3. Update the relevant form to include this field
4. Update the detail page to display it
5. Update docs/database-schema.md
6. Run npm run validate
```

---

## Maintenance

### Run a full health check

```
Run a full health check on the DJ Lab project:
1. npm run validate (lint + typecheck + tests)
2. npm run build
3. Check that all docs are up to date with the current code
4. Report any issues found
```

### Update dependencies

```
Update the npm dependencies in DJ Lab to their latest compatible versions.

Run npm outdated first to see what's available.
Then update cautiously — run npm run validate after each major update to catch breaking changes.
Don't update Next.js major versions without checking the migration guide.
```

### Review and clean up code

```
Review the DJ Lab codebase for:
- Unused imports or variables
- Inconsistent patterns
- Missing error handling
- Accessibility issues
- Mobile responsiveness issues

Report findings but don't make changes without approval.
```

---

## Bug Reports

### Fix a specific bug

```
Bug in DJ Lab: [describe what's broken]

Steps to reproduce:
1. [step 1]
2. [step 2]
3. [step 3]

Expected: [what should happen]
Actual: [what actually happens]

Check docs/debugging-playbook.md first for known issues.
Then investigate and fix. Run npm run validate when done.
```

---

## Tips for Better Prompts

1. **Reference specific files** — "Edit src/data/seed-curriculum.json" is better than "edit the curriculum"
2. **Mention the validation step** — Always ask the AI to run `npm run validate`
3. **Be explicit about scope** — "Only change X, don't touch Y" prevents unwanted changes
4. **Ask for explanations** — "Explain what you changed and why" helps you learn
5. **Use the issue templates** — File a GitHub issue first, then reference it: "Fix the bug described in issue #5"
