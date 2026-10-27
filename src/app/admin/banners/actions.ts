"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { MarketingService } from "@/server/services/marketing.service";
import { bannerSchema } from "@/validators/marketing";

export async function createBannerAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = bannerSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const banner = await MarketingService.createBanner(parsed.data);
    return { success: true, data: banner };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create banner",
    };
  }
}

export async function updateBannerAction(id: string, formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = bannerSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const banner = await MarketingService.updateBanner(id, parsed.data);
    return { success: true, data: banner };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update banner",
    };
  }
}

export async function deleteBannerAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await MarketingService.deleteBanner(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete banner",
    };
  }
}
