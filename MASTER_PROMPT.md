# Next.js E-commerce, Antigravity Master Prompt Kit

## Kivabe use korben
1. Antigravity te empty folder open korun, Agent Manager/Editor e new workspace banan.
2. **Part A (Master Prompt)** ta project root e `GEMINI.md` (or Antigravity Rules) file e save korun, jate agent protibar eta mone rakhe.
3. Tarpor **Phase 1 theke 12** porjonto ekta ekta kore prompt din. Ek phase shesh hole run/test kore tarpor porer phase e jan. Ek sathe sob prompt dile quality kome jay.
4. Model: Gemini 3 Pro / Claude (jeta available), mode: Planning. Agent er plan review kore Approve korben.

---

## PART A: MASTER PROMPT (GEMINI.md te rakhun)

```
You are a senior full-stack engineer. We are building a production-grade,
fully dynamic E-COMMERCE platform. Follow every rule below in all phases.

## Product
- Public storefront (customer side) + Customer account panel + Admin panel.
- Everything shown on the site (products, categories, brands, banners,
  promotions, coupons, homepage sections, site settings, SEO fields) is
  managed from the Admin panel. NOTHING is hardcoded.
- Admin has full CRUD on every entity.
- Customers can buy as GUEST (no login) or as a LOGGED-IN user.
- Orders go to Admin panel, Admin processes them (confirm, pack, ship,
  deliver, cancel, refund). Customers track order status in their panel
  and via a public "Track Order" page (order number + phone/email).
- Primary market: Bangladesh (BDT currency, COD, bKash/SSLCommerz ready),
  with Stripe for card payments. Make currency and payment providers configurable.

## Tech stack (do not change without asking)
- Next.js 15 (App Router) + TypeScript (strict) + React Server Components
- Tailwind CSS + shadcn/ui + Lucide icons + Framer Motion (subtle animations)
- PostgreSQL + Prisma ORM
- Auth.js (NextAuth v5): email+password, Google login; role based (ADMIN, STAFF, CUSTOMER)
- Zod for validation (shared client/server), React Hook Form
- Server Actions / Route Handlers for mutations, TanStack Query where needed
- Zustand for cart (persisted in localStorage + synced to DB after login)
- Image upload: Cloudinary (or UploadThing), use next/image
- Payments: Cash on Delivery + Stripe Checkout (+ webhook). Keep a payment
  provider interface so bKash/SSLCommerz can be added later.
- Email: Resend (order confirmation, status update)
- Charts in admin: Recharts
- Package manager: pnpm

## Architecture rules
- Folder structure: src/app/(store), src/app/(account), src/app/(auth),
  src/app/admin, src/app/api, src/components/{ui,store,admin,shared},
  src/lib, src/server (services, repositories), src/validators, src/types, prisma/
- Business logic in src/server/services, NOT inside components.
- Every admin action and API route must check role on the SERVER.
- Validate all input with Zod on the server. Never trust the client.
- Use DB transactions for order creation + stock decrement.
- Prices stored as integers (minor units) or Decimal, never floats.
- Soft delete where it makes sense (products, categories).
- Use environment variables, provide .env.example, never commit secrets.

## SEO rules (mandatory)
- generateMetadata for every public page (title, description, canonical, OpenGraph, Twitter).
- Dynamic XML sitemap via app/sitemap.ts (products, categories, brands,
  blog/pages) with lastModified; app/robots.ts; split sitemaps if >5000 URLs.
- JSON-LD structured data: Product, BreadcrumbList, Organization, WebSite
  (SearchAction), Review/AggregateRating.
- Clean slugs (unique, editable from admin), 301 redirect on slug change.
- Admin can set meta title/description/OG image per product, category, page.
- Server-render product/category pages (ISR with revalidateTag on admin updates).
- Optimize Core Web Vitals: next/image, next/font, lazy loading, no layout shift.
- noindex for cart, checkout, account, admin pages.

## UI/UX rules
- Modern, clean, premium look. Mobile-first, fully responsive.
- Design tokens (colors, radius, spacing) in Tailwind config; light + dark mode.
- Skeleton loaders, empty states, error states, toasts, optimistic UI.
- Accessible (semantic HTML, aria, keyboard nav, focus states, contrast).
- Sticky header with search + mega menu, mobile bottom nav / drawer menu,
  quick view, wishlist, mini-cart drawer, sticky add-to-cart on mobile.

## Working style
- Before coding each phase: output a short plan and list of files.
- After each phase: run lint + typecheck + build, fix errors, and give me a
  short summary + how to test it manually.
- Write seed data (prisma/seed.ts) with an admin user and demo data.
- Don't leave TODOs or placeholder/lorem content in finished features.
- If something is ambiguous, pick the best-practice default and note it.
```

