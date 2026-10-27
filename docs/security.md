# Security & Threat Model

## 1. Zero Client-Side Authority
The platform enforces absolute server-authoritative integrity:
* Product prices, discounts, stock levels, and shipment fees are never trusted from the client payload.
* The client sends only references (e.g. `variantId`, `quantity`, `couponCode`). The server resolves all monetary values and availability directly against the PostgreSQL database.

---

## 2. Supabase Row Level Security (RLS) Policy Blueprint
All tables have RLS enabled by default (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).

### Policies Summary:
* `profiles`:
  * `SELECT`: Authenticated users can read their own profile (`auth.uid() = id`). Admins can read all profiles.
  * `UPDATE`: Authenticated users can update their own `full_name` and `phone`, but **cannot** alter `role`.
  * `INSERT`: Controlled by PostgreSQL trigger on `auth.users` creation.
* `orders`:
  * `SELECT`: Authenticated users can view orders where `user_id = auth.uid()`.
  * `SELECT (Guest Tracking)`: Security Definer function `get_guest_order_by_token(token, phone)` returns sanitized tracking status without exposing user PII.
  * `INSERT`: Server Action executes via controlled server context; direct client `INSERT` is rejected.
  * `UPDATE`: Only users with role `ADMIN` or authorized service role.
* `products`, `categories`, `brands`:
  * `SELECT`: Public (anonymous) can view where `is_published = true`.
  * `ALL`: Only users with role `ADMIN`.
* `inventory`:
  * Public access is completely blocked (`SELECT` returns count availability via safe view or server action only).
  * Direct updates restricted to database procedures and admins.

---

## 3. Session & Authentication Security
* **Cookie-Based Sessions**: Utilizing `@supabase/ssr` with `HttpOnly`, `Secure`, `SameSite=Lax` cookies.
* **Secret Protection**:
  * `SUPABASE_SERVICE_ROLE_KEY` is strictly server-side and never prefixed with `NEXT_PUBLIC_`.
  * Gateway secrets (`PAYMENT_STORE_PASSWORD`, `PAYMENT_SECRET_KEY`) are inaccessible to frontend bundles.
* **Rate Limiting**: IP and phone-based rate limiting on sensitive endpoints (checkout submission, OTP/login, order tracking lookups) to prevent credential stuffing and inventory locking attacks.
