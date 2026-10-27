---
description: Mandatory project operating instructions for Bangladesh E-commerce Platform
globs: **/*
alwaysApply: true
---

# Bangladesh E-Commerce Project Operating Rules

1. Before starting any task, read [MASTER_PROMPT.md](file:///e:/Rohan/PP/E-Commerce-B2C/MASTER_PROMPT.md) and [AGENTS.md](file:///e:/Rohan/PP/E-Commerce-B2C/AGENTS.md).
2. Treat `MASTER_PROMPT.md` as the primary, immutable source of truth for all requirements, architecture, and standards.
3. Review `docs/PROGRESS.md` before changing code.
4. Follow the Next.js App Router (RSC-first), TypeScript strict mode, Tailwind CSS, and Supabase architecture.
5. All calculations in BDT must use integer minor units (poisha) or decimal-safe strategies. Never use floating-point math for money.
6. Zero client-side authority: Never trust client-sent prices, discounts, stock levels, or roles.
7. Verify all changes through tests, type checks (`tsc --noEmit`), and builds. Never claim a feature is complete without verification.
8. Update `docs/PROGRESS.md` at the conclusion of each phase or milestone.
