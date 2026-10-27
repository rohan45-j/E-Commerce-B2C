# Testing & Quality Assurance Strategy

## 1. Testing Pyramid
* **Unit Testing (Vitest)**:
  * Pricing calculation engine (discounts, tax, Poisha conversion).
  * Bangladesh phone number and address validation schemas (Zod).
  * Order state transition validator (verifying illegal transitions throw errors).
  * Payment adapter payload formatting.
* **Integration Testing**:
  * Supabase client initialization & session cookie handling.
  * Server actions: cart-to-order transactional creation.
  * Stock reservation rollback on payment abandonment.
* **End-to-End Testing (Playwright)**:
  * Customer journey: Guest browsing → Cart addition → Bangladesh address checkout → COD order confirmation.
  * Admin journey: Login → Product creation with variants & images → Order status dispatch update → Audit log verification.
  * Responsive viewports: 375px (Mobile), 768px (Tablet), 1440px (Desktop).
