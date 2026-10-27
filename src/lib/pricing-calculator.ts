/**
 * Pure calculation logic for BDT financial operations in integer minor units (poisha).
 * 1 BDT = 100 poisha.
 */

export interface PricingItem {
  unitPrice: number; // in poisha
  quantity: number;
}

export type ShippingZoneCode = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

export interface CouponRule {
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number; // percentage (e.g. 10 for 10%) or poisha (e.g. 50000 for ৳500)
  minOrderAmount?: number | null; // in poisha
  maxDiscount?: number | null; // in poisha
}

export const SHIPPING_RATES: Record<ShippingZoneCode, number> = {
  INSIDE_DHAKA: 6000, // ৳60 in poisha
  OUTSIDE_DHAKA: 12000, // ৳120 in poisha
};

export const FREE_SHIPPING_THRESHOLD = 1000000; // ৳10,000 in poisha

/**
 * Calculates order items subtotal in poisha
 */
export function calculateSubtotal(items: PricingItem[]): number {
  return items.reduce((acc, item) => {
    if (item.quantity <= 0 || item.unitPrice < 0) return acc;
    return acc + Math.round(item.unitPrice * item.quantity);
  }, 0);
}

/**
 * Calculates delivery fee based on shipping zone and order subtotal
 */
export function calculateShippingFee(
  subtotal: number,
  zone: ShippingZoneCode = "INSIDE_DHAKA",
  freeThreshold = FREE_SHIPPING_THRESHOLD
): number {
  if (subtotal >= freeThreshold) {
    return 0;
  }
  return SHIPPING_RATES[zone] ?? SHIPPING_RATES.INSIDE_DHAKA;
}

/**
 * Calculates coupon discount amount in poisha
 */
export function calculateCouponDiscount(
  subtotal: number,
  coupon?: CouponRule | null
): { discountAmount: number; freeShipping: boolean } {
  if (!coupon || subtotal <= 0) {
    return { discountAmount: 0, freeShipping: false };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return { discountAmount: 0, freeShipping: false };
  }

  if (coupon.type === "FREE_SHIPPING") {
    return { discountAmount: 0, freeShipping: true };
  }

  if (coupon.type === "FIXED_AMOUNT") {
    const discount = Math.min(coupon.value, subtotal);
    return { discountAmount: Math.max(0, discount), freeShipping: false };
  }

  if (coupon.type === "PERCENTAGE") {
    const rawDiscount = Math.round((subtotal * coupon.value) / 100);
    const cappedDiscount = coupon.maxDiscount
      ? Math.min(rawDiscount, coupon.maxDiscount)
      : rawDiscount;
    return { discountAmount: Math.max(0, Math.min(cappedDiscount, subtotal)), freeShipping: false };
  }

  return { discountAmount: 0, freeShipping: false };
}

/**
 * Calculates the complete financial breakdown
 */
export function calculateOrderSummary(params: {
  subtotal: number;
  shippingZone: ShippingZoneCode;
  coupon?: CouponRule | null;
  taxRatePercent?: number;
}) {
  const { subtotal, shippingZone, coupon, taxRatePercent = 0 } = params;

  const { discountAmount, freeShipping } = calculateCouponDiscount(subtotal, coupon);
  const baseShipping = freeShipping ? 0 : calculateShippingFee(subtotal, shippingZone);
  const shippingFee = freeShipping ? 0 : baseShipping;

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxRatePercent > 0 ? Math.round((taxableAmount * taxRatePercent) / 100) : 0;

  const totalAmount = Math.max(0, taxableAmount + shippingFee + taxAmount);

  return {
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    totalAmount,
    freeShipping,
  };
}

/**
 * Formats poisha into display BDT string: 50000 -> "৳500.00" or "৳500"
 */
export function formatBDT(poisha: number, includeDecimals = false): string {
  const taka = poisha / 100;
  if (includeDecimals) {
    return `৳${taka.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `৳${Math.round(taka).toLocaleString("en-BD")}`;
}
