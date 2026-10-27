import { describe, it, expect } from "vitest";
import {
  calculateSubtotal,
  calculateShippingFee,
  calculateCouponDiscount,
  calculateOrderSummary,
  formatBDT,
  SHIPPING_RATES,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/pricing-calculator";

describe("Pricing and Financial Calculations (BDT Poisha)", () => {
  describe("calculateSubtotal", () => {
    it("should accurately calculate subtotal in poisha without floating point inaccuracy", () => {
      const items = [
        { unitPrice: 150000, quantity: 2 }, // ৳1500 * 2 = ৳3000 (300000 poisha)
        { unitPrice: 49900, quantity: 3 },  // ৳499 * 3 = ৳1497 (149700 poisha)
      ];
      const subtotal = calculateSubtotal(items);
      expect(subtotal).toBe(449700); // ৳4,497.00
    });

    it("should return 0 for empty items array", () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it("should ignore invalid items with zero or negative quantity", () => {
      const items = [
        { unitPrice: 20000, quantity: 0 },
        { unitPrice: 50000, quantity: -1 },
        { unitPrice: 10000, quantity: 1 },
      ];
      expect(calculateSubtotal(items)).toBe(10000);
    });
  });

  describe("calculateShippingFee", () => {
    it("should charge standard inside Dhaka shipping rate (৳60 / 6000 poisha)", () => {
      const fee = calculateShippingFee(50000, "INSIDE_DHAKA");
      expect(fee).toBe(SHIPPING_RATES.INSIDE_DHAKA);
      expect(fee).toBe(6000);
    });

    it("should charge standard outside Dhaka shipping rate (৳120 / 12000 poisha)", () => {
      const fee = calculateShippingFee(50000, "OUTSIDE_DHAKA");
      expect(fee).toBe(SHIPPING_RATES.OUTSIDE_DHAKA);
      expect(fee).toBe(12000);
    });

    it("should offer free shipping for orders at or above threshold (৳10,000 / 1,000,000 poisha)", () => {
      const feeInside = calculateShippingFee(FREE_SHIPPING_THRESHOLD, "INSIDE_DHAKA");
      const feeOutside = calculateShippingFee(FREE_SHIPPING_THRESHOLD + 50000, "OUTSIDE_DHAKA");
      expect(feeInside).toBe(0);
      expect(feeOutside).toBe(0);
    });
  });

  describe("calculateCouponDiscount", () => {
    it("should apply percentage discount correctly", () => {
      const subtotal = 200000; // ৳2000
      const coupon = {
        type: "PERCENTAGE" as const,
        value: 10, // 10%
      };
      const { discountAmount, freeShipping } = calculateCouponDiscount(subtotal, coupon);
      expect(discountAmount).toBe(20000); // ৳200
      expect(freeShipping).toBe(false);
    });

    it("should respect max discount cap on percentage coupons", () => {
      const subtotal = 1000000; // ৳10,000
      const coupon = {
        type: "PERCENTAGE" as const,
        value: 20, // 20% would be ৳2000 (200000 poisha)
        maxDiscount: 100000, // Capped at ৳1000 (100000 poisha)
      };
      const { discountAmount } = calculateCouponDiscount(subtotal, coupon);
      expect(discountAmount).toBe(100000);
    });

    it("should not apply coupon if subtotal is below minimum order amount", () => {
      const subtotal = 50000; // ৳500
      const coupon = {
        type: "FIXED_AMOUNT" as const,
        value: 10000, // ৳100 off
        minOrderAmount: 100000, // Minimum ৳1000 required
      };
      const { discountAmount } = calculateCouponDiscount(subtotal, coupon);
      expect(discountAmount).toBe(0);
    });

    it("should handle FREE_SHIPPING coupon type", () => {
      const coupon = {
        type: "FREE_SHIPPING" as const,
        value: 0,
      };
      const { discountAmount, freeShipping } = calculateCouponDiscount(50000, coupon);
      expect(discountAmount).toBe(0);
      expect(freeShipping).toBe(true);
    });
  });

  describe("calculateOrderSummary", () => {
    it("should compute accurate total with items, discount, shipping and VAT", () => {
      const summary = calculateOrderSummary({
        subtotal: 300000, // ৳3,000
        shippingZone: "INSIDE_DHAKA", // ৳60 (6000 poisha)
        coupon: {
          type: "FIXED_AMOUNT",
          value: 50000, // ৳500 discount
        },
        taxRatePercent: 5, // 5% VAT on discounted subtotal: (৳2,500 * 5%) = ৳125 (12500 poisha)
      });

      expect(summary.subtotal).toBe(300000);
      expect(summary.discountAmount).toBe(50000);
      expect(summary.shippingFee).toBe(6000);
      expect(summary.taxAmount).toBe(12500); // ৳125
      // Total = 250000 + 6000 + 12500 = 268500 poisha (৳2,685)
      expect(summary.totalAmount).toBe(268500);
    });

    it("should prevent total amount from dropping below zero", () => {
      const summary = calculateOrderSummary({
        subtotal: 10000,
        shippingZone: "INSIDE_DHAKA",
        coupon: {
          type: "FIXED_AMOUNT",
          value: 999999, // Exceeds subtotal
        },
      });

      expect(summary.discountAmount).toBe(10000); // Capped at subtotal
      expect(summary.totalAmount).toBe(6000); // Only shipping remains
    });
  });

  describe("formatBDT", () => {
    it("formats poisha to BDT string without decimals", () => {
      expect(formatBDT(150000)).toBe("৳1,500");
    });

    it("formats poisha to BDT string with decimals when requested", () => {
      expect(formatBDT(150050, true)).toBe("৳1,500.50");
    });
  });
});
