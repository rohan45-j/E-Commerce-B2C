"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { MarketingService } from "@/server/services/marketing.service";
import { cmsPageSchema } from "@/validators/marketing";

export async function createPageAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = cmsPageSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const page = await MarketingService.createPage(parsed.data);
    return { success: true, data: page };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create page",
    };
  }
}

export async function updatePageAction(id: string, formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = cmsPageSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const page = await MarketingService.updatePage(id, parsed.data);
    return { success: true, data: page };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update page",
    };
  }
}

export async function deletePageAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await MarketingService.deletePage(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete page",
    };
  }
}