---

## PART B: STEP-BY-STEP PROMPTS

### Phase 1: Project setup
```
Phase 1: Initialize the project following GEMINI.md.
- Create Next.js 15 + TypeScript + Tailwind + pnpm project, install shadcn/ui,
  lucide-react, framer-motion, zod, react-hook-form, zustand, tanstack-query,
  prisma, next-auth@beta, bcryptjs, recharts, sonner.
- Set up folder structure, ESLint, Prettier, absolute imports (@/), .env.example.
- Configure fonts (next/font), theme (light/dark), global layout, and a
  design-token based Tailwind theme.
- Set up Prisma with PostgreSQL and a db client singleton.
Finish with: pnpm build passing and a short README with setup steps.
```

### Phase 2: Database schema
```
Phase 2: Design the complete Prisma schema and seed.
Models: User (role), Account/Session (Auth.js), Address, Category (nested,
parent/child), Brand, Product, ProductImage, ProductVariant (size/color/sku/
price/stock), Attribute/Tag, Review, Wishlist, Cart/CartItem, Coupon,
Promotion (flash sale / discount rules, start/end date), Banner (placement,
image desktop/mobile, link, order, active, schedule), HomepageSection
(configurable blocks), Order, OrderItem, OrderStatusHistory, Payment,
Shipment (courier, tracking no), ShippingZone/ShippingRate, Page (CMS: about,
privacy, terms), SiteSetting (logo, name, contact, social, currency, SEO
defaults), Redirect, Notification, ContactMessage, NewsletterSubscriber.
Order status enum: PENDING, CONFIRMED, PROCESSING, PACKED, SHIPPED,
OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED, REFUNDED.
Add proper indexes, unique slugs, relations, onDelete rules.
Create prisma/seed.ts: 1 admin (admin@example.com / strong password from env),
categories, brands, 20 demo products with images, banners, coupons, settings.
Run migrate + seed and show me the ERD summary.
```

### Phase 3: Authentication & roles
```
Phase 3: Implement Auth.js v5.
- Register, login, logout, forgot/reset password (email token), email verify (optional toggle).
- Google OAuth. Credentials with bcrypt.
- Roles ADMIN / STAFF / CUSTOMER with middleware protecting /admin/* and /account/*.
- Server helpers: requireUser(), requireRole().
- Auth pages with modern split-screen UI, form validation, rate limiting on login.
- Guest checkout must work WITHOUT login (do not force login anywhere in store flow).
Test: admin can open /admin, customer cannot.
```

### Phase 4: Admin panel layout + dashboard
```
Phase 4: Build the Admin panel shell at /admin.
- Collapsible sidebar, topbar with search, notifications bell, profile menu, dark mode.
- Reusable admin components: DataTable (server-side pagination, sort, filter,
  search, bulk actions, column toggle), FormDrawer/Modal, ImageUploader
  (multi, drag-drop, reorder), RichTextEditor (Tiptap), ConfirmDialog, StatusBadge.
- Dashboard: today/week/month sales, orders count by status, revenue chart,
  top products, low stock alerts, recent orders, new customers.
Use real DB queries, no fake numbers.
```

### Phase 5: Admin CRUD (catalog)
```
Phase 5: Full CRUD in admin for:
1) Categories (nested tree, image, SEO fields, reorder)
2) Brands
3) Products: title, slug (auto + editable), short/long description, images
   gallery, price, compare-at price, cost, SKU, barcode, stock, variants &
   options (size/color), tags, category, brand, status (draft/active/archived),
   featured/new/best-seller flags, weight/dimensions, SEO meta, duplicate product, bulk import/export CSV.
4) Reviews moderation (approve/hide/delete)
5) Inventory view with low-stock filter and quick stock edit.
Zod validation, server-side role checks, toasts, and revalidateTag so the
storefront updates immediately after changes.
```

### Phase 6: Admin CRUD (marketing & CMS)
```
Phase 6: Admin CRUD for:
- Banners (hero slider, promo strips, category banners; desktop+mobile image,
  link, schedule start/end, position, order, active toggle)
- Promotions / Flash sales (percentage/fixed, applies to products/categories/brands, schedule)
- Coupons (code, type, min order, usage limit, per-user limit, expiry)
- Homepage Builder: admin can add/reorder/enable sections (hero, featured
  categories, flash sale, new arrivals, best sellers, brand logos, banners,
  custom HTML, testimonials)
- CMS Pages (about, terms, privacy, FAQ) with rich text + SEO
- Site Settings (logo, favicon, name, contact, socials, currency, tax,
  shipping rates/zones, payment toggles COD/Stripe, SEO defaults, analytics IDs)
- Redirects manager
All must reflect on the storefront without code changes.
```

