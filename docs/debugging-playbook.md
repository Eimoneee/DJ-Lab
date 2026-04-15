# Debugging Playbook

Common issues you might run into with DJ Lab and how to fix them.

---

## Setup Issues

### "Module not found" or missing dependencies

**Symptom:** Error like `Cannot find module 'react'` or similar when running `npm run dev`.

**Fix:**
```bash
rm -rf node_modules
npm install
```

### "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Symptom:** App crashes on load with an error about missing Supabase URL.

**Fix:**
1. Make sure `.env.local` exists: `cp .env.local.example .env.local`
2. Add your Supabase URL and anon key (find them at Supabase → Settings → API)
3. Restart the dev server (`Ctrl+C`, then `npm run dev`)

### Migrations not working

**Symptom:** Tables don't exist, or queries fail with "relation does not exist".

**Fix:**
1. Go to your Supabase project → SQL Editor
2. Run migrations **in order**:
   - First: `00001_initial_schema.sql`
   - Then: `00002_expand_track_and_artist.sql`
   - Then: `00003_add_artist_taxonomy.sql`
3. Each migration is additive — skipping one will break later ones

### Curriculum is empty

**Symptom:** Dashboard shows no lessons, curriculum page is blank.

**Fix:**
1. Generate the seed SQL: `npm run seed:sql`
2. Open the generated `supabase/seed.sql`
3. Run it in the Supabase SQL Editor
4. Refresh the app

---

## Runtime Issues

### "Row Level Security policy violation"

**Symptom:** Data operations fail with a permissions error.

**Cause:** You're trying to access data that belongs to another user, or the RLS policy wasn't created properly.

**Fix:**
1. Make sure you're logged in (check the browser console for auth state)
2. Verify RLS policies exist: go to Supabase → Table Editor → select table → Policies tab
3. If policies are missing, re-run the initial migration (`00001_initial_schema.sql`)

### Progress not updating

**Symptom:** You click "Mark as Complete" but the dashboard doesn't update.

**Cause:** The completion record might not have been saved to Supabase.

**Fix:**
1. Open browser DevTools → Network tab
2. Click "Mark as Complete" again
3. Look for the Supabase API call — check if it returns a 200 or an error
4. If error, check the browser console for details

### Artist taxonomy not showing

**Symptom:** Artist detail page doesn't show the taxonomy section, or comparison page is empty.

**Cause:** The `taxonomy` JSONB column might be null for that artist.

**Fix:**
1. Edit the artist and fill in the taxonomy ratings (the "Sonic Taxonomy" section in the form)
2. Save the artist
3. The taxonomy bars should now appear on the detail page

### Page loads but shows no data

**Symptom:** A page renders but all content areas are empty.

**Cause:** Usually a Supabase query issue — either auth, RLS, or missing data.

**Fix:**
1. Open browser DevTools → Console tab
2. Look for any red error messages
3. Check the Network tab for failed Supabase API calls
4. Common causes:
   - Not logged in (redirect to `/login`)
   - Missing migration (re-run the relevant SQL)
   - Empty table (add data through the UI or seed script)

---

## Build Issues

### TypeScript errors on build

**Symptom:** `npm run build` fails with type errors.

**Fix:**
1. Run `npm run typecheck` to see all errors
2. Common causes:
   - Missing type in `src/types/database.ts` after adding a DB column
   - Importing a component that doesn't exist
   - Passing wrong props to a component

### ESLint errors

**Symptom:** `npm run lint` reports errors.

**Fix:**
1. Run `npm run lint` to see all errors
2. Most common: unused imports, missing dependencies in useEffect hooks
3. Auto-fix where possible: review the error messages — ESLint usually suggests the fix

### Tests failing

**Symptom:** `npm test` shows red failures.

**Fix:**
1. Read the test output — it tells you exactly what failed and why
2. Test files are in `src/lib/__tests__/`:
   - `progress.test.ts` — progression logic, progress bar math, seed data structure
   - `bar-math.test.ts` — BPM/bar math calculations, timeline parsing
   - `save-logic.test.ts` — save error handling regressions
3. If you changed seed data, you may need to update the test expectations (e.g., lesson counts per phase)

---

## Deployment Issues

### Vercel build fails

**Symptom:** Deploy to Vercel fails during build.

**Fix:**
1. Run `npm run build` locally first — fix any errors
2. Make sure environment variables are set in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Check that all dependencies are in `package.json` (not just installed locally)

### App works locally but not on Vercel

**Symptom:** Everything works in `npm run dev` but breaks in production.

**Fix:**
1. Try `npm run build && npm start` locally to simulate production
2. Check for hardcoded `localhost` URLs
3. Make sure Supabase env vars are set in Vercel's project settings

---

## Quick Diagnostic Checklist

When something isn't working, run through this:

1. **Is the dev server running?** → `npm run dev`
2. **Are env vars set?** → Check `.env.local` exists with valid Supabase credentials
3. **Are migrations applied?** → Check Supabase → Table Editor for expected tables
4. **Is the curriculum seeded?** → Check `modules` table has 4 rows
5. **Are you logged in?** → Check browser DevTools → Application → Cookies for Supabase session
6. **Does the build pass?** → `npm run validate`
7. **Any console errors?** → Check browser DevTools → Console tab
