---
name: Zod .default() + zodResolver type mismatch
description: Why zod .default() on schema fields breaks react-hook-form's zodResolver and how to fix it.
---

When a zod schema uses `.default(value)` on object fields, the inferred input type becomes `T | undefined` while the output type remains `T`. `zodResolver` expects the form value type to match the schema output exactly, so `useForm<SchemaType>({ resolver: zodResolver(schema) })` produces a `Resolver<...>` type mismatch that TypeScript rejects.

**Why:** zod's `.default()` changes the input type (the thing the form submits) to be optional — but react-hook-form holds a strongly-typed state object, creating an input/output type mismatch the resolver cannot satisfy.

**How to apply:** Keep all fields required in the zod schema (no `.default()`). Supply the initial values explicitly via `useForm({ defaultValues: { field: defaultValue } })`. This keeps both the schema types and the form state types consistent.
