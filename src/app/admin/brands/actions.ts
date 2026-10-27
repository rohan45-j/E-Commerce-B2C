"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { CatalogService } from "@/server/services/catalog.service";
import { brandSchema } from "@/validators/catalog";

export async function createBrandAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = brandSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const brand = await CatalogService.createBrand(parsed.data);
    return { success: true, data: brand };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create brand",
    };
  }
}

export async function updateBrandAction(id: string, formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = brandSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const brand = await CatalogService.updateBrand(id, parsed.data);
    return { success: true, data: brand };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update brand",
    };
  }
}

export async function deleteBrandAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await CatalogService.deleteBrand(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete brand",
    };
  }
}
