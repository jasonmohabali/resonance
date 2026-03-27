---
name: dependency-and-config-update
description: Workflow command scaffold for dependency-and-config-update in resonance.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /dependency-and-config-update

Use this workflow when working on **dependency-and-config-update** in `resonance`.

## Goal

Updates dependencies and project configuration, often as part of a feature or infrastructure change.

## Common Files

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `.gitignore`
- `*.config.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update package.json and package-lock.json
- Update next.config.ts or other config files as needed
- Add or update .gitignore if necessary
- Add new config files (e.g., sentry.edge.config.ts, sentry.server.config.ts)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.