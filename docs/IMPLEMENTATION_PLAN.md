# Project Implementation Plan: Premium Bangladesh E-Commerce

This plan outlines the end-to-end phased development workflow for the full-stack Bangladesh e-commerce platform.

---

## Phase Breakdown & Deliverables

### Phase 0 — Workspace Inspection & Planning *(Status: COMPLETED)*
- [x] Inspect workspace and initialize project documentation.
- [x] Create comprehensive specifications (`requirements.md`, `database-design.md`, `order-lifecycle.md`, `payment-integration.md`, `security.md`, `route-map.md`, `seo.md`, `testing.md`).
- [x] Create root `MASTER_PROMPT.md` and `AGENTS.md`.
- [x] Setup `.env.example` baseline.
- [x] Define Bangladesh-specific checkout, shipping rules, and payment adapters.

### Phase 1 — Foundation & Core Scaffolding *(Status: READY TO START)*
- [ ] Initialize Next.js App Router project with TypeScript strict mode and Tailwind CSS.
- [ ] Configure shadcn/ui design tokens, font hierarchy (Inter / Outfit / Hind Siliguri for Bengali typography), and Lucide icons.
- [ ] Configure Supabase client architecture (`src/lib/supabase/client.ts`, `server.ts`, `admin.ts`, `middleware.ts`).
- [ ] Create initial PostgreSQL schema migrations (`supabase/migrations/`) matching `database-design.md` with Row Level Security (RLS) policies.
- [ ] Implement runtime environment variable validation using Zod.
- [ ] Create development seed data script (`supabase/seed.sql`).

### Phase 2 — Storefront UI & Layouts *(Status: PENDING)*
- [ ] Build dynamic homepage with announcement bar, hero carousel, category cards, featured collections, and newsletter.
- [ ] Implement responsive navigation header with search bar, category dropdown, cart trigger, and user account menu.
- [ ] Implement product catalog listing page (`/products`) with faceted search filters (categories, brands, price range, stock).
- [ ] Build product detail page (PDP) with multi-image gallery, interactive variant selectors (size/color), SKU display, and specifications table.
- [ ] Implement shopping cart drawer and dedicated cart page (`/cart`) with live subtotal and free-shipping progress indicator.
- [ ] Implement responsive footer with company details, payment gateway badges, and policy links.

### Phase 3 — Database Integration & Real CRUD *(Status: PENDING)*
- [ ] Connect real Supabase queries to storefront pages via React Server Components.
- [ ] Implement image uploads to Supabase Storage bucket (`product-images`).
- [ ] Implement full category and brand CRUD operations with SEO fields.
- [ ] Implement product management with multi-variant generation, pricing overrides, and inventory bindings.
- [ ] Set up on-demand ISR cache revalidation (`/api/revalidate`).

### Phase 4 — Authentication & Admin Operations *(Status: PENDING)*
- [ ] Implement Supabase Auth email/password login, registration, and password recovery.
- [ ] Build protected customer account portal (`/account`) with profile settings, address book (Bangladesh divisions/districts), and order history.
- [ ] Implement secure role-based access control (`CUSTOMER`, `ADMIN`).
- [ ] Build administrative operations dashboard (`/admin`) with real-time KPI metrics (gross sales, net revenue, pending orders, low stock).
- [ ] Build admin product, category, brand, coupon, and banner management interfaces.

### Phase 5 — Cart, Checkout & Order Processing *(Status: PENDING)*
- [ ] Implement server-authoritative checkout calculation engine (recomputing line prices, discounts, delivery fees, and taxes).
- [ ] Build Bangladesh-specific checkout form with 8 divisions, 64 districts, and Upazila selections.
- [ ] Support both guest checkout and authenticated customer checkout.
- [ ] Implement atomic stock reservation using PostgreSQL procedures to prevent overselling.
- [ ] Implement coupon validation with minimum spend and usage limit constraints.
- [ ] Generate immutable order and line-item snapshots upon order placement.

### Phase 6 — Payment Gateway & Manual Delivery Fulfillment *(Status: PENDING)*
- [ ] Implement provider-independent payment adapter interface.
- [ ] Implement SSLCOMMERZ gateway adapter (sandbox mode) with server-to-server IPN verification.
- [ ] Implement Cash on Delivery (COD) workflow with zone-based restrictions and phone confirmation flags.
- [ ] Implement 12-state order lifecycle state machine in `/admin/orders/[id]`.
- [ ] Support courier consignment assignment (Steadfast, Pathao, RedX, or internal rider) and manual dispatch logging.
- [ ] Implement separate logging for COD collection vs physical parcel delivery.
- [ ] Build public guest order tracking page (`/track-order`) using high-entropy tracking tokens.

### Phase 7 — Technical SEO & Performance *(Status: PENDING)*
- [ ] Implement dynamic metadata and Open Graph tags across all public routes.
- [ ] Implement dynamic XML sitemap (`/sitemap.xml`) and search crawler directives (`/robots.txt`).
- [ ] Embed JSON-LD structured data (`Product`, `Offer`, `BreadcrumbList`, `Organization`).
- [ ] Optimize images with `next/image` and test Core Web Vitals (LCP, CLS, FID).

### Phase 8 — QA, Concurrency & Security Verification *(Status: PENDING)*
- [ ] Write Vitest unit tests for pricing, validation, and state machine transitions.
- [ ] Write Playwright end-to-end tests for customer checkout and admin order fulfillment.
- [ ] Test RLS authorization policies and verify zero unauthorized data access.
- [ ] Run concurrency and race condition tests on inventory reservation.

### Phase 9 — Production Deployment *(Status: PENDING)*
- [ ] Finalize environment variables and secret management.
- [ ] Execute database migrations on production Supabase instance.
- [ ] Run production build (`npm run build`) and verify zero errors.
- [ ] Document backup, rollback, and disaster recovery procedures.
