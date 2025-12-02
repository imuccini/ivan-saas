---
trigger: always_on
---

---
description: Supastarter Monorepo Structure & Architecture Guide
globs: "**/*"
alwaysApply: true
---
# Project Architecture (Turborepo + Next.js 15)

## 1. Directory Map
**Frontend (`apps/web/`)**
- **Routes:**
  - `app/(marketing)/`: Public pages.
  - `app/(saas)/app/`: Authenticated dashboard.
  - `app/(saas)/app/(organizations)/[slug]/`: Tenant-specific routes.
  - `app/api/`: Next.js Route Handlers (Edge cases only).
- **Logic (Modules):** `apps/web/modules/` (Strict Separation)
  - `ui/`: Shared Shadcn components.
  - `saas/[feature]/`: Feature logic (contains `components/`, `hooks/`, `lib/`).
  - `marketing/`: Marketing components.

**Backend (`packages/`)**
- `api/`: Main API layer (ORPC/tRPC). **ALL business logic goes here.**
- `auth/`: Better-auth config & plugins.
- `database/`: Prisma schema & client.
- `mail/`: Email templates & providers.

## 2. Critical Placement Rules
- **Backend Logic:** NEVER place DB calls or heavy logic in `apps/web`. Must reside in `packages/api` or `packages/database`.
- **Imports:** Use workspace protocol (e.g., `import { db } from "@repo/database"`).
- **Module Pattern:** Frontend features must exist in `modules/[name]`, not in `app/`. The `app/` directory is strictly for routing and page shells.

## 3. Tech Stack
- **API:** ORPC (tRPC-like).
- **Auth:** Better-auth.
- **ORM:** Prisma.
- **Styling:** Tailwind 4 + Shadcn UI.