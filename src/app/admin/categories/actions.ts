"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { CatalogService } from "@/server/services/catalog.service";
import { categorySchema } from "@/validators/catalog";

export async function createCategoryAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const category = await CatalogService.createCategory(parsed.data);
    return { success: true, data: category };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create category",
    };
  }
}

export async function updateCategoryAction(id: string, formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = categorySchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const category = await CatalogService.updateCategory(id, parsed.data);
    return { success: true, data: category };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update category",
    };
  }
}

export async function deleteCategoryAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await CatalogService.deleteCategory(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete category",
    };
  }
}
