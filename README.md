# Dhaka Premium Luxury E-Commerce Platform

A production-grade, fully dynamic B2C e-commerce platform built with Next.js 15 (App Router, React Server Components), TypeScript, Prisma ORM, and PostgreSQL. Tailored for Bangladesh with BDT currency, integer minor units (poisha), Cash on Delivery (COD), Stripe Card Checkout, and bKash / SSLCommerz modular readiness.

---

## 🌟 Core Architecture & Features

### 1. Storefront (Customer Experience)
- **Dynamic Homepage**: Hero slides, categories showcase, flash sale banner, curated best-sellers and featured grid powered by admin settings.
- **Shop Catalog & Faceted Filters**: Multi-attribute filtering (category, price range, stock status, ratings), real-time sorting, search, URL query synchronization.
- **Product Details Page (PDP)**: High-resolution image gallery, color/size variant selection with real-time price & stock updates, customer reviews, JSON-LD schema markup (`Product`, `BreadcrumbList`), and sticky mobile CTA.
- **Wishlist & Cart**: Zustand persistent cart (persisted in localStorage and synced), free delivery progress indicator (৳10,000 threshold), coupon discount calculator.
- **Frictionless Express Checkout**: Supports both **Guest Checkout** (no login required) and **Logged-in Customers**. Bangladesh shipping zones (Inside Dhaka ৳60 / Outside Dhaka ৳120).
- **Public Order Tracking**: Public `/track-order` lookup using Order Number (`ORD-YYYY-XXXXXX`) or Phone Number, complete with a visual 6-stage lifecycle stepper.

### 2. Customer Account Portal (`/account`)
- Real-time customer dashboard with recent orders overview and fast actions.
- Full order history with detailed breakdown, tracking stepper, and cancellation capability while in `PENDING` or `CONFIRMED` state (automatically restores inventory in atomic transactions).
- Saved delivery address book and profile security management.

### 3. Admin Management Panel (`/admin`)
- **Dashboard & Analytics**: Revenue metrics, order distribution, low-stock warnings, and Recharts sales trend visuals.
- **Catalog Management**: Full CRUD for Categories (hierarchical tree), Brands, Products, Variants (SKU, price, barcode, dimensions, stock), and Reviews moderation.
- **Marketing & CMS**: Banners manager, Coupons (percentage, fixed amount, free shipping, usage caps), CMS pages (About, Terms, Privacy, FAQ), and site settings.
- **Order Pipeline**: Lifecycle transition manager (`PENDING` -> `CONFIRMED` -> `PROCESSING` -> `PACKED` -> `SHIPPED` -> `OUT_FOR_DELIVERY` -> `DELIVERED`), courier and tracking assignment, status timeline history, and printable invoices.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15.1 (App Router, Server Actions, React 19) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS v3, shadcn/ui, Lucide Icons, Framer Motion |
| **Database** | PostgreSQL + Prisma ORM v6 |
| **Authentication** | Auth.js (NextAuth v5 beta) with RBAC (`ADMIN`, `STAFF`, `CUSTOMER`) |
| **State Management** | Zustand (Cart & Wishlist with localStorage persistence) |
| **Form Validation** | Zod + React Hook Form |
| **Payments** | Cash on Delivery (COD) + Stripe Checkout Sessions & Webhooks |
| **Testing** | Vitest (unit & financial logic) + Playwright (E2E user flows) |
| **Package Manager** | pnpm |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js 20+ (LTS recommended)
- pnpm 9+ (`npm install -g pnpm`)
- PostgreSQL instance running locally or hosted on Neon / Supabase

### 2. Installation
```bash
git clone <repository-url>
cd E-Commerce-B2C
pnpm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your database credentials and authentication secret are set:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_b2c?schema=public"
AUTH_SECRET="your-32-char-random-auth-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Push schema or run migrations
npx prisma db push

# Seed demo categories, brands, products, banners, and default admin
pnpm seed
```

### 5. Running the Application
```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

Default Admin Credentials:
- **Email**: `admin@example.com`
- **Password**: `ChangeMe123!@#`

---

## 🧪 Testing

### Running Unit Tests (Financial & Pricing Logic)
```bash
pnpm test
```
Runs 14 automated unit tests verifying:
- BDT minor unit (poisha) integer math without floating-point errors.
- Shipping zone calculation (Inside Dhaka vs Outside Dhaka & ৳10,000 free shipping).
- Percentage, fixed, and free-shipping coupon discount calculations with caps.
- Currency formatting utilities.

### Running End-to-End Tests (Playwright)
```bash
pnpm test:e2e
```
Verifies storefront navigation, guest checkout forms, customer authentication, admin protection, and public order tracking.

---

## 🌐 Production Deployment Guide

### Deploying to Vercel with Managed PostgreSQL (Neon / Supabase)

1. **Database Setup (Neon or Supabase)**:
   - Create a new PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
   - Copy the connection string into Vercel environment variables as `DATABASE_URL`.
   - For Supabase connection pooling, set `DIRECT_URL` to port 5432 and `DATABASE_URL` to pooler port 6543.

2. **Vercel Project Setup**:
   - Connect the repository to Vercel.
   - Set Build Command: `pnpm build`
   - Set Install Command: `pnpm install`

3. **Required Environment Variables on Vercel**:
   ```
   DATABASE_URL
   AUTH_SECRET
   AUTH_URL="https://your-domain.vercel.app"
   NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
   ADMIN_EMAIL="admin@yourdomain.com"
   ADMIN_PASSWORD="YourSecurePassword"
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   RESEND_API_KEY="..."
   EMAIL_FROM="orders@yourdomain.com"
   ```

4. **Run Migrations on Production**:
   ```bash
   npx prisma migrate deploy
   ```

5. **Stripe Webhook Configuration**:
   - Go to your Stripe Dashboard -> Developers -> Webhooks.
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`.
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`.
   - Copy the Signing Secret into `STRIPE_WEBHOOK_SECRET`.

6. **Google Search Console & Dynamic Sitemap**:
   - Verify domain ownership in Google Search Console.
   - Submit dynamic sitemap URL: `https://your-domain.com/sitemap.xml`.
   - Robots policy is automatically served at `https://your-domain.com/robots.txt`.

---

## 🛡️ Security & Performance
- **Content Security Headers**: Pre-configured HSTS, X-Content-Type-Options (`nosniff`), X-Frame-Options (`SAMEORIGIN`), Referrer-Policy, and Permissions-Policy.
- **Server Authority**: Client submissions never determine prices, discounts, shipping fees, or inventory. All orders are validated server-side.
- **Database Atomicity**: Order submission and cancellations use Prisma transactions (`prisma.$transaction`) with strict row-level updates to eliminate race conditions and overselling.