### Phase 7: Storefront (customer side)
```
Phase 7: Build the public storefront with advanced modern UI/UX.
Pages: Home (rendered from Homepage Builder), Shop/Category listing
(filters: price range, brand, category, rating, attributes; sort; pagination
or infinite scroll; URL-synced filters), Product details (gallery with zoom,
variants, stock status, reviews, related products, sticky mobile CTA,
share), Search (instant suggestions, debounced), Brand page, CMS pages,
Contact, Wishlist, Compare (optional).
Header with mega menu, mini-cart drawer, wishlist counter, search.
Server components + ISR for SEO, skeletons for client parts.
Use only real data from DB.
```

### Phase 8: Cart, checkout, payment
```
Phase 8: Implement cart and checkout.
- Cart (Zustand, persisted). Merge guest cart into user cart on login.
- Coupon apply, shipping rate by zone/city, tax, totals calculated on the SERVER.
- Checkout for guest and logged-in: contact info, address (saved addresses
  for users), delivery method, payment method (COD / Stripe).
- Stripe Checkout session + webhook (verify signature) to mark payment paid/failed.
- On order submit: create Order in a transaction, decrement stock, generate
  order number (e.g. ORD-2026-000123), record OrderStatusHistory (PENDING),
  send confirmation email, create admin notification.
- Order success page with summary and tracking link.
- Prevent double submit and oversell; handle out-of-stock gracefully.
```

### Phase 9: Admin order management
```
Phase 9: Admin Order Management.
- Orders list with filters (status, payment, date, search by order no/phone/email).
- Order detail: items, customer, addresses, payment info, timeline.
- Change status step by step (Confirm -> Processing -> Packed -> Shipped ->
  Out for delivery -> Delivered; Cancel/Return/Refund with reason).
  Each change writes OrderStatusHistory and sends email/notification to customer.
- Assign courier + tracking number, print invoice/packing slip (PDF),
  bulk status update, internal notes, mark COD as paid on delivery,
  restock on cancel/return.
```

### Phase 10: Customer account panel & tracking
```
Phase 10: Customer panel at /account.
- Dashboard, profile edit, change password, address book, wishlist,
  order history, order details with a visual status timeline/stepper
  (real-time-ish via polling or SSE), reorder button, cancel order (only
  while PENDING/CONFIRMED), download invoice, write review for delivered items.
- Public /track-order page: order number + phone/email -> shows status timeline.
- Notification center for status updates.
```

### Phase 11: SEO, performance, security
```
Phase 11: SEO + hardening.
- app/sitemap.ts (dynamic: products, categories, brands, pages), robots.ts,
  canonical URLs, OpenGraph/Twitter images, JSON-LD (Product, Breadcrumb,
  Organization, WebSite), hreflang if multi-language later, redirects from DB.
- Verify metadata on all public pages; noindex on cart/checkout/account/admin.
- Performance: image optimization, caching/ISR + revalidateTag, dynamic
  imports, bundle check. Target Lighthouse 90+.
- Security: rate limiting, CSRF-safe server actions, input sanitization (XSS
  for rich text), secure headers (CSP), file upload validation, audit
  that every admin route/action checks role.
- Error pages (404/500), loading states, analytics (GA4/Meta Pixel via settings).
```

### Phase 12: Testing, QA & deployment
```
Phase 12: QA and deploy.
- Add Playwright E2E tests: guest checkout, user checkout, admin creates
  product -> appears on store, admin updates order status -> customer sees it.
- Add unit tests for price/coupon/shipping calculation.
- Fix all lint/type/build errors, write full README (setup, env vars, seed,
  admin login, deployment).
- Prepare for Vercel + managed PostgreSQL (Neon/Supabase): env checklist,
  prisma migrate deploy, Stripe webhook setup, domain + sitemap submit to Google Search Console.
- Give me a final checklist of features implemented vs missing.
```

---

## Extra tips
- Prottek phase shesh e: `pnpm lint && pnpm build` run koraben, error thakle agent ke bolun: "Fix all errors, don't move on."
- Agent kono bhul korle: "Revert only this change and redo with ..." bole specific feedback din.
- Notun feature chaile: "Follow GEMINI.md rules. Add X. First give a plan." diye start korun.
- Real credentials (Stripe key, DB URL, Cloudinary) `.env` e nijer haate boshan, prompt e kokhono dibena.
