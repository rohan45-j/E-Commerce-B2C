"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { CatalogService } from "@/server/services/catalog.service";
import { quickStockSchema } from "@/validators/catalog";

export async function quickUpdateStockAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = quickStockSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const updated = await CatalogService.quickUpdateStock(
      parsed.data.productId,
      parsed.data.stock
    );
    return { success: true, data: updated };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update stock",
    };
  }
}
