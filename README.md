# What's for Lunch? 🍽️

A tiny lunch poll app. Everyone taps one of four options (Saj, Manoushe, Falafel, Foul), and a live results page shows the running tally with animated bars — no refresh needed.

Plain HTML/CSS/JS, no framework, no build step. [Supabase](https://supabase.com) handles the database, security, and realtime updates.

## How it works

- **`index.html`** — four big tap buttons. Voting inserts a row into the `votes` table in Supabase. Once you vote, your browser remembers it (via `localStorage`) and shows a "you voted for X" confirmation instead of the buttons.
- **`results.html`** — reads all votes, shows a bar + percentage per option and the total vote count, and subscribes to Supabase Realtime so new votes appear instantly on every open tab/device without polling or refreshing.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (or use an existing one).
2. Open **SQL Editor** in the Supabase dashboard, paste in the contents of [`schema.sql`](./schema.sql), and run it. This will:
   - Create the `votes` table:
     | column       | type        | notes                                      |
     |--------------|-------------|---------------------------------------------|
     | `id`         | uuid        | primary key, default `gen_random_uuid()`    |
     | `option`     | text        | one of `'Saj'`, `'Manoushe'`, `'Falafel'`, `'Foul'` |
     | `created_at` | timestamptz | default `now()`                             |
   - Enable Row Level Security with:
     - Public **INSERT** allowed (anyone can vote)
     - Public **SELECT** allowed (anyone can read results)
     - No **UPDATE** or **DELETE** policy for the public — those are blocked by default
   - Add `votes` to the `supabase_realtime` publication so the results page gets live updates.
3. Get your project credentials: in the dashboard go to **Settings -> API**.
   - **Project URL** -> copy the "Project URL" field
   - **anon public key** -> copy the key labelled "anon" / "public" under Project API keys (never use the `service_role` key in frontend code)

## Local config (credentials are never committed)

The app reads its Supabase URL and key from `config.js`, which is listed in `.gitignore` and never pushed to GitHub.

1. Copy the example file:
   ```bash
   cp config.example.js config.js
   ```
2. Open `config.js` and paste in your values:
   ```js
   window.SUPABASE_CONFIG = {
     url: "https://YOUR-PROJECT-REF.supabase.co",
     anonKey: "YOUR-ANON-PUBLIC-KEY",
   };
   ```
3. Serve the folder with any static server (it must be served over HTTP, not opened as a `file://` path), e.g.:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8000
   ```
4. Open `index.html` (voting) and `results.html` (live results) in your browser.

The anon key is meant to be public-facing (that's what RLS policies are for), but it still shouldn't sit in git history as a matter of hygiene — hence the gitignored config file.

## Deploying

This is a static site, so any static host works. `config.js` is gitignored, so a plain deploy from GitHub won't have it — you need to get your Supabase values to the host one way or another. Two options, easiest first:

**Option A: just commit `config.js` when you deploy.** The anon key is designed to be public-facing (Row Level Security is what actually protects your data, not secrecy of this key), so it's reasonable to commit a real `config.js` once you're ready to go live. Remove `config.js` from `.gitignore`, commit it with your real values, push, then deploy — zero extra config needed on the host.

**Option B: inject it at build time, keep it out of git.** Both Vercel and Netlify let you set environment variables in their dashboard and run a build command that writes `config.js` before serving:
1. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as environment variables in the host's project settings.
2. Set the build command to:
   ```bash
   echo "window.SUPABASE_CONFIG = { url: \"$SUPABASE_URL\", anonKey: \"$SUPABASE_ANON_KEY\" };" > config.js
   ```
3. Vercel: framework preset "Other", output directory `.`. Netlify: publish directory `.` (repo root).

Either way, import the GitHub repo at [vercel.com/new](https://vercel.com/new) or [app.netlify.com/start](https://app.netlify.com/start) to deploy.

## On the "one vote per person" check

The `localStorage` flag is a **friendly nudge**, not fraud prevention. It's trivial to bypass — incognito/private browsing, clearing site data, or a different browser/device all let someone vote again. Don't rely on it for anything where vote integrity actually matters; it just stops accidental double-taps from the same phone.
