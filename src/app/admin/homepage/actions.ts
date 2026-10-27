"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { MarketingService } from "@/server/services/marketing.service";
import { homepageSectionSchema } from "@/validators/marketing";

export async function createHomepageSectionAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = homepageSectionSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const section = await MarketingService.createHomepageSection(parsed.data);
    return { success: true, data: section };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create section",
    };
  }
}

export async function updateHomepageSectionAction(id: string, formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = homepageSectionSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const section = await MarketingService.updateHomepageSection(id, parsed.data);
    return { success: true, data: section };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update section",
    };
  }
}

export async function deleteHomepageSectionAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await MarketingService.deleteHomepageSection(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete section",
    };
  }
}
