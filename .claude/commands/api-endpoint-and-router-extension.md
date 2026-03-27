---
name: api-endpoint-and-router-extension
description: Workflow command scaffold for api-endpoint-and-router-extension in resonance.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /api-endpoint-and-router-extension

Use this workflow when working on **api-endpoint-and-router-extension** in `resonance`.

## Goal

Adds or updates API endpoints and extends TRPC routers for new features or resources.

## Common Files

- `src/app/api/*/route.ts`
- `src/trpc/routers/*.ts`
- `src/trpc/routers/_app.ts`
- `src/types/*.d.ts`
- `src/lib/env.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update route files under src/app/api/[resource]/[action]/route.ts or similar
- Add or update router files under src/trpc/routers/[resource].ts
- Update src/trpc/routers/_app.ts to include new routers if necessary
- Update types or shared backend logic if needed (e.g., src/types/*, src/lib/env.ts)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.