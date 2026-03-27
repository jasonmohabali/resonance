```markdown
# resonance Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute to the `resonance` codebase, a TypeScript project built on Next.js. You'll learn the project's coding conventions, how to add new features, extend APIs, update dependencies, and work with backend infrastructure. The guide includes practical workflows, code examples, and command suggestions to streamline development and maintain consistency.

## Coding Conventions

**File Naming**
- Use `camelCase` for files and folders.
  - Example: `dashboardSidebar.tsx`, `textToSpeech.ts`

**Imports**
- Use path aliases for imports.
  - Example:
    ```typescript
    import DashboardSidebar from '@/features/dashboard/components/dashboardSidebar'
    ```

**Exports**
- Default exports are preferred.
  - Example:
    ```typescript
    const DashboardSidebar = () => { /* ... */ }
    export default DashboardSidebar
    ```

**Commit Patterns**
- Commits use numeric or freeform prefixes (e.g., `01`, `09`, `bonus`).
- Average commit message length: ~43 characters.

## Workflows

### Feature Module Development
**Trigger:** When adding a new major feature or module (e.g., dashboard, text-to-speech).
**Command:** `/new-feature-module`

1. Create or update the feature directory under `src/features/[feature-name]/`.
2. Add or update components in `src/features/[feature-name]/components/`.
   - Example:
     ```typescript
     // src/features/textToSpeech/components/speakButton.tsx
     const SpeakButton = () => { /* ... */ }
     export default SpeakButton
     ```
3. Add or update hooks in `src/features/[feature-name]/hooks/`.
   - Example:
     ```typescript
     // src/features/textToSpeech/hooks/useSpeech.ts
     const useSpeech = () => { /* ... */ }
     export default useSpeech
     ```
4. Add or update data/constants files in `src/features/[feature-name]/data/` or `data/constants.ts`.
5. Add or update views in `src/features/[feature-name]/views/`.
6. Update or create related pages/layouts under `src/app/(dashboard)/[feature-name]/`.
7. Update shared files if necessary (e.g., `src/app/layout.tsx`, `src/features/dashboard/components/dashboardSidebar.tsx`).

---

### API Endpoint and Router Extension
**Trigger:** When adding a new API endpoint or extending backend capabilities.
**Command:** `/add-api-endpoint`

1. Create or update route files under `src/app/api/[resource]/[action]/route.ts`.
   - Example:
     ```typescript
     // src/app/api/voice/list/route.ts
     export default async function handler(req, res) { /* ... */ }
     ```
2. Add or update router files under `src/trpc/routers/[resource].ts`.
3. Update `src/trpc/routers/_app.ts` to include new routers if necessary.
4. Update types or shared backend logic if needed (e.g., `src/types/*`, `src/lib/env.ts`).

---

### Dependency and Config Update
**Trigger:** When adding/updating dependencies or changing project configuration.
**Command:** `/update-deps`

1. Update `package.json` and `package-lock.json`.
2. Update `next.config.ts` or other config files as needed.
3. Add or update `.gitignore` if necessary.
4. Add new config files (e.g., `sentry.edge.config.ts`, `sentry.server.config.ts`).

---

### Backend Infrastructure Extension
**Trigger:** When extending backend infrastructure (e.g., DB config, seeding, storage).
**Command:** `/extend-backend`

1. Add or update `prisma.config.ts` or `prisma/schema.prisma`.
2. Add or update scripts for seeding or system data (e.g., `scripts/seed-system-voices.ts`, `scripts/system-voices/*.wav`).
3. Update `src/lib/*` for backend utilities (e.g., `env.ts`, `r2.ts`, `db.ts`).
4. Update or create server files (e.g., `src/trpc/server.tsx`).

---

## Testing Patterns

- Test files use the pattern `*.test.*` (e.g., `myComponent.test.tsx`).
- The testing framework is not explicitly specified; check for setup in the project root or `package.json`.
- Place tests alongside the files they test or in a dedicated `__tests__` directory.

**Example:**
```typescript
// src/features/textToSpeech/components/speakButton.test.tsx
import { render } from '@testing-library/react'
import SpeakButton from './speakButton'

test('renders SpeakButton', () => {
  render(<SpeakButton />)
  // assertions...
})
```

## Commands

| Command              | Purpose                                               |
|----------------------|-------------------------------------------------------|
| /new-feature-module  | Start a new feature/module with components, hooks, etc.|
| /add-api-endpoint    | Add or extend API endpoints and TRPC routers          |
| /update-deps         | Update dependencies and project configuration         |
| /extend-backend      | Extend backend infrastructure (DB, scripts, storage)  |
```