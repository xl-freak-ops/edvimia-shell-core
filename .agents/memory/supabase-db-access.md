---
name: Supabase direct DB access from Replit
description: How to get a working Postgres connection to this project's Supabase DB for running migrations, and the network pitfall that blocks the naive approach.
---

- This project ships with only the Supabase anon/publishable key in env — no service-role key, no DB URL, no Supabase CLI. PostgREST (the anon/service-role REST API) cannot run arbitrary DDL, so applying new migrations requires a direct Postgres connection string obtained from the user (Supabase dashboard → Project Settings → Database → Connection string).
- **Pitfall:** the "Direct connection" host (`db.<ref>.supabase.co:5432`) resolves to an IPv6-only address. This Replit environment has no IPv6 egress (`curl -6` fails to resolve any host), so `psql`/`pg` connections to it fail with an opaque, empty `psql: error:` message — not a helpful auth/network error.
- **Fix:** use the Supabase **Session pooler** (or Transaction pooler) connection string instead — host contains `pooler.supabase.com`, username is `postgres.<project_ref>` (not just `postgres`). That host has an IPv4 address and works normally with `psql`.
- Store the pooler URL as a secret (e.g. `SUPABASE_DB_POOLER_URL`) via `requestSecrets`, then run migrations with `psql "$SUPABASE_DB_POOLER_URL" -f migration.sql`.
- **Why this matters:** if `psql` to a Supabase host fails with a blank error message, suspect IPv6-only DNS resolution before suspecting credentials — check `dns.lookup(host, {all:true})` for a `family:6`-only result.
