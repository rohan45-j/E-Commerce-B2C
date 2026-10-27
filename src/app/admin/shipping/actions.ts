"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { MarketingService } from "@/server/services/marketing.service";
import { shippingZoneSchema, shippingRateSchema } from "@/validators/marketing";

export async function createShippingZoneAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = shippingZoneSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const zone = await MarketingService.createShippingZone(parsed.data);
    return { success: true, data: zone };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create zone",
    };
  }
}

export async function deleteShippingZoneAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await MarketingService.deleteShippingZone(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete zone",
    };
  }
}

export async function createShippingRateAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = shippingRateSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const rate = await MarketingService.createShippingRate(parsed.data);
    return { success: true, data: rate };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create rate",
    };
  }
}

export async function deleteShippingRateAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await MarketingService.deleteShippingRate(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete rate",
    };
  }
}
