---
name: Edvimia deployment setup for Replit
description: How to build and serve this TanStack Start / Nitro SSR app on Replit autoscale.
---

The app uses `@lovable.dev/vite-tanstack-config` which wraps Nitro for SSR builds. The default Nitro preset is `cloudflare-module` — that does NOT work on Replit.

**Required vite.config.ts setting:**
```ts
nitro: { preset: "node" }
```

This makes Nitro output a standalone Node.js server to `.output/server/index.mjs`.

**Deployment config (in .replit `[deployment]`):**
- build: `["bun", "run", "build"]`
- run: `["node", ".output/server/index.mjs"]`
- deploymentTarget: `"autoscale"`

**Port:** The server reads `PORT` env var, falls back to 3000. Replit autoscale injects `PORT` automatically — no manual configuration needed.

**Why:** Cloudflare module preset produces Cloudflare Workers-compatible output (fetch handler, no Node http server) which cannot run under Node directly. The `node` preset produces a real HTTP server.
