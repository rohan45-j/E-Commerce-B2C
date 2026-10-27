"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { CatalogService } from "@/server/services/catalog.service";

export async function moderateReviewAction(id: string, isApproved: boolean) {
  await requireStaffOrAdmin();
  try {
    const review = await CatalogService.moderateReview(id, isApproved);
    return { success: true, data: review };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to moderate review",
    };
  }
}

export async function deleteReviewAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await CatalogService.deleteReview(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete review",
    };
  }
}
