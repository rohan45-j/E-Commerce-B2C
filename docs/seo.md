# Technical SEO & Discoverability Specification

## 1. Meta Architecture
Every public route dynamically constructs metadata using Next.js `generateMetadata()`:
* **Canonical URL**: Dynamic construction from `NEXT_PUBLIC_SITE_URL` to prevent duplicate indexing across query params.
* **Open Graph & Twitter**: Dynamic OG image cards displaying product title, price, brand, and primary product photo.
* **Robots Directives**: Storefront catalog pages indexed (`index, follow`); admin, account, checkout, and tracking routes strictly `noindex, nofollow`.

---

## 2. Dynamic XML Sitemap & Robots.txt
* `src/app/sitemap.ts`: Fetches all active categories and published products from Supabase with realistic `lastModified` timestamps and `changeFrequency`.
* `src/app/robots.ts`: Rules explicitly allowing search engine bots on `/`, `/products/*`, `/categories/*` while disallowing `/admin/*`, `/account/*`, `/checkout/*`, `/api/*`.

---

## 3. Structured Data (JSON-LD)
Server-rendered JSON-LD scripts embedded on relevant pages:
* **Product Detail Page**:
  * `@type`: `Product`
  * `name`, `image`, `description`, `sku`, `brand`
  * `offers`: `@type: Offer`, `priceCurrency: BDT`, `price`, `availability: InStock / OutOfStock`, `seller: Organization`
  * `aggregateRating`: Built only from genuine approved customer reviews in `reviews` table.
* **Category Page**: `@type: BreadcrumbList`
* **Homepage**: `@type: Organization`, `@type: WebSite` with `potentialAction: SearchAction`
