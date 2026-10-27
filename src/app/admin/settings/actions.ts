"use server";

import { requireAdmin } from "@/server/auth-helpers";
import { MarketingService } from "@/server/services/marketing.service";

export async function updateSiteSettingsAction(settings: Record<string, string>) {
  // Site settings require full ADMIN role
  await requireAdmin();
  try {
    await MarketingService.updateSiteSettings(settings);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update settings",
    };
  }
}
