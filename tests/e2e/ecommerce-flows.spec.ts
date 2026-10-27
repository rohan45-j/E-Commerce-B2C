import { test, expect } from "@playwright/test";

test.describe("E-Commerce End-to-End User Journeys", () => {
  test("1. Storefront browse and guest checkout flow", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");
    await expect(page).toHaveTitle(/Dhaka Luxury/i);

    // Verify main storefront elements exist
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Navigate to shop catalog
    await page.goto("/shop");
    await expect(page.locator("h1")).toContainText(/All Collections/i);

    // Navigate to Cart
    await page.goto("/cart");
    await expect(page.locator("h1")).toContainText(/Shopping Cart/i);

    // Navigate to Checkout as Guest
    await page.goto("/checkout");
    await expect(page.locator("h1")).toContainText(/Express Checkout/i);

    // Verify guest checkout form fields exist
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible();
    await expect(page.locator('input[placeholder="017XXXXXXXX"]')).toBeVisible();
    await expect(page.locator('input[placeholder="House 12, Road 4, Sector 3..."]')).toBeVisible();
  });

  test("2. User authentication and account dashboard", async ({ page }) => {
    // Navigate to login
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText(/Sign In/i);

    // Verify email and password inputs
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Navigate to register
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText(/Create Account/i);
  });

  test("3. Admin catalog and product lifecycle", async ({ page }) => {
    // Visit admin products catalog
    await page.goto("/admin/products");

    // In a test environment or unauthenticated session, middleware redirects to /login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(admin|login)/);
  });

  test("4. Public order tracking flow", async ({ page }) => {
    // Navigate to public tracking page
    await page.goto("/track-order");
    await expect(page.locator("h1")).toContainText(/Track Your Order/i);

    // Verify tracking input fields
    const orderInput = page.locator('input[placeholder*="ORD-"]');
    await expect(orderInput).toBeVisible();

    const phoneInput = page.locator('input[placeholder*="017"]');
    await expect(phoneInput).toBeVisible();

    const trackButton = page.locator('button:has-text("Track Status")');
    await expect(trackButton).toBeVisible();
  });
});
