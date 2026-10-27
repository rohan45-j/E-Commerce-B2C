# AGENTS.md — Permanent Project Operating Instructions

These instructions are mandatory for all AI agents, engineers, and automated subagents operating in this repository.

## 1. Primary Source of Truth
* **Always read [MASTER_PROMPT.md](file:///e:/Rohan/PP/E-Commerce-B2C/MASTER_PROMPT.md) first**: Before starting any task, read the root `MASTER_PROMPT.md` in its entirety.
* Treat `MASTER_PROMPT.md` as the definitive, immutable source of truth for all business logic, architecture rules, technology choices, and functional standards.
* Review the current repository state and [docs/PROGRESS.md](file:///e:/Rohan/PP/E-Commerce-B2C/docs/PROGRESS.md) before making code modifications.

---

## 2. Core Engineering Standards
* **Architecture & Technology Adherence**: Follow the Next.js App Router (React Server Components), TypeScript strict mode, Tailwind CSS, shadcn/ui, and Supabase architecture as defined in `docs/ARCHITECTURE.md`.
* **Preserve Working Functionality**: Never perform arbitrary rewrites or replace functional components with mock implementations or simplified placeholders.
* **Server-Authoritative Authority**: Never trust client-side prices, stock levels, discounts, shipping charges, or user roles. Enforce all validation on the server and at the database policy level (RLS).
* **Financial Precision**: All calculations in BDT must use integer minor units (poisha) or decimal-safe logic. Floating-point arithmetic is strictly forbidden for financial calculations.

---

## 3. Implementation & Verification Workflow
* **Do the Actual Work**: When an implementation or fix is requested, perform the full end-to-end code changes rather than only offering a theoretical plan.
* **Investigation & Verification**: For every feature, bug fix, or schema migration:
  1. Investigate existing code and documentation.
  2. Implement the changes carefully.
  3. Verify the changes using appropriate linting, TypeScript compiler checks (`tsc --noEmit`), tests (Vitest / Playwright), or build checks (`npm run build`).
* **Honest Verification Reporting**: Never claim a feature, test, or integration works unless it has been explicitly run and confirmed.

---

## 4. Security & Credential Guidelines
* **Zero Secret Exposure**: Never commit `.env` files, paste real API keys, or expose private credentials in logs, documentation, or client-accessible code.
* **Supabase Service-Role Isolation**: The `SUPABASE_SERVICE_ROLE_KEY` must only ever be accessed in server-only contexts (e.g. `src/lib/supabase/admin.ts` or route handlers) and must never have a `NEXT_PUBLIC_` prefix.
* **Row Level Security (RLS)**: Every new database table must have RLS enabled with explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies.

---

## 5. Documentation & Task Completion
* **Update Documentation**: When adding new features, schema modifications, or environment variables, update the corresponding documents in `docs/` and log the update in `docs/PROGRESS.md`.
* **Ask for Clarification**: Seek user input before initiating destructive operations (such as dropping database columns or deleting user assets) or when essential business credentials or decisions are missing.
* **Task Summary**: At the end of every task:
  1. Summarize all files modified or created.
  2. Present concrete verification results (tests executed, build status).
  3. Note any unresolved questions or immediate next steps.
