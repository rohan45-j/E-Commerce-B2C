# Route Map & Navigation Architecture

## 1. Storefront Routes (Public & Guest Friendly)
| Path | Component Type | Access Control | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | RSC | Public | Dynamic homepage (hero banners, categories, collections, reviews) |
| `/products` | RSC + Client Filters | Public | Catalog browsing with faceted search (brand, price, category, rating) |
| `/products/[slug]` | RSC + Client PDP Controls | Public | Product details, variant selector, gallery, reviews, schema.org |
| `/categories/[slug]` | RSC + Filters | Public | Category landing page with subcategory navigation |
| `/cart` | Client Component | Public | Cart management with live subtotal and free shipping progress |
| `/checkout` | Client Component + Server Actions | Public (Guest & Auth) | Bangladesh address form, shipping method, coupon, payment selector |
| `/order-confirmation/[ref]` | RSC | Public with token | Order summary, items snapshot, payment instructions, receipt |
| `/track-order` | Client Component + Server Action | Public | Secure guest tracking by token/order number + phone |
| `/about`, `/contact`, `/faq` | RSC | Public | Informational & support pages |
| `/privacy-policy`, `/terms` | RSC | Public | Legal compliance pages |

---

## 2. Customer Account Routes (Protected - Authenticated Customers)
| Path | Component Type | Access Control | Purpose |
| :--- | :--- | :--- | :--- |
| `/account` | RSC | Customer Session | Overview, recent orders summary, default address |
| `/account/orders` | RSC | Customer Session | Order history list with status badges |
| `/account/orders/[id]` | RSC | Customer Session | Detailed order view, tracking timeline, download receipt |
| `/account/addresses` | RSC + Client Form | Customer Session | Address book management (Division/District/Upazila) |
| `/account/profile` | RSC + Client Form | Customer Session | Name, phone, password update |

---

## 3. Admin Panel Routes (Protected - Role: ADMIN)
| Path | Component Type | Access Control | Purpose |
| :--- | :--- | :--- | :--- |
| `/admin` | RSC | Role: ADMIN | Operational KPI dashboard, sales charts, pending tasks |
| `/admin/products` | RSC + DataTable | Role: ADMIN | Product list with stock alerts, search, bulk status toggle |
| `/admin/products/new` | Client Form + Server Action | Role: ADMIN | Create product, variants, SKUs, image uploads |
| `/admin/products/[id]/edit` | Client Form + Server Action | Role: ADMIN | Edit product specifications, pricing, inventory |
| `/admin/categories` | RSC + Form | Role: ADMIN | Category tree CRUD, image uploads |
| `/admin/brands` | RSC + Form | Role: ADMIN | Brand CRUD, logo uploads |
| `/admin/orders` | RSC + Filterable Table | Role: ADMIN | Order fulfillment management, status pipeline |
| `/admin/orders/[id]` | RSC + Action Controls | Role: ADMIN | Order dispatching, courier assignment, COD collection logging |
| `/admin/inventory` | RSC + Quick Adjust | Role: ADMIN | Stock levels, low stock warnings, manual stock movement log |
| `/admin/coupons` | RSC + Form | Role: ADMIN | Discount codes, usage limits, minimum spend rules |
| `/admin/promotions` | RSC + Form | Role: ADMIN | Hero banners, campaign schedules, homepage section order |
| `/admin/reviews` | RSC + Moderation Controls | Role: ADMIN | Approve/reject customer product reviews |
| `/admin/customers` | RSC + Table | Role: ADMIN | Registered customer list, order count, total spend |
| `/admin/shipping` | RSC + Form | Role: ADMIN | Bangladesh shipping rates (Inside Dhaka, Outside Dhaka, etc.) |
| `/admin/settings` | RSC + Form | Role: ADMIN | Store metadata, business timezone, tax rules, gateway keys |
| `/admin/audit-logs` | RSC | Role: ADMIN | Security and administrative audit trail |

---

## 4. API & Automated Endpoints
| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/webhooks/payment` | POST | Gateway IPN/webhook handler with signature verification & idempotency |
| `/sitemap.xml` | GET | Dynamic XML sitemap for SEO crawlers |
| `/robots.txt` | GET | Search engine crawler rules |
