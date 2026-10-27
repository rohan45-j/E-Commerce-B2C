"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { MarketingService } from "@/server/services/marketing.service";
import { couponSchema } from "@/validators/marketing";

export async function createCouponAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = couponSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const coupon = await MarketingService.createCoupon(parsed.data);
    return { success: true, data: coupon };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create coupon",
    };
  }
}

export async function updateCouponAction(id: string, formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = couponSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const coupon = await MarketingService.updateCoupon(id, parsed.data);
    return { success: true, data: coupon };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update coupon",
    };
  }
}

export async function deleteCouponAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await MarketingService.deleteCoupon(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete coupon",
    };
  }
}
