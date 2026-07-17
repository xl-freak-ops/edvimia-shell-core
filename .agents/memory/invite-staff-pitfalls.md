---
name: invite-staff Edge Function pitfalls
description: Recurring bugs and patterns from the invite-staff Edge Function and related auth flow
---

## Known pitfalls

**app_role enum drift** — the live DB enum is `{super_admin, school_admin, principal, vice_principal, form_teacher, subject_teacher, parent, student}`. "teacher", "bursar", "support_staff" were removed in a later migration. The auth trigger casts `raw_user_meta_data->>'initial_role'` to this enum — any invalid value causes "Database error saving new user" from inviteUserByEmail.

**Why:** The handle_new_user trigger runs on auth.users INSERT; a cast failure rolls back the entire INSERT, which surfaces as the generic Supabase error string, not a clear cast error.

**maybeSingle() on user_roles fails for multi-school admins** — users with multiple scoped school_admin rows (two school_ids) cause maybeSingle() to return null data (PGRST116). Use `.limit(1)` and take `rows?.[0]` instead.

**provisionAccess must include school_id on user_roles** — inserting without school_id creates an unscoped role that fails is_school_member() RLS, so the new teacher can't see any school data.

**FunctionsHttpError body is not readable via context.json()** — the Supabase JS functions client doesn't expose the response body reliably through the error object. Use a raw fetch() instead of supabase.functions.invoke() so you can read the body before throwing.

**Supabase Site URL must be set** — default is localhost:3000; email invite links and confirmation links use it as the redirect base. Must be updated in project auth config when changing environments.
