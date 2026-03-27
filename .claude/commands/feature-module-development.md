---
name: feature-module-development
description: Workflow command scaffold for feature-module-development in resonance.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-module-development

Use this workflow when working on **feature-module-development** in `resonance`.

## Goal

Adds a new feature module or major feature (e.g., dashboard, text-to-speech, voice management, billing) including UI components, views, hooks, and data files.

## Common Files

- `src/features/*/components/*.tsx`
- `src/features/*/hooks/*.ts`
- `src/features/*/data/*.ts`
- `src/features/*/views/*.tsx`
- `src/app/(dashboard)/*/*.tsx`
- `src/app/layout.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update feature directory under src/features/[feature-name]/
- Add or update components in src/features/[feature-name]/components/
- Add or update hooks in src/features/[feature-name]/hooks/
- Add or update data/constants files in src/features/[feature-name]/data/ or data/constants.ts
- Add or update views in src/features/[feature-name]/views/

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.