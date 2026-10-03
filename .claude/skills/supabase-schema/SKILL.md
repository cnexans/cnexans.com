---
name: supabase-schema
description: How to change the Supabase database used by this site (tables, columns, grants, RLS policies, functions). Use before any schema or permissions change to contacts, comments, post_likes or any other table, or when src/db/schema.sql looks relevant.
---

# Supabase schema lives in another repo

This site uses the shared Supabase project **master-siderproject**
(`oarzeoeoxcgmoxaeagmr`). Its schema is controlled by the private GitHub repo
**`cnexans/master-sideproject-supabase`** (local clone usually at
`~/Projects/master-sideproject-supabase`). Several side projects share the
database, so every change goes through a migration in that repo.

## Rules

- **Never** change the schema from here: no `ALTER`/`CREATE`/`GRANT` through
  `psql`, a `pg` script, the `POSTGRES_URL*` env vars or the Supabase dashboard.
- `src/db/schema.sql` in this repo is **outdated documentation**. Don't edit it
  expecting it to apply, and don't trust it for the current state (e.g. RLS is
  on in production, and `contacts` is insert-only for the Data API).

## How to make a change

1. In `cnexans/master-sideproject-supabase`, branch off `main` and add
   `supabase/migrations/<YYYYMMDDHHMMSS>_<name>.sql`. Write it idempotently
   (`if not exists`, `drop policy if exists` before `create policy`).
2. Add a row to the migrations table in its `README.md`. Check its
   "Who uses what" table before touching a shared table.
3. Open a PR. CI replays every migration from scratch on a local Postgres.
4. Merging to `main` runs `supabase db push` against production.
5. Verify: `supabase migration list --linked` shows the version on the remote side.

## What this site relies on

| Table | Access from this site |
|---|---|
| `contacts` | Contact form inserts `email, subject, message, locale` with the anon key (`return=minimal`). Everything else (`/admin` panel, `scripts/cleanup-spam.mjs`) uses `SUPABASE_SERVICE_ROLE_KEY` server-side only. |
| `comments` | Anon inserts; anon reads only `is_visible = true`. Spam job flags with `is_spam`. |
| `post_likes` | No direct table access. Visitors (signed in anonymously) only call `get_post_like_count`, `like_post` (insert-only, uses `auth.uid()`) and `get_my_liked_posts`. Likes can't be removed through the Data API. |
| `spotify_*` | Spotify now-playing widget (`~/Projects/spotify-now-playing-widget`, nowplayingwidget.vercel.app). This site only calls its public `/api/now-playing/<user-id>` endpoint. |
