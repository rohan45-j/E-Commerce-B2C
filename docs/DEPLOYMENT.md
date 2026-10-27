# Deployment & Operational Runbook

## 1. Hosting Architecture
* **Frontend & Server Actions**: Vercel or Node.js container (Docker) running Next.js production server.
* **Database & Storage**: Supabase managed PostgreSQL (with Connection Pooler / PgBouncer enabled for serverless operations) and Supabase Storage bucket `product-images`.

---

## 2. Environment Variables Baseline (`.env.example`)
* Application:
  * `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
  * `NEXT_PUBLIC_SITE_NAME="Dhaka Premium E-Commerce"`
  * `BUSINESS_TIMEZONE=Asia/Dhaka`
  * `DEFAULT_LOCALE=en-BD`
  * `DEFAULT_CURRENCY=BDT`
* Supabase:
  * `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`
  * `SUPABASE_SERVICE_ROLE_KEY=eyJ...` (Server-only)
* Storage:
  * `SUPABASE_STORAGE_BUCKET=product-images`
* Payment Gateway (SSLCOMMERZ / Sandbox):
  * `PAYMENT_PROVIDER=sslcommerz`
  * `PAYMENT_ENV=sandbox`
  * `SSLCOMMERZ_STORE_ID=testbox`
  * `SSLCOMMERZ_STORE_PASSWORD=qwerty`
