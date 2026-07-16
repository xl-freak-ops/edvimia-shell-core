---
name: PostgREST embed via auth.users foreign key
description: Why .select("*, profiles(...)") fails when the FK points at auth.users, and the correct workaround.
---

PostgREST can only resolve embedded selects through foreign keys it can see in the public schema. Columns like `user_id UUID REFERENCES auth.users(id)` are in the `auth` schema — PostgREST cannot traverse that FK, so `.select("*, profiles(full_name)")` against such a column silently returns a SelectQueryError at runtime (or a TypeScript error if types are generated correctly).

**Why:** auth.users lives outside public; PostgREST's relationship introspection only covers public schema FKs.

**How to apply:** Whenever you need to join profile data from a table whose FK points at auth.users (announcements.created_by, messages.sender_id, etc.), do a two-step query: fetch the rows first, extract the user_id list, then call `supabase.from("profiles").select("id, full_name").in("id", ids)` and merge the results in JS. See `attachSenderProfiles` helper in `src/lib/communication/hooks.ts` for the established pattern.
