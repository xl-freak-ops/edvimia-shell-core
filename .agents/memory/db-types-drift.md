---
name: DB functions vs types.ts vs migration files can all drift apart
description: Three sources of truth for DB schema can silently diverge; how to detect and fix each gap.
---

The project has three representations of DB schema that must stay in sync:
1. **Live DB** — what actually exists in Supabase (source of truth at runtime)
2. **`src/integrations/supabase/types.ts`** — hand-maintained TypeScript types used by the client
3. **`supabase/migrations/*.sql`** — SQL migration files committed to the repo

Any of these can drift from the others without any obvious error. Observed drift patterns:

- RPC functions (`admin_list_school_users`, `admin_assign_role`, `admin_revoke_role`, `can_manage_settings`, `is_school_admin_of`) were applied directly to the DB during a prior interrupted session without ever being captured in a migration file. The migration file had to be written retroactively.
- `types.ts` had an `avatar_url` field on `admin_list_school_users` return type that the actual DB function does not return (it returns `created_at` instead). No error at compile time because the type was manually edited, not generated.

**How to apply:** When adding new RPCs or tables:
1. Write the migration file first, then apply it (`psql "$SUPABASE_DB_URL" -f migration.sql`).
2. Update `types.ts` to match exactly what the DB function actually returns (verify with `pg_get_functiondef`).
3. Cross-check with `SELECT proname FROM pg_proc WHERE proname = '...'` before writing types.
If inheriting an interrupted session, always audit `pg_proc` for functions that exist in DB but have no corresponding migration file.
